import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.props = {

    }
  }

  render() {
    return (
      <div className="searchBar">
        <div className="searchBarType">
          <div className="typeText">
            <span>SID:</span>
          </div>
          <div className="iconSwitch">
            <i className="fas fa-sync"></i>
          </div>
        </div>
        <div className="searchBarInner">
          <div className="input">
            <span>{this.props.sid.project}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.assetShot}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.type}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.name}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.task}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.subtask}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.state}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.version}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.fileName}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.props.sid.ext}</span>
          </div>
        </div>

        <div className="copy">
          <i className="far fa-copy"></i>
        </div>

        <style jsx>{`
          .searchBar {
            display: flex;
            flex-direction: row;
            flex: 1;
            height: 25px;
            background: ${this.props.theme.background};
            border-radius: 6px;
            border: ${this.props.theme.border};
          }
          .searchBarType {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 60px;
            padding-left: 5px;
            background: ${this.props.theme.secondaryBg};
            border-right: ${this.props.theme.border};
          }
          .typeText {
            flex: 1;
          }
          .searchBarType .iconSwitch {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 25px;
            font-size: 14px;
            color: ${this.props.theme.text};
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .searchBarType:hover {
            background: ${this.props.theme.secondaryBg};
          }
          .searchBarInner {
            display: flex;
            flex-direction: row;
          }
          span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            color: ${this.props.theme.text};
          }
          .input {
            width: auto;
            margin: 0 5px;
          }
          .slashIcon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 15px;
            background: ${this.props.theme.secondaryBg};
            font-weight: bold;
          }
          .copy {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 25px;
            color: ${this.props.theme.text};
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .copy:hover {
            background: ${this.props.theme.secondaryBg};
          }
        `}</style>
      </div>
    );
  };
};
