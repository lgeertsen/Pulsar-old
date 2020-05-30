import { FileSequence } from 'fileseq';

import Logger from './Logger';
import File from './File';

class Sequence extends FileSequence {

  constructor(sequence, comment, tags) {
    super(undefined);

    this.frameSet = sequence.frameSet;
    this.dirname = sequence.dirname;
    this.basename = sequence.basename;
    this.extension = sequence.extension;
    this.padding = sequence.padding;

    this.frames = sequence.frameSet._frange;

    this.comment = comment;
    this.tags = tags;
    this.state;
    this.version;
    // this._frames = [];
  }

  // get frames() { return this._frames; }
  // get affichageFrames() { return this._frames[0] + "-" + this._frames[this._frames.length - 1]; }
  // get name() { return this._name; }
  //
  // addFile(name, state, version, extension, size, modified, comment, tags, path, frame){
  //   this._name = name;
  //   this._state = state;
  //   this._version = version;
  //   this._extension = extension;
  //   this._size += size;
  //   this._modified = modified;
  //   this._comment = comment;
  //   this._tags = tags;
  //   this._path = path;
  //
  //   this._frames.push(frame);
  //   this._frames.sort();
  // }
  //
  // formatForRender() {
  //   let file = {
  //     class: "sequence",
  //     name: this._name,
  //     frames: this._frames[0] + "-" + this._frames[this._frames.length - 1],
  //     state: this._state,
  //     version: this._version,
  //     extension: this._extension,
  //     size: this._size,
  //     modified: this.formatDate(),
  //     tags: this._tags,
  //     path: this._path
  //   }
  //   return file;
  // }
  //
  // format() {
  //   let file = {
  //     name: this._name,
  //     frames: this._frames,
  //     state: this._state,
  //     version: this._version,
  //     extension: this._extension,
  //     size: this._size,
  //     modified: this.formatDate(),
  //     comment: this._comment,
  //     tags: this._tags,
  //     path: this._path
  //   }
  //   return file;
  // }
}

export default Sequence
