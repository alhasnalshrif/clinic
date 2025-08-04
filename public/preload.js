const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Server configuration
  getServerUrl: () => ipcRenderer.invoke('get-server-url'),
  setServerUrl: (url) => ipcRenderer.invoke('set-server-url', url),
  testServerConnection: (url) => ipcRenderer.invoke('test-server-connection', url),
  
  // Settings events
  onOpenSettings: (callback) => ipcRenderer.on('open-settings', callback),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // App info
  isElectron: true,
  platform: process.platform
});