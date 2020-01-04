import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import Nav from '../components/Nav';

import "../styles/settings.sass"

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
      saveShortcut: "",
      incrementShortcut: "",

      navOpen: false,

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

        <Nav
          open={this.state.navOpen}
          page="settings"
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <div className={this.state.navOpen ? "main" : "main full"}></div>

        <style jsx global>{`

        `}</style>
        <style jsx>{`

        `}</style>
      </React.Fragment>
    );
  };
};
