import electron from 'electron';
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Nav from '../components/Nav'

const ipcRenderer = electron.ipcRenderer || false;

export default class Home extends React.Component {
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
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          <link href="./static/fontawesome/css/all.css" rel="stylesheet"/>
        </Head>

        <Nav/>

        <div className="main">
          <div className="container">
            <div className="titleContainer">
              <h1 className="title"><span>Pulsar</span></h1>
            </div>
            <div className="menuContainer">
              <div className="menu">
                <Link href="/manager">
                  <div className="menuLink">
                    <h1>File Manager</h1>
                  </div>
                </Link>
                <Link href="/graph">
                  <div className="menuLink">
                    <h1>Graph Editor</h1>
                  </div>
                </Link>
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
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .main .container {
            min-width: 800px;
            min-height: 600px;
            width: 80%;
            height: 80%;
            display: flex;
            flex-direction: column;
          }
          .main .container > div {
            width: auto;
            height: auto;
          }
          .titleContainer {
            text-align: center;
            padding: 50px;
          }
          .title {
            font-size: 9rem;
          }
          .title span {
            position: relative;
          }
          .title span::after {
            content: " ";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(to right, #3494e6, #ec6ead);
          }
          .menuContainer {
            flex: 1;
          }
          .menu {
            display: flex;
            flex-direction: row;
            justify-content: center;
          }
          .menuLink {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 200px;
            height: 200px;
            margin: 25px;
            border: 1px solid #e3e3e3;
            border-radius: 6px;
            background: #fff;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .menuLink:hover {
            box-shadow: 0 3px 10px 4px rgba(0,0,0,0.04);
          }
        `}</style>
      </React.Fragment>
    );
  };
};
