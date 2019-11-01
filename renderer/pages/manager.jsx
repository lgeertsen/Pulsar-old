import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Browser from '../components/Browser';
import Dropdown from '../components/Dropdown';
import FileBrowser from '../components/FileBrowser';
import FileViewer from '../components/FileViewer';
import Nav from '../components/Nav';
import SearchBar from '../components/SearchBar';
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
      theme: "light",

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
      softwares: {},

      newFileName: undefined,

      directories: {
        type: [],
        name: [],
        task: [],
        subtask: [],
        file: []
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
        "file": undefined
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
        console.log("----- receive config file -----");
        if(data.projects) {
          this.setState({projects: data.projects})
          if(data.projects.length > 0) {
            this.setProject(data.projects[0])
          }
        }
      });

      ipcRenderer.on('directories', (event, data) => {
        console.log("----- receive type directories -----");
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
    sid.project = project;
    this.setState({sid: sid, project: project});
    ipcRenderer.send("setProject", project);
  }

  setSwitch(data) {
    let choice = data == 1 ? "assets" : "shots"
    let sid = this.state.sid;
    sid.assetShot = data == 1 ? "a" : "s";
    this.setState({switch: choice, sid: sid});
    ipcRenderer.send("setSwitch", choice);
  }

  setSidDir(type, index) {
    let dir = this.state.directories[type][index];
    let sid = this.state.sid;
    sid[type] = dir;
    this.setState({sid: sid});
    ipcRenderer.send("setSidDir", {type: type, dir: dir});
  }

  setSidFile(index) {
    let file = this.state.directories.file[index];
    let sid = this.state.sid;
    sid.file = file;
    sid.state = file.state;
    sid.version = file.version;
    sid.fileName = file.name;
    sid.ext = file.extension;
    this.setState({sid: sid});
    ipcRenderer.send("setFile", file);
  }

  checkSotfwareSaved() {
    ipcRenderer.send("checkSotfwareSaved");
  }

  execTask(task) {
    console.log("----- exec command -----", task.command)
    if(this.state.selectedSoftware == undefined) { return; }
    let selectedSoft = this.state.selectedSoftware;
    let data = {
      id: selectedSoft,
      command: task.command,
      arguments: task.arguments
    }
    if(selectedSoft = "new") {
      data["type"] = "maya"
    } else {
      data["type"] = this.state.softwares[selectedSoft].software
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

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <Nav/>

        <div className="main">
          <div className="softwareContainer">
            <div className="softwareTitle">
              <h3>Open software</h3>
            </div>
            {Object.keys(this.state.softwares).map((softwareId, index) => (
              <div key={index} className={this.state.selectedSoftware == softwareId ? "software selected" : "software"}>
                <div className="softwareHeader">
                  <img className="softwareImg" src={"./static/" + this.state.softwares[softwareId].software + ".jpg"}></img>
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
                  value={this.state.project}
                  options={this.state.projects}
                  onChange={(element) => this.setProject(element)}
                />
              </div>
              <div className="assetShotSwitch">
                <Switch
                  theme={themes[this.state.theme]}
                  option1="Assets"
                  option2="Shots"
                  onChange={(choice) => this.setSwitch(choice)}
                />
              </div>
              <div className="searchBar">
                <SearchBar
                  theme={themes[this.state.theme]}
                  sid={this.state.sid}
                />
              </div>
            </div>



            <div className="filterContainer">
              <div className="filterTitle">
                <h4>Filters</h4>
              </div>
              <div className="filterTypes">
                <div className="filterType">
                  <div className="filterOption">O Work</div>
                  <div className="filterOption">O Publish</div>
                </div>
                <div className="filterType">
                  <div className="filterOption">O 2D</div>
                  <div className="filterOption">O 3D</div>
                </div>
              </div>
            </div>




            <div className="browserContainer">
              <div className="browser sequenceBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  title={this.state.switch == "assets" ? "Asset Type" : "Sequences"}
                  directories={this.state.directories.type}
                  onChange={(dir) => this.setSidDir("type", dir)}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser shotBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  title={this.state.switch == "assets" ? "Asset Name" : "Shots"}
                  directories={this.state.directories.name}
                  onChange={(dir) => this.setSidDir("name", dir)}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser taskBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  title="Tasks"
                  directories={this.state.directories.task}
                  onChange={(dir) => this.setSidDir("task", dir)}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser subtaskBrowser">
                <Browser
                  theme={themes[this.state.theme]}
                  title="Subtasks"
                  directories={this.state.directories.subtask}
                  onChange={(dir) => this.setSidDir("subtask", dir)}
                />
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="fileBrowser">
                <FileBrowser
                  theme={themes[this.state.theme]}
                  title="Files"
                  files={this.state.directories.file}
                  onChange={(file) => this.setSidFile(file)}
                />
              </div>
            </div>



            <div className={this.state.sid.file == undefined ? "selectedContainer" : "selectedContainer open"}>
              {this.state.sid.file != undefined ?
                <FileViewer
                  theme={themes[this.state.theme]}
                  sid={this.state.sid}
                  execTask={(task) => this.execTask(task)}
                  onChangeComment={(e) => this.editComment(e)}
                  onSaveComment={() => this.saveComment()}
                  softwares={this.getCompatibleSoftware()}
                  selectSoftware={(id) => this.setState({selectedSoftware: id})}
                  selectedSoftware={this.state.selectedSoftware}
                  selectedSoft={this.state.softwares[this.state.selectedSoftware]}
                  checkSotfwareSaved={() => this.checkSotfwareSaved()}
                  getWipName={() => this.getWipName()}
                />
                : ""
              }
            </div>


          </div>
        </div>

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
          }
          .softwareContainer {
            width: 150px;
            background: #fff;
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
            display: flex;
            align-items: center;
            flex-direction: row;
            height: 60px;
          }
          .filterContainer > div {
            height: 60px;
            margin: 0 25px;
          }
          .filterTitle {
            width: 50px;
          }
          .filterTypes {
            flex: 1;
            display: flex;
            flex-direction: row;
          }
          .filterType {
            display: flex;
            flex-direction: column;
            width: 80px;
          }




          .browserContainer {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .browser,
          .fileBrowser {
            flex: 1;
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
