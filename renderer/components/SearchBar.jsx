import React from 'react';

export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.props = {

    }
  }

  render() {
    return (
      <div className={"search-bar " + this.props.theme}>
        <div className={"search-bar-type " + this.props.theme}>
          <div className="search-bar-type-text">
            <span>ID:</span>
          </div>
          <div className="icon-switch icon">
            <i className="las la-sync"></i>
          </div>
        </div>
        <div className="search-bar-inner">
          <div className="search-bar-input">
            <span>{this.props.assetId.project}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.pathType}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.group}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.name}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.task}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.subtask}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.file.state}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.file.version}</span>
          </div>
          <div className={"search-bar-slash " + this.props.theme}>
            <span>/</span>
          </div>
          <div className="search-bar-input">
            <span>{this.props.assetId.file ? `${this.props.assetId.file.name}.${this.props.assetId.file.extension}` : ""}</span>
          </div>
        </div>

        <div className={"search-bar-copy icon " + this.props.theme}>
          <i className="las la-copy"></i>
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
  };
};
