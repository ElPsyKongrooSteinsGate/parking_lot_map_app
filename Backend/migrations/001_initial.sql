create extension if not exists pgcrypto;
create extension if not exists postgis;

DO $$ begin
  create type account_status as enum ('active', 'pending', 'suspended', 'closed');
exception when duplicate_object then null; end $$;
DO $$ begin
  create type space_status as enum ('available', 'occupied', 'reserved', 'unavailable', 'maintenance');
exception when duplicate_object then null; end $$;
DO $$ begin
  create type space_type as enum ('standard', 'accessible', 'electric', 'motorcycle', 'loading', 'staff');
exception when duplicate_object then null; end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(), email citext not null unique, password_hash text not null,
  display_name text not null check (length(display_name) between 1 and 120), status account_status not null default 'pending',
  last_login_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  version integer not null default 1 check (version > 0), deleted_at timestamptz
);
create table if not exists roles (
  id uuid primary key default gen_random_uuid(), code text not null unique, name text not null,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists user_roles (
  user_id uuid not null references users(id), role_id uuid not null references roles(id),
  created_at timestamptz not null default now(), primary key (user_id, role_id)
);
create table if not exists commercial_facilities (
  id uuid primary key default gen_random_uuid(), name text not null, description text, address_line1 text,
  address_line2 text, city text, region text, postal_code text, country_code char(2), geometry geometry(Point, 4326),
  status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  version integer not null default 1, deleted_at timestamptz
);
create table if not exists parking_facilities (
  id uuid primary key default gen_random_uuid(), commercial_facility_id uuid not null references commercial_facilities(id),
  name text not null, description text, address_line1 text, city text, region text, postal_code text,
  capacity integer not null default 0 check (capacity >= 0), default_currency char(3) not null default 'USD',
  default_hourly_rate_minor integer check (default_hourly_rate_minor is null or default_hourly_rate_minor >= 0),
  status text not null default 'active', geometry geometry(Point, 4326), created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(), version integer not null default 1, deleted_at timestamptz
);
create table if not exists parking_zones (
  id uuid primary key default gen_random_uuid(), parking_facility_id uuid not null references parking_facilities(id),
  code text not null, name text not null, description text, accessibility_metadata jsonb,
  geometry geometry(Polygon, 4326), created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  version integer not null default 1, deleted_at timestamptz, unique (parking_facility_id, code)
);
create table if not exists parking_levels (
  id uuid primary key default gen_random_uuid(), parking_facility_id uuid not null references parking_facilities(id), code text not null,
  name text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), version integer not null default 1,
  deleted_at timestamptz, unique (parking_facility_id, code)
);
create table if not exists parking_areas (
  id uuid primary key default gen_random_uuid(), parking_level_id uuid not null references parking_levels(id), code text not null,
  name text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), version integer not null default 1,
  deleted_at timestamptz, unique (parking_level_id, code)
);
create table if not exists parking_rows (
  id uuid primary key default gen_random_uuid(), parking_area_id uuid not null references parking_areas(id), code text not null,
  name text not null, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), version integer not null default 1,
  deleted_at timestamptz, unique (parking_area_id, code)
);
create table if not exists parking_spaces (
  id uuid primary key default gen_random_uuid(), parking_facility_id uuid not null references parking_facilities(id),
  zone_id uuid references parking_zones(id), level_id uuid references parking_levels(id), area_id uuid references parking_areas(id), row_id uuid references parking_rows(id),
  label text not null, space_type space_type not null, status space_status not null default 'available', requires_permit boolean not null default false,
  allowed_vehicle_types text[] not null default '{}', hourly_rate_minor integer check (hourly_rate_minor is null or hourly_rate_minor >= 0), currency char(3),
  geometry geometry(Point, 4326), metadata jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now(), version integer not null default 1, deleted_at timestamptz
);
create unique index if not exists parking_spaces_facility_label_uq on parking_spaces (parking_facility_id, lower(label)) where deleted_at is null;
create index if not exists parking_spaces_facility_status_idx on parking_spaces (parking_facility_id, status);
create index if not exists parking_spaces_zone_status_idx on parking_spaces (zone_id, status);
create index if not exists parking_facilities_geometry_gist_idx on parking_facilities using gist (geometry);
create index if not exists parking_spaces_geometry_gist_idx on parking_spaces using gist (geometry);

create table if not exists parking_space_status_history (
  id uuid primary key default gen_random_uuid(), space_id uuid not null references parking_spaces(id), previous_status space_status,
  new_status space_status not null, changed_by_user_id uuid references users(id), source text not null, reason text,
  changed_at timestamptz not null default now(), request_id uuid
);
create table if not exists occupancy_events (
  id uuid primary key default gen_random_uuid(), space_id uuid not null references parking_spaces(id), source text not null,
  external_event_id text, observed_at timestamptz not null, received_at timestamptz not null default now(), previous_status space_status,
  new_status space_status not null, payload jsonb, unique (source, external_event_id)
);
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(), event_type text not null, actor_user_id uuid references users(id), target_type text not null,
  target_id uuid, decision text not null check (decision in ('allowed', 'denied')), reason_code text not null, request_id uuid not null,
  source_ip inet, metadata jsonb, created_at timestamptz not null default now()
);

insert into roles (code, name) values
  ('developer', 'Developer'), ('admin', 'Administrator'), ('parking_manager', 'Parking manager'), ('driver', 'Driver')
on conflict (code) do nothing;
