import { app, BrowserWindow } from 'electron';

import { createRenderer } from './create-renderer';
import { createIpc } from './create-ipc';

let renderer: BrowserWindow | null;

const createWindow = createRenderer(
  win => renderer = win, 
  () => renderer = null
);

createIpc();

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (renderer === null) {
    createWindow();
  }
});
