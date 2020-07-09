import FileManager from './FileManager'

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

  setGroupValue (group, value) {
    this.clearValues(group)
    this.groups[group] = value
    this.setSearchDir(group)
    this.searchNext()
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
}

export default AssetId
