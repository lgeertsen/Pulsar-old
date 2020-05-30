import { unlink, writeFile } from 'fs';

import Logger from './Logger';

export default class File {
  constructor(name, extension, size, modified, comment, tags, path) {
    this.name = name;
    this.state;
    this.version;
    this.extension = extension;
    this.size = size;
    this.modified = modified;
    this.comment = comment;
    this.tags = tags;
    this.path = path;
  }

  get fullName () { return `${this._name}.${this._extension}` }

  // get name () { return this._name }
  // get state () { return this._state }
  // get version () { return this._version }
  // get path () { return this._path }
  // get size () { return this._size }
  // set size (size) { this._size = size }

  saveComment(comment) {
    this._comment = comment;
    let splitPath = this._path.split("/");
    let i = splitPath.length - 1;
    splitPath[i] = "comment.txt";
    let path = splitPath.join("/");

    writeFile(path, comment, err => {
      if (err) return console.log(err);
      console.log("comment saved");
    });
  }

  saveTag(tag) {
    this._tags.push(tag);
    let splitPath = this._path.split("/");
    let i = splitPath.length - 1;
    splitPath[i] = `${tag}.tag`;
    let path = splitPath.join("/");

    writeFile(path, "", err => {
      if (err) return console.log(err);
      console.log("tag saved");
    });
  }

  deleteTag(tag) {
    this._tags.push(tag);
    let splitPath = this._path.split("/");
    let i = splitPath.length - 1;
    splitPath[i] = `${tag}.tag`;
    let path = splitPath.join("/");

    unlink(path, (err) => {
      if (err) {
        console.error(err)
        return
      }
      //file removed
    })
  }

  formatDate() {
    let year = this._modified.getFullYear();
    let month = this._modified.getMonth() + 1;
    let day = this._modified.getDate();
    let hours = this._modified.getHours();
    let minutes = this._modified.getMinutes();
    // let seconds = this._modified.getSeconds();

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  }

  formatForRender() {
    let file = {
      class: "file",
      name: this._name,
      state: this._state,
      version: this._version,
      extension: this._extension,
      size: this._size,
      modified: this.formatDate(),
      tags: this._tags,
      path: this._path
    }
    return file;
  }

  format() {
    let file = {
      name: this._name,
      state: this._state,
      version: this._version,
      extension: this._extension,
      size: this._size,
      modified: this.formatDate(),
      comment: this._comment,
      tags: this._tags,
      path: this._path
    }
    return file;
  }
}
