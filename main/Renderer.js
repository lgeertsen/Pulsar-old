import { ipcMain } from 'electron';

export default class Renderer {
  constructor(server, mainWindow, overlay) {
    this._server = server;
    this._mainWindow = mainWindow;
    this._overlay = overlay;

    this.listenForMessages();
  }

  sendMessageMain(message, data) {
    this._mainWindow.webContents.send(message, data)
  }

  sendMessageOverlay(message, data) {
    this._overlay.webContents.send(message, data)
  }

  listenForMessages() {
    ipcMain.on("getSoftwares", (event) => {
      event.sender.send('softwares', this._server.softwares);
    });

    ipcMain.on("getConfig", (event) => {
      if(this._server.config.config == {}) {
        console.log("----- Config not ready yet -----");
        this._server.config.readConfig((message, config) => this._server.onConfig(message, config))
      } else {
        event.sender.send('config', this._server.config.config);
      }
    });

    ipcMain.on("setAssetId", (event, data) => {
      this._server.setAssetIdValue(data.sid, data.type, data.value);
    });



    ipcMain.on("setFile", (event, data) => {
      console.log("----- set file -----", data);
      // socket.emit("setFile", data);
    });

    ipcMain.on("execTask", (event, data) => {
      console.log("----- exec task -----", data);
      // socket.emit("execTask", data);
    });

    ipcMain.on("checkSotfwareSaved", (event) => {
      console.log("----- check is software is saved -----");
      // socket.emit("checkSotfwareSaved");
    });

    ipcMain.on("saveComment", (event, data) => {
      console.log("----- save comment -----", data);
      // socket.emit("saveComment", data);
    });

    ipcMain.on("saveConfig", (event, data) => {
      removeShortcuts()
      console.log("----- save config -----", data);
      // socket.emit("saveConfig", data);
      config = data;
      // overlay.webContents.send('config', data);
      // setShortcuts()
    });

    ipcMain.on("refresh", (event) => {
      console.log("----- refresh browser -----");
      // socket.emit("refresh");
    });

    ipcMain.on("overlaySoftware", (event, data) => {
      // overlaySoftware = data;
      // overlay.webContents.send('software', data);
    });

    ipcMain.on("getSceneName", (event, data) => {
      // socket.emit("getSceneName", data);
    });
  }
}
