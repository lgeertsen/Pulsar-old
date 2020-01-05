import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Nav from '../components/Nav';

import "../styles/welcome.sass"

const ipcRenderer = electron.ipcRenderer || false;

export default class Welcome extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {},
      theme: "light",
      primaryColor: "blue",
      saveShortcut: "",
      incrementShortcut: "",

      navOpen: false,

      step: 0
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
    }
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

        <div className={this.state.navOpen ? "main theme-" + this.state.theme : "main full theme-" + this.state.theme}>
          <div className="box welcome-box">
            <div className={this.state.step == 0 ? "welcome-step welcome-step-0" : "welcome-step welcome-step-0 slide-out-left"}>
              <div className="welcome-title-container">
                <h1 className="welcome-top-title display-4 sub-display">Welcome To</h1>
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
                <span>Select the theme you would like to use for Pulsar</span>
              </div>
              <div className="step-themes">
                <div className="step-theme">
                  <div className="step-theme-preview step-theme-light"></div>
                  <div>Light</div>
                </div>
                <div className="step-theme">
                  <div className="step-theme-preview step-theme-dark"></div>
                  <div>Dark</div>
                </div>
              </div>
              <div className="step-footer">
                <div className="step-next button" onClick={(e) => this.setState({theme: this.state.theme == "light" ? "dark" : "light"})}>Next</div>
              </div>
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
