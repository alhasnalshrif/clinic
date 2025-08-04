const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const { ipcMain, dialog, Menu } = electron;

const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let backendProcess;
let serverUrl = 'http://localhost:8000';

// Configuration file path
const configPath = path.join(app.getPath('userData'), 'clinic-config.json');

// Load configuration
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      serverUrl = config.serverUrl || 'http://localhost:8000';
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }
}

// Save configuration
function saveConfig() {
  try {
    const config = { serverUrl };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

// Start backend server if in production mode
function startBackendServer() {
  if (!isDev) {
    const backendPath = path.join(__dirname, '..', 'backend');
    const serverScript = path.join(backendPath, 'server.js');
    
    if (fs.existsSync(serverScript)) {
      backendProcess = spawn('node', [serverScript], {
        cwd: backendPath,
        stdio: 'pipe',
        env: { ...process.env, PORT: '8000' }
      });
      
      backendProcess.on('error', (error) => {
        console.error('Backend server error:', error);
        dialog.showErrorBox('Server Error', 'Failed to start backend server: ' + error.message);
      });
      
      backendProcess.on('exit', (code) => {
        console.log('Backend server exited with code:', code);
      });
    }
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // App icon
    title: 'Clinic Management System'
  });

  // Hide menu bar
  mainWindow.setMenuBarVisibility(false);

  // Load the app
  const startUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;
  mainWindow.loadURL(startUrl);

  // Development tools
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent navigation to external URLs
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== new URL(startUrl).origin && !isDev) {
      event.preventDefault();
    }
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Settings',
          click: () => {
            if (mainWindow) {
              mainWindow.webContents.send('open-settings');
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Clinic Management System',
              message: 'Clinic Management System',
              detail: 'Version 2.0.0\nA comprehensive dental clinic management solution.'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC handlers
ipcMain.handle('get-server-url', () => {
  return serverUrl;
});

ipcMain.handle('set-server-url', (event, newUrl) => {
  serverUrl = newUrl;
  saveConfig();
  return serverUrl;
});

ipcMain.handle('test-server-connection', async (event, testUrl) => {
  try {
    const response = await fetch(testUrl + '/api/health');
    return response.ok;
  } catch (error) {
    return false;
  }
});

// App event handlers
app.whenReady().then(() => {
  loadConfig();
  startBackendServer();
  createWindow();
  createMenu();
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});