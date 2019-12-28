import format from 'string-format';
import glob from 'glob';

import Logger from './Logger';

export default class FileManager {
  static getDirectories(asset, cb) {
    let formattedPath = FileManager.formatPath(asset);
    let slicedPath = FileManager.slicePath(formattedPath);
    glob(`${slicedPath}*/`, [], (err, dirs) => {
      if(err) {
        Logger.error(err);
      } else {
        Logger.info(`----- Directories found in ${slicedPath} -----`);
        let formattedDirs = FileManager.formatDirs(dirs);
        cb(formattedDirs);
      }
    });
  }

  static getFiles(asset, cb) {
    let formattedPath = FileManager.formatPath(asset);
    let slicedPath = FileManager.slicePath(formattedPath);
    glob(`${slicedPath}*/`, [], (err, dirs) => {
      if(err) {
        Logger.error(err);
      } else {
        Logger.info(`----- Directories found in ${slicedPath} -----`);
        let formattedDirs = FileManager.formatDirs(dirs);
        asset.setDirs(formattedDirs, cb);
      }
    });
  }

  static formatPath(asset) {
    let formattedPath = format(asset.path, asset)
    return formattedPath;
  }

  static slicePath(path) {
    let index = path.indexOf("<>");
    let slicedPath = path.slice(0, index);
    return slicedPath;
  }

  static formatDirs(dirs) {
    let formattedDirs = [];
    for(let i = 0; i < dirs.length; i++) {
      let dirPath = dirs[i].slice(0, -1);
      let index = dirPath.lastIndexOf("/");
      let dir = dirPath.slice(index+1);

      Logger.error(dir);
      if(!formattedDirs.includes(dir)) {
        formattedDirs.push(dir);
      }
    }

    return formattedDirs;
  }
}
