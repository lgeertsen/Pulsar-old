import { join } from 'path';
import { app, ipcMain, globalShortcut } from 'electron';
import serve from 'electron-serve';
import {
  createWindow,
  exitOnChange,
} from './helpers';

// import io from 'socket.io-client';

import Server from "./Server";

// import {PythonShell} from 'python-shell';

const isProd = process.env.NODE_ENV === 'production';

var overlaySoftware = undefined;

var softwares = {};
var config = {};
var directories = {
  type: [],
  name: [],
  task: [],
  subtask: [],
  file: []
};
var assetDirectories = {
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

  var mainWindow = createWindow('main', {
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
    frame: false
  });

  // mainWindow.maximize();
  mainWindow.minimize();

  // var overlay = createWindow('overlay', {
  //   width: 250,
  //   height: 85,
  //   frame: false,
  //   resizable: false,
  //   alwaysOnTop: true,
  //   skipTaskbar: true,
  //   transparent: true
  // });
  //
  // overlay.minimize();


  const homeUrl = isProd ? 'app://./manager.html' : 'http://localhost:8888/manager';
  await mainWindow.loadURL(homeUrl);

  // const overlayUrl = isProd ? 'app://./overlay.html' : 'http://localhost:8888/overlay';
  // await overlay.loadURL(overlayUrl);

  if (!isProd) {
    mainWindow.webContents.openDevTools();
    // overlay.webContents.openDevTools();
  }

  // mainWindow.on("focus", (e) => {
  //   overlay.minimize();
  // });
  //
  // mainWindow.on("blur", (e) => {
  //   overlay.restore();
  // });





  const server = new Server(mainWindow, "overlay");
  server.startServer();

  // const ret = globalShortcut.register('CommandOrControl+S', () => {
  //   console.log('CommandOrControl+S is pressed')
  // });


  // var socket = io('http://localhost:7846/frontend', {
  //   transports: ['websocket'],
  // });


  // ipcMain.on("getSoftwares", (event) => {
  //   event.sender.send('softwares', softwares);
  // });
  //
  // ipcMain.on("getConfig", (event) => {
  //   if(config == {}) {
  //     socket.emit("getConfig");
  //   } else {
  //     event.sender.send('config', config);
  //   }
  // });
  //
  // ipcMain.on("setProject", (event, data) => {
  //   console.log("----- set project -----", data);
  //   socket.emit("setProject", data);
  // });
  //
  // ipcMain.on("setAssetProject", (event, data) => {
  //   console.log("----- set project -----", data);
  //   socket.emit("setAssetProject", data);
  // });
  //
  // ipcMain.on("setSwitch", (event, data) => {
  //   console.log("----- set switch -----", data);
  //   socket.emit("setSwitch", data);
  // });
  //
  // ipcMain.on("setAssetSwitch", (event, data) => {
  //   console.log("----- set switch -----", data);
  //   socket.emit("setAssetSwitch", data);
  // });
  //
  // ipcMain.on("setType", (event, data) => {
  //   console.log("----- set type -----", data);
  //   socket.emit("setType", data);
  // });
  //
  // ipcMain.on("setName", (event, data) => {
  //   console.log("----- set type -----", data);
  //   socket.emit("setType", data);
  // });
  //
  // ipcMain.on("setSidDir", (event, data) => {
  //   console.log("----- set sid dir -----", data);
  //   socket.emit("setSidDir", data);
  // });
  //
  // ipcMain.on("setFile", (event, data) => {
  //   console.log("----- set file -----", data);
  //   socket.emit("setFile", data);
  // });
  //
  // ipcMain.on("execTask", (event, data) => {
  //   console.log("----- exec task -----", data);
  //   socket.emit("execTask", data);
  // });
  //
  // ipcMain.on("checkSotfwareSaved", (event) => {
  //   console.log("----- check is software is saved -----");
  //   socket.emit("checkSotfwareSaved");
  // });
  //
  // ipcMain.on("saveComment", (event, data) => {
  //   console.log("----- save comment -----", data);
  //   socket.emit("saveComment", data);
  // });
  //
  // ipcMain.on("saveConfig", (event, data) => {
  //   removeShortcuts()
  //   console.log("----- save config -----", data);
  //   socket.emit("saveConfig", data);
  //   config = data;
  //   overlay.webContents.send('config', data);
  //   setShortcuts()
  // });
  //
  // ipcMain.on("refresh", (event) => {
  //   console.log("----- refresh browser -----");
  //   socket.emit("refresh");
  // });
  //
  // ipcMain.on("overlaySoftware", (event, data) => {
  //   overlaySoftware = data;
  //   overlay.webContents.send('software', data);
  // });
  //
  // ipcMain.on("getSceneName", (event, data) => {
  //   socket.emit("getSceneName", data);
  // });


  // socket.on("connection", (data) => {
  //   console.log("----- connected to the python server -----");
  // });
  //
  // socket.on("configFile", (data) => {
  //   removeShortcuts()
  //   console.log("----- received config file -----");
  //   console.log(data);
  //   config = data;
  //   mainWindow.webContents.send('config', data)
  //   overlay.webContents.send('config', data)
  //   setShortcuts()
  // });
  //
  // socket.on("directories", (data) => {
  //   console.log("----- received directories");
  //   console.log(data);
  //   let dirs = data.sid == "sid" ? directories : assetDirectories;
  //   switch (data.type) {
  //     case "type":
  //     dirs.name = [];
  //     dirs.task = [];
  //     dirs.subtask = [];
  //     dirs.file = [];
  //     break;
  //     case "name":
  //     dirs.task = [];
  //     dirs.subtask = [];
  //     dirs.file = [];
  //     break;
  //     case "task":
  //     dirs.subtask = [];
  //     dirs.file = [];
  //     break;
  //     case "subtask":
  //     dirs.file = [];
  //     break;
  //   }
  //   dirs[data.type] = data.dirs
  //   mainWindow.webContents.send('directories', {sid: data.sid, dirs: dirs})
  // });
  //
  // socket.on("softwares", (data) => {
  //   console.log("----- connected softwares: -----");
  //   console.log(data);
  //   softwares = data;
  //   mainWindow.webContents.send('softwares', data)
  // });

  // var setShortcuts = () => {
  //   globalShortcut.register(config.overlay.save, () => {
  //     console.log('save')
  //     if(overlaySoftware != undefined) {
  //       let task = {
  //         id: overlaySoftware.id,
  //         command: "save_file",
  //         arguments: {},
  //         type: overlaySoftware.software
  //       };
  //       socket.emit("execTask", task);
  //     }
  //   });
  //   globalShortcut.register(config.overlay.increment, () => {
  //     console.log('increment')
  //     if(overlaySoftware != undefined) {
  //       let task = {
  //         id: overlaySoftware.id,
  //         command: "save_increment",
  //         arguments: {},
  //         type: overlaySoftware.software
  //       };
  //       socket.emit("execTask", task);
  //     }
  //   });

    mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
    if (overlay != null) {
      // secondWindow.close()
      overlay.destroy()
      overlay = null;
    }
  })
  // }

  // const spawn = require('child_process');
  // let result;
  // if (process.env.NODE_ENV === 'production') {
  //   const executable = join(__dirname, process.platform === 'win32' ? 'pulsar.exe' : 'pulsar');
  //   result = spawn.sync(executable, [], { encoding: 'utf8' });
  // } else {
  //   const executable = 'C:/Users/leege/Pulsar/python/dist/pulsar.exe';
  //   result = spawn.async(executable, [], { encoding: 'utf8' });
  //   // result = spawn.sync('python', [join(__dirname, '../python/pulsar.py')], { encoding: 'utf8' });
  // }
})();

var removeShortcuts = () => {
  globalShortcut.unregisterAll()
}

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
