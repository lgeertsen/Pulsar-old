import File from './File';
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
  project:  ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  pathType: ["group", "groups", "name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  group:    ["name", "names", "task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  name:     ["task", "tasks", "subtask", "subtasks", "state", "version", "file", "files"],
  task:     ["subtask", "subtasks", "state", "version", "file", "files"],
  subtask:  ["state", "version", "file", "files"]
}

export default class AssetId {
  constructor(sid, paths, projects, sendToRenderer) {
    this._sid = sid;
    this._paths = paths;
    this._pathType = "asset";

    this._sendToRenderer = sendToRenderer;

    this._projects = projects

    this._project = "<>";
    this._dimension = "3d";
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
    this._files = [];

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
  set projects (projects) { this._projects = projects }

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

  get file () { return this._file.fullName }
  set file (file) { this._file = file }
  get formatFile () { return this._file == "<>" ? "<>" : this._file.format() }


  // Directories get & set
  get groups () { return this._groups }
  set groups (groups) { this._groups = groups }

  get names () { return this._names }
  set names (names) { this._names = names }

  get tasks () { return this._tasks }
  set tasks (tasks) { this._tasks = tasks }

  get subtasks () { return this._subtasks }
  set subtasks (subtasks) { this._subtasks = subtasks }

  get files () { return this._files }
  set files (files) { this._files = files }

  get searchDir () { return this._searchDir }

  setValue(type, value) {
    this.clearValues(type);
    this.setSearchDir(type);
    if(this.searchDir != undefined) {
      this[type] = value;
      if(this.searchDir == "files") {
        FileManager.getProjectFiles(this, (files) => this.setFiles(files));
      } else {
        FileManager.getDirectories(this, (dirs) => this.setDirs(dirs));
      }
    } else {
      let file = this._files.filter(f => {
        return f.path == value;
      })[0];
      this._file = file;
      this._state = file.state;
      this._version = file.version;
      this.formatForRender();
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

  setFiles(files) {
    this._files = files;
    this.formatForRender();
  }

  setDirs(dirs) {
    let formattedDirs = FileManager.formatDirs(dirs);
    let arrangedDirs = FileManager.removeDoubles(formattedDirs)
    this[this._searchDir] = arrangedDirs;
    this.formatForRender();
  }

  formatForRender() {
    let asset = {
      sid:         this.sid,

      path:        this.path,

      projects:    this.projects,
      project:     this.projectName,
      projectPath: this.project,
      pathType:    this.pathType,
      dimension:   this.dimension,
      group:       this.group == "<>" ? "" : this.group,
      name:        this.name == "<>" ? "" : this.name,
      task:        this.task == "<>" ? "" : this.task,
      subtask:     this.subtask == "<>" ? "" : this.subtask,
      file:        this.formatFile == "<>" ? "" : this.formatFile,

      groups:      this.groups,
      names:       this.names,
      tasks:       this.tasks,
      subtasks:    this.subtasks,
      files:       this.formatFiles(),
    }

    this._sendToRenderer(asset);
  }

  formatFiles() {
    let files = [];
    for(let i = 0; i < this._files.length; i++) {
      let file = this._files[i].formatForRender();
      files.push(file);
    }
    return files;
  }

  saveComment(comment) {
    if(this._file == "<>") {
      return;
    }
    this._file.saveComment(comment);
  }

  saveTag(tag) {
    if(this._file == "<>") {
      return;
    }
    this._file.saveTag(tag);
  }

  deleteTag(tag) {
    if(this._file == "<>") {
      return;
    }
    this._file.deleteTag(tag);
  }
}
