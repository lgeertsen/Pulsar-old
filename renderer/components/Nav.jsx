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
      <div className={this.props.open ? "nav" : "nav nav-compressed"}>
        <div className={this.props.open ? "nav-compressed-sidebar" : "nav-compressed-sidebar open" }>
          <div className="nav-compressed-header">
            <h1>P</h1>
          </div>
          <div className="menu-divider"></div>
          <div className="menu-collapse">
            <div className="hamburger-wrapper">
              <div className={this.props.open ? "hamburger-square cross" : "hamburger-square" } onClick={(e) => this.props.toggleNav(true)}>
                <div className="hamburger-line"></div>
                <div className="hamburger-line line-bottom"></div>
              </div>
            </div>
          </div>
          <div className="menu-divider"></div>
          <div className="nav-menu">
            <div className="nav-item icon active">
              <i className="las la-folder-open"></i>
            </div>
            <div className="nav-item icon">
              <i className="las la-cog"></i>
            </div>
          </div>
        </div>
        <div className={this.props.open ? "nav-sidebar open" : "nav-sidebar"}>
          <div className="nav-header">
            <h1>Pulsar</h1>
            <div className="menu-collapse">
              <div className="hamburger-wrapper">
                <div className={this.props.open ? "hamburger-square cross" : "hamburger-square" } onClick={(e) => this.props.toggleNav(false)}>
                  <div className="hamburger-line"></div>
                  <div className="hamburger-line line-bottom"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="menu-divider"></div>
          <div className="nav-menu">
            <div className="nav-item icon active">
              <i className="las la-folder-open"></i>
              <div className="nav-item-title">Asset Manager</div>
            </div>
            <div className="nav-item icon">
              <i className="las la-cog"></i>
              <div className="nav-item-title">Settings</div>
            </div>
          </div>
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
  };
};
