const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const startProgram = require('./nspy');

function createWindow() {
  const win = new BrowserWindow({
    width: 1020,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, '../img/logo.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('index.html');
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('opgg', (event, arg) => {
  startProgram('opgg');
});

ipcMain.on('porofessor', (event, arg) => {
  startProgram('porofessor');
});

ipcMain.on('justnames', async (event, arg) => {
  console.log('start didgging names')
  const justnames = await startProgram('justnames');
  console.log("program:", justnames);

  event.reply('send-names', justnames);
});

ipcMain.on('copyAll', (event, arg) => {
  console.log('copy all');
});