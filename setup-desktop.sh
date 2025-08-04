#!/bin/bash

# Clinic Management System - Desktop App Setup Script
# This script demonstrates the complete setup and packaging process

echo "🏥 Clinic Management System - Desktop App Setup"
echo "=================================================="

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
echo "Frontend dependencies:"
npm install

echo "Backend dependencies:"
cd backend
npm install
cd ..

# Step 2: Build the React application
echo "🔨 Building React application..."
npm run build

# Step 3: Package the desktop application
echo "📱 Packaging desktop application..."

# For Windows (MSI and EXE)
echo "Building Windows installers..."
npm run dist-win

# For other platforms (optional)
# npm run dist-mac    # macOS DMG
# npm run dist-linux  # Linux AppImage/DEB

echo "✅ Desktop application packaging complete!"
echo ""
echo "📋 Output files will be in the 'dist' directory:"
echo "   - Windows: clinic-management-setup.exe, clinic-management.msi"
echo "   - Portable: clinic-management-win.zip"
echo ""
echo "🔧 Server Configuration:"
echo "   - During installation, users can configure the server URL"
echo "   - Default: http://localhost:8000 (local server)"
echo "   - Can be changed to network or remote server addresses"
echo ""
echo "🚀 Installation includes:"
echo "   - Complete clinic management frontend"
echo "   - Local backend server (Node.js)"
echo "   - SQLite database"
echo "   - Configurable server connectivity"
echo "   - Desktop shortcuts and start menu entries"

# Step 4: Development mode (optional)
echo ""
echo "🔧 To run in development mode:"
echo "   npm run electron-dev"
echo ""
echo "🔧 To run frontend and backend separately:"
echo "   npm run dev"