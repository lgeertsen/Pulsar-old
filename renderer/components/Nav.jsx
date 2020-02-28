import React from 'react';
import Router from 'next/router'
import electron from 'electron';

export default class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
      <div className={this.props.open ? "nav" : "nav nav-compressed"}>
        <div className={this.props.open ? "nav-compressed-sidebar "  + this.props.theme : "nav-compressed-sidebar open " + this.props.theme }>
          <div className="nav-compressed-header">
            <h1>P</h1>
          </div>
          <div className="menu-divider"></div>
          <div className="menu-collapse">
            <div className="hamburger-wrapper">
              <div className={this.props.open ? "hamburger-square cross" : "hamburger-square" } onClick={(e) => this.props.toggleNav(true)}>
                <div className={"hamburger-line " + this.props.theme}></div>
                <div className={"hamburger-line line-bottom " + this.props.theme}></div>
              </div>
            </div>
          </div>
          <div className="menu-divider"></div>
          <div className="nav-menu">
            <div className={this.props.page == "manager" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/manager')}>
              <i className="las la-folder-open"></i>
            </div>
            {/* <div className={this.props.page == "graph" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/graph')}>
              <i className="las la-project-diagram"></i>
            </div> */}
            {/* <div className={this.props.page == "farm" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor}>
              <i className="las la-tractor"></i>
            </div> */}
            {/* <div className={this.props.page == "vyewer" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor}>
              <i className="las la-photo-video"></i>
            </div> */}
            <div className={this.props.page == "settings" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/settings')}>
              <i className="las la-cog"></i>
            </div>
          </div>
        </div>
        <div className={this.props.open ? "nav-sidebar open "  + this.props.theme : "nav-sidebar "  + this.props.theme}>
          <div className="nav-header">
            <h1>Pulsar</h1>
            <div className="menu-collapse">
              <div className="hamburger-wrapper">
                <div className={this.props.open ? "hamburger-square cross" : "hamburger-square" } onClick={(e) => this.props.toggleNav(false)}>
                  <div className={"hamburger-line " + this.props.theme}></div>
                  <div className={"hamburger-line line-bottom " + this.props.theme}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="menu-divider"></div>
          <div className="nav-menu">
            <div className={this.props.page == "manager" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/manager')}>
              <i className="las la-folder-open"></i>
              <div className="nav-item-title">Asset Manager</div>
            </div>
            {/* <div className={this.props.page == "graph" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/graph')}>
              <i className="las la-project-diagram"></i>
              <div className="nav-item-title">Graph Editor</div>
            </div> */}
            {/* <div className={this.props.page == "farm" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor}>
              <i className="las la-tractor"></i>
              <div className="nav-item-title">Render Farm</div>
            </div> */}
            {/* <div className={this.props.page == "vyewer" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor}>
              <i className="las la-photo-video"></i>
              <div className="nav-item-title">Vyewer</div>
            </div> */}
            <div className={this.props.page == "settings" ? "nav-item icon active " + this.props.primaryColor : "nav-item icon hover-" + this.props.primaryColor} onClick={() => Router.push('/settings')}>
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
