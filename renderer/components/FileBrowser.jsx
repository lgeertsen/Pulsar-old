import React, { useState } from 'react';

const FileBrowser = ({ title, files, onChange }) => {

  const [selectedFile, setSelectedFile] = useState(-1);

  const handleChange = index => {
    onChange(index);
    setSelectedFile(index);
  };

  const getSize = bytes => {
    let suffixes =  ["B", "KB", "MB", "GB", "TB"];
    let counter = 0;
    while (Math.round(bytes / 1024) >= 1) {
      bytes = bytes / 1024;
      counter++;
    }
    bytes = Math.round(bytes);
    return bytes.toString() + suffixes[counter];
  }

    return (
      <div className="fileBrowser">
        <div className="fileBrowserTitle">
          <h4>{title}</h4>
        </div>
        <div className="fileBrowserInner">
          <div className="fileHeader file">
            <div className="fileName nameHeader">
              <span>Name</span>
            </div>
            <div className="fileModified modifiedHeader">
              <span>Date Modified</span>
            </div>
            <div className="fileSize sizeHeader">
              <span>Size</span>
            </div>
          </div>
          {files.sort((a, b) => {
            if(a.version < b.version) { return -1; }
            if(a.version > b.version) { return 1; }
            if(a.state < b.state) { return 1; }
            if(a.state > b.state) { return -1; }
            return 0;
          }).map((file, index) => (
            <div key={index} className={index == selectedFile ? "file selected" : "file"} onClick={(e) => handleChange(index)}>
              <div className="fileName">
                <i className="fas fa-file"></i>
                <span>{file.name + "_" + file.state + "_" + file.version + "." + file.extension}</span>
              </div>
              <div className="fileModified">
                <span>{file.modified}</span>
              </div>
              <div className="fileSize">
                <span>{getSize(file.size)}</span>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .fileBrowser {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }
          .fileBrowserTitle {
            height: 25px;
            background: #f2f2f2;
          }
          .fileBrowserTitle h4 {
            margin-left: 10px;
          }
          .fileBrowserInner {
            overflow-x: auto;
            overflow-y: scroll;
            display: flex;
            flex-direction: column;
          }
          .file {
            display: flex;
            flex-direction: row;
            height: 20px;
            border-bottom: 1px solid #f2f2f2;
            color: #444F60;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .file:hover {
            background: #f2f2f2;
          }
          .file.selected {
            background: #f2f244;
          }
          .file.fileHeader {
            background: #f9f9f9;
            cursor: default;
          }
          .file > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-right: 1px solid #e3e3e3;
            margin-left: 5px;
          }
          .file span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          .fileName {
            flex: 6;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .fileName i {
            margin: 3px 5px;
          }
          .fileModified {
            flex: 3;
          }
          .fileSize {
            flex: 2;
          }
        `}</style>
      </div>
    );
};

export default FileBrowser;
