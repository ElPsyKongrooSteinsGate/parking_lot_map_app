```bash
#!/usr/bin/env bash

# Use MINGW64 Node
export PATH="/mingw64/bin:$PATH"
hash -r

# Use Rolldown's MSVC native binding
export NAPI_RS_NATIVE_LIBRARY_PATH="$(cygpath -w "$PWD/node_modules/@rolldown/binding-win32-x64-msvc/rolldown-binding.win32-x64-msvc.node")"

# Show what is being used
echo "Node:"
node --version
echo "Node executable:"
node -p "process.execPath"

echo "Rolldown binding:"
echo "$NAPI_RS_NATIVE_LIBRARY_PATH"

# Test Rolldown
node -e "require('rolldown'); console.log('Rolldown loaded successfully')"

# Start Vite
npm run dev
```
