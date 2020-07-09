import { basename, join } from 'path'
import { existsSync, readFileSync } from 'fs'
import glob from 'glob'

import Logger from './Logger'

export default class NodeManager {
  constructor () {
    if (!!this.constructor.instance) {
      return this.constructor.instance
    }

    this.constructor.instance = this

    this._path = ''
    this._nodes = {}

    this.addBaseNodes()
    this.addTractorNodes()

    return this
  }

  get path () { return this._path }
  set path (path) { this._path = path }

  get nodes () { return this._nodes }

  addBaseNodes () {
    if (!this._nodes.constants) {
      this._nodes.constants = {}
    }

    if (!this._nodes.constants.string) {
      const node = {
        id: 'constants.string',
        type: 'constants',
        name: 'string',
        color: 'green',
        icon: 'las la-ad',
        script: null,
        inputs: [
          {
            name: 'string',
            label: 'String',
            description: 'String',
            value: '',
            type: 'string',
            hidden: true
          }
        ],
        outputs: [
          {
            name: 'output',
            type: 'string'
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }
    if (!this._nodes.constants.number) {
      const node = {
        id: 'constants.number',
        type: 'constants',
        name: 'number',
        color: 'cyan',
        icon: '0',
        script: null,
        inputs: [
          {
            name: 'number',
            label: 'Number',
            description: 'Number',
            value: 0,
            type: 'number',
            hidden: true
          }
        ],
        outputs: [
          {
            name: 'output',
            type: 'number'
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if (!this._nodes.constants.bool) {
      const node = {
        id: 'constants.bool',
        type: 'constants',
        name: 'bool',
        color: 'purple',
        icon: 'las la-check-square',
        script: null,
        inputs: [
          {
            name: 'bool',
            label: 'Bool',
            description: 'Boolean',
            value: true,
            type: 'bool',
            hidden: true
          }
        ],
        outputs: [
          {
            name: 'output',
            type: 'bool'
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if (!this._nodes.constants.file) {
      const node = {
        id: 'constants.file',
        type: 'constants',
        name: 'file',
        color: 'red',
        icon: 'las la-file',
        script: null,
        inputs: [
          {
            name: 'file',
            label: 'File',
            description: 'File',
            value: '',
            type: 'file',
            extensions: [],
            hidden: true
          }
        ],
        outputs: [
          {
            name: 'output',
            type: 'file'
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if (!this._nodes.base) {
      this._nodes.base = {}
    }

    if (!this._nodes.base.OUTPUT) {
      const node = {
        id: 'base.OUTPUT',
        type: 'base',
        name: 'OUTPUT',
        color: 'black',
        icon: 'las la-flag-checkered',
        script: null,
        inputs: [
          {
            name: 'output',
            type: 'any'
          }
        ],
        outputs: []
      }
      this._nodes.base[node.name] = node
    }

    if (!this._nodes.base.project_file) {
      const node = {
        id: 'base.project_file',
        type: 'base',
        name: 'project_file',
        color: 'red',
        icon: 'las la-folder',
        script: null,
        inputs: [
          {
            name: 'project',
            label: 'Project',
            description: 'Name of the project',
            value: '',
            type: 'dropdown.project',
            hidden: true
          },
          {
            name: 'assetshot',
            label: 'Asset or Shot',
            description: 'Asset or Shot',
            value: 'asset',
            type: 'switch.assetshot',
            hidden: true
          }
        ],
        outputs: [
          {
            name: 'file',
            label: 'file',
            type: 'file'
          }
        ]
      }
      this._nodes.base[node.name] = node
    }

    if (!this._nodes.operations) {
      this._nodes.operations = {}
    }

    if (!this._nodes.operations.merge) {
      const node = {
        id: 'operations.merge',
        type: 'operations',
        subType: 'merge',
        name: 'merge',
        color: 'turquoise',
        icon: 'las la-compress-arrows-alt',
        script: null,
        inputs: [
          {
            name: 'input1',
            label: 'Input 1',
            description: 'Input',
            value: '',
            type: 'any'
          }
        ],
        outputs: []
      }
      this._nodes.operations[node.name] = node
    }

    if (!this._nodes.fake) {
      this._nodes.fake = {}
    }

    if (!this._nodes.fake.check_frames) {
      const node = {
        id: 'fake.check_frames',
        type: 'fake',
        subType: 'check_frames',
        name: 'check_render',
        color: 'periwinkle',
        icon: 'las la-image',
        script: null,
        inputs: [
          {
            name: 'path',
            label: 'Path',
            description: 'Path',
            value: '',
            type: 'string'
          }
        ],
        outputs: [
          {
            name: 'frames',
            label: 'Missing Frames',
            description: 'Path',
            value: '',
            type: 'string'
          }
        ]
      }
      this._nodes.fake[node.name] = node
    }

    if (!this._nodes.fake.nuke_import) {
      const node = {
        id: 'fake.nuke_import',
        type: 'fake',
        subType: 'nuke_import',
        name: 'nuke_import',
        color: 'yellow',
        icon: 'nuke.png',
        script: null,
        inputs: [
          {
            name: 'scene',
            label: 'Scene',
            description: 'Path',
            value: '',
            type: 'file'
          },
          {
            name: 'images',
            label: 'Images',
            description: 'Path',
            value: '',
            type: 'string'
          }
        ],
        outputs: [

        ]
      }
      this._nodes.fake[node.name] = node
    }
  }

  addTractorNodes () {
    if (!this._nodes.tractor) {
      this._nodes.tractor = {}
    }

    // if(!this._nodes.tractor.submit) {
    //   let node = {
    //     id: "tractor.submit",
    //     type: "tractor",
    //     subType: "submit",
    //     name: "submit",
    //     color: "seabrook",
    //     icon: "las la-tractor",
    //     script: null,
    //     inputs: [
    //       {
    //         name: "pulsar_graph",
    //         label: "Pulsar Graph File",
    //         description: "Pulsar Graph File",
    //         value: "",
    //         type: "string",
    //         hidden: true
    //       },
    //       {
    //         name: "pool",
    //         label: "Pool",
    //         description: "Pool",
    //         value: "",
    //         type: "string"
    //       }
    //     ],
    //     outputs: []
    //   }
    //   this._nodes.tractor[node.name] = node
    // }

    // if(!this._nodes.tractor.render_houdini) {
    //   let node = {
    //     id: "tractor.render_houdini",
    //     type: "tractor",
    //     subType: "render_houdini",
    //     name: "render_houdini",
    //     color: "orange",
    //     icon: "las la-tractor",
    //     script: null,
    //     inputs: [
    //       {
    //         "name": "scene",
    //         "label": "Scene",
    //         "description": "The houdini scene file you'd like to render",
    //         "value": "",
    //         "type": "file",
    //         "extensions": [
    //           "hip",
    //           "hipnc"
    //         ]
    //       },
    //       {
    //         "name": "render_node",
    //         "label": "Render Node",
    //         "description": "The path of the node you want to render your scene with",
    //         "value": "/out/",
    //         "type": "string"
    //       },
    //       {
    //         "name": "frames",
    //         "label": "Frames",
    //         "description": "The frames you want to render",
    //         "value": "",
    //         "type": "string"
    //       },
    //       {
    //         "name": "pool",
    //         "label": "Pool",
    //         "description": "The pools you want to render on",
    //         "value": "",
    //         "type": "string"
    //       }
    //     ],
    //     outputs: [
    //       {
    //         "name": "output",
    //         "label": "output",
    //         "description": "output",
    //         "value": "",
    //         "type": "bool"
    //       }
    //     ]
    //   }
    //   this._nodes.tractor[node.name] = node
    // }
  }

  importNodes (cb) {
    glob(`${this._path}/*/`, (err, dirs) => {
      if (err) {
        Logger.error(err)
      } else {
        // console.log(dirs);
        for (const i in dirs) {
          const dirname = basename(dirs[i])
          const path = join(dirs[i], 'pulsar.json')
          if (existsSync(path)) {
            const data = readFileSync(path)
            try {
              const file = JSON.parse(data)
              const nodes = file.nodes
              for (const j in nodes) {
                nodes[j].type = dirname
                nodes[j].id = `${dirname}.${nodes[j].name}`
                if (nodes[j].category in this._nodes) {
                  this._nodes[nodes[j].category][nodes[j].name] = nodes[j]
                } else {
                  this._nodes[nodes[j].category] = {}
                  this._nodes[nodes[j].category][nodes[j].name] = nodes[j]
                }
              }
            } catch (e) {
              Logger.error(e)
            }
          }
        }

        cb()
        // for(let i = 0; i < files.length; i++) {
        //   let data = readFileSync(files[i]); //, (err, data) => {
        //
        //     try {
        //       let file = JSON.parse(data)
        //       let node = file.node
        //       if(node.type in this._nodes) {
        //         this._nodes[node.type][node.name] = node
        //       } else {
        //         this._nodes[node.type] = {}
        //         this._nodes[node.type][node.name] = node
        //       }
        //     } catch (e) {
        //       Logger.error(e);
        //     }
        //   // } );
        // }
        // cb();
      }
    })
  }

  getNode (type, task) {
    return this._nodes[type][task]
  }
}

// const instance = new NodeManager()
// Object.freeze(instance)
//
// export default instance
