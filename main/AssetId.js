import path from 'path'

import Config from './Config'
import FileManager from './FileManager'
import Node from './Node'
import NodeManager from './NodeManager'

/**
 * Class representing an AssetId.
 */
class AssetId {
  /**
   * constructor - Construcor for an AssetId
   *
   * @param  {string} type            The type of the path
   * @param  {string} path            Unformatted path used to descripe the path to find files
   * @param  {string} project         The name of the project where the AssetId belongs to
   * @param  {type} formatForRender   Function to send the assetId to the Render Screen
   * @returns {AssetId}               AssetId Object
   */
  constructor (type, path, project, formatForRender) {
    const reg = /({[\w|\d]*})+/
    // console.log(reg[Symbol.split](path);

    this._type = type
    this._path = path

    // let pathsSetup = {}
    //
    // for(let path in paths) {
    //   pathsSetup[path] = {}
    //
    //   for(let pathType in paths[path]) {
    const groups = reg[Symbol.split](path)

    const finalGroups = {}
    const groupOrder = []
    const dirs = {}
    const dirOrder = []

    for (let i = 0; i < groups.length; i++) {
      const g = groups[i]
      if (g[0] === '{' && g[g.length - 1] === '}') {
        const group = g.slice(1, -1)
        finalGroups[group] = '<>'
        groupOrder.push(group)
        // this[group] = "<>";
        if (group === 'dimension') {
          finalGroups[group] = '3d'
        }
        if (!['dimension', 'state', 'version', 'project'].includes(group)) {
          // let groupList = `${group}List`;
          // this[groupList] = [];
          // if(group != "file") {
          dirs[group] = []
          dirOrder.push(group)
          // }
        }
      }
    }

    this._groups = finalGroups
    this._groups.project = project
    this._groupOrder = groupOrder

    this._directories = dirs
    this._directoriesOrder = dirOrder

    this._formatForRender = formatForRender
  }

  /**
   * get path - Getter for the path
   *
   * @returns {string} the unformatted asset path
   */
  get path () { return this._path }

  /**
   * get directories - Getter for the file/directory lists found for the assetId
   *
   * @returns {Object}  Object of arrays of files/directories(strings)
   */
  get directories () { return this._directories }

  /**
   * get directoriesOrder - Getter of the order the directories appear in the path
   *
   * @returns {Array}  Array of strings
   */
  get directoriesOrder () { return this._directoriesOrder }

  /**
   * get groups - Getter of the value of all groups used for formatting the path
   *
   * @returns {Object}  Object of all groups with their values, "<>" for empty values
   */
  get groups () { return this._groups }

  /**
   * setDimension - Setter for the "dimension" group if it exists
   *
   * @param  {string} dimension "3d" or "2d"
   */
  setDimension (dimension) {
    if (Object.keys(this._groups).includes('dimension')) {
      this.clearValues('dimension')
      this.setSearchDir('project')
      this._groups.dimension = dimension
      this.searchNext()
    }
  }

  createNewGroupValue (group, value) {
    const index = this._groupOrder.indexOf(group)
    const data = {
      path: this._path,
      groups: {}
    }
    for (const i in this._groupOrder) {
      const g = this._groupOrder[i]
      if (i < index) {
        data.groups[g] = this._groups[g]
      } else {
        data.groups[g] = '<>'
      }
    }

    this._directories[group].push(value)

    const formattedPath = FileManager.formatPath(data)
    const dirPath = FileManager.slicePath(formattedPath)
    FileManager.createDirectory(dirPath, value, () => this._formatForRender())
  }

  setGroupValue (group, value) {
    this.clearValues(group)
    this.groups[group] = value
    this.setSearchDir(group)
    this.searchNext()
  }

  /**
   * createNewFile - Create new scene file
   *
   * @param {string} name     Name of the new file
   * @param {string} template Path of the template, undefined if no template is used
   * @param {string} type     The name of the software, undefined if a template is used
   */
  createNewFile (name, template, type) {
    const nm = new NodeManager()
    let fileName = name.replace(' ', '_')
    if (template) {
      const extension = path.extname(template)
      fileName = name + extension
    }

    const formatPath = FileManager.formatPath(this)
    const slicePath = FileManager.slicePath(formatPath)
    let filePath
    if ('version' in this._groups) {
      const version = this.getMaxVersion() + 1
      let versionStr = '' + version.toString()
      while (versionStr.length < 3) {
        versionStr = '0' + versionStr
      }

      const versionString = 'v' + versionStr
      if ('state' in this._groups) {
        const stateVersion = `work_${versionString}`
        filePath = path.join(slicePath, stateVersion, fileName)
      } else {
        filePath = path.join(slicePath, versionString, fileName)
      }
    } else {
      filePath = path.join(slicePath, fileName)
    }

    if (template) {
      const nodeTemplate = nm.getNode('base', 'create_asset_from_existing')
      const node = new Node('temp', 'temp', nodeTemplate, { x: 0, y: 0 })
      node.setInputValue('path', path.normalize(template))
      node.setInputValue('file', path.normalize(filePath))
      node.execute(() => FileManager.getFiles(this, (files) => this.setFiles(files)))
    } else {
      const nodeTemplate = nm.getNode(type, 'create_asset')
      const node = new Node('temp', 'temp', nodeTemplate, { x: 0, y: 0 })
      node.setInputValue('file', filePath)
      node.execute(() => FileManager.getFiles(this, (files) => this.setFiles(files)))
    }
  }

