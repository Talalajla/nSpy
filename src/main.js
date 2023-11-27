const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const startProgram = require('./nspy');

function createWindow() {
  const win = new BrowserWindow({
    width: 1020,
    height: 600,
    resizable: false,
    icon: path.join(__dirname, '../img/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js')
    }
  });

  win.loadFile(path.join(__dirname, './index.html'))
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

ipcMain.on('opgg', async (event, arg) => {
  const msg = await startProgram('opgg');

  if (msg.message === 'done') {
    console.log('Done');
  } else {
    event.reply('invalid-port', msg.message);
    return;
  }
});

ipcMain.on('porofessor', async (event, arg) => {
  const msg = await startProgram('porofessor');

  if (msg.message === 'done') {
    console.log('Done');
  } else {
    event.reply('invalid-port', msg.message);
    return;
  }
});

ipcMain.on('ugg', async (event, arg) => {
  const msg = await startProgram('ugg');

  if (msg.message === 'done') {
    console.log('Done');
  } else {
    event.reply('invalid-port', msg.message);
    return;
  }
});

ipcMain.on('justnames', async (event, arg) => {
  const msg = await startProgram('justnames');
  if (msg.message !== 'done') {
    event.reply('invalid-port', msg.message);
    return;
  }

  event.reply('send-names', msg.names);
});

ipcMain.on('copyAll', (event, arg) => {
  console.log('copy all');
});
