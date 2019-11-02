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
        <div className="settings-btn" onClick={() => this.props.openSettings()}>
          <span>Settings</span>
          <i className="fas fa-cog"></i>
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
            background: ${this.props.theme.background};
            display: flex;
            border-bottom: ${this.props.theme.border};
            -webkit-app-region: drag;
            box-shadow: 0 2px 0 0 ${this.props.theme.secondaryBg};
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
          .back-btn,
          .settings-btn {
            -webkit-app-region: no-drag;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 25px;
            background: ${this.props.theme.background};
            color: ${this.props.theme.text};
            border-left: ${this.props.theme.border};
            transition: all ease 0.2s;
            cursor: pointer;
          }
          .back-btn {
            border: none;
            border-right: ${this.props.theme.border};
          }
          .settings-btn {
            width: auto;
            margin-right: 50px;
            padding: 0 10px;
            border-right: ${this.props.theme.border};
          }
          .settings-btn span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            margin-right: 10px;
            margin-bottom: 2px;
          }
          .nav-btn:hover,
          .back-btn:hover,
          .settings-btn:hover {
            color: ${this.props.theme.textSecondary};
          }
        `}</style>
      </div>
    );
  };
};
