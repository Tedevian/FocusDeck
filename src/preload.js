const { contextBridge, ipcRenderer } = require('electron');

// Puente seguro entre el renderer y el proceso principal para los
// controles de la barra de título (minimizar / maximizar / cerrar).
contextBridge.exposeInMainWorld('focusdeckWindow', {
  minimize: () => ipcRenderer.send('window-minimize'),
  toggleMaximize: () => ipcRenderer.send('window-toggle-maximize'),
  close: () => ipcRenderer.send('window-close'),
  onMaximizedChange: (callback) => {
    const listener = (_event, value) => callback(value);
    ipcRenderer.on('window-maximized-changed', listener);
  },
});
