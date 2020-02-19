import express from 'express';
import path from 'path';
import { createServer } from 'http';
import SocketIO from 'socket.io';

import { execFile } from 'child_process';

import AssetId from './AssetId';
import Config from './Config';
import FileManager from './FileManager'
import Logger from './Logger';
import NodeManager from './NodeManager';
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

    this._nodeManager = new NodeManager();

    this._config = new Config();

    this._softwares = {};

    this._assetIds = {}
  }

  get assetIds () { return this.assetIds }

  set software (software) { this._softwares[software.id] = software }

  get softwares () { return this._softwares }

  get config () { return this._config }

  get nodes () { return this._nodeManager.nodes }

  async whenReady() {
    let config = await this._config.readConfig()
    Logger.list(config);
    this.onConfig("config", config)
    return config
  }

  setWindows(mainWindow, overlay) {
    this._mainWindow = mainWindow;
    this._overlay = overlay;
    this._renderer = new Renderer(this, mainWindow, overlay);
  }

  onConfig (message, config) {
    this._nodeManager.path = config.nodes;
    this._nodeManager.importNodes();
    // this.sendMessageMain(message, config)
    if(this._assetIds["fileManager"] == undefined) {
      Logger.info("----- fileManager AssetId doesn't exist -----");
      let fm = new AssetId("fileManager", config.paths, config.projects, (data) => this.sendMessageMainData("assetId", data));
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
      let na = new AssetId("newAsset", config.paths, config.projects, (data) => this.sendMessageMainData("assetId", data));
      this._assetIds["newAsset"] = na;
      let keys = Object.keys(config.projects);
      if(keys.length > 0) {
        this.setAssetIdValue("newAsset", "project", keys[0])
        // na.project = keys[0];
      }
      // na.formatForRender();
    }
  }

  setConfig(data) {
    this._config.setConfig(data, () => this.sendMessageMain("configSet"));
  }

  setAssetIdValue(sid, type, value) {
    Logger.info(`sid = ${sid}`)
    Logger.warning(`${type}: ${value}`)
    this._assetIds[sid].setValue(type, value);
  }

  sendMessageMain(message) {
    this._renderer.sendMessageMain(message)
  }

  sendMessageMainData(message, data) {
    this._renderer.sendMessageMainData(message, data)
  }

  execTask(data) {
    let type = data.type;
    let task = data.command
    if(["maya", "houdini", "nuke"].includes(type)) {
      let args = data.arguments;
      if(data.id == "new") {
        let winTask = `${type}_${task}`;
        let node = this._nodeManager.getNode("windows", winTask);
        let dirPath = `${this.config.config.nodes}/scripts/windows/`;
        let file = node.script;
        let file_path = path.join(dirPath, file);
        let soft_path = this.config.config.softwares[type];
        Logger.warning(file_path);
        // let command = `start ${file_path} ${soft_path} ${args.file}`
        // Logger.success(command);
        execFile(file_path, [soft_path, args.file], (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout: ${stdout}`);
        });
      } else {

      }
    } else if(["mayapy", "hython"].includes(data.id)) {
      let node = this._nodeManager.getNode(type, task);
      let dirPath = `${this.config.config.nodes}/scripts/${type}`;
      let file = node.script;
      let file_path = path.join(dirPath, file);
      let soft_path = this.config.config.softwares[type];
      // let command = `${soft_path} ${file_path} ${data.arguments.file}`;
      // Logger.info(command);
      execFile(soft_path, [file_path, data.arguments.file], (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    }
  }

  startServer() {
    // this._http.listen(9846, function(){
    //   console.log('----- listening on *:9846 -----')
    // });
  }
}
