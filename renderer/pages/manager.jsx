import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Nav from '../components/Nav';
import SearchBar from '../components/SearchBar';

const ipcRenderer = electron.ipcRenderer || false;

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      project: "test"
    }
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig")




      console.log("----- ipcRenderer exists -----");
      ipcRenderer.on('config', (event, data) => {
        console.log("----- receive list of open softwares -----");
        this.setState({projects: data.projects})
      })
    }
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
          <div className="softwareContainer"></div>
          <div className="managerContainer">
            <div className="searchContainer">
              <div className="projectSelect">
                <div className="selectedProject">
                  <h4>{this.state.project}</h4>
                </div>
                <i className="fas fa-angle-down"></i>
              </div>
              <div className="assetShotSwitch">
                <div className="assetBtn">
                  <span>Assets</span>
                </div>
                <div className="shotBtn">
                  <span>Shots</span>
                </div>
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
              </div>
            </div>




            <div className="browserContainer">
              <div className="browser sequenceBrowser">
                <div className="browserTitle">
                  <h4>Sequences</h4>
                </div>
                <div className="browserInner"></div>
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser shotBrowser">
                <div className="browserTitle">
                  <h4>Shots</h4>
                </div>
                <div className="browserInner"></div>
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser taskBrowser">
                <div className="browserTitle">
                  <h4>Tasks</h4>
                </div>
                <div className="browserInner"></div>
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="browser subtaskBrowser">
                <div className="browserTitle">
                  <h4>Subtasks</h4>
                </div>
                <div className="browserInner"></div>
              </div>
              <div className="chevronContainer">
                <i className="fas fa-angle-right"></i>
              </div>
              <div className="fileBrowser">
                <div className="browserTitle">
                  <h4>Files</h4>
                </div>
                <div className="fileBrowserInner"></div>
              </div>
            </div>



            <div className="fileContainer">
              <div className="fileContainerInner"></div>
            </div>



            <div className="commandContainer">
              <div className="btn">
                <span>Open</span>
              </div>
              <div className="btn">
                <span>Open As</span>
              </div>
              <div className="btn">
                <span>Save</span>
              </div>
              <div className="btn">
                <span>Save As</span>
              </div>
              <div className="btn">
                <span>Publish</span>
              </div>
              <div className="btn">
                <span>Release</span>
              </div>
              <div className="btn">
                <span>Publish & Release</span>
              </div>
              <div className="btn">
                <span>Close</span>
              </div>
              <div className="btn">
                <span>Screenshot</span>
              </div>
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
            display: flex;
            align-items: center;
            flex-direction: row;
            width: 120px;
            border-radius: 6px;
            background: #fff;
            border:  1px solid #e3e3e3;
            cursor: pointer;
          }
          .selectedProject {
            flex: 1;
            margin-left: 10px;
          }
          .projectSelect i {
            color: #444F60;
            margin-right: 10px;
            font-size: 20px;
          }
          .assetShotSwitch {
            display: flex;
            flex-direction: row;
            width: 120px;
          }
          .assetBtn,
          .shotBtn {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
            border: 1px solid #e3e3e3;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            cursor: pointer;
          }
          .assetBtn {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
          .shotBtn {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
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
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }
          .browser:first-child {
            margin-left: 25px;
          }
          .fileBrowser {
            flex: 3;
            margin-right: 25px;
          }
          .browserTitle {
            height: 25px;
            background: #f2f2f2;
          }
          .browserTitle h4 {
            margin-left: 10px;
          }
          .browserInner {
            overflow-x: auto;
            overflow-y: scroll;
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




          .fileContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }
          .fileContainerInner {
            height: 90%;
            margin: 0 25px;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }




          .commandContainer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 50px;
          }
          .commandContainer .btn {
            display: flex;
            align-items: center;
            width: auto;
            height: 25px;
            margin: 0 0.5%;
            padding: 5px 10px;
            border-radius: 6px;
            background: #fff;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border:  1px solid #e3e3e3;
            cursor: pointer;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
