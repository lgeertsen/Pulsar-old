import FileManager from './FileManager';
import Logger from './Logger';
import Renderer from './Renderer';

const typeToDirMap = {
  project:  "groups",
  pathType: "groups",
  group:    "names",
  name:     "tasks",
  task:     "subtasks",
  subtask:  "files"
}

const typeToClearMap = {
  project:  ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "file", "files"],
  pathType: ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "file", "files"],
  group:    ["name", "names", "task", "tasks", "subtask", "subtasks", "file", "files"],
  name:     ["task", "tasks", "subtask", "subtasks", "file", "files"],
  task:     ["subtask", "subtasks", "file", "files"],
  subtask:  ["file", "files"]
}

export default class AssetId {
  constructor(sid, paths, projects, sendToRenderer) {
    this._sid = sid;
    this._paths = paths;
    this._pathType = "asset";

    this._sendToRenderer = sendToRenderer;

    this._projects = projects

    this._project = "<>";
    this._dimension = "*";
    this._group = "<>";
    this._name = "<>";
    this._task = "<>";
    this._subtask = "<>";
    this._state = "<>";
    this._subtask = "<>";
    this._state = "<>";
    this._verstion = "<>";
    this._file = "<>";

    // Directories
    this._groups = [];
    this._names = [];
    this._tasks = [];
    this._subtasks = [];

    this._searchDir = null;
  }

  get sid () { return this._sid }

  get paths () { return this._paths }

  get pathType () { return this._pathType }
  set pathType (pathType) { this._pathType = pathType }

  get path () { return this._paths[this.pathType] }

  get project () { return this._projects[this._project] }
  set project (project) { this._project = project }
  get projectName () { return this._project }
  get projects () { return Object.keys(this._projects) }

  get dimension () { return this._dimension }
  set dimension (dimension) { this._dimension = dimension }

  get group () { return this._group }
  set group (group) { this._group = group }

  get name () { return this._name }
  set name (name) { this._name = name }

  get task () { return this._task }
  set task (task) { this._task = task }

  get subtask () { return this._subtask }
  set subtask (subtask) { this._subtask = subtask }

  get state () { return this._state }
  set state (state) { this._state = state }

  get version () { return this._version }
  set version (version) { this._version = version }

  get file () { return this._file }
  set file (file) { this._file = file }


  // Directories get & set
  get groups () { return this._groups }
  set groups (groups) { this._groups = groups }

  get names () { return this._names }
  set names (names) { this._names = names }

  get tasks () { return this._tasks }
  set tasks (tasks) { this._tasks = tasks }

  get subtasks () { return this._subtasks }
  set subtasks (subtasks) { this._subtasks = subtasks }

  get searchDir () { return this._searchDir }

  setValue(type, value) {
    this.clearValues(type);
    this[type] = value;
    this.setSearchDir(type);
    if(this.searchDir == "files") {
      FileManager.getFiles(this);
    } else {
      FileManager.getDirectories(this, (dirs) => this.setDirs(dirs));
    }
  }

  clearValues(type) {
    let values = typeToClearMap[type];

    if(values) {
      for(let i = 0; i < values.length; i++) {
        if(typeof(this[values[i]]) == "object") {
          this[values[i]] = [];
        } else {
          this[values[i]] = "<>";
        }
      }
    }
  }

  setSearchDir(type) {
    this._searchDir = typeToDirMap[type];
  }

  setDirs(dirs) {
    this[this._searchDir] = dirs;
    Logger.list(dirs);
    this.formatForRender()
  }

  formatForRender() {
    let asset = {
      sid:        this.sid,

      projects:   this.projects,
      project:    this.projectName,
      pathType:   this.pathType,
      dimension:  this.dimension,
      group:      this.group,
      name:       this.name,
      task:       this.task,
      subtask:    this.subtask,

      groups:     this.groups,
      names:      this.names,
      tasks:      this.tasks,
      subtasks:   this.subtasks
    }
    Logger.info("Formatted assetId");
    Logger.log(asset);
    this._sendToRenderer(asset);
  }
}
