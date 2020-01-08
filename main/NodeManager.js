import { basename } from 'path';
import { readFile } from 'fs';
import glob from 'glob';

import Logger from './Logger';

export default class NodeManager {
  constructor() {
    this._path = "";
    this._nodes = {};
  }

  set path (path) { this._path = path }

  importNodes() {
    glob(`${this._path}/*`, {nodir: true}, (err, files) => {
      if(err) {
        Logger.error(err);
      } else {
        Logger.list(files);
        for(let i = 0; i < files.length; i++) {
          readFile(files[i], (err, data) => {
            try {
              let file = JSON.parse(data)
              let node = file.node
              if(node.type in this._nodes) {
                this._nodes[node.type][node.name] = node
              } else {
                this._nodes[node.type] = {}
                this._nodes[node.type][node.name] = node
              }
              console.log(this._nodes);
            } catch (e) {
              Logger.error(e);
            }
          });
        }
      }
    });
  }

  getNode(type, task) {
    return this._nodes[type][task];
  }
}
