#!/usr/bin/env bash

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
cd -- "$PROJECT_ROOT" || exit 1

# Use MINGW64 Node when available.
if [[ -d /mingw64/bin ]]; then
	export PATH="/mingw64/bin:$PATH"
	hash -r
fi

# Show what is being used
echo "Node:"
node --version
echo "Node executable:"
node -p "process.execPath"

# Test Rolldown
node -e "import('rolldown').then(() => console.log('Rolldown loaded successfully'))"

# Start Vite
npm run dev
