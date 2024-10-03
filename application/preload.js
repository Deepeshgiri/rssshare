const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
    requestResourceCollection: () => ipcRenderer.invoke('collect-resources'),
    executeTask: (task) => ipcRenderer.invoke('execute-task', task),
});
