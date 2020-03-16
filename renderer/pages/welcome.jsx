import { ipcRenderer } from 'electron';
import React from 'react';
import Head from 'next/head';
import Router from 'next/router'

import Nav from '../components/Nav';

import "../styles/welcome.sass"

const colors = [
  "orange",
  "yellow",
  "green",
  "turquoise",
  "cyan",
  "blue",
  "purple",
  "red"
];

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      theme: "theme-light",
      primaryColor: "blue",
      saveShortcut: "",
      incrementShortcut: "",
      projects: {},

      newProjectName: "",
      newProjectPath: "",

      navOpen: false,

      step: 0,
      finished: false
    };
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig");

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

      ipcRenderer.on('selectedDirectory', (event, data) => {
        this.setState({newProjectPath: data});
      });

      ipcRenderer.on('configSet', (event, data) => {
        Router.push('/manager')
      });
    }
  }

  selectDirectory() {
    ipcRenderer.send('selectDirectory');
  }

  addProject() {
    let projects = this.state.projects;
    let name = this.state.newProjectName;
    let path = this.state.newProjectPath;
    if(name != "" && path != "") {
      projects[name] = path;
      this.setState({projects: projects, newProjectName: "", newProjectPath: ""});
    }
  }

  removeProject(project) {
    let projects = this.state.projects;
    delete projects[project];
    this.setState({projects: projects});
  }

  finishSetup() {
    let theme = this.state.theme;
    let color = this.state.primaryColor;
    let projects = this.state.projects;
    let data = {
      "color": color,
      "firstUsage": false,
      "projects": projects,
      "theme": theme,
    };
    console.log(data);
    ipcRenderer.send('setConfig', data);
    this.setState({finished: true})
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Big+Shoulders+Text:400,500,700&display=swap" rel="stylesheet"/>
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="./static/line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <div className={this.state.navOpen ? "main main-start " + this.state.theme : "main main-start full " + this.state.theme}>
          <div className={"box welcome-box " + this.state.theme}>
            <div className={this.state.step == 0 ? "welcome-step welcome-step-0" : "welcome-step welcome-step-0 slide-out-left"}>
              <div className="welcome-title-container">
                <h1 className="welcome-top-title display-4 sub-display">WELCOME TO</h1>
                <h1 className="welcome-title display-1">Pulsar</h1>
              </div>
              <div className="get-started" onClick={(e) => this.setState({step: 1})}>
                <span>Get Started!</span>
                <i className="las la-arrow-circle-right"></i>
              </div>
            </div>
            <div className={this.state.step == 1 ? "welcome-step welcome-step-1 slide-in-right" : this.state.step < 1 ? "welcome-step welcome-step-1 hidden" : "welcome-step welcome-step-1 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Theme</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <span>Select the theme you would like to use for Pulsar</span>
              </div>
              <div className="step-themes">
                <div className={"step-theme " + this.state.theme} onClick={(e) => this.setState({theme: "theme-light"})}>
                  <div className="theme-light bg-main">
                    <div className="step-theme-box box theme-light">
                      <h1 className="display-4 sub-display">LIGHT</h1>
                    </div>
                  </div>
                </div>
                <div className={"step-theme " + this.state.theme} onClick={(e) => this.setState({theme: "theme-dark"})}>
                  <div className="theme-dark bg-main">
                    <div className="step-theme-box box theme-dark">
                      <h1 className="display-4 sub-display">DARK</h1>
                    </div>
                  </div>
                </div>
              </div>
              <div className="step-footer">
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 2})}>Next</div>
              </div>
            </div>
            <div className={this.state.step == 2 ? "welcome-step welcome-step-2 slide-in-right" : this.state.step < 2 ? "welcome-step welcome-step-2 hidden" : "welcome-step welcome-step-2 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Color</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <span>Pick your favorite color</span>
              </div>
              <div className="step-colors">
                {colors.map((color, index) => (
                  <div key={index} className={this.state.primaryColor == color ? "step-color-bullet bg-" + color : "step-color-bullet bg-" + color + " border-" + color} onClick={(e) => this.setState({primaryColor: color})}></div>
                ))}
              </div>
              <div className="step-footer">
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 3})}>Next</div>
              </div>
            </div>
            <div className={this.state.step == 3 ? "welcome-step welcome-step-3 slide-in-right" : this.state.step < 3 ? "welcome-step welcome-step-3 hidden" : "welcome-step welcome-step-3 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Projects</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <span>Add your projects</span>
              </div>
              <div className="step-projects">
                {Object.keys(this.state.projects).map((project, index) => (
                  <div key={index} className={"step-project box " + this.state.theme}>
                    <div className="step-project-name padding-left">{project}</div>
                    <div className="step-project-path">{this.state.projects[project]}</div>
                    <div className="step-project-delete icon" onClick={(e) => this.removeProject(project)}>
                      <i className="las la-times"></i>
                    </div>
                  </div>
                ))}
                <div className="step-project">
                  <div className="step-project-name">
                    <input className={"border-input input " + this.state.theme} type="text" placeholder="Project Name" value={this.state.newProjectName} onChange={(e) => this.setState({newProjectName: e.target.value.trim()})}/>
                  </div>
                  <div className="file step-project-path">
                    <div className="file-label" onClick={(e) => this.selectDirectory()}>
                      {/* <input className="file-input" type="file" onChange={(e) => this.setState({newProjectPath: e.target.value})}/> */}
                      <div className={"file-cta " + this.state.theme}>
                        <span className="file-icon">
                          <i className="las la-folder-open"></i>
                        </span>
                        <span className="file-label">
                          {this.state.newProjectPath == "" ? "Select Project Directory" : this.state.newProjectPath}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="step-project-delete" onClick={(e) => this.addProject()}>
                    <div className={"button bg-" + this.state.primaryColor}>
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="step-footer">
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 4})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 4 ? "welcome-step welcome-step-4 slide-in-right" : this.state.step < 4 ? "welcome-step welcome-step-4 hidden" : "welcome-step welcome-step-4 slide-out-left"}>
              <div className="steps-finish">
                <div>
                  <h1 className={this.state.step == 4 ? "display-1 finish-animate" : "display-1"}>All set up!!!</h1>
                </div>
                <div>
                  <i className={this.state.step == 4 ? "las la-check-circle finish-animate " + this.state.primaryColor : "las la-check-circle " + this.state.primaryColor}></i>
                </div>
                <div className={this.state.step == 4 ? "button finish-animate " + this.state.theme : "button " + this.state.theme} onClick={(e) => this.finishSetup()}>Finish</div>
              </div>
            </div>
          </div>
        </div>



        <style jsx global>{`
          @font-face {
              font-family: 'Architectural';
              src: url('./static/architectural/Architectural.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                   url('./static/architectural/Architectural.woff') format('woff'), /* Modern Browsers */
                   url('./static/architectural/Architectural.ttf') format('truetype'); /* Safari, Android, iOS */
                       font-style: normal;
              font-weight: normal;
              text-rendering: optimizeLegibility;
          }

          @font-face {
              font-family: 'Apex Mk3 ExtraLight';
              src: url('./static/Apex/apex_mk3-extralight-webfont.woff2') format('woff2'),
                   url('./static/Apex/apex_mk3-extralight-webfont.woff') format('woff');
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
