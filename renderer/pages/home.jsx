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
                    <h1>Asset Manager</h1>
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
            background: #fff;
          }
          * {
            margin: 0;
          }
          p, h1, h2, h3, h4, h5, h6 {
            font-family: "Oswald", sans-serif;
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
            border: 1px solid #777;
            border-radius: 3px;
            background: #fff;
            cursor: pointer;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
            transition: all ease 0.2s;
          }
          .menuLink:hover {
            box-shadow: 0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);
          }
        `}</style>
      </React.Fragment>
    );
  };
};
