import React from 'react';
import Router from 'next/router'
import electron from 'electron';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    this.remote = electron.remote || false;

    this.minimize = this.minimize.bind(this);
    this.maximize = this.maximize.bind(this);
    this.close = this.close.bind(this);
  }

  minimize() {
    const window = this.remote.getCurrentWindow();
    window.minimize();
  }

  maximize() {
    const window = this.remote.getCurrentWindow();
    if(window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }

  close() {
    const window = this.remote.getCurrentWindow();
    window.close();
  }

  render() {

    return (
      <div className="nav">
        <div className="navigation-container">
          <div className="back-btn" onClick={() => Router.back()}>
            <i className="fas fa-angle-left"></i>
          </div>
        </div>
        <div className="nav-btns-container">
          <div id="btn-minimize" className="nav-btn" onClick={this.minimize}>
            <i className="fas fa-minus"></i>
          </div>
          <div id="btn-maximize" className="nav-btn" onClick={this.maximize}>
            <i className="far fa-square"></i>
          </div>
          <div id="btn-close" className="nav-btn" onClick={this.close}>
            <i className="fas fa-times"></i>
          </div>
        </div>

        <style jsx>{`
          div {
            width: auto;
            height: 25px;
          }
          .nav {
            width: 100%;
            height: 25px;
            background: #fff;
            display: flex;
            border-bottom: 1px solid #ededed;
            -webkit-app-region: drag;
            box-shadow: 0 2px 0 0 #f5f5f5;
          }
          .navigation-container {
            flex: 1;
            -webkit-app-region: drag;
          }
          .nav-btns-container {
            display: flex;
            flex-direction: row;
          }
          .nav-btn,
          .back-btn {
            -webkit-app-region: no-drag;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 25px;
            background: #fff;
            color: #cecece;
            border-left: 1px solid #cecece;
            transition: all ease 0.2s;
          }
          .back-btn {
            border: none;
            border-right: 1px solid #cecece;
          }
          .nav-btn:hover,
          .back-btn:hover {
            color: #999;
          }
        `}</style>
      </div>
    );
  };
};
