import { join } from 'path';
import { app, ipcMain } from 'electron';
import serve from 'electron-serve';
import {
  createWindow,
  exitOnChange,
} from './helpers';

import io from 'socket.io-client';

import {PythonShell} from 'python-shell';

const isProd = process.env.NODE_ENV === 'production';

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
    height: 800
  });

  mainWindow.maximize();

  const homeUrl = isProd ? 'app://./home.html' : 'http://localhost:8888/home';
  await mainWindow.loadURL(homeUrl);

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }

  // var socket = io('http://localhost:7846/frontend', {
  //   transports: ['websocket'],
  // });
})();

app.on('window-all-closed', () => {
  app.quit();
});

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
