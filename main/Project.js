import AssetId from './AssetId';
import Logger from './Logger';

/**
 * Class representing a Project.
 */
class Project {
  /**
   * constructor - Project Object constructor
   *
   * @param  {string} name              Name of the project
   * @param  {Object} paths             File Paths
   * @param  {function} sendToRenderer  Function to send project to the Render Screen
   * @returns {Project}                 Project Object
   */
  constructor(name, paths, sendToRenderer) {
    this._name = name;
    this._path = paths["path"];
    this._pathTypes = {
      "asset": {
        scene: new AssetId("scene", paths["asset"]["scene"], this._path, () => this.formatForRender()),
        render: new AssetId("render", paths["asset"]["render"], this._path, () => this.formatForRender()),
        cache: new AssetId("cache", paths["asset"]["cache"], this._path, () => this.formatForRender()),
        texture: new AssetId("texture", paths["asset"]["texture"], this._path, () => this.formatForRender())
      },
      "shot": {
        scene: new AssetId("scene", paths["shot"]["scene"], this._path, () => this.formatForRender()),
        render: new AssetId("render", paths["shot"]["render"], this._path, () => this.formatForRender()),
        cache: new AssetId("cache", paths["shot"]["cache"], this._path, () => this.formatForRender()),
        texture: new AssetId("texture", paths["shot"]["texture"], this._path, () => this.formatForRender())
      }
    }

    this._pathType = "asset";
    this._pathSubType = "scene"

    this._sendToRenderer = sendToRenderer;
  }


  /**
   * set pathType - pathType setter
   *
   * @param  {string} pathType "asset" or "shot"
   */
  set pathType(pathType) {
    this._pathType = pathType;
    let assetId = this._pathTypes[this._pathType][this._pathSubType];
    assetId.clearValues("project");
    assetId.setSearchDir("project");
    assetId.searchNext();
  }


  /**
   * set pathSubType - pathSubType setter
   *
   * @param  {string} pathSubType "scene", "render", "texture" or "cache"
   */
  set pathSubType(pathSubType) {
    this._pathSubType = pathSubType
    let assetId = this._pathTypes[this._pathType][this._pathSubType];
    assetId.clearValues("project");
    assetId.setSearchDir("project");
    assetId.searchNext();
  }


  /**
   * setDimension - set the dimension of the current used AssetId of the project
   *
   * @param  {string} dimension "3d" or "2d"
   */
  setDimension(dimension) {
    this._pathTypes[this._pathType][this._pathSubType].setDimension(dimension);
  }


  /**
   * getData - Get the files/directories found for the current selected AssetId of the project
   *
   */
  getData() {
    let assetId = this._pathTypes[this._pathType][this._pathSubType];
    assetId.clearValues("project");
    assetId.setSearchDir("project");
    assetId.searchNext();
  }


  /**
   * setGroupValue - Set the value of a group in the current selected AssetId
   *
   * @param  {string} group name of the group
   * @param  {string} value     the value the set for the group
   */
  setGroupValue(group, value) {
    let assetId = this._pathTypes[this._pathType][this._pathSubType];
    assetId.setGroupValue(group, value);
  }


  /**
   * formatForRender - Format the data of the project into an Object to send to the Render Screen
   *
   */
  formatForRender() {
    let directories = {};
    let dirOrder = [];
    let groups = {};

    let assetId = this._pathTypes[this._pathType][this._pathSubType];
    directories = assetId.directories;
    dirOrder = assetId.directoriesOrder;
    groups = assetId.groups;
    let file = groups.file == "<>" ? {} : groups.file;

    let asset = {
      project: this._name,
      pathType: this._pathType,
      pathSubType: this._pathSubType,
      groups: groups,
      directories: directories,
      directoriesOrder: dirOrder,
      file: file
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

export default Project
