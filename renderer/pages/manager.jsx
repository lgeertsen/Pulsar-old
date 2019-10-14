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
          <div></div>
          <div></div>
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
        `}</style>
        <style jsx>{`
          .main {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
