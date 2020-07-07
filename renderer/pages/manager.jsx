import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Browser from '../components/Browser';
import Dropdown from '../components/Dropdown';
import FileBrowser from '../components/FileBrowser';
import FileViewer from '../components/FileViewer';
import SequenceBrowser from '../components/SequenceBrowser';
import SequenceViewver from '../components/SequenceViewver';
import FiltersContainer from '../containers/FiltersContainer';
import Nav from '../components/Nav';
import NewAssetContainer from '../containers/NewAssetContainer';
import SearchBar from '../components/SearchBar';
import Switch from '../components/Switch';

import "../styles/manager.sass"

const ipcRenderer = electron.ipcRenderer || false;

export default class Manager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      theme: "light-theme",
      primaryColor: "green",
      saveShortcut: "",
      incrementShortcut: "",

      navOpen: false,

      newAssetModal: false,
      settingsModal: false,

      projects: [],
      projectName: "",
      project: {
        project: "",
        pathType: "asset",
        pathSubType: "scene",
        groups: {},
        directories: {},
        directoriesOrder: [],
        file: {}
      },

      selectedSoftware: undefined,
      selectedSoftwareType: undefined,
      softwares: {},
      overlaySoftware: undefined,

      newFileName: undefined,

      filters: {
        pathType: {
          title: "Path Type",
          type: "radio",
          options: {
            scene: true,
            render: false,
            texture: false,
            cache: false,
          }
        },
        scene2D3D: {
          title: "2D/3D",
          type: "radio",
          options: {
            _2D: false,
            _3D: true
          }
        },
        state: {
          title: "State",
          type: "checkbox",
          options: {
            work: true,
            publish: true,
            wip: false
          }
        }
      },

      fileManagerAssetId: {
        dimension: "*",
        file: "",
        files: [],
        group: "",
        groups: [],
        name: "",
        names: [],
        pathType: "asset",
        project: "",
        projects: [],
        subtask: "",
        subtasks: [],
        task: "",
        tasks: [],
      },
      newAssetId: {
        dimension: "*",
        file: "",
        files: [],
        group: "",
        groups: [],
        name: "",
        names: [],
        pathType: "asset",
        project: "",
        projects: [],
        subtask: "",
        subtasks: [],
        task: "",
        tasks: [],
      },
    };
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig");
      ipcRenderer.send("getSoftwares");
      ipcRenderer.send("getProjects");
      ipcRenderer.send("getProject");

      ipcRenderer.on('config', (event, data) => {
        console.log("----- receive config file -----", data);
        this.setState({config: data})
        if(data.theme) {
          console.log(data.theme);
          this.setState({theme: data.theme});
        }
        if(data.color) {
          this.setState({primaryColor: data.color});
        }
        if(data.overlay.save) {
          this.setState({saveShortcut: data.overlay.save})
        }
        if(data.overlay.increment) {
          this.setState({incrementShortcut: data.overlay.increment})
        }
      });

      ipcRenderer.on("projects", (event, data) => {
        this.setState({projects: data.projects, projectName: data.project});
      });

      ipcRenderer.on("project", (event, data) => {
        console.log("received DATA");
        console.log(data);
        this.setState({project: data});
      });

      ipcRenderer.on('assetId', (event, data) => {
        console.log("----- received assetId -----");
        console.log(data);
        if(data.sid == "fileManager") {
          this.setState({fileManagerAssetId: data});
        } else if(data.sid == "newAsset") {
          this.setState({newAssetId: data});
        }
      });

      ipcRenderer.on('softwares', (event, data) => {
        console.log("----- receive software list -----");
        console.log(data);
        this.setState({softwares: data});
        let keys = Object.keys(data);
        if(this.state.overlaySoftware == undefined) {
          if(keys.length > 0) {
            this.setState({overlaySoftware: keys[0]});
            ipcRenderer.send("overlaySoftware", data[keys[0]]);
          } else {
            this.setState({overlaySoftware: undefined});
            ipcRenderer.send("overlaySoftware", undefined);
          }
        } else {
          ipcRenderer.send("overlaySoftware", this.state.softwares[this.state.overlaySoftware]);
        }
      });
    }
  }

  setProject(project) {
    ipcRenderer.send("setProject", project);
    this.setState({projectName: project});
  }

  setPathType(pathType) {
    ipcRenderer.send("setPathType", pathType);
  }

  setPathSubType(pathSubType) {
    ipcRenderer.send("setPathSubType", pathSubType);
  }

  setDimension(dimension) {
    ipcRenderer.send("dimension", dimension);
  }

  setGroupValue(group, value) {
    console.log(group);
    console.log(value);
    ipcRenderer.send("setGroupValue", {group: group, value: value});
  }

  setAssetIdValue(sid, type, data) {
    ipcRenderer.send("setAssetId", {sid: sid, type: type, value: data});
  }

  refreshBrowser() {
    ipcRenderer.send("refresh");
  }

  checkSotfwareSaved() {
    ipcRenderer.send("checkSotfwareSaved");
  }

  setFilter(filter, option, value) {
    let filters = this.state.filters;

    if(filters[filter].type === "radio"){
      let keys = Object.keys(filters[filter].options);
      for (let i = 0; i < keys.length; i++) {
        filters[filter].options[keys[i]] = false;
      }
      filters[filter].options[option] = true;
      if(filter == "pathType") {
        this.setPathSubType(option);
      }
      if(filter == "scene2D3D") {
        this.setDimension(option == "_3D" ? "3d" : "2d");
      }
    }
    else {
      filters[filter].options[option] = value;
    }
    this.setState({filters: filters});
  }

  filteredFiles() {
    let files = this.state.project.directories.file;

    let filteredFiles = [];
    if(files.length > 0) {
      let filters = this.state.filters;
      for(const filter in filters) {
        switch (filter) {
          case "state":
          if(files[0].state) {
            let states = [];
            if(filters[filter].options["work"]) { states.push("work") }
            if(filters[filter].options["publish"]) { states.push("publish") }
            if(filters[filter].options["wip"]) { states.push("wip") }
            let filtered = files.filter(file => {
              return states.includes(file.state);
            });
            filteredFiles = filteredFiles.concat(filtered);
          } else {
            filteredFiles = files;
          }
          break;
        }
      }
    }

    return filteredFiles
  }

  execTask(task) {
    console.log("----- exec command -----", task.command)
    if(this.state.selectedSoftware == undefined) { return; }
    let selectedSoft = this.state.selectedSoftware;
    let data = {
      id: selectedSoft,
      command: task.command,
      arguments: task.arguments,
      type: this.state.selectedSoftwareType
    }
    console.log(data);

    ipcRenderer.send("execTask", data)
  }

  editComment(e) {
    let assetId = this.state.fileManagerAssetId
    assetId.file.comment = e.target.value;
    this.setState({fileManagerAssetId: assetId});
  }

  saveComment() {
    let sid = this.state.fileManagerAssetId.sid
    let comment = this.state.fileManagerAssetId.file.comment;
    ipcRenderer.send("saveComment", {sid: sid, comment: comment});
  }

  saveTag(tag) {
    let sid = this.state.fileManagerAssetId.sid;
    let assetId = this.state.fileManagerAssetId;
    assetId.file.tags.push(tag);
    this.setState({fileManagerAssetId: assetId});
    ipcRenderer.send("saveTag", {sid: sid, tag: tag});
  }

  deleteTag(tag) {
    let sid = this.state.fileManagerAssetId.sid;
    let assetId = this.state.fileManagerAssetId;
    for(let i in assetId.file.tags) {
      if(assetId.file.tags[i] == tag) {
        assetId.file.tags.splice(i, 1);
      }
    }
    this.setState({fileManagerAssetId: assetId});
    ipcRenderer.send("deleteTag", {sid: sid, tag: tag});
  }

  getCompatibleSoftware() {
    let file = this.state.fileManagerAssetId.file;
    var softwares = this.state.softwares;
    var softs = [];
    if(["ma", "mb"].includes(file.extension)) {
      for(let id in softwares) {
        if(softwares[id].software == "maya") {
          let soft = softwares[id];
          soft.id = id;
          softs.push(soft);
        }
      }
      let newSoft = {
        id: "new",
        software: "maya",
        scene: "Open new maya",
        saved: 1
      }
      softs.push(newSoft);
    } else if(["hip", "hipnc"].includes(file.extension)) {
      for(let id in softwares) {
        if(softwares[id].software == "houdini") {
          let soft = softwares[id];
          soft.id = id;
          softs.push(soft);
        }
      }
      let newSoft = {
        id: "new",
        software: "houdini",
        scene: "Open new houdini",
        saved: 1
      }
      softs.push(newSoft);
    } else if(["nk"].includes(file.extension)) {
      for(let id in softwares) {
        if(softwares[id].software == "nuke") {
          let soft = softwares[id];
          soft.id = id;
          softs.push(soft);
        }
      }
      let newSoft = {
        id: "new",
        software: "nuke",
        scene: "Open new nuke",
        saved: 1
      }
      softs.push(newSoft);
    }

    return softs;
  }

  getWipName() {
    let assetId = this.state.fileManagerAssetId;

    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    let wipName = `WIP_${assetId.file.name}_${assetId.task}_${assetId.subtask}_${assetId.file.version}_${timestamp}`;
    return wipName
  }

  setTheme(theme) {
    this.setState({theme: theme});
  }

  setPrimaryColor(color) {
    this.setState({primaryColor: color});
  }

  cancelSettings() {
    let theme = this.state.config.theme;
    let primaryColor = this.state.config.color;
    this.setState({theme: theme, primaryColor: primaryColor});
  }

  saveSettings() {
    let theme = this.state.theme;
    let color = this.state.primaryColor;
    let saveShortcut = this.state.saveShortcut;
    let incrementShortcut = this.state.incrementShortcut;

    let config = this.state.config;
    config.theme = theme;
    config.color = color;
    config.overlay.save = saveShortcut;
    config.overlay.increment = incrementShortcut;
    this.setState({config: config});
    ipcRenderer.send("saveConfig", config);
  }

  setOverlaySoftware(softwareId) {
    this.setState({overlaySoftware: softwareId});
    ipcRenderer.send("overlaySoftware", this.state.softwares[softwareId]);
  }

  reloadSceneName(softwareId) {
    ipcRenderer.send("getSceneName", softwareId);
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Big+Shoulders+Text:400,500,700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <Nav
          open={this.state.navOpen}
          page="manager"
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <div className={this.state.navOpen ? `main ${this.state.theme} main-${this.state.primaryColor}` : `main full ${this.state.theme} main-${this.state.primaryColor}`}>
          <div className={Object.keys(this.state.softwares).length > 0 ? "software-container open" : "software-container"}>
            <div className="software-title">
              <h3>Open software</h3>
            </div>
            {Object.keys(this.state.softwares).map((softwareId, index) => (
              <div key={index} className={this.state.overlaySoftware == softwareId ? "software selected" : "software"}>
                <div className="overlaySelector" onClick={(e) => this.setOverlaySoftware(softwareId)}>
                  <i className="far fa-window-restore"></i>
                </div>
                <div className="softwareHeader">
                  <img className="softwareImg" src={"softwareLogos/" + this.state.softwares[softwareId].software + ".png"}></img>
                  <h4 className="softwareName">{this.state.softwares[softwareId].software.charAt(0).toUpperCase() + this.state.softwares[softwareId].software.slice(1)}</h4>
                </div>
                <span className="softwareSceneName"><i className="las la-sync" onClick={(e) => this.reloadSceneName(softwareId)}></i>{this.state.softwares[softwareId].saved == 1 ? this.state.softwares[softwareId].scene : this.state.softwares[softwareId].scene + "*"}</span>
              </div>
            ))}
          </div>


          <div className="manager-container">
            <div className="search-container">
              <div className="create-asset">
                <div className={"create-asset-btn button " + this.state.theme} onClick={(e) => this.setState({newAssetModal: true})}>
                  <h5>Create Asset</h5>
                </div>
              </div>
              <div className="project-select">
                <Dropdown
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  value={this.state.projectName}
                  options={this.state.projects}
                  onChange={(element) => this.setProject(element)}
                />
              </div>
              <div className="asset-shot-switch">
                <Switch
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  value={this.state.project.pathType}
                  option1="Assets"
                  value1="asset"
                  option2="Shots"
                  value2="shot"
                  onChange={(choice) => this.setPathType(choice)}
                />
              </div>
              <div className="search-bar-container">
                <SearchBar
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  assetId={this.state.fileManagerAssetId}
                />
              </div>
            </div>



            <div className="filter-container">
              <FiltersContainer
                theme={this.state.theme}
                primaryColor={this.state.primaryColor}
                filters={this.state.filters}
                setFilter={(filter, option, value) => this.setFilter(filter, option, value)}
                groups={this.state.project.groups}
              />
            </div>




            <div className="browser-container">
              {this.state.project.directoriesOrder.map((dir, index) => (
                dir != "file" ?
                <div key={index} className="browser">
                  <Browser
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    title={dir.split("_").join(" ")}
                    directories={this.state.project.directories[dir]}
                    onChange={(value) => this.setGroupValue(dir, value)}
                    selectedDir={this.state.project.groups[dir]}
                  />
                  <div className="chevron-container">
                    <i className="las la-angle-right"></i>
                  </div>
                </div>
                :
                this.state.filters.pathType.options.render == true ?
                  <SequenceBrowser
                    key={index}
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    title="Files"
                    files={this.filteredFiles()}
                    onChange={(file) => this.setGroupValue("file", file)}
                    selectedFile={this.state.project.groups.file}
                    groups={this.state.project.groups}
                  />
                  :
                  <FileBrowser
                    key={index}
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    title="Files"
                    files={this.filteredFiles()}
                    onChange={(file) => this.setGroupValue("file", file)}
                    selectedFile={this.state.project.groups.file}
                    groups={this.state.project.groups}
                  />
              ))}
              {/* <div className="browser sequenceBrowser">
                <Browser
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  title={this.state.fileManagerAssetId.pathType == "asset" ? "Asset Type" : "Sequences"}
                  directories={this.state.fileManagerAssetId.groups}
                  onChange={(dir) => this.setAssetIdValue("fileManager", "group", dir)}
                  selectedDir={this.state.fileManagerAssetId.group}
                />
              </div>
              <div className="chevron-container">
                <i className="las la-angle-right"></i>
              </div>
              <div className="browser shotBrowser">
                <Browser
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  title={this.state.fileManagerAssetId.pathType == "asset" ? "Asset Name" : "Shots"}
                  directories={this.state.fileManagerAssetId.names}
                  onChange={(dir) => this.setAssetIdValue("fileManager", "name", dir)}
                  selectedDir={this.state.fileManagerAssetId.name}
                />
              </div>
              <div className="chevron-container">
                <i className="las la-angle-right"></i>
              </div>
              <div className="browser taskBrowser">
                <Browser
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  title="Tasks"
                  directories={this.state.fileManagerAssetId.tasks}
                  onChange={(dir) => this.setAssetIdValue("fileManager", "task", dir)}
                  selectedDir={this.state.fileManagerAssetId.task}
                />
              </div>
              <div className="chevron-container">
                <i className="las la-angle-right"></i>
              </div>
              <div className="browser subtaskBrowser">
                <Browser
                  theme={this.state.theme}
                  primaryColor={this.state.primaryColor}
                  title="Subtasks"
                  directories={this.state.fileManagerAssetId.subtasks}
                  onChange={(dir) => this.setAssetIdValue("fileManager", "subtask", dir)}
                  selectedDir={this.state.fileManagerAssetId.subtask}
                />
              </div>
              <div className="chevron-container">
                <i className="las la-angle-right"></i>
              </div>
              <div className="file-browser">
                {
                  this.state.filters.pathType.options.render == true ?
                  <SequenceBrowser
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    title="Files"
                    files={this.filteredFiles()}
                    onChange={(file) => this.setAssetIdValue("fileManager", "file", file)}
                    selectedFile={this.state.fileManagerAssetId.file}
                  />
                  :
                  <FileBrowser
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    title="Files"
                    files={this.filteredFiles()}
                    onChange={(file) => this.setAssetIdValue("fileManager", "file", file)}
                    selectedFile={this.state.fileManagerAssetId.file}
                  />
                }
              </div> */}
            </div>



            <div className={this.state.project.groups.file == "<>" ? "file-container" : "file-container open"}>
              {this.state.project.groups.file != "<>" ?
                this.state.filters.pathType.options.render == true && this.state.project.groups.file?.frames != undefined ?
                  <SequenceViewver
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    assetId={this.state.project}
                    execTask={(task) => this.execTask(task)}
                    onChangeComment={(e) => this.editComment(e)}
                    onSaveComment={() => this.saveComment()}
                    softwares={this.getCompatibleSoftware()}
                    selectSoftware={(id, software) => this.setState({selectedSoftware: id, selectedSoftwareType: software})}
                    selectedSoftware={this.state.selectedSoftware}
                    selectedSoft={this.state.softwares[this.state.selectedSoftware]}
                    checkSotfwareSaved={() => this.checkSotfwareSaved()}
                    getWipName={() => this.getWipName()}
                    refresh={() => this.refreshBrowser()}
                  />
                :
                  <FileViewer
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    assetId={this.state.project}
                    execTask={(task) => this.execTask(task)}
                    onChangeComment={(e) => this.editComment(e)}
                    onSaveComment={() => this.saveComment()}
                    softwares={this.getCompatibleSoftware()}
                    selectSoftware={(id, software) => this.setState({selectedSoftware: id, selectedSoftwareType: software})}
                    selectedSoftware={this.state.selectedSoftware}
                    selectedSoft={this.state.softwares[this.state.selectedSoftware]}
                    checkSotfwareSaved={() => this.checkSotfwareSaved()}
                    getWipName={() => this.getWipName()}
                    refresh={() => this.refreshBrowser()}
                  />
                : ""
              }
            </div>


          </div>
        </div>

        <NewAssetContainer
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          show={this.state.newAssetModal}
          handleClose={() =>  this.setState({newAssetModal: false})}
          assetId={this.state.newAssetId}
          setAssetIdValue={(type, element) => this.setAssetIdValue("newAsset", type, element)}
        />

        <style jsx global>{`
          @font-face {
              font-family: 'Architectural';
              src: url('architectural/Architectural.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                   url('architectural/Architectural.woff') format('woff'), /* Modern Browsers */
                   url('architectural/Architectural.ttf') format('truetype'); /* Safari, Android, iOS */
                       font-style: normal;
              font-weight: normal;
              text-rendering: optimizeLegibility;
          }

          @font-face {
              font-family: 'Apex Mk3 ExtraLight';
              src: url('Apex/apex_mk3-extralight-webfont.woff2') format('woff2'),
                   url('Apex/apex_mk3-extralight-webfont.woff') format('woff');
              font-weight: normal;
              font-style: normal;
          }
        `}</style>
        <style jsx>{`

        `}</style>
      </React.Fragment>
    );
  };
};
