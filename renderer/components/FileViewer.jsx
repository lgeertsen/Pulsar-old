import React, { useState } from 'react';

const FileViewer = ({ file, execTask }) => {

  // const [selectedFile, setSelectedFile] = useState(-1);

  const handleClick = command => {
    execTask(command)
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
            <div className="fileInfoContainer">
              <div className="fileInfo">
                <h3>{file.name + "_" + file.state + "_" + file.version + "." + file.extension}</h3>
                <span></span>
              </div>

              <div className="commandsContainer">
                <div className="btn" onClick={(e) => handleClick("open_file")}>
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
                {file.state == "work" ?
                  <div className="btn">
                    <span>Publish</span>
                  </div>
                  : ""
                }
                {file.state == "publish" ?
                  <div className="btn">
                    <span>Release</span>
                  </div>
                  : ""
                }
                {file.state == "work" ?
                  <div className="btn">
                    <span>Publish & Release</span>
                  </div>
                  : ""
                }
                <div className="btn">
                  <span>Close</span>
                </div>
              </div>
            </div>
            <div className="fileComment">
              <h3>Comment</h3>
              <div></div>
            </div>
            <div className="fileScreenshot">
              <h3>Screenshot</h3>
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
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 100%;
            margin: 15px 25px;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }

          .fileInfoContainer {
            width: 400px;
            display: flex;
            flex-direction: row;
            padding-top: 10px;
            margin: 0 15px;
            border-right: 1px solid #f2f2f2;
          }
          .fileInfo {
            flex: 1;
          }
          .fileComment {
            width: 350px;
            padding-top: 10px;
            margin-right: 15px;
            border-right: 1px solid #f2f2f2;
          }
          .fileScreenshot {
            flex: 1;
            padding-top: 10px;
            margin-right: 15px;
          }



          .commandsContainer {
            width: auto;
            display: flex;
            flex-direction: column;
            // flex-wrap: wrap;
          }
          .btn {
            display: flex;
            align-items: center;
            width: 100px;
            height: 25px;
            margin: 5px;
            padding: 2px 5px;
            border-radius: 6px;
            font-size: 14px;
            background: #fff;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border:  1px solid #e3e3e3;
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn:hover {
            background: #f2f2f2;
          }
        `}</style>
      </div>
    );
};

export default FileViewer;
