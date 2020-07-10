import { Menu, dialog } from 'electron'
import express from 'express'
import path from 'path'
import fs from 'fs'
// import { homedir } from 'os'
import { createServer } from 'http'
import SocketIO from 'socket.io'

import { execFile } from 'child_process'

import Config from './Config'
import Graph from './Graph'
import Logger from './Logger'
import NodeManager from './NodeManager'
import Project from './Project'
import Renderer from './Renderer'
import SoftwareSocket from './SoftwareSocket'
// import router from './Router'

export default class Server {
  constructor () {
    this._app = express()
    // this._app.use('/', router)
    this._http = createServer(this._app)
    this._io = new SocketIO(this._http)
    this._softwareSocket = new SoftwareSocket(this._io)

    this._nodeManager = new NodeManager()

    this._config = new Config()

    this._softwares = {}

    this._page = undefined

    // this._assetIds = {}
    this._projects = {}
    this._project = undefined
    this._graph = new Graph(this._nodeManager, this, (data) => this.sendMessageMainData('graph', data))
  }

  // get assetIds () { return this.assetIds }

  get project () { return this._projects[this._project] }
  set project (project) { this._project = project }
  get software () { return this._softwares }
  set software (software) { this._softwares[software.id] = software }
  get softwares () { return this._softwares }
  get config () { return this._config }
  get nodes () { return this._nodeManager.nodes }

  get page () { return this._page }
  set page (page) {
    this._page = page
    this.setWindowMenu()
  }

  async whenReady () {
    const config = await this._config.readConfig()
    // Logger.list(config);
    this.onConfig('config', config)
    return config
  }

  setWindows (mainWindow, overlay) {
    this._mainWindow = mainWindow
    this._overlay = overlay
    this._renderer = new Renderer(this, mainWindow, overlay)
  }

