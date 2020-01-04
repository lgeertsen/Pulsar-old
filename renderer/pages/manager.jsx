import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Browser from '../components/Browser';
import Dropdown from '../components/Dropdown';
import FileBrowser from '../components/FileBrowser';
import FileViewer from '../components/FileViewer';
import FiltersContainer from '../containers/FiltersContainer';
import Nav from '../components/Nav';
import NewAssetContainer from '../containers/NewAssetContainer';
import SearchBar from '../components/SearchBar';
import SettingsContainer from '../containers/SettingsContainer';
import Switch from '../components/Switch';

import "../styles/manager.sass"

import darkTheme from '../themes/dark';
import lightTheme from '../themes/light';

const themes = {
  dark: darkTheme,
  light: lightTheme
};

const ipcRenderer = electron.ipcRenderer || false;

export default class Manager extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      theme: "light",
      primaryColor: "blue",
      saveShortcut: "",
      incrementShortcut: "",

      navOpen: false,

      newAssetModal: false,
      settingsModal: false,

      projects: [],

      selectedSoftware: undefined,
      selectedSoftwareType: undefined,
      softwares: {},
      overlaySoftware: undefined,

      newFileName: undefined,

      filters: {
        // scened2D3D: {
        //   _2D: false,
        //   _3D: true
        // },
        state: {
          work: true,
          publish: true,
          wip: false
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
      ipcRenderer.send("getAssetId");

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
    filters[filter][option] = value;
    this.setState({filters: filters});
  }

  filteredFiles() {
    let files = this.state.fileManagerAssetId.files;
    let filteredFiles = [];

    let filters = this.state.filters;
    for(const filter in filters) {
      switch (filter) {
        case "state":
          let states = [];
          if(filters[filter]["work"]) { states.push("work") }
          if(filters[filter]["publish"]) { states.push("publish") }
          if(filters[filter]["wip"]) { states.push("wip") }
          let filtered = files.filter(file => {
            return states.includes(file.state);
          });

          filteredFiles = filteredFiles.concat(filtered);
          break;
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
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="./static/line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <Nav
          open={this.state.navOpen}
          page="manager"
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <div className={this.state.navOpen ? "main" : "main full"}>
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
                  <img className="softwareImg" src={"./static/" + this.state.softwares[softwareId].software + ".png"}></img>
                  <h4 className="softwareName">{this.state.softwares[softwareId].software.charAt(0).toUpperCase() + this.state.softwares[softwareId].software.slice(1)}</h4>
                </div>
                <span className="softwareSceneName"><i className="las la-sync" onClick={(e) => this.reloadSceneName(softwareId)}></i>{this.state.softwares[softwareId].saved == 1 ? this.state.softwares[softwareId].scene : this.state.softwares[softwareId].scene + "*"}</span>
              </div>
            ))}
          </div>


          <div className="manager-container">
            <div className="search-container">
              <div className="create-asset">
                <div className="create-asset-btn button" onClick={(e) => this.setState({newAssetModal: true})}>
                  <h5>Create Asset</h5>
                </div>
              </div>
              <div className="project-select">
                <Dropdown
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  value={this.state.fileManagerAssetId.project}
                  options={this.state.fileManagerAssetId.projects}
                  onChange={(element) => this.setAssetIdValue("fileManager", "project", element)}
                />
              </div>
              <div className="asset-shot-switch">
                <Switch
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  value={this.state.fileManagerAssetId.pathType}
                  option1="Assets"
                  value1="asset"
                  option2="Shots"
                  value2="shot"
                  onChange={(choice) => this.setAssetIdValue("fileManager", "pathType", choice)}
                />
              </div>
              <div className="search-bar-container">
                <SearchBar
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  assetId={this.state.fileManagerAssetId}
                />
              </div>
            </div>



            <div className="filter-container">
              <FiltersContainer
                theme={themes[this.state.theme]}
                primaryColor={this.state.primaryColor}
                filters={this.state.filters}
                setFilter={(filter, option, value) => this.setFilter(filter, option, value)}
              />
            </div>




            <div className="browser-container">
              <div className="browser sequenceBrowser">
                <Browser
                  theme={themes[this.state.theme]}
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
                  theme={themes[this.state.theme]}
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
                  theme={themes[this.state.theme]}
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
                  theme={themes[this.state.theme]}
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
                <FileBrowser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title="Files"
                  files={this.filteredFiles()}
                  onChange={(file) => this.setAssetIdValue("fileManager", "file", file)}
                  selectedFile={this.state.fileManagerAssetId.file}
                />
              </div>
            </div>



            <div className={this.state.fileManagerAssetId.file == "" ? "file-container" : "file-container open"}>
              {this.state.fileManagerAssetId.file != "" ?
                <FileViewer
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  assetId={this.state.fileManagerAssetId}
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
          theme={themes[this.state.theme]}
          primaryColor={this.state.primaryColor}
          show={this.state.newAssetModal}
          handleClose={() =>  this.setState({newAssetModal: false})}
          assetId={this.state.newAssetId}
          setAssetIdValue={(type, element) => this.setAssetIdValue("newAsset", type, element)}
        />
{/*
        <SettingsContainer
          saveShortcut={this.state.saveShortcut}
          setSaveShortcut={(value) => this.setState({saveShortcut: value})}
          incrementShortcut={this.state.incrementShortcut}
          setIncrementShortcut={(value) => this.setState({incrementShortcut: value})}
          theme={themes[this.state.theme]}
          themeName={this.state.theme}
          setTheme={(theme) => this.setTheme(theme)}
          primaryColor={this.state.primaryColor}
          setPrimaryColor={(color) => this.setPrimaryColor(color)}
          show={this.state.settingsModal}
          handleClose={() =>  this.setState({settingsModal: false})}
          cancelSettings={() => this.cancelSettings()}
          saveSettings={() => this.saveSettings()}
        /> */}

        <style jsx global>{`

        `}</style>
        <style jsx>{`

        `}</style>
      </React.Fragment>
    );
  };
};
