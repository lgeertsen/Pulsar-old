import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: {
        type: "shots",
        sequence: "S10",
        shot: "SH350",
        task: "fx",
        subtask: "pyro",
        version: "v001"
      }
    }
  }

  render() {
    return (
      <div className="searchBar">
        <div className="searchBarType">
          <div className="typeText">
            <span>Path:</span>
          </div>
          <div className="iconSwitch">
            <i className="fas fa-sync"></i>
          </div>
        </div>
        <div className="searchBarInner">
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.type}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.sequence}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.shot}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.task}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.subtask}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
          </div>
          <div className="input">
            <span>{this.state.sid.version}</span>
          </div>
          <div className="slashIcon">
            <span>/</span>
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
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }
          .searchBarType {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 60px;
            padding-left: 5px;
            background: #f2f2f2;
            border-right: 1px solid #e3e3e3;
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
            color: #444F60;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .searchBarType:hover {
            background: #f2f2f2;
          }
          .searchBarInner {
            display: flex;
            flex-direction: row;
          }
          span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            color: #444F60;
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
            background: #f2f2f2;
            font-weight: bold;
          }
          .copy {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 25px;
            color: #444F60;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .copy:hover {
            background: #f2f2f2;
          }
        `}</style>
      </div>
    );
  };
};
