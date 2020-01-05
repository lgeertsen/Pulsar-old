import express from 'express';
import { createServer } from 'http';
import SocketIO from 'socket.io';

import AssetId from './AssetId';
import Config from './Config';
import FileManager from './FileManager'
import Logger from './Logger';
import Renderer from './Renderer';
import SoftwareSocket from './SoftwareSocket';
// import router from './Router'

export default class Server {
  constructor() {
    this._app = express();
    // this._app.use('/', router)
    this._http = createServer(this._app);
    this._io = new SocketIO(this._http);
    this._softwareSocket = new SoftwareSocket(this._io);

    this._config = new Config();

    this._softwares = {};

    this._assetIds = {}
  }

  get assetIds () { return this.assetIds }

  set software (software) { this._softwares[software.id] = software }

  get softwares () { return this._softwares }

  get config () { return this._config }

  async whenReady() {
    let config = await this._config.readConfig()
    this.onConfig("config", config)
    return config
  }

  setWindows(mainWindow, overlay) {
    this._mainWindow = mainWindow;
    this._overlay = overlay;
    this._renderer = new Renderer(this, mainWindow, overlay);
  }

  onConfig (message, config) {
    // this.sendMessageMain(message, config)
    if(this._assetIds["fileManager"] == undefined) {
      Logger.info("----- fileManager AssetId doesn't exist -----");
      let fm = new AssetId("fileManager", config.paths, config.projects, (data) => this.sendMessageMain("assetId", data));
      this._assetIds["fileManager"] = fm;
      let keys = Object.keys(config.projects);
      if(keys.length > 0) {
        this.setAssetIdValue("fileManager", "project", keys[0])
        // fm.project = keys[0];
      }
      // fm.formatForRender();
    }
    if(this._assetIds["newAsset"] == undefined) {
      Logger.log("----- newAsset AssetId doesn't exist -----");
      let na = new AssetId("newAsset", config.paths, config.projects, (data) => this.sendMessageMain("assetId", data));
      this._assetIds["newAsset"] = na;
      let keys = Object.keys(config.projects);
      if(keys.length > 0) {
        this.setAssetIdValue("newAsset", "project", keys[0])
        // na.project = keys[0];
      }
      // na.formatForRender();
    }
  }

  setAssetIdValue(sid, type, value) {
    Logger.info(`sid = ${sid}`)
    Logger.warning(`${type}: ${value}`)
    this._assetIds[sid].setValue(type, value);
  }

  sendMessageMain(message, data) {
    this._renderer.sendMessageMain(message, data)
  }

  startServer() {
    this._http.listen(9846, function(){
      console.log('----- listening on *:9846 -----')
    });
  }
}
