import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Nav from '../components/Nav'

const ipcRenderer = electron.ipcRenderer || false;

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {

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
          <div className="softwareContainer"></div>
          <div className="managerContainer">
            <div className="searchContainer">
              <div className="projectSelect">Project</div>
              <div className="assetShotSwitch">Assets | Shots</div>
              <div className="searchBar">/shots/S10/SH350/fx/pyro/v001/work/.hip</div>
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
              <div className="btn">Open</div>
              <div className="btn">Open As</div>
              <div className="btn">Save</div>
              <div className="btn">Save As</div>
              <div className="btn">Publish</div>
              <div className="btn">Release</div>
              <div className="btn">Publish & Release</div>
              <div className="btn">Close</div>
              <div className="btn">Screenshot</div>
            </div>
          </div>
        </div>

        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #fff;
          }
          * {
            font-family: "Oswald", sans-serif;
            margin: 0;
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
            border-right: 1px solid #f00;
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
            border-bottom: 1px solid #f00;
          }
          .searchContainer > div {
            height: 25px;
            margin: 0 25px;
          }
          .projectSelect {
            width: 120px;
            border: 1px solid #444;
          }
          .assetShotSwitch {
            width: 120px;
            border: 1px solid #444;
          }
          .searchBar {
            flex: 1;
            border: 1px solid #444;
          }



          .filterContainer {
            display: flex;
            align-items: center;
            flex-direction: row;
            height: 60px;
            border-bottom: 1px solid #f00;
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
            border-bottom: 1px solid #f00;
          }
          .browser,
          .fileBrowser {
            flex: 1;
            display: flex;
            flex-direction: column;
            border: 2px solid #444;
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
            border-bottom: 3px solid #777;
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




          .fileContainer {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            border-bottom: 1px solid #f00;
          }
          .fileContainerInner {
            height: 90%;
            margin: 0 25px;
            border: 2px solid #444;
          }




          .commandContainer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 50px;
          }
          .btn {
            width: auto;
            height: 25px;
            margin: 0 0.5%;
            padding: 5px 10px;
            border: 2px solid #444;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
