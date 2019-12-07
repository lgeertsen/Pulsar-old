import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Browser from '../components/Browser';
import Dropdown from '../components/Dropdown';
import FileBrowser from '../components/FileBrowser';
import FileViewer from '../components/FileViewer';
import FiltersContainer from '../containers/FiltersContainer';
import Nav from '../components/Nav';
import SearchBar from '../components/SearchBar';
import SettingsContainer from '../containers/SettingsContainer';
import Switch from '../components/Switch';

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

      settingsModal: false,

      projects: [],

      project: "",
      switch: "assets",
      type: undefined,
      name: undefined,
      task: undefined,
      subtask: undefined,
      state: undefined,
      version: undefined,
      file: undefined,

      selectedSoftware: undefined,
      selectedSoftwareType: undefined,
      softwares: {},

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

      directories: {
        type: [],
        name: [],
        task: [],
        subtask: [],
        file: []
      },

      selectedIndexes: {
        type: -1,
        name: -1,
        task: -1,
        subtask: -1,
        file: -1
      },

      sid: {
        "project": undefined,
        "assetShot": "a",
        "type": undefined,
        "name": undefined,
        "task": undefined,
        "subtask": undefined,
        "state": undefined,
        "version": undefined,
        "file": undefined,
        "ext": undefined
      }
    };
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig")
      ipcRenderer.send("getSoftwares")
      console.log("----- ipcRenderer exists -----");




      ipcRenderer.on('config', (event, data) => {
        console.log("----- receive config file -----", data);
        this.setState({config: data})
        if(data.theme) {
          this.setState({theme: data.theme});
        }
        if(data.color) {
          this.setState({primaryColor: data.color});
        }
        if(data.projects) {
          this.setState({projects: data.projects})
          if(data.projects.length > 0) {
            this.setProject(data.projects[0])
          }
        }
      });

      ipcRenderer.on('directories', (event, data) => {
        console.log("----- received directories -----");
        console.log(data);
        this.setState({directories: data});
      });

      ipcRenderer.on('softwares', (event, data) => {
        console.log("----- receive software list -----");
        console.log(data);
        this.setState({softwares: data});
      });
    }
  }

  setProject(project) {
    let sid = this.state.sid;
    let selectedIndexes = this.state.selectedIndexes;
    sid.project = project;
    selectedIndexes.file = -1;
    sid.fileName = undefined;
    sid.state = undefined;
    sid.version = undefined;
    sid.ext = undefined;
    selectedIndexes.subtask = -1;
    sid.subtask = undefined;
    selectedIndexes.task = -1;
    sid.task = undefined;
    selectedIndexes.name = -1;
    sid.name = undefined;
    selectedIndexes.type = -1;
    sid.type = undefined;

    this.setState({sid: sid, project: project, selectedIndexes: selectedIndexes});
    ipcRenderer.send("setProject", project);
  }

  setSwitch(data) {
    let choice = data == 1 ? "assets" : "shots"
    let sid = this.state.sid;
    let selectedIndexes = this.state.selectedIndexes;
    selectedIndexes.file = -1;
    sid.fileName = undefined;
    sid.state = undefined;
    sid.version = undefined;
    sid.ext = undefined;
    selectedIndexes.subtask = -1;
    sid.subtask = undefined;
    selectedIndexes.task = -1;
    sid.task = undefined;
    selectedIndexes.name = -1;
    sid.name = undefined;
    selectedIndexes.type = -1;
    sid.type = undefined;
    sid.assetShot = data == 1 ? "a" : "s";
    this.setState({switch: choice, sid: sid, selectedIndexes: selectedIndexes});
    ipcRenderer.send("setSwitch", choice);
  }

  setSidDir(type, index) {
    console.log("-------------type------------", type);
    let dir = this.state.directories[type][index];
    let sid = this.state.sid;
    sid[type] = dir;
    let selectedIndexes = this.state.selectedIndexes
    selectedIndexes[type] = index

    if(type == "subtask") {
      selectedIndexes.file = -1;
      sid.fileName = undefined;
      sid.state = undefined;
      sid.version = undefined;
      sid.ext = undefined;
    } else if(type == "task") {
      selectedIndexes.file = -1;
      sid.fileName = undefined;
      sid.state = undefined;
      sid.version = undefined;
      sid.ext = undefined;
      selectedIndexes.subtask = -1;
      sid.subtask = undefined;
    } else if(type == "name") {
      selectedIndexes.file = -1;
      sid.fileName = undefined;
      sid.state = undefined;
      sid.version = undefined;
      sid.ext = undefined;
      selectedIndexes.subtask = -1;
      sid.subtask = undefined;
      selectedIndexes.task = -1;
      sid.task = undefined;
    } else if(type == "type") {
      selectedIndexes.file = -1;
      sid.fileName = undefined;
      sid.state = undefined;
      sid.version = undefined;
      sid.ext = undefined;
      selectedIndexes.subtask = -1;
      sid.subtask = undefined;
      selectedIndexes.task = -1;
      sid.task = undefined;
      selectedIndexes.name = -1;
      sid.name = undefined;
    }

    this.setState({sid: sid, selectedIndexes: selectedIndexes});
    ipcRenderer.send("setSidDir", {type: type, dir: dir});
  }

  setSidFile(file, index) {
    let sid = this.state.sid;
    sid.file = file;
    sid.state = file.state;
    sid.version = file.version;
    sid.fileName = file.name;
    sid.ext = file.extension;
    let selectedIndexes = this.state.selectedIndexes
    selectedIndexes.file = index
    this.setState({sid: sid, selectedIndexes: selectedIndexes});
    ipcRenderer.send("setFile", file);
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
    let files = this.state.directories.file;
    let filteredFiles = [];

    let filters = this.state.filters;
    for(const filter in filters) {
      switch (filter) {
        case "state":
          let work = filters[filter]["work"];
          let publish = filters[filter]["publish"];
          let wip = filters[filter]["wip"];

          for(let i = 0; i < files.length; i ++) {
            if(files[i].state == "work" && work) {
              filteredFiles.push(files[i]);
            } else if(files[i].state == "publish" && publish) {
              filteredFiles.push(files[i]);
            } else if(files[i].state == "wip" && wip) {
              filteredFiles.psuh(files[i]);
            }
          }
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
    let sid = this.state.sid
    sid.file.comment = e.target.value;
    this.setState({sid: sid});
  }

  saveComment() {
    let comment = this.state.sid.file.comment;
    ipcRenderer.send("saveComment", comment);
  }

  getCompatibleSoftware() {
    let file = this.state.sid.file;
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
    let sid = this.state.sid;

    let now = new Date(Date.now());
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();

    let timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    let wipName = `WIP_${sid.file.name}_${sid.task}_${sid.subtask}_${sid.file.version}_${timestamp}`;
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
    let config = this.state.config;
    config.theme = theme;
    config.color = color;
    this.setState({config: config});
    ipcRenderer.send("saveConfig", config);
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <Nav
          theme={themes[this.state.theme]}
          openSettings={() => this.setState({settingsModal: true})}
        />

        <div className="main">
          <div className="softwareContainer">
            <div className="softwareTitle">
              <h3>Open software</h3>
            </div>
            {Object.keys(this.state.softwares).map((softwareId, index) => (
              <div key={index} className={this.state.selectedSoftware == softwareId ? "software selected" : "software"}>
                <div className="softwareHeader">
                  <img className="softwareImg" src={"./static/" + this.state.softwares[softwareId].software + ".png"}></img>
                  <h4 className="softwareName">{this.state.softwares[softwareId].software.charAt(0).toUpperCase() + this.state.softwares[softwareId].software.slice(1)}</h4>
                </div>
                <span className="softwareSceneNmae">{this.state.softwares[softwareId].saved == 1 ? this.state.softwares[softwareId].scene : this.state.softwares[softwareId].scene + "*"}</span>
              </div>
            ))}
          </div>


          <div className="managerContainer">
            <div className="searchContainer">
              <div className="projectSelect">
                <Dropdown
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  value={this.state.project}
                  options={this.state.projects}
                  onChange={(element) => this.setProject(element)}
                />
              </div>
              <div className="assetShotSwitch">
                <Switch
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  option1="Assets"
                  option2="Shots"
                  onChange={(choice) => this.setSwitch(choice)}
                />
              </div>
              <div className="searchBar">
                <SearchBar
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  sid={this.state.sid}
                />
              </div>
            </div>



            <div className="filterContainer">
              <FiltersContainer
                theme={themes[this.state.theme]}
                primaryColor={this.state.primaryColor}
                filters={this.state.filters}
                setFilter={(filter, option, value) => this.setFilter(filter, option, value)}
              />
            </div>




            <div className="browserContainer">
              <div className="browser sequenceBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title={this.state.switch == "assets" ? "Asset Type" : "Sequences"}
                  directories={this.state.directories.type}
                  onChange={(dir) => this.setSidDir("type", dir)}
                  selectedDir={this.state.selectedIndexes.type}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser shotBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title={this.state.switch == "assets" ? "Asset Name" : "Shots"}
                  directories={this.state.directories.name}
                  onChange={(dir) => this.setSidDir("name", dir)}
                  selectedDir={this.state.selectedIndexes.name}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser taskBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title="Tasks"
                  directories={this.state.directories.task}
                  onChange={(dir) => this.setSidDir("task", dir)}
                  selectedDir={this.state.selectedIndexes.task}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser subtaskBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title="Subtasks"
                  directories={this.state.directories.subtask}
                  onChange={(dir) => this.setSidDir("subtask", dir)}
                  selectedDir={this.state.selectedIndexes.subtask}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="fileBrowser">
                <FileBrowser
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  title="Files"
                  files={this.filteredFiles()}
                  onChange={(file, index) => this.setSidFile(file, index)}
                  selectedFile={this.state.selectedIndexes.file}
                />
              </div>
            </div>



            <div className={this.state.sid.file == undefined ? "selectedContainer" : "selectedContainer open"}>
              {this.state.sid.file != undefined ?
                <FileViewer
                  theme={themes[this.state.theme]}
                  primaryColor={this.state.primaryColor}
                  sid={this.state.sid}
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

        <SettingsContainer
          theme={themes[this.state.theme]}
          themeName={this.state.theme}
          setTheme={(theme) => this.setTheme(theme)}
          primaryColor={this.state.primaryColor}
          setPrimaryColor={(color) => this.setPrimaryColor(color)}
          show={this.state.settingsModal}
          handleClose={() =>  this.setState({settingsModal: false})}
          cancelSettings={() => this.cancelSettings()}
          saveSettings={() => this.saveSettings()}
        />

        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: ${themes[this.state.theme].body} !important;
          }
          * {
            margin: 0;
          }
          p, h1, h2, h3, h4, h5, h6 {
            color: ${themes[this.state.theme].text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          div {
            height: 100%;
            width: 100%;
          }
          #__next {
            display: flex;
            flex-direction: column;
          }
        `}</style>
        <style jsx>{`
          .main {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            background-image: linear-gradient(${themes[this.state.theme].transparentBg}, ${themes[this.state.theme].transparentBg}), url('./static/img/jakob-owens-CiUR8zISX60-unsplash.jpg');
            background-position: center;
            background-attachment: fixed;
            background-size: cover;
            background-repeat: no-repeat;
          }
          .softwareContainer {
            width: 150px;
            background: ${themes[this.state.theme].background};
            border-right: ${themes[this.state.theme].border};
          }
          .softwareTitle {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px 0;
            height: auto;
            border-bottom: ${themes[this.state.theme].border};
          }
          .software {
            display: flex;
            flex-direction: column;
            // align-items: center;
            height: auto;
            border-bottom: ${themes[this.state.theme].border};
            transition: all ease 0.2s;
          }
          .software.selected {
            background: #3498db;
          }
          .softwareHeader {
            display: flex;
            flex-direction:row;
            align-items: center;
            height: auto;
          }
          .softwareHeader img {
            width: 25%;
            margin: 10px;
          }
          .softwareHeader h4 {
            margin: 10px 0;
          }
          .softwareSceneNmae {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            margin-left: 10px;
            margin-bottom: 10px;
            overflow-wrap: break-word;
          }



          .managerContainer {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          .searchContainer {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            height: 40px;
          }
          .searchContainer > div {
            height: 25px;
            margin: 0 25px;
          }
          .projectSelect {
            position: relative;
            width: 120px;
          }


          .assetShotSwitch {
            width: 120px;
          }

          .searchBar {
            flex: 1;
          }



          .filterContainer {
            height: 150px;
            display: flex;
            flex-direction: row;
            align-items: center;
          }


          .browserContainer {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .browser {
            // flex: 1;
            width: 150px;
          }
          .browser:first-child {
            margin-left: 25px;
          }
          .fileBrowser {
            flex: 3;
            margin-right: 25px;
          }

          .chevronContainer {
            width: 25px;
            height: auto;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .chevronContainer i {
            color: ${themes[this.state.theme].text};
            font-size: 28px;
          }


          .selectedContainer {
            margin: 25px 0 ;
            height: 0px;
            overflow: hidden;
            transition: height ease 0.5s;
          }
          .selectedContainer.open {
            height: 350px;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
