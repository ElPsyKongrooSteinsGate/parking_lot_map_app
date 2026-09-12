# Commercial Facilities Page

## Purpose

The Commercial Facilities page will provide administrators and parking managers with a place to manage the top level of the parking hierarchy.

## Proposed File Location

```text
src/pages/Parking_manager_user/Facilities/Facilities.tsx
src/pages/Parking_manager_user/Facilities/Facilities.css
src/pages/Parking_manager_user/Facilities/index.ts
```

## Proposed Route

Add a protected route in `src/App.tsx`:

```text
/facilities
```

The route should be available to users with the appropriate management permission, such as:

- Developer
- Administrator
- Parking Manager

The final implementation should use the shared authorization policies rather than relying only on frontend role checks.

## Navigation

Add a Facilities link to the parking manager sidebar in:

```text
src/components/sidebar/sidebar.tsx
```

The link should navigate to `/facilities` and remain hidden or disabled for driver-only users.

## Page Responsibilities

The page should eventually support:

- Viewing commercial facilities
- Creating a commercial facility
- Editing facility details
- Assigning facility managers
- Assigning parking facilities to a commercial facility
- Viewing facility occupancy summaries
- Viewing facility-level alerts
- Filtering facilities by status or location

## Parking Hierarchy

The page is the top level of this structure:

```text
Commercial Facility
└── Parking Facility
    └── Parking Access Zone
        └── Parking Level
            └── Parking Area
                └── Parking Row
                    └── Parking Space
```

## Suggested Facility Fields

A commercial facility may eventually include:

- `id`
- `name`
- `facilityType`
- `address`
- `status`
- `managerIds`
- `parkingFacilityIds`
- `zoneIds`
- `contactInformation`
- `operatingHours`
- `accessibilityRating`
- `createdAt`
- `updatedAt`

Example facility types include:

- Shopping mall
- Office building
- Hotel
- Hospital
- Airport
- University
- Commercial complex

## Authorization Considerations

- RBAC determines whether the user can access the page.
- ABAC limits management to assigned facilities.
- PBAC evaluates named policies such as facility creation, editing, and assignment.
- Drivers should not be allowed to create or edit facilities.
- Suspended accounts should not access management actions.

## Relationship to Existing Pages

- `Dashboard.tsx` can display facility-level occupancy summaries.
- `Parking_spaces.tsx` can manage spaces belonging to a selected facility.
- `Driver_user.tsx` can consume facility and availability data without editing it.
- `App.tsx` should register the protected route.
- `sidebar.tsx` should provide manager navigation.

## Implementation Status

This page is currently a planned feature only. No TSX, CSS, route, or sidebar implementation has been added yet.
