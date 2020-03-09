import { basename } from 'path';
import { readdirSync, readFileSync, statSync } from 'fs';
import format from 'string-format';
import glob from 'glob';

import File from './File';
import Sequence from './Sequence';
import Logger from './Logger';

export default class FileManager {
  static getDirectories(asset, cb) {
    let formattedPath = FileManager.formatPath(asset);
    let slicedPath = FileManager.slicePath(formattedPath);
    glob(`${slicedPath}*/`, {}, (err, dirs) => {
      if(err) {
        Logger.error(err);
      } else {
        Logger.info(`----- Directories found in ${slicedPath} -----`);
        cb(dirs);
      }
    });
  }

  static getProjectFiles(asset, cb) {
    FileManager.getDirectories(asset, dirs => {
      let allFiles = [];
      let formattedDirs = FileManager.formatDirs(dirs);
      for(let i = 0; i < dirs.length; i++) {
        let files = glob.sync(`${dirs[i]}*`, {nodir: true});
        let formattedFiles = FileManager.formatDirs(files);
        let dirSplit = formattedDirs[i].split("_");
        let state = dirSplit[0];
        let version = state == "wip" ? "_" : dirSplit[1];

        let comment = "";
        let tags = [];

        for(let j = 0; j < files.length; j++) {
          let f = formattedFiles[j];
          let fileSplit = f.split(".");
          let ext = fileSplit[fileSplit.length-1];
          if(formattedFiles[j] == "comment.txt") {
            comment = readFileSync(files[j], "utf8");
          } else if(ext == "tag") {
            tags.push(fileSplit[0]);
          }
        }
        for(let j = 0; j < files.length; j++) {
          let f = formattedFiles[j];
          let fileSplit = f.split(".");
          let ext = fileSplit[fileSplit.length-1];
          if(formattedFiles[j] != "comment.txt" && ext != "tag") {
            let stats = statSync(files[j]);

            let file = new File(
              fileSplit[0],
              state,
              version,
              ext,
              stats.size,
              stats.mtime,
              comment,
              tags,
              files[j]
            );
            allFiles.push(file);
          }
        }
      }
      cb(allFiles);
    });
  }

  static getSequenceFiles(asset, cb){
    FileManager.getDirectories(asset, dirs => {
      let allFiles = [];
      let formattedDirs = FileManager.formatDirs(dirs);
      for(let i = 0; i < dirs.length; i++) {
        let files = glob.sync(`${dirs[i]}*`, {nodir: true});
        let formattedFiles = FileManager.formatDirs(files);
        let dirSplit = formattedDirs[i].split("_");
        let state = dirSplit[0];
        let version = state == "wip" ? "_" : dirSplit[1];

        let comment = "";
        let tags = [];
        let sequences = [];

        for(let j = 0; j < files.length; j++) {
          let f = formattedFiles[j];
          let fileSplit = f.split(".");
          let ext = fileSplit[fileSplit.length-1];
          if(fileSplit.length === 3 && !Number.isNaN(fileSplit[1]) && !sequences.includes(fileSplit[0])){
            sequences.push(fileSplit[0]);
          }
          if(formattedFiles[j] == "comment.txt") {
            comment = readFileSync(files[j], "utf8");
          } else if(ext == "tag") {
            tags.push(fileSplit[0]);
          }
        }
        sequences.forEach((sequence, i) => {
          sequences[i] = new Sequence(sequence);
        });

        for(let j = 0; j < files.length; j++) {
          let f = formattedFiles[j];
          let fileSplit = f.split(".");
          let ext = fileSplit[fileSplit.length-1];
          let stats = statSync(files[j]);

          if(fileSplit.length === 3 && !Number.isNaN(fileSplit[1])){
            var k = 0;
            sequences.forEach((sequence, i) => {
              if(sequence.name === fileSplit[0]){
                sequence.addFile(
                  fileSplit[0],
                  state,
                  version,
                  ext,
                  stats.size,
                  stats.mtime,
                  comment,
                  tags,
                  files[j],
                  fileSplit[1]
                )
              }
            });
          }
          else{
            if(formattedFiles[j] != "comment.txt" && ext != "tag") {

              let file = new File(
                fileSplit[0],
                state,
                version,
                ext,
                stats.size,
                stats.mtime,
                comment,
                tags,
                files[j]
              );
              allFiles.push(file);
            }
          }
        }
        var k = 0;
        console.log(sequences);
        sequences.forEach((sequence, i) => {
          allFiles.push(sequence);
        });
      }
      cb(allFiles);
    });
  }

  static formatPath(asset) {
    let formattedPath = format(asset.path, asset);
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
      // let dirPath = dirs[i].slice(0, -1);
      // let index = dirPath.lastIndexOf("/");
      // let dir = dirPath.slice(index+1);
      let dir = basename(dirs[i]);
      formattedDirs.push(dir);
    }

    return formattedDirs;
  }

  static removeDoubles(allDirs) {
    let dirs = [];
    for(let i = 0; i < allDirs.length; i++) {
      if(!dirs.includes(allDirs[i])) {
        dirs.push(allDirs[i]);
      }
    }
    return dirs;
  }
}
