import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Nav from '../components/Nav';

import "../styles/settings.sass"

const ipcRenderer = electron.ipcRenderer || false;

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

export default class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      theme: "light-theme",
      primaryColor: "green",
      saveShortcut: "",
      incrementShortcut: "",

      navOpen: false,

      selectedTab: 0,

      projects: {},

      newProjectName: "",
      newProjectPath: "",

      tabs: [
        {
          "title": "Projects",
          "icon" : "la-archive",
        },
        {
          "title": "Theme",
          "icon": "la-palette",
        },
        {
          "title": "Overlay",
          "icon": "la-window-restore",
        }
      ]
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
          this.setState({theme: data.theme});
        }
        if(data.color) {
          console.log(data.color);
          this.setState({primaryColor: data.color});
        }
        if(data.overlay.save) {
          this.setState({saveShortcut: data.overlay.save})
        }
        if(data.overlay.increment) {
          this.setState({incrementShortcut: data.overlay.increment})
        }
        if(data.projects) {
          this.setState({projects: data.projects})
        }
      });

      ipcRenderer.on('selectedDirectory', (event, data) => {
        this.setState({newProjectPath: data});
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
      let data = {
        "projects": projects,
      };
      ipcRenderer.send('setConfig', data);
    }
  }

  removeProject(project) {
    let projects = this.state.projects;
    delete projects[project];

    let data = {
      "projects": projects,
    };
    ipcRenderer.send('setConfig', data);

    this.setState({projects: projects});
  }

  setTheme(newTheme) {
    let theme = this.state.theme;
    theme = newTheme;

    let data = {
      "theme": theme,
    };
    ipcRenderer.send('setConfig', data);

    this.setState({theme: theme});
  }

  setColor(color) {
    let primaryColor = this.state.primaryColor;
    primaryColor = color;

    let data = {
      "color": primaryColor,
    };
    ipcRenderer.send('setConfig', data);

    this.setState({primaryColor: primaryColor});
  }

  renderProjectTab() {
    return (
      <div>
        <div className={"settings-title"}>
          <h1 className="display-4">Projects</h1>
        </div>
        <div className="settings-option settings-projects">
          {Object.keys(this.state.projects).map((project, index) => (
            <div key={index} className={"settings-project box " + this.state.theme}>
              <div className="settings-project-name padding-left">{project}</div>
              <div className="settings-project-path">{this.state.projects[project]}</div>
              <div className="settings-project-delete icon" onClick={(e) => this.removeProject(project)}>
                <i className="las la-times"></i>
              </div>
            </div>
          ))}
          <div className="settings-project">
            <div className="settings-project-name">
              <input className="input" type="text" placeholder="Project Name" value={this.state.newProjectName} onChange={(e) => this.setState({newProjectName: e.target.value.trim()})}/>
            </div>
            <div className="file settings-project-path">
              <div className="file-label" onClick={(e) => this.selectDirectory()}>
                {/* <input className="file-input" type="file" onChange={(e) => this.setState({newProjectPath: e.target.value})}/> */}
                <div className="file-cta">
                  <span className="file-icon">
                    <i className="las la-folder-open"></i>
                  </span>
                  <span className="file-label">
                    {this.state.newProjectPath == "" ? "Select Project Directory" : this.state.newProjectPath}
                  </span>
                </div>
              </div>
            </div>
            <div className="settings-project-delete" onClick={(e) => this.addProject()}>
              <div className={"button bg-" + this.state.primaryColor}>
                <i className="las la-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderThemeTab() {
    return (
      <div>
        <div className={"settings-title"}>
          <h1 className="display-4">Theme</h1>
        </div>
        <div className="settings-option">
          <div className="settings-option-title">
            <div className="display-6 sub-display">Theme</div>
          </div>
          <div className="settings-option-choices">
            <div className={"settings-theme " + this.state.theme} onClick={(e) => this.setTheme("theme-light")}>
              <div className="theme-light bg-main">
                <div className="settings-theme-box box theme-light">
                  <h1 className="display-4 sub-display">Light</h1>
                </div>
              </div>
            </div>
            <div className={"settings-theme " + this.state.theme} onClick={(e) => this.setTheme("theme-dark")}>
              <div className="theme-dark bg-main">
                <div className="settings-theme-box box theme-dark">
                  <h1 className="display-4 sub-display">Dark</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="settings-option">
          <div className="settings-option-title">
            <div className="display-6 sub-display">Color</div>
          </div>
          <div className="settings-option-choices">
            {colors.map((color, index) => (
              <div key={index} className={this.state.primaryColor == color ? "settings-color-bullet bg-" + color : "settings-color-bullet bg-" + color + " border-" + color} onClick={(e) => this.setColor(color)}></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  renderOverlayTab() {
    return (
      <div className="settings-main-inner">

      </div>
    );
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

        <Nav
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          open={this.state.navOpen}
          page="settings"
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <div className={this.state.navOpen ? "main " + this.state.theme : "main full " + this.state.theme}>
          <div className="settings-page-title">
            <h1 className="display-1">Settings</h1>
          </div>
          <div className="settings-container">
            <div className="settings-sidebar">
              <div className="nav-menu">
                {this.state.tabs.map((tab, index) => (
                  <div key={index} className={this.state.selectedTab == index ? "nav-item icon " + this.state.primaryColor : "nav-item icon hover-" + this.state.primaryColor} onClick={(e) => this.setState({selectedTab: index})}>
                    <i className={"las " + tab.icon}></i>
                    <div className="nav-item-title">{tab.title}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="settings-main">
              {this.state.selectedTab == 0 ? this.renderProjectTab() : this.state.selectedTab == 1 ? this.renderThemeTab() : this.renderOverlayTab()}
            </div>
          </div>
        </div>



        <style jsx global>{`

        `}</style>
        <style jsx>{`

        `}</style>
      </React.Fragment>
    );
  };
};
