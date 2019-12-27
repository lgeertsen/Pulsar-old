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
      console.log("----- data -----", data);
      this._server.setAssetIdValue(data.sid, data.type, data.value);
    });

    ipcMain.on("setProject", (event, data) => {
      console.log("----- set project -----", data);
      // socket.emit("setProject", data);
    });

    ipcMain.on("setAssetProject", (event, data) => {
      console.log("----- set project -----", data);
      // socket.emit("setAssetProject", data);
    });

    ipcMain.on("setSwitch", (event, data) => {
      console.log("----- set switch -----", data);
      // socket.emit("setSwitch", data);
    });

    ipcMain.on("setAssetSwitch", (event, data) => {
      console.log("----- set switch -----", data);
      // socket.emit("setAssetSwitch", data);
    });

    ipcMain.on("setType", (event, data) => {
      console.log("----- set type -----", data);
      // socket.emit("setType", data);
    });

    ipcMain.on("setName", (event, data) => {
      console.log("----- set type -----", data);
      // socket.emit("setType", data);
    });

    ipcMain.on("setSidDir", (event, data) => {
      console.log("----- set sid dir -----", data);
      // socket.emit("setSidDir", data);
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
