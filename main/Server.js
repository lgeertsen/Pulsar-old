import express from 'express';
import path from 'path';
import { homedir } from 'os';
import { createServer } from 'http';
import SocketIO from 'socket.io';

import { execFile } from 'child_process';

import AssetId from './AssetId';
import Config from './Config';
import FileManager from './FileManager';
import Graph from './Graph';
import Logger from './Logger';
import NodeManager from './NodeManager';
import Project from './Project';
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

    // this._assetIds = {}
    this._projects = {}
    this._project = undefined;
    this._graph = new Graph(this._nodeManager, (data) => this.sendMessageMainData("graph", data));
  }

  // get assetIds () { return this.assetIds }

  get project() { return this._projects[this._project] }
  set project(project) { this._project = project }
  set software (software) { this._softwares[software.id] = software }
  get softwares () { return this._softwares }
  get config () { return this._config }
  get nodes () { return this._nodeManager.nodes }

  async whenReady() {
    let config = await this._config.readConfig()
    // Logger.list(config);
    this.onConfig("config", config)
    return config
  }

  setWindows(mainWindow, overlay) {
    this._mainWindow = mainWindow;
    this._overlay = overlay;
    this._renderer = new Renderer(this, mainWindow, overlay);
  }

  onConfig (message, config) {
    if (process.env.NODE_ENV === 'production') {
      this._nodeManager.path = path.join(__dirname, '../../../nodes');
      console.log(path.join(__dirname, '../../../nodes'));
      // result = spawn.sync(executable, [], { encoding: 'utf8' });
    } else {
      this._nodeManager.path = "./nodes";
    }
    this._nodeManager.importNodes(() => {
      let output = this._graph.addNode("base", "OUTPUT", {x: 11000, y: 10500});
      let render = this._graph.addNode("houdini", "render", {x: 10700, y: 10500});
      let file1 = this._graph.addNode("constants", "file", {x: 10400, y: 10450});
      let file2 = this._graph.addNode("constants", "file", {x: 10400, y: 10550});
      let string = this._graph.addNode("constants", "string", {x: 10400, y: 10650});
      this._graph.addEdge(output, "output", render, "output");
      this._graph.addEdge(render, "hrender.py", file1, "output");
      this._graph.addEdge(render, "scene", file2, "output");
      this._graph.addEdge(render, "render_node", string, "output");
    });

    // this.sendMessageMain(message, config)

    for(let p in config.projects) {
      let project = new Project(p, config.projects[p], (data) => this.sendMessageMainData("project", data));
      this._projects[p] = project;
    }

    let keys = Object.keys(config.projects);
    if(keys.length > 0) {
      this._project = keys[0];
    }


    // if(this._assetIds["fileManager"] == undefined) {
    //   Logger.info("----- fileManager AssetId doesn't exist -----");
    //   let fm = new AssetId("fileManager", config.paths, config.projects, (data) => this.sendMessageMainData("assetId", data));
    //   this._assetIds["fileManager"] = fm;
    //   let keys = Object.keys(config.projects);
    //   if(keys.length > 0) {
    //     this.setAssetIdValue("fileManager", "project", keys[0])
    //     // fm.project = keys[0];
    //   }
    //   // fm.formatForRender();
    // }
    // if(this._assetIds["newAsset"] == undefined) {
    //   Logger.log("----- newAsset AssetId doesn't exist -----");
    //   let na = new AssetId("newAsset", config.paths, config.projects, (data) => this.sendMessageMainData("assetId", data));
    //   this._assetIds["newAsset"] = na;
    //   let keys = Object.keys(config.projects);
    //   if(keys.length > 0) {
    //     this.setAssetIdValue("newAsset", "project", keys[0])
    //     // na.project = keys[0];
    //   }
    //   // na.formatForRender();
    // }
  }

  setConfig(data) {
    if(this._config.config.firstUsage == true && data.firstUsage == false) {
      for(let p in data.projects) {
        let project = new Project(p, data.projects[p], (data) => this.sendMessageMainData("project", data));
        this._projects[p] = project;
      }

      let keys = Object.keys(data.projects);
      if(keys.length > 0) {
        this._project = keys[0];
      }
      // if(Object.keys(data.projects).length > 0) {
        // this._assetIds["fileManager"].projects = data.projects;
        // this._assetIds["fileManager"].project = Object.keys(data.projects)[0];
        // this._assetIds["newAsset"].projects = data.projects;
        // this._assetIds["newAsset"].project = Object.keys(data.projects)[0];
      // }
    }
    this._config.setConfig(data, () => this.sendMessageMain("configSet"));
  }

  setAssetIdValue(sid, type, value) {
    Logger.info(`sid = ${sid}`)
    Logger.warning(`${type}: ${value}`)
    // this._assetIds[sid].setValue(type, value);
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
        if(data.customArgs) {
          winTask = task;
        }
        let node = this._nodeManager.getNode("windows", winTask);
        let dirPath;
        if (process.env.NODE_ENV === 'production') {
          dirPath = path.join(__dirname, '../../../nodes/scripts/windows');
          // result = spawn.sync(executable, [], { encoding: 'utf8' });
        } else {
          dirPath = `${this.config.config.nodes}/scripts/windows`;
        }
        let file = node.script;
        let file_path = path.join(dirPath, file);
        let soft_path = this.config.config.softwares[type];
        Logger.warning(file_path);
        // let command = `start ${file_path} ${soft_path} ${args.file}`
        // Logger.success(command);
        if(data.customArgs) {
          execFile(file_path, args, (error, stdout, stderr) => {
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
        }

      } else {

      }
    } else if(["mayapy", "hython"].includes(data.id)) {
      let node = this._nodeManager.getNode(type, task);
      // let dirPath = `${this.config.config.nodes}/scripts/${type}`;
      let dirPath;
      if (process.env.NODE_ENV === 'production') {
        dirPath = path.join(__dirname, `../../../nodes/scripts/${type}`);
        // result = spawn.sync(executable, [], { encoding: 'utf8' });
      } else {
        dirPath = `${this.config.config.nodes}/scripts/${type}`;
      }
      let file = node.script;
      let file_path = path.join(dirPath, file);

      let args = data.arguments;
      args.unshift(file_path);

      let soft_path = this.config.config.softwares[type];
      // let command = `${soft_path} ${file_path} ${data.arguments.file}`;
      // Logger.info(command);
      execFile(soft_path, args, (error, stdout, stderr) => {
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
    try {
      // this._http.listen(7846, function(){
      //   console.log('----- listening on *:7846 -----')
      // });
    } catch (e) {

    }
  }
}
