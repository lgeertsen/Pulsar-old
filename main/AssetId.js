import File from './File';
import FileManager from './FileManager';
import Logger from './Logger';
import Renderer from './Renderer';

const typeToDirMap = {
  project:  "groups",
  pathType: "groups",
  pathSubType: "groups",
  dimension: "groups",
  group:    "names",
  name:     "tasks",
  task:     "subtasks",
  subtask:  "files"
}

const typeToClearMap = {
  project:  ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  pathType: ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  pathSubType: ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  dimension: ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  group:    ["name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  name:     ["task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  task:     ["subtask", "subtasks", "state", "version", "file", "files"],
  subtask:  ["state", "version", "file", "files"]
}


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
  constructor(type, path, project, formatForRender) {
    let reg = /({[\w|\d]*})+/;
    // console.log(reg[Symbol.split](path);

    this._type = type;
    this._path = path;

    // let pathsSetup = {}
    //
    // for(let path in paths) {
    //   pathsSetup[path] = {}
    //
    //   for(let pathType in paths[path]) {
    let groups = reg[Symbol.split](path);

    let finalGroups = {};
    let groupOrder = [];
    let dirs = {};
    let dirOrder = [];

    for(let i = 0; i < groups.length; i++) {
      let g = groups[i];
      if(g[0] == "{" && g[g.length-1] == "}") {
        let group = g.slice(1, -1);
        finalGroups[group] = "<>";
        groupOrder.push(group);
        // this[group] = "<>";
        if(group == "dimension") {
          finalGroups[group] = "3d";
        }
        if(!["dimension", "state", "version", "project"].includes(group)) {
          // let groupList = `${group}List`;
          // this[groupList] = [];
          // if(group != "file") {
            dirs[group] = [];
            dirOrder.push(group);
          // }
        }
      }
    }

    this._groups = finalGroups;
    this._groups.project = project;
    this._groupOrder = groupOrder;

    this._directories = dirs;
    this._directoriesOrder = dirOrder;

    this._formatForRender = formatForRender;

    // this._sid = sid;
    // this._paths = pathsSetup;
    // this._pathType = "asset";
    // this._pathSubType = "scene";
    //
    // this._sendToRenderer = sendToRenderer;
    //
    // this._projects = projects
    //
    // this._project = "<>";
    // this._dimension = "3d";
    // this._group = "<>";
    // this._name = "<>";
    // this._task = "<>";
    // this._subtask = "<>";
    // this._state = "<>";
    // this._subtask = "<>";
    // this._state = "<>";
    // this._verstion = "<>";
    // this._file = "<>";
    //
    // // Directories
    // this._groups = [];
    // this._names = [];
    // this._tasks = [];
    // this._subtasks = [];
    // this._files = [];
    //
    // this._searchGroup = null;
  }


  /**
   * get path - Getter for the path
   *
   * @returns {string} the unformatted asset path
   */
  get path() { return this._path }

  /**
   * get directories - Getter for the file/directory lists found for the assetId
   *
   * @returns {Object}  Object of arrays of files/directories(strings)
   */
  get directories() { return this._directories }


  /**
   * get directoriesOrder - Getter of the order the directories appear in the path
   *
   * @returns {Array}  Array of strings
   */
  get directoriesOrder() { return this._directoriesOrder }

  /**
   * get groups - Getter of the value of all groups used for formatting the path
   *
   * @returns {Object}  Object of all groups with their values, "<>" for empty values
   */
  get groups() { return this._groups }


  /**
   * setDimension - Setter for the "dimension" group if it exists
   *
   * @param  {string} dimension "3d" or "2d"
   */
  setDimension(dimension) {
    if(Object.keys(this._groups).includes("dimension")) {
      this.clearValues("dimension");
      this.setSearchDir("project");
      this._groups["dimension"] = dimension;
      this.searchNext();
    }
  }

  // get sid () { return this._sid }
  //
  // get paths () { return this._paths }
  //
  // get pathType () { return this._pathType }
  // set pathType (pathType) { this._pathType = pathType }
  //
  // get pathSubType () { return this._pathSubType }
  // set pathSubType (pathSubType) { this._pathSubType = pathSubType }
  //
  // get path () { return this._paths[this.pathType][this._pathSubType] }

  // get project () { return this._projects[this._project] }
  // set project (project) { this._project = project }
  // get projectName () { return this._project }
  // get projects () { return Object.keys(this._projects) }
  // set projects (projects) { this._projects = projects }
  //
  // get dimension () { return this._dimension }
  // set dimension (dimension) { this._dimension = dimension }
  //
  // get group () { return this._group }
  // set group (group) { this._group = group }
  //
  // get name () { return this._name }
  // set name (name) { this._name = name }
  //
  // get task () { return this._task }
  // set task (task) { this._task = task }
  //
  // get subtask () { return this._subtask }f
  // set subtask (subtask) { this._subtask = subtask }
  //
  // get state () { return this._state }
  // set state (state) { this._state = state }
  //
  // get version () { return this._version }
  // set version (version) { this._version = version }
  //
  // get file () { return this._file.fullName }
  // set file (file) { this._file = file }
  // get formatFile () { return this._file == "<>" ? "<>" : this._file.format() }
  //
  //
  // // Directories get & set
  // get groups () { return this._groups }
  // set groups (groups) { this._groups = groups }
  //
  // get names () { return this._names }
  // set names (names) { this._names = names }
  //
  // get tasks () { return this._tasks }
  // set tasks (tasks) { this._tasks = tasks }
  //
  // get subtasks () { return this._subtasks }
  // set subtasks (subtasks) { this._subtasks = subtasks }
  //
  // get files () { return this._files }
  // set files (files) { this._files = files }
  //
  // get searchDir () { return this._searchGroup }
  //
  // setValue(type, value) {
  //   this.clearValues(type);
  //   this.setSearchDir(type);
  //   if(this.searchDir != undefined) {
  //     this[type] = value;
  //     if(this.searchDir == "files") {
  //       if(this.pathSubType == "render"){
  //         FileManager.getSequenceFiles(this, (files) => this.setFiles(files));
  //       }
  //       else{
  //         FileManager.getProjectFiles(this, (files) => this.setFiles(files));
  //       }
  //     } else {
  //       FileManager.getDirectories(this, (dirs) => this.setDirs(dirs));
  //     }
  //   } else {
  //     let file = this._files.filter(f => {
  //       return f.path == value;
  //     })[0];
  //     this._file = file;
  //     this._state = file.state;
  //     this._version = file.version;
  //     this.formatForRender();
  //   }
  // }
  //
  //
  //

  setGroupValue(group, value) {
    this.clearValues(group);
    this.groups[group] = value;
    this.setSearchDir(group);
    this.searchNext();
  }

  /**
   * clearValues - function to clear all groups and directories that come after the given group in the groupOrder Array
   *
   * @param  {string} group   the name of the group for wich all groups that come after in the groupOrder list should be cleared
   */
  clearValues(group) {
    let index = this._groupOrder.indexOf(group);
    if(index == -1) {
      return
    }

    for(let i = index+1; i < this._groupOrder.length; i++) {
      let item = this._groupOrder[i];
      if(item == "dimension") {
        continue;
      }
      this._groups[item] = "<>";
      if(item in this._directories) {
        this._directories[item] = [];
      }
    }
  }

  /**
   * setSearchDir - Find the next name of the next group for wich directories or files should be searched for on disk
   *
   * @param  {string} group the name of the last set group variable
   */
  setSearchDir(group) {
    let index = this._groupOrder.indexOf(group);
    if(index == -1) {
      return;
    }

    index += 1;
    let searchGroup = this._groupOrder[index];
    while(!(searchGroup in this._directories) && index <= this._groupOrder.length) {
      index += 1;
      searchGroup = this._groupOrder[index];
    }

    this._searchGroup = searchGroup;
  }


  /**
   * searchNext - Search disk for the files/directories based on the value of _searchGroup
   *
   */
  searchNext() {
    if(this._searchGroup != undefined) {
      if(this._searchGroup == "file") {
        if(this._type == "render"){
          FileManager.getSequenceFiles(this, (files) => this.setFiles(files));
        } else {
          FileManager.getFiles(this, (files) => this.setFiles(files));
        }
      } else {
        FileManager.getDirectories(this, (dirs) => this.setDirs(dirs));
      }
    } else {
      this._formatForRender();
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
  setDirs(dirs) {
    let formattedDirs = FileManager.formatDirs(dirs);
    // let arrangedDirs = FileManager.removeDoubles(formattedDirs)
    this._directories[this._searchGroup] = formattedDirs;

    this._formatForRender();
  }


  /**
   * setFiles - Set the found files and send the AssetId to the Screen Renderer
   *
   * @param  {Array} files Array of files
   */
  setFiles(files) {
    this._directories["file"] = files

    this._formatForRender();
  }

  //
  // formatForRender() {
  //   let asset = {
  //     sid:         this.sid,
  //
  //     path:        this.path,
  //     pathSubType: this._pathSubType,
  //
  //     projects:    this.projects,
  //     project:     this.projectName,
  //     projectPath: this.project,
  //     pathType:    this.pathType,
  //     dimension:   this.dimension,
  //     group:       this.group == "<>" ? "" : this.group,
  //     name:        this.name == "<>" ? "" : this.name,
  //     task:        this.task == "<>" ? "" : this.task,
  //     subtask:     this.subtask == "<>" ? "" : this.subtask,
  //     file:        this.formatFile == "<>" ? "" : this.formatFile,
  //
  //     groups:      this.groups,
  //     names:       this.names,
  //     tasks:       this.tasks,
  //     subtasks:    this.subtasks,
  //     files:       this.formatFiles(),
  //   }
  //
  //   this._sendToRenderer(asset);
  // }
  //
  // formatFiles() {
  //   let files = [];
  //   for(let i = 0; i < this._files.length; i++) {
  //     let file = this._files[i].formatForRender();
  //     files.push(file);
  //   }
  //   return files;
  // }
  //
  // saveComment(comment) {
  //   if(this._file == "<>") {
  //     return;
  //   }
  //   this._file.saveComment(comment);
  // }
  //
  // saveTag(tag) {
  //   if(this._file == "<>") {
  //     return;
  //   }
  //   this._file.saveTag(tag);
  // }
  //
  // deleteTag(tag) {
  //   if(this._file == "<>") {
  //     return;
  //   }
  //   this._file.deleteTag(tag);
  // }
}

export default AssetId
