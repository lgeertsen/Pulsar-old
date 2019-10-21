import React, { useState } from 'react';

const FileViewer = ({ file }) => {

  // const [selectedFile, setSelectedFile] = useState(-1);

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
      <div className="fileViewer">
        <div className="fileContainer">
          <div className="fileContainerInner">
            <div>
              <h4>{file.name + "_" + file.state + "_" + file.version + "." + file.extension}</h4>
            </div>

            <div className="commandContainer">
              <div className="btn">
                <span>Open</span>
              </div>
              <div className="btn">
                <span>Open As</span>
              </div>
              <div className="btn">
                <span>Save</span>
              </div>
              <div className="btn">
                <span>Save As</span>
              </div>
              <div className="btn">
                <span>Publish</span>
              </div>
              <div className="btn">
                <span>Release</span>
              </div>
              <div className="btn">
                <span>Publish & Release</span>
              </div>
              <div className="btn">
                <span>Close</span>
              </div>
              <div className="btn">
                <span>Screenshot</span>
              </div>
            </div>
          </div>
        </div>


        <style jsx>{`
          .fileViewer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .fileContainer {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .fileContainerInner {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            margin: 15px 25px;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }




          .commandContainer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 60px;
          }
          .commandContainer .btn {
            display: flex;
            align-items: center;
            width: auto;
            height: 25px;
            margin: 0 0.5%;
            padding: 5px 10px;
            border-radius: 6px;
            background: #fff;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border:  1px solid #e3e3e3;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
};

export default FileViewer;
