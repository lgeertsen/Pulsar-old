import electron from 'electron';
import React from 'react';
import Head from 'next/head';

const ipcRenderer = electron.ipcRenderer || false;
const remote = electron.remote || false;

export default class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    }
  }

  componentDidMount() {

  }

  toggle() {
    let open = this.state.open;
    this.setState({open: !open});
  }

  render() {

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <div className="main">
          <div className="dragbar">
            <i className="fas fa-ellipsis-v"></i>
          </div>
          <div className={this.state.open ? "container open" : "container"}>

          </div>
          <div className="resize" onClick={(e) => this.toggle()}>
            <i className={this.state.open ? "fas fa-caret-left" : "fas fa-caret-right"}></i>
          </div>
        </div>


        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
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
            display: flex;
            flex-direction: row;
            align-items: center;
            // justify-content: center;
          }
          .dragbar {
            width: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #444;
            color: #aaa;
            font-size: 24px;
            border-right: 1px solid #f4f6fb;
            -webkit-app-region: drag;
          }
          .resize {
            width: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #444;
            color: #aaa;
            font-size: 24px;
            cursor: pointer;
          }
          .container {
            width: 0px;
            background: #f4f6fb;
            transition: all ease 0.5s;
          }
          .container.open {
            width: 220px;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
