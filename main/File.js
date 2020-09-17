import { unlink, writeFile } from 'fs'

/**
 * Class that represents a file
 */
class File {
  /**
   * constructor - Construcor for the File class
   *
   * @param {string} name      The file's name
   * @param {string} extension The file's extension
   * @param {number} size      The size of the file in bytes
   * @param {Date} modified  The modification date of the file
   * @param {string} comment   The comment that goes with the file
   * @param {string[]} tags    The tags that have been added to the file
   * @param {string} path      The path of the file
   */
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

  /**
   * fullName - Getter for the file name plus it's extension
   *
   * @returns {string} fileName.fileExtension
   */
  get fullName () { return `${this._name}.${this._extension}` }

  /**
   * getVersionAsInt - Getter for the files version
   *
   * @returns {number} The version of the file
   */
  getVersionAsInt () { return parseInt(this.version) }

  /**
   * saveComment - Save a comment.txt for the file
   *
   * @param {string} comment The comment that has to be saved
   */
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

  /**
   * saveTag - Add a .tag file
   *
   * @param {string} tag Name of the tag
   */
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

  /**
   * deleteTag - Delete a .tag file
   *
   * @param {string} tag Name of the tage to be deleted
   */
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

  /**
   * formatDate - Format the modified date to a readable string
   *
   * @returns {string} The modified date as a string
   */
  formatDate () {
    const year = this._modified.getFullYear()
    const month = this._modified.getMonth() + 1
    const day = this._modified.getDate()
    const hours = this._modified.getHours()
    const minutes = this._modified.getMinutes()
    // let seconds = this._modified.getSeconds();

    return `${month}/${day}/${year} ${hours}:${minutes}`
  }

  /**
   * formatForRender - Format the instance as an Object to send to the frontend
   *
   * @returns {Object} An Object representation of the instance
   */
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

  /**
   * format - Duplicate of formatForRender??????
   *
   * @returns {type} Description
   */
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

export default File
