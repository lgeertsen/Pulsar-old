import { homedir } from 'os';
import { join, sep } from 'path';
import fs from 'fs';

export default class Config {
  constructor() {
    this._config = {};
    this._file = ".pulsar.config";
    this._path = homedir();
    let pathSplit = this._path.split(sep);
    pathSplit.push(this._file);
    this._filePath = join(...pathSplit);
  }

  get config () { return this._config }
  set config (config) { this._config = config }

  initConfig(cb) {
    fs.copyFile('.pulsar.config', this._filePath, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('----- config copied successfully');
        this.readConfig(cb)
      }
    });
  }

  readConfig(cb) {
    console.log("----- Read config -----");
    fs.readFile(this._filePath, (err, data) => {
      if (err) {
        console.error(err)
        if(err.code == 'ENOENT') {
          console.log("----- Config does not exist");
          this.initConfig(cb)
        }
      } else {
        try {
          let config = JSON.parse(data)
          this._config = config;
          cb("config", this._config);
        } catch (e) {
          console.error(e);
        }
      }
    });
  }
}
