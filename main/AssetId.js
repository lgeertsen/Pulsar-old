export default class AssetId {
  constructor(sid, paths) {
    this._sid = sid;
    this._paths = paths;
    this._pathType = "asset";

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
  }

  get sid () { return this._sid }

  get paths () { return this._paths }

  get pathType () { return this._pathType }
  set pathType (pathType) { this._pathType = pathType }

  get path () { return this._paths[this.pathType] }

  get project () { return this._project }
  set project (project) { this._project = project }

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

  setValue(type, value) {
    this[type] = value;
    console.log(this);
  }
}
