import { unlink, writeFile } from 'fs'

export default class File {
  constructor (name, extension, size, modified, comment, tags, path) {
    this.name = name
    this.state = undefined
    this.version = undefined
    this.extension = extension
    this.size = size
    this.modified = modified
    this.comment = comment
    this.tags = tags
    this.path = path
  }

  get fullName () { return `${this._name}.${this._extension}` }

  getVersionAsInt () { return parseInt(this.version) }

  saveComment (comment) {
    this._comment = comment
    const splitPath = this._path.split('/')
    const i = splitPath.length - 1
    splitPath[i] = 'comment.txt'
    const path = splitPath.join('/')

    writeFile(path, comment, err => {
      if (err) return console.log(err)
      console.log('comment saved')
    })
  }

  saveTag (tag) {
    this._tags.push(tag)
    const splitPath = this._path.split('/')
    const i = splitPath.length - 1
    splitPath[i] = `${tag}.tag`
    const path = splitPath.join('/')

    writeFile(path, '', err => {
      if (err) return console.log(err)
      console.log('tag saved')
    })
  }

  deleteTag (tag) {
    this._tags.push(tag)
    const splitPath = this._path.split('/')
    const i = splitPath.length - 1
    splitPath[i] = `${tag}.tag`
    const path = splitPath.join('/')

    unlink(path, (err) => {
      if (err) {
        console.error(err)
      }
      // file removed
    })
  }

  formatDate () {
    const year = this._modified.getFullYear()
    const month = this._modified.getMonth() + 1
    const day = this._modified.getDate()
    const hours = this._modified.getHours()
    const minutes = this._modified.getMinutes()
    // let seconds = this._modified.getSeconds();

    return `${month}/${day}/${year} ${hours}:${minutes}`
  }

  formatForRender () {
    const file = {
      class: 'file',
      name: this._name,
      state: this._state,
      version: this._version,
      extension: this._extension,
      size: this._size,
      modified: this.formatDate(),
      tags: this._tags,
      path: this._path
    }
    return file
  }

  format () {
    const file = {
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
    return file
  }
}
