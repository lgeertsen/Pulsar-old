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

const ipcRenderer = electron.ipcRenderer || false;

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

      directories: {
        type: [],
        name: [],
        task: [],
        subtask: [],
        file: []
      },

      sid: {
        "type": undefined,
        "name": undefined,
        "task": undefined,
        "subtask": undefined,
        "state": undefined,
        "version": undefined,
        "file": undefined
      }
    }
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
    this.setState({project: project});
    ipcRenderer.send("setProject", project);
  }

  setSwitch(data) {
    let choice = data == 1 ? "assets" : "shots"
    this.setState({switch: choice});
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
    this.setState({sid: sid});
    ipcRenderer.send("setFile", file);
  }

  execTask(command) {
    console.log("----- exec command -----", command)
    if(this.state.selectedSoftware == undefined) { return; }
    let selectedSoft = this.state.selectedSoftware;
    let data = {
      id: selectedSoft,
      command: command,
      type: this.state.softwares[selectedSoft].software
    }

    ipcRenderer.send("execTask", data)
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <Nav/>

        <div className="main">
          <div className="softwareContainer">
            <div className="softwareTitle">
              <h3>Open software</h3>
            </div>
            {Object.keys(this.state.softwares).map((softwareId, index) => (
              <div key={index} className={this.state.selectedSoftware == softwareId ? "software selected" : "software"} onClick={(e) => this.setState({selectedSoftware: softwareId})}>
                <div className="softwareHeader">
                  <img className="softwareImg" src={"./static/" + this.state.softwares[softwareId].software + ".jpg"}></img>
                  <h4 className="softwareName">{this.state.softwares[softwareId].software.charAt(0).toUpperCase() + this.state.softwares[softwareId].software.slice(1)}</h4>
                </div>
                <span className="softwareSceneNmae">{this.state.softwares[softwareId].scene}</span>
              </div>
            ))}
          </div>


          <div className="managerContainer">
            <div className="searchContainer">
              <div className="projectSelect">
                <Dropdown
                  value={this.state.project}
                  options={this.state.projects}
                  onChange={(element) => this.setProject(element)}
                />
              </div>
              <div className="assetShotSwitch">
                <Switch
                  option1="Assets"
                  option2="Shots"
                  onChange={(choice) => this.setSwitch(choice)}
                />
              </div>
              <div className="searchBar">
                <SearchBar/>
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
                  title="Files"
                  files={this.state.directories.file}
                  onChange={(file) => this.setSidFile(file)}
                />
              </div>
            </div>



            <div className={this.state.sid.file == undefined ? "selectedContainer" : "selectedContainer open"}>
              {this.state.sid.file != undefined ?
                <FileViewer
                  file={this.state.sid.file}
                  execTask={(command) => this.execTask(command)}
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
            background: #f4f6fb;
          }
          * {
            margin: 0;
          }
          p, h1, h2, h3, h4, h5, h6 {
            color: #444F60;
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
            border-right: 1px solid #ededed;
          }
          .softwareTitle {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 10px 0;
            height: auto;
            border-bottom: 1px solid #e3e3e3;
          }
          .software {
            display: flex;
            flex-direction: column;
            // align-items: center;
            height: auto;
            border-bottom: 1px solid #e3e3e3;
            transition: all ease 0.2s;
          }
          .software.selected {
            background: #f2f244;
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
            color: #444F60;
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
