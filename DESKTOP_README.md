# Desktop Application Packaging

This document explains how to build and distribute the Clinic Management System as a desktop application with configurable server settings.

## 🖥️ Desktop App Features

### Core Features
- **Complete Offline Capability**: Runs independently with built-in server
- **Configurable Server URL**: Connect to local or remote servers
- **Professional Installer**: Windows MSI/EXE with setup customization
- **Auto-Start Backend**: Automatically starts the Node.js server
- **Secure Configuration**: Server settings stored securely
- **Cross-Platform**: Support for Windows, macOS, and Linux

### Desktop-Specific Enhancements
- **Server Configuration UI**: Dedicated settings page for server management
- **Connection Testing**: Built-in server connectivity validation
- **Installation Customization**: Configure server URL during installation
- **System Integration**: Desktop shortcuts and start menu entries
- **Auto-Update Ready**: Infrastructure for future update capabilities

## 🚀 Quick Start

### Prerequisites
```bash
Node.js >= 16.0.0
npm >= 8.0.0
```

### Build Desktop Application
```bash
# Install all dependencies
npm install
cd backend && npm install && cd ..

# Build React application
npm run build

# Package for Windows (MSI + EXE)
npm run dist-win

# Package for all platforms
npm run dist
```

### Available Build Commands
```bash
# Development
npm run electron-dev      # Run in development mode
npm run dev              # Run frontend + backend separately

# Building
npm run build            # Build React app
npm run pack             # Package without installer
npm run dist             # Package with installer (all platforms)

# Platform-specific
npm run dist-win         # Windows MSI/EXE
npm run dist-mac         # macOS DMG
npm run dist-linux       # Linux AppImage/DEB
```

## 📁 Project Structure

```
clinic/
├── public/
│   ├── electron.js          # Main Electron process
│   ├── preload.js          # Secure IPC bridge
│   └── assets/             # App icons
├── src/
│   ├── components/
│   │   └── ServerConfig/   # Server configuration UI
│   └── config/
│       └── app.js          # Dynamic configuration
├── backend/                # Node.js server (bundled)
├── build/
│   └── installer.nsh       # Windows installer script
└── dist/                   # Output packages
```

## ⚙️ Configuration Options

### Installer Configuration
The Windows installer (`installer.nsh`) allows users to:
- Set custom server URL during installation
- Choose installation directory
- Create desktop shortcuts
- Configure start menu entries

### Runtime Configuration
Users can change server settings through:
- **Desktop App UI**: Settings → Server Configuration
- **Configuration File**: `%APPDATA%/Clinic Management System/clinic-config.json`
- **Command Line**: Via Electron IPC

### Supported Server URLs
```javascript
// Local server (default)
"http://localhost:8000"

// Network server
"http://192.168.1.100:8000"

// Remote server
"https://clinic.yourdomain.com"
```

## 🔧 Development

### Electron Configuration
```javascript
// public/electron.js
- Main process handles backend server startup
- IPC communication for configuration
- Security-first architecture
- Auto-start local server in production

// public/preload.js
- Secure bridge between renderer and main
- Exposes only necessary APIs
- Type-safe communication
```

### Backend Integration
```javascript
// Automatically starts Node.js server
// Configurable connection endpoints
// Health check and connection testing
// Graceful shutdown on app exit
```

### Frontend Enhancements
```javascript
// Dynamic server URL configuration
// Desktop-specific UI components
// Connection status indicators
// Electron-aware feature flags
```

## 📦 Packaging Details

### Windows Packaging
```json
{
  "target": ["nsis", "msi"],
  "icon": "public/assets/icon.ico",
  "publisherName": "Clinic Management Solutions",
  "oneClick": false,
  "allowToChangeInstallationDirectory": true
}
```

### Output Files
After building, you'll find:
```
dist/
├── clinic-management-setup.exe    # NSIS installer
├── clinic-management.msi          # MSI installer
├── win-unpacked/                  # Portable version
└── latest.yml                     # Update metadata
```

### File Inclusions
The packaged application includes:
- React build output
- Complete Node.js backend
- SQLite database
- Backend dependencies
- Electron runtime
- Configuration files

## 🔒 Security Features

### Secure Architecture
- **Context Isolation**: Renderer process isolation
- **Preload Script**: Controlled IPC exposure
- **Content Security Policy**: XSS protection
- **Secure Defaults**: No node integration in renderer

### Configuration Security
- **Encrypted Storage**: Secure configuration storage
- **Validation**: URL format validation
- **Sandboxing**: Limited system access
- **Safe Defaults**: Fallback to secure settings

## 🧪 Testing

### Manual Testing
1. **Development Mode**:
   ```bash
   npm run electron-dev
   ```

2. **Production Build**:
   ```bash
   npm run build && npm run pack
   ```

3. **Installer Testing**:
   ```bash
   npm run dist-win
   # Test the installer on Windows
   ```

### Automated Testing
```bash
# Test React components
npm test

# Test backend API
cd backend && npm test

# Test Electron (requires additional setup)
npm run test:electron
```

## 🔄 Updates and Maintenance

### Auto-Update Setup (Future)
The application is configured for auto-updates:
- Update server configuration
- Differential updates
- Silent background updates
- Rollback capabilities

### Version Management
```json
{
  "version": "2.0.0",
  "buildVersion": "1.0.0",
  "productName": "Clinic Management System"
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Clean install
   rm -rf node_modules backend/node_modules
   npm install && cd backend && npm install
   ```

2. **Server Connection Issues**:
   - Check server URL format
   - Verify server is running
   - Test connection through UI

3. **Packaging Errors**:
   - Ensure all dependencies installed
   - Check electron-builder configuration
   - Verify file paths in package.json

### Debug Mode
```bash
# Enable debug logging
export DEBUG=electron-builder
npm run dist
```

## 🚀 Deployment

### Distribution
1. **Direct Distribution**: Share installer files
2. **Network Installation**: Deploy to file servers
3. **Web Download**: Host on websites
4. **Auto-Update Server**: Setup update infrastructure

### Installation Process
1. User downloads installer
2. Runs setup with server configuration
3. Application installs with shortcuts
4. First run connects to configured server
5. Local database initializes if needed

## 📞 Support

### User Support
- **Installation Guide**: Step-by-step setup
- **Configuration Help**: Server URL assistance
- **Troubleshooting**: Common issue resolution
- **Updates**: Version management

### Developer Support
- **Build Issues**: Compilation problems
- **Packaging**: Distribution challenges
- **Configuration**: Setup customization
- **Integration**: Server connectivity

---

**Built with ❤️ for dental professionals**

*Desktop packaging ready for production deployment*