import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Dropdown from '../components/Dropdown';
import Nav from '../components/Nav';

import "../styles/farm.sass"

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

      projects: {},

      jobs: {},
    };
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig");
      // ipcRenderer.send("getSoftwares");
      // ipcRenderer.send("getAssetId");

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
        if(data.projects) {
          this.setState({projects: data.projects, project: Object.keys(data.projects)[0]});
          ipcRenderer.send("getJobs", {project: this.state.project});
        }
      });

      ipcRenderer.on('tsid', (event) => {
        console.log("got tsid");
        ipcRenderer.send("getJobs", {project: this.state.project});
      });

      ipcRenderer.on('jobs', (event, data) => {
        console.log(data);
        this.setState({jobs: data});
        // for (var id in data) {
        //   console.log(data[id]);
        // }
      });
    }
  }

  dateToString(spooldate){
    var date = new Date(spooldate);
    return ('0' + date.getDate()).slice(-2) + '/' +
      ('0' + date.getMonth()).slice(-2) +
      ' - ' + ('0' + date.getHours()).slice(-2) +
      ':' + ('0' + date.getMinutes()).slice(-2);
  }

  setTheme(theme) {
    this.setState({theme: theme});
  }

  setPrimaryColor(color) {
    this.setState({primaryColor: color});
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Big+Shoulders+Text:400,500,700&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Inconsolata&display=swap" rel="stylesheet"/>
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="./static/line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <Nav
          open={this.state.navOpen}
          page="farm"
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          toggleNav={(v) => this.setState({navOpen: v})}
        />

          <div className={this.state.navOpen ? "main " + this.state.theme : "main full " + this.state.theme}>
            <div className="main-container">
              <div className="search-container">
                <div className="project-select">
                  <Dropdown
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    value={this.state.project}
                    options={Object.keys(this.state.projects)}
                    onChange={(element) => this.setState({project: element})}
                  />
                </div>
              </div>
            </div>

            <div className="jobs-container">
              <div className="job-line-header">
                <div className="job-name">Title</div>
                <div className="job-service">service</div>
                <div className="job-spooldate">Spooled</div>
                <div className="job-state">state</div>
              </div>
              { Object.keys(this.state.jobs).map((id, index) => (
                <div className="job-line">
                  <div className="job-name" key={id + 'title'}>{this.state.jobs[id].title}</div>
                  <div className="job-service" key={id + 'service'}>{this.state.jobs[id].service}</div>
                  <div className="job-spooldate" key={id + 'spooldate'}>{this.dateToString(this.state.jobs[id].spooldate)}</div>
                  <div className="job-state" key={id + 'state'}>{this.state.jobs[id].state}</div>
                </div>
              ))}

            </div>


          </div>
      </React.Fragment>
    );
  };
};