  /**
   * execTask - Exevute a task with a scene file
   *
   * @param {string} softwareId   Id of the connected software, 'new' if you want to launch a new instance
   * @param {string} softwareType Type of software the task needs to be executed in
   * @param {string} command      The script to be executed in the software
   * @param {array} args         THe arguments to pass to the command
   */
  execTask (softwareId, softwareType, command, args) {
    const nm = new NodeManager()
    if (softwareId === 'new') {
      const config = new Config()
      const softs = config.config.softwares

      const nodeCategory = softwareType
      const nodeName = `${command}_new`
      const nodeTemplate = nm.getNode(nodeCategory, nodeName)
      const node = new Node('temp', 'temp', nodeTemplate, { x: 0, y: 0 })
      node.setInputValue('path', softs[softwareType])
      for (const arg in args) {
        node.setInputValue(arg, args[arg])
      }
      node.execute(() => FileManager.getFiles(this, (files) => this.setFiles(files)))
    } else {
      const nodeTemplate = nm.getNode(softwareType, command)
      const node = new Node('temp', 'temp', nodeTemplate, { x: 0, y: 0 })
      for (const arg in args) {
        node.setInputValue(arg, args[arg])
      }
      node.executeSocket(softwareId, () => FileManager.getFiles(this, (files) => this.setFiles(files)))
    }
  }

  getMaxVersion () {
    const files = this._directories.file
    if (!files.length) return 0
    let max = 0
    for (const i in files) {
      const file = files[i]
      const version = file.getVersionAsInt()
      if (version > max) {
        max = version
      }
    }
    return max
  }

  /**
   * clearValues - function to clear all groups and directories that come after the given group in the groupOrder Array
   *
   * @param  {string} group   the name of the group for wich all groups that come after in the groupOrder list should be cleared
   */
  clearValues (group) {
    const index = this._groupOrder.indexOf(group)
    if (index === -1) {
      return
    }

    for (let i = index + 1; i < this._groupOrder.length; i++) {
      const item = this._groupOrder[i]
      if (item === 'dimension') {
        continue
      }
      this._groups[item] = '<>'
      if (item in this._directories) {
        this._directories[item] = []
      }
    }
  }

  /**
   * setSearchDir - Find the next name of the next group for wich directories or files should be searched for on disk
   *
   * @param  {string} group the name of the last set group variable
   */
  setSearchDir (group) {
    let index = this._groupOrder.indexOf(group)
    if (index === -1) {
      return
    }

    index += 1
    let searchGroup = this._groupOrder[index]
    while (!(searchGroup in this._directories) && index <= this._groupOrder.length) {
      index += 1
      searchGroup = this._groupOrder[index]
    }

    this._searchGroup = searchGroup
  }

  /**
   * searchNext - Search disk for the files/directories based on the value of _searchGroup
   *
   */
  searchNext () {
    if (this._searchGroup !== undefined) {
      if (this._searchGroup === 'file') {
        if (this._type === 'render') {
          FileManager.getSequenceFiles(this, (files) => this.setFiles(files))
        } else {
          FileManager.getFiles(this, (files) => this.setFiles(files))
        }
      } else {
        FileManager.getDirectories(this, (dirs) => this.setDirs(dirs))
      }
    } else {
      this._formatForRender()
    }
  }
  //
  // setFiles(files) {
  //   this._files = files;
  //   this.formatForRender();
  // }

  /**
   * setDirs - Set the found directories and send the AssetId to the Screen Renderer
   *
   * @param  {Array} dirs Array of directories
   */
  setDirs (dirs) {
    const formattedDirs = FileManager.formatDirs(dirs)
    // let arrangedDirs = FileManager.removeDoubles(formattedDirs)
    this._directories[this._searchGroup] = formattedDirs

    this._formatForRender()
  }

  /**
   * setFiles - Set the found files and send the AssetId to the Screen Renderer
   *
   * @param  {Array} files Array of files
   */
  setFiles (files) {
    this._directories.file = files
    this._formatForRender()
  }

  /**
   * saveComment - Save the comment of a file
   *
   * @param {string} comment A comment
   */
  saveComment (comment) {
    const file = this._groups.file
    const dirPath = path.dirname(file.path)
    const commentPath = path.join(dirPath, 'comment.txt')
    FileManager.writeFile(commentPath, comment)
  }

  /**
   * saveTag - Add a tag to a file
   *
   * @param {string} tag Name of the tag
   */
  saveTag (tag) {
    const file = this._groups.file
    const dirPath = path.dirname(file.path)
    const tagFile = `${tag}.tag`
    const tagPath = path.join(dirPath, tagFile)
    FileManager.writeFile(tagPath, '')
  }

  /**
   * deleteTag - Remove a tog from a file
   *
   * @param {string} tag Name of the tag
   */
  deleteTag (tag) {
    const file = this._groups.file
    const dirPath = path.dirname(file.path)
    const tagFile = `${tag}.tag`
    const tagPath = path.join(dirPath, tagFile)
    FileManager.deleteFile(tagPath)
  }
}

export default AssetId