  setWindowMenu () {
    if (this._page === 'graph') {
      const template = [
        {
          label: 'File',
          submenu: [
            {
              label: 'Open Graph',
              click: () => {
                this.openGraph()
              }
            },
            {
              label: 'Save Graph',
              click: () => {
                this.saveGraph()
              }
            }
          ]
        }
      ]
      const menu = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menu)
    }
  }

  onConfig (message, config) {
    if (process.env.NODE_ENV === 'production') {
      this._nodeManager.path = path.join(__dirname, '../../../nodes')
      console.log(path.join(__dirname, '../../../nodes'))
      // result = spawn.sync(executable, [], { encoding: 'utf8' });
    } else {
      this._nodeManager.path = 'C:/Users/leege/_pulsar/nodes'
    }
    this._nodeManager.importNodes(() => {
      // let output = this._graph.addNode("base", "OUTPUT", {x: 11000, y: 10500});
      // let merge = this._graph.addNode("operations", "merge", {x: 11000, y: 10600});
      // let render = this._graph.addNode("houdini", "render", {x: 10700, y: 10500});
      // this._graph.setNodeInputValue(render, "frames", [1, 5]);
      // let render2 = this._graph.addNode("houdini", "render", {x: 10700, y: 10700});
      // this._graph.setNodeInputValue(render2, "frames", [10, 15]);
      // let file1 = this._graph.addNode("constants", "file", {x: 10400, y: 10450});
      // this._graph.setNodeInputValue(file1, "file", "C:\\Houdini17\\bin\\hrender.py");
      // let file2 = this._graph.addNode("constants", "file", {x: 10400, y: 10550});
      // this._graph.setNodeInputValue(file2, "file", "C:\\Users\\leege\\pulsar-test.hipnc");
      // let string = this._graph.addNode("constants", "string", {x: 10400, y: 10650});
      // this._graph.setNodeInputValue(string, "string", "/out/mantra_ipr");
      // // this._graph.addEdge(output, "output", render, "output");
      // this._graph.addEdge(merge, "input1", render, "output");
      // this._graph.addEdge(merge, "input2", render2, "output");
      // this._graph.addEdge(render, "hrender.py", file1, "output");
      // this._graph.addEdge(render, "scene", file2, "output");
      // this._graph.addEdge(render, "render_node", string, "output");
      // this._graph.addEdge(render2, "hrender.py", file1, "output");
      // this._graph.addEdge(render2, "scene", file2, "output");
      // this._graph.addEdge(render2, "render_node", string, "output");
    })

    // this.sendMessageMain(message, config)

    for (const p in config.projects) {
      const project = new Project(p, config.projects[p], (data) => this.sendMessageMainData('project', data))
      this._projects[p] = project
    }

    const keys = Object.keys(config.projects)
    if (keys.length > 0) {
      this._project = keys[0]
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

  setConfig (data) {
    if (this._config.config.firstUsage === true && data.firstUsage === false) {
      for (const p in data.projects) {
        const project = new Project(p, data.projects[p], (data) => this.sendMessageMainData('project', data))
        this._projects[p] = project
      }

      const keys = Object.keys(data.projects)
      if (keys.length > 0) {
        this._project = keys[0]
      }
      // if(Object.keys(data.projects).length > 0) {
      // this._assetIds["fileManager"].projects = data.projects;
      // this._assetIds["fileManager"].project = Object.keys(data.projects)[0];
      // this._assetIds["newAsset"].projects = data.projects;
      // this._assetIds["newAsset"].project = Object.keys(data.projects)[0];
      // }
    }
    this._config.setConfig(data, () => this.sendMessageMain('configSet'))
  }

  setAssetIdValue (sid, type, value) {
    Logger.info(`sid = ${sid}`)
    Logger.warning(`${type}: ${value}`)
    // this._assetIds[sid].setValue(type, value);
  }

  sendMessageMain (message) {
    this._renderer.sendMessageMain(message)
  }

  sendMessageMainData (message, data) {
    this._renderer.sendMessageMainData(message, data)
  }

  execTask (data) {
    const type = data.type
    const task = data.command

    if (['maya', 'houdini', 'nuke'].includes(type)) {
      const args = data.arguments
      if (data.id === 'new') {
        let winTask = `${type}_${task}`
        if (data.customArgs) {
          winTask = task
        }
        const node = this._nodeManager.getNode('windows', winTask)
        let dirPath
        if (process.env.NODE_ENV === 'production') {
          dirPath = path.join(__dirname, '../../../nodes/scripts/windows')
          // result = spawn.sync(executable, [], { encoding: 'utf8' });
        } else {
          dirPath = `${this.config.config.nodes}/scripts/windows`
        }
        const file = node.script
        const filePath = path.join(dirPath, file)
        const softPath = this.config.config.softwares[type]
        Logger.warning(filePath)
        // let command = `start ${filePath} ${softPath} ${args.file}`
        // Logger.success(command);
        if (data.customArgs) {
          execFile(filePath, args, (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`)
              return
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`)
              return
            }
            console.log(`stdout: ${stdout}`)
          })
        } else {
          execFile(filePath, [softPath, args.file], (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`)
              return
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`)
              return
            }
            console.log(`stdout: ${stdout}`)
          })
        }
      } else {

      }
    } else if (['mayapy', 'hython'].includes(data.id)) {
      const node = this._nodeManager.getNode(type, task)
      // let dirPath = `${this.config.config.nodes}/scripts/${type}`;
      let dirPath
      if (process.env.NODE_ENV === 'production') {
        dirPath = path.join(__dirname, `../../../nodes/scripts/${type}`)
        // result = spawn.sync(executable, [], { encoding: 'utf8' });
      } else {
        dirPath = `${this.config.config.nodes}/scripts/${type}`
      }
      const file = node.script
      const filePath = path.join(dirPath, file)

      const args = data.arguments
      args.unshift(filePath)

      const softPath = this.config.config.softwares[type]
      // let command = `${softPath} ${filePath} ${data.arguments.file}`;
      // Logger.info(command);
      execFile(softPath, args, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        console.log(`stdout: ${stdout}`)
      })
    }
  }

  startServer () {
    try {
      this._http.listen(7846, () => {
        console.log('----- listening on *:7846 -----')
      })
    } catch (e) {

    }
  }

  openGraph () {
    dialog.showOpenDialog(this._mainWindow, {
      filters:
      [
        { name: 'Pulsar Graph', extensions: ['puls'] }
      ]
    }, (files) => {
      if (files.length > 0) {
        const file = files[0]
        if (!file.endsWith('.puls')) {
          return
        }
        fs.readFile(file, (err, data) => {
          if (err) {
            console.error(err)
            return
          }
          try {
            const graph = JSON.parse(data)
            console.log(graph)
            this.sendMessageMain('clearGraph')
            this._graph.graph = graph
          } catch (e) {
            console.error(e)
          }
        })
      }
    })
  }

  saveGraph () {
    if (this._graph.name === undefined) {
      dialog.showSaveDialog(this._mainWindow, {
        filters:
        [
          { name: 'Pulsar Graph', extensions: ['puls'] }
        ]
      }, (file) => {
        if (file === '') {
          console.log('no file')
          return
        }
        if (!file.endsWith('.puls')) {
          file += '.puls'
        }
        const data = this._graph.formatForSave()
        data.name = path.basename(file)
        data.path = file
        const jsonContent = JSON.stringify(data, null, 2)

        fs.writeFile(file, jsonContent, 'utf8', function (err) {
          if (err) {
            console.log('An error occured while writing JSON Object to File.')
            // return console.log(err);
          }
        })
      })
    } else {
      const data = this._graph.formatForSave()
      const jsonContent = JSON.stringify(data, null, 2)

      fs.writeFile(data.path, jsonContent, 'utf8', function (err) {
        if (err) {
          console.log('An error occured while writing JSON Object to File.')
          // return console.log(err);
        }
      })
    }
  }
}
