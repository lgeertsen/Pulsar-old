import { basename } from 'path';
import { readFileSync } from 'fs';
import glob from 'glob';

import Logger from './Logger';

export default class NodeManager {
  constructor() {
    this._path = "";
    this._nodes = {};

    this.addBaseNodes();
    this.addTractorNodes();
  }

  set path (path) { this._path = path }

  get nodes () { return this._nodes }

  addBaseNodes() {
    if(!this._nodes.constants) {
      this._nodes.constants = {}
    }

    if(!this._nodes.constants.string) {
      let node = {
        id: "constants.string",
        type: "constants",
        name: "string",
        color: "green",
        icon: "las la-ad",
        script: null,
        inputs: [
          {
            name: "string",
            label: "String",
            description: "String",
            value: "",
            type: "string",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "string"
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }
    if(!this._nodes.constants.number) {
      let node = {
        id: "constants.number",
        type: "constants",
        name: "number",
        color: "cyan",
        icon: "0",
        script: null,
        inputs: [
          {
            name: "number",
            label: "Number",
            description: "Number",
            value: 0,
            type: "number",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "number"
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if(!this._nodes.constants.bool) {
      let node = {
        id: "constants.bool",
        type: "constants",
        name: "bool",
        color: "purple",
        icon: "las la-check-square",
        script: null,
        inputs: [
          {
            name: "bool",
            label: "Bool",
            description: "Boolean",
            value: true,
            type: "bool",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "bool"
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if(!this._nodes.constants.file) {
      let node = {
        id: "constants.file",
        type: "constants",
        name: "file",
        color: "red",
        icon: "las la-file",
        script: null,
        inputs: [
          {
            name: "file",
            label: "File",
            description: "File",
            value: "",
            type: "file",
            extensions: [],
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "file"
          }
        ]
      }
      this._nodes.constants[node.name] = node
    }

    if(!this._nodes.base) {
      this._nodes.base = {}
    }

    if(!this._nodes.base.OUTPUT) {
      let node = {
        id: "base.OUTPUT",
        type: "base",
        name: "OUTPUT",
        color: "black",
        icon: "las la-flag-checkered",
        script: null,
        inputs: [
          {
            name: "output",
            type: "any"
          }
        ],
        outputs: []
      }
      this._nodes.base[node.name] = node
    }

    if(!this._nodes.base.project_file) {
      let node = {
        id: "base.project_file",
        type: "base",
        name: "project_file",
        color: "red",
        icon: "las la-folder",
        script: null,
        inputs: [
          {
            name: "project",
            label: "Project",
            description: "Name of the project",
            value: "",
            type: "dropdown.project",
            hidden: true
          },
          {
            name: "assetshot",
            label: "Asset or Shot",
            description: "Asset or Shot",
            value: "asset",
            type: "switch.assetshot",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "file",
            label: "file",
            type: "file"
          }
        ]
      }
      this._nodes.base[node.name] = node
    }

    if(!this._nodes.operations) {
      this._nodes.operations = {}
    }

    if(!this._nodes.operations.merge) {
      let node = {
        id: "operations.merge",
        type: "operations",
        subType: "merge",
        name: "merge",
        color: "turquoise",
        icon: "las la-compress-arrows-alt",
        script: null,
        inputs: [
          {
            name: "input1",
            label: "Input 1",
            description: "Input",
            value: "",
            type: "any"
          }
        ],
        outputs: []
      }
      this._nodes.operations[node.name] = node
    }
  }

  addTractorNodes() {
    if(!this._nodes.tractor) {
      this._nodes.tractor = {}
    }

    if(!this._nodes.tractor.submit) {
      let node = {
        id: "tractor.submit",
        type: "tractor",
        subType: "submit",
        name: "submit",
        color: "seabrook",
        icon: "las la-tractor",
        script: null,
        inputs: [
          {
            name: "pool",
            label: "Pool",
            description: "Pool",
            value: "",
            type: "string"
          }
        ],
        outputs: []
      }
      this._nodes.tractor[node.name] = node
    }

    if(!this._nodes.tractor.render_houdini) {
      let node = {
        id: "tractor.render_houdini",
        type: "tractor",
        name: "render_houdini",
        color: "orange",
        icon: "las la-tractor",
        script: null,
        inputs: [
          {
            "name": "scene",
            "label": "Scene",
            "description": "The houdini scene file you'd like to render",
            "value": "",
            "type": "file",
            "extensions": [
              "hip",
              "hipnc"
            ]
          },
          {
            "name": "render_node",
            "label": "Render Node",
            "description": "The path of the node you want to render your scene with",
            "value": "/out/",
            "type": "string"
          },
          {
            "name": "frames",
            "label": "Frames",
            "description": "The frames you want to render",
            "value": "",
            "type": "string"
          },
          {
            "name": "pool",
            "label": "Pool",
            "description": "The pools you want to render on",
            "value": "",
            "type": "string"
          }
        ],
        outputs: [
          {
            "name": "output",
            "label": "output",
            "description": "output",
            "value": "",
            "type": "bool"
          }
        ]
      }
      this._nodes.tractor[node.name] = node
    }
  }

  importNodes(cb) {
    glob(`${this._path}/*`, {nodir: true}, (err, files) => {
      if(err) {
        Logger.error(err);
      } else {
        for(let i = 0; i < files.length; i++) {
          let data = readFileSync(files[i]); //, (err, data) => {

            try {
              let file = JSON.parse(data)
              let node = file.node
              if(node.type in this._nodes) {
                this._nodes[node.type][node.name] = node
              } else {
                this._nodes[node.type] = {}
                this._nodes[node.type][node.name] = node
              }
            } catch (e) {
              Logger.error(e);
            }
          // } );
        }
        cb();
      }
    });
  }

  getNode(type, task) {
    return this._nodes[type][task];
  }
}
