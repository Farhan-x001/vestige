#!/bin/bash

echo "🔧 Fixing layout.js and page.js issues..."

# 1. Fix "variable"--font → variable: "--font"
find src -type f -name "*.js" -exec sed -i '' 's/variable"\([^"]*\)"/variable: "\1"/g' {} +

# 2. Fix "subsets["latin"]" → subsets: ["latin"]
find src -type f -name "*.js" -exec sed -i '' 's/subsets\["latin"\]/subsets: ["latin"]/g' {} +

# 3. Fix transition={{ duration.8 }} → transition={{ duration: 0.8 }}
find src -type f -name "*.js" -exec sed -i '' 's/duration\.8/duration: 0.8/g' {} +

echo "✅ Fix applied. Now run: npm run dev"
