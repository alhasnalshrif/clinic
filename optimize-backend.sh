#!/bin/bash

# Backend preparation script for Electron packaging
# This script optimizes the backend for desktop app distribution

echo "🔧 Preparing backend for desktop packaging..."

# Create a production-ready backend bundle
cd backend

# Install only production dependencies
echo "📦 Installing production dependencies..."
npm ci --only=production

# Create optimized package.json for distribution
echo "📝 Creating optimized package.json..."
cat > package-dist.json << 'EOF'
{
  "name": "clinic-backend",
  "version": "1.0.0",
  "description": "Clinic Management Backend for Desktop App",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "better-sqlite3": "^11.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "drizzle-orm": "^0.35.3",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  }
}
EOF

# Copy the optimized package.json
cp package-dist.json package.json

# Remove development dependencies and files
rm -rf node_modules/.cache
rm -rf drizzle/.DS_Store
rm -f package-dist.json

echo "✅ Backend optimized for packaging"
cd ..

echo "🏗️ Backend packaging optimization complete!"
echo "   - Production dependencies only"
echo "   - Optimized package.json"
echo "   - Removed development artifacts"