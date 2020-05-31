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

const matchProjectPath = /{project}((\/[\w]+)*(\/{[\w]+})*)*(\/{state}_{version})?\/{file}/;

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
      softwares: {
        houdini: {
          selected: false,
          exe: {
            "houdinifx": {
              path: "",
              default: "C:/Program Files/Side Effects Software/Houdini X.Y.ZZZ/bin/houdinifx.exe"
            },
            "hython": {
              path: "",
              default: "C:/Program Files/Side Effects Software/Houdini X.Y.ZZZ/bin/hython.exe"
            }
          }
        },
        "maya": {
          selected: false,
          exe: {
            "maya": {
              path: "",
              default: "C:/Program Files/Autodesk/MayaXXXX/bin/maya.exe"
            },
            "mayapy": {
              path: "",
              default: "C:/Program Files/Autodesk/Maya2018/bin/mayapy.exe"
            }
          }
        },
        "nuke": {
          selected: false,
          exe: {
            "nuke": {
              path: "",
              default: "C:/Program Files/NukeXX.YvZ/bin/NukeXX.Y.exe"
            }
          }
        }
      },

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

      ipcRenderer.on('selectedSoftwarePath', (event, data) => {
        let softs = this.state.softwares;
        softs[data.software].exe[data.exe].path = data.path;
        this.setState({softwares: softs});
      });

      ipcRenderer.on('configSet', (event, data) => {
        Router.push('/manager')
      });
    }
  }

  selectDirectory() {
    ipcRenderer.send('selectDirectory');
  }

  selectSoftwarePath(software, exe) {
    ipcRenderer.send('selectSoftwarePath', {software: software, exe: exe});
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

  selectSoft(soft) {
    let softs = this.state.softwares;
    softs[soft].selected = !softs[soft].selected;
    this.setState({softwares: softs});
  }

  finishSetup() {
    let theme = this.state.theme;
    let color = this.state.primaryColor;
    let projects = this.state.projects;
    let softs = this.state.softwares;
    let softwares = {};
    for(let soft in softs) {
      if(softs[soft].selected) {
        for(let exe in softs[soft].exe) {
          softwares[exe] = softs[soft].exe[exe].path
        }
      }
    }
    let data = {
      "color": color,
      "firstUsage": false,
      "projects": projects,
      "theme": theme,
      "softwares": softwares
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
          <link href="line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <div className={this.state.navOpen ? `main main-start ${this.state.theme} main-${this.state.primaryColor}` : `main main-start full ${this.state.theme} main-${this.state.primaryColor}`}>
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
                <div className="flex-fill"></div>
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
                <div className={"step-previous button " + this.state.theme} onClick={(e) => this.setState({step: 1})}>Back</div>
                <div className="flex-fill"></div>
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 3})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 3 ? "welcome-step welcome-step-3 slide-in-right" : this.state.step < 3 ? "welcome-step welcome-step-3 hidden" : "welcome-step welcome-step-3 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Projects PART I</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <h5>Projects:</h5>
              </div>
              <div className="step-projects">
                {Object.keys(this.state.projects).length > 0 ? Object.keys(this.state.projects).map((project, index) => (
                  <div key={index} className={"step-project box " + this.state.theme}>
                    <div className="step-project-name padding-left">{project}</div>
                    <div className="step-project-path">{this.state.projects[project]}</div>
                    <div className="step-project-delete icon" onClick={(e) => this.removeProject(project)}>
                      <i className="las la-times"></i>
                    </div>
                  </div>
                )) : <h6 className="step-project-empty">No Projects added</h6>}
                <span>Add project</span>
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
                        <div className={this.state.newProjectPath == "" ? "file-label-inner empty" : "file-label-inner"}>
                          {this.state.newProjectPath == "" ? "Select Project Directory" : this.state.newProjectPath}
                        </div>
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
                <div className={"step-previous button " + this.state.theme} onClick={(e) => this.setState({step: 2})}>Back</div>
                <div className="flex-fill"></div>
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 4})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 4 ? "welcome-step welcome-step-4 slide-in-right" : this.state.step < 4 ? "welcome-step welcome-step-4 hidden" : "welcome-step welcome-step-4 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Projects PART II</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <h5>Projects:</h5>
              </div>
              <div className="step-projects">
                {/* {Object.keys(this.state.projects).length > 0 ? Object.keys(this.state.projects).map((project, index) => (
                  <div key={index} className={"step-project box " + this.state.theme}>
                    <div className="step-project-name padding-left">{project}</div>
                    <div className="step-project-path">{this.state.projects[project]}</div>
                    <div className="step-project-delete icon" onClick={(e) => this.removeProject(project)}>
                      <i className="las la-times"></i>
                    </div>
                  </div>
                )) : <h6 className="step-project-empty">No Projects added</h6>}
                <span>Add project</span>
                <div className="step-project">
                  <div className="step-project-name">
                    <input className={"border-input input " + this.state.theme} type="text" placeholder="Project Name" value={this.state.newProjectName} onChange={(e) => this.setState({newProjectName: e.target.value.trim()})}/>
                  </div>
                  <div className="file step-project-path">
                    <div className="file-label" onClick={(e) => this.selectDirectory()}>
                      <div className={"file-cta " + this.state.theme}>
                        <span className="file-icon">
                          <i className="las la-folder-open"></i>
                        </span>
                        <div className={this.state.newProjectPath == "" ? "file-label-inner empty" : "file-label-inner"}>
                          {this.state.newProjectPath == "" ? "Select Project Directory" : this.state.newProjectPath}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="step-project-delete" onClick={(e) => this.addProject()}>
                    <div className={"button bg-" + this.state.primaryColor}>
                      <i className="las la-plus"></i>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="step-footer">
                <div className={"step-previous button " + this.state.theme} onClick={(e) => this.setState({step: 3})}>Back</div>
                <div className="flex-fill"></div>
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 5})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 5 ? "welcome-step welcome-step-5 slide-in-right" : this.state.step < 5 ? "welcome-step welcome-step-5 hidden" : "welcome-step welcome-step-5 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Software configuration PART I</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <span>Select the softwares you use</span>
              </div>
              <div className="step-software-select">
                {Object.keys(this.state.softwares).map((soft, index) => (
                  <div key={index} className={"software-square " + this.state.theme} onClick={e => this.selectSoft(soft)}>
                    <img src={`softwareLogos/${soft}.png`}></img>
                    <div className={this.state.softwares[soft].selected ? "software-overlay selected" : "software-overlay"}>{soft}</div>
                    <div className={this.state.softwares[soft].selected ? `selected-overlay ${this.state.primaryColor}` : "selected-overlay hidden"}>
                      <i className="las la-check"></i>
                    </div>
                  </div>
                ))}
              </div>
              <div className="step-footer">
                <div className={"step-previous button " + this.state.theme} onClick={(e) => this.setState({step: 4})}>Back</div>
                <div className="flex-fill"></div>
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 6})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 6 ? "welcome-step welcome-step-6 slide-in-right" : this.state.step < 6 ? "welcome-step welcome-step-6 hidden" : "welcome-step welcome-step-6 slide-out-left"}>
              <div className="step-title">
                <h1 className="display-2">Software configuration PART II</h1>
                <div className={"step-divider border-" + this.state.primaryColor}></div>
                <span>Select the paths to the software executables</span>
              </div>
              <div className="step-software">
                {Object.keys(this.state.softwares).map((soft, index) => (
                  <div className={this.state.softwares[soft].selected == true ? "software-setup" : "hidden"}>
                    <hr/>
                    {this.state.softwares[soft].selected ?
                      <div key={index} className="software-setup-main">
                        <div className="software-setup-header">
                          <img src={`softwareLogos/${soft}.png`}></img>
                          <h3 className="display-3 sub-display">{soft}</h3>
                        </div>
                        <div className="software-paths">
                          {Object.keys(this.state.softwares[soft].exe).map((exe, ind) => (
                            <div key={ind}>
                              <div className="step-project">
                                <div className="step-project-name">
                                  <div className={"border-input input " + this.state.theme}>{exe}.exe</div>
                                </div>
                                <div className="file step-project-path">
                                  <div className="file-label" onClick={(e) => this.selectSoftwarePath(soft, exe)}>
                                    {/* <input className="file-input" type="file" onChange={(e) => this.setState({newProjectPath: e.target.value})}/> */}
                                    <div className={"file-cta " + this.state.theme}>
                                      <span className="file-icon">
                                        <i className="las la-folder-open"></i>
                                      </span>
                                      <div className={this.state.softwares[soft].exe[exe].path == "" ? "file-label-inner empty" : "file-label-inner"}>
                                        {this.state.softwares[soft].exe[exe].path == "" ? "Select Software Path" : this.state.softwares[soft].exe[exe].path}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <h6 className="step-software-small-caption">Default install location: {this.state.softwares[soft].exe[exe].default}</h6>
                            </div>
                          ))}
                        </div>
                      </div>
                      : ""
                    }
                  </div>
                ))}

              </div>
              <div className="step-footer">
                <div className={"step-previous button " + this.state.theme} onClick={(e) => this.setState({step: 5})}>Back</div>
                <div className="flex-fill"></div>
                <div className={"step-next button " + this.state.theme} onClick={(e) => this.setState({step: 7})}>Next</div>
              </div>
            </div>

            <div className={this.state.step == 7 ? "welcome-step welcome-step-7 slide-in-right" : this.state.step < 7 ? "welcome-step welcome-step-7 hidden" : "welcome-step welcome-step-7 slide-out-left"}>
              <div className="steps-finish">
                <div>
                  <h1 className={this.state.step == 7 ? "display-1 finish-animate" : "display-1"}>All set up!!!</h1>
                </div>
                <div>
                  <i className={this.state.step == 7 ? "las la-check-circle finish-animate " + this.state.primaryColor : "las la-check-circle " + this.state.primaryColor}></i>
                </div>
                <div className={this.state.step == 7 ? "button finish-animate " + this.state.theme : "button " + this.state.theme} onClick={(e) => this.finishSetup()}>Finish</div>
              </div>
            </div>
          </div>
        </div>



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
