import AssetId from './AssetId';
import Logger from './Logger';

export default class Project {
  constructor(name, paths, sendToRenderer) {
    this._name = name;
    this._path = paths["path"];
    this._asset = {
      scene: new AssetId(paths["asset"]["scene"], this._path),
      render: new AssetId(paths["asset"]["render"], this._path),
      cache: new AssetId(paths["asset"]["cache"], this._path),
      texture: new AssetId(paths["asset"]["scene"], this._path)
    };
    this._shot = {
      scene: new AssetId(paths["shot"]["scene"], this._path),
      render: new AssetId(paths["shot"]["render"], this._path),
      cache: new AssetId(paths["shot"]["cache"], this._path),
      texture: new AssetId(paths["shot"]["scene"], this._path)
    }

    this._pathType = "asset";
    this._pathSubType = "scene"

    this._sendToRenderer = sendToRenderer;
  }

  set pathType(pathType) { this._pathType = pathType }

  formatForRender() {
    let directories = {};
    let dirOrder = [];
    let groups = {};

    if(this._pathType == "asset") {
      let assetId = this._asset[this._pathSubType];
      directories = assetId.directories;
      dirOrder = assetId.directoriesOrder;
      groups = assetId.groups;
    } else {
      let assetId = this._shot[this._pathSubType];
      directories = assetId.directories;
      dirOrder = assetId.directoriesOrder;
      groups = assetId.groups;
    }

    let asset = {
      project: this._name,
      pathType: this._pathType,
      pathSubType: this._pathSubType,
      groups: groups,
      directories: directories,
      directoriesOrder: dirOrder
    }
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
    this._sendToRenderer(asset);
    // }
  }
}
