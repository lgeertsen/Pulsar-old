import { join } from 'path';
import { app, ipcMain, globalShortcut } from 'electron';
import serve from 'electron-serve';
import {
  createWindow,
  exitOnChange,
} from './helpers';

import io from 'socket.io-client';

import {PythonShell} from 'python-shell';

const isProd = process.env.NODE_ENV === 'production';

var softwares = {};
var config = {};
var directories = {
  type: [],
  name: [],
  task: [],
  subtask: [],
  file: []
};

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    frame: false
  });

  mainWindow.maximize();

  const overlay = createWindow('overlay', {
    width: 250,
    height: 85,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: true
  });

  overlay.minimize();


  const homeUrl = isProd ? 'app://./manager.html' : 'http://localhost:8888/manager';
  await mainWindow.loadURL(homeUrl);

  const overlayUrl = isProd ? 'app://./overlay.html' : 'http://localhost:8888/overlay';
  await overlay.loadURL(overlayUrl);

  if (!isProd) {
    mainWindow.webContents.openDevTools();
    overlay.webContents.openDevTools();
  }

  mainWindow.on("focus", (e) => {
    overlay.minimize();
  });

  mainWindow.on("blur", (e) => {
    overlay.restore();
  });

  // const ret = globalShortcut.register('CommandOrControl+S', () => {
  //   console.log('CommandOrControl+S is pressed')
  // });


  var socket = io('http://localhost:7846/frontend', {
    transports: ['websocket'],
  });


  ipcMain.on("getSoftwares", (event) => {
    event.sender.send('softwares', softwares);
  });

  ipcMain.on("getConfig", (event) => {
    if(config == {}) {
      socket.emit("getConfig");
    } else {
      event.sender.send('config', config);
    }
  });

  ipcMain.on("setProject", (event, data) => {
    console.log("----- set project -----", data);
    socket.emit("setProject", data);
  });

  ipcMain.on("setSwitch", (event, data) => {
    console.log("----- set switch -----", data);
    socket.emit("setSwitch", data);
  });

  ipcMain.on("setType", (event, data) => {
    console.log("----- set type -----", data);
    socket.emit("setType", data);
  });

  ipcMain.on("setName", (event, data) => {
    console.log("----- set type -----", data);
    socket.emit("setType", data);
  });

  ipcMain.on("setSidDir", (event, data) => {
    console.log("----- set sid dir -----", data);
    socket.emit("setSidDir", data);
  });

  ipcMain.on("setFile", (event, data) => {
    console.log("----- set file -----", data);
    socket.emit("setFile", data);
  });

  ipcMain.on("execTask", (event, data) => {
    console.log("----- exec task -----", data);
    socket.emit("execTask", data);
  });

  ipcMain.on("checkSotfwareSaved", (event) => {
    console.log("----- check is software is saved -----");
    socket.emit("checkSotfwareSaved");
  });

  ipcMain.on("saveComment", (event, data) => {
    console.log("----- save comment -----", data);
    socket.emit("saveComment", data);
  });

  ipcMain.on("saveConfig", (event, data) => {
    console.log("----- save config -----", data);
    socket.emit("saveConfig", data);
    config = data;
    overlay.webContents.send('config', data);
  });

  ipcMain.on("refresh", (event) => {
    console.log("----- refresh browser -----");
    socket.emit("refresh");
  });

  ipcMain.on("overlaySoftware", (event, data) => {
    overlay.webContents.send('software', data);
  });

  ipcMain.on("getSceneName", (event, data) => {
    socket.emit("getSceneName", data);
  });





  socket.on("connection", (data) => {
    console.log("----- connected to the python server -----");
  });

  socket.on("configFile", (data) => {
    console.log("----- received config file -----");
    console.log(data);
    config = data;
    mainWindow.webContents.send('config', data)
    overlay.webContents.send('config', data)
  });

  socket.on("directories", (data) => {
    console.log("----- received directories");
    console.log(data);
    switch (data.type) {
      case "type":
        directories.name = [];
        directories.task = [];
        directories.subtask = [];
        directories.file = [];
        break;
      case "name":
        directories.task = [];
        directories.subtask = [];
        directories.file = [];
        break;
      case "task":
        directories.subtask = [];
        directories.file = [];
        break;
      case "subtask":
        directories.file = [];
        break;
    }
    directories[data.type] = data.dirs
    mainWindow.webContents.send('directories', directories)
  });

  socket.on("softwares", (data) => {
    console.log("----- connected softwares: -----");
    console.log(data);
    softwares = data;
    mainWindow.webContents.send('softwares', data)
  });

  const spawn = require('child_process');
  let result;
  if (process.env.NODE_ENV === 'production') {
    const executable = join(__dirname, process.platform === 'win32' ? 'pulsar.exe' : 'pulsar');
    result = spawn.sync(executable, [], { encoding: 'utf8' });
  } else {
    const executable = 'C:/Users/leege/Pulsar/python/dist/pulsar.exe';
    result = spawn.async(executable, [], { encoding: 'utf8' });
    // result = spawn.sync('python', [join(__dirname, '../python/pulsar.py')], { encoding: 'utf8' });
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

app.on('will-quit', () => {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll()
})


// ipcMain.on('run-python', (event, arg) => {
//   let options = {
//     mode: 'text',
//     pythonOptions: ['-u'], // get print results in real-time
//     scriptPath: './python'
//   };
//
//   PythonShell.run('server.py', options, function (err, results) {
//     if (err) throw err;
//     // results is an array consisting of messages collected during execution
//     console.log('results: %j', results);
//     event.sender.send('result', results);
//   });
//   // const spawn = require('cross-spawn');
//   // let result;
//   // if (process.env.NODE_ENV === 'production') {
//   //   const executable = join(__dirname, process.platform === 'win32' ? 'hello.exe' : 'hello');
//   //   result = spawn.sync(executable, [], { encoding: 'utf8' });
//   // } else {
//   //   result = spawn.sync('python', [join(__dirname, '../python/hello.py')], { encoding: 'utf8' });
//   // }
//   // event.sender.send('result', result.stdout);
// });
