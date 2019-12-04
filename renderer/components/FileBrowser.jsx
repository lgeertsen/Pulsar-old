import React, { useState } from 'react';

const FileBrowser = ({ theme, primaryColor, title, files, onChange }) => {

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
            <div className="fileTag tagHeader">
              <span>Tags</span>
            </div>
            <div className="fileModified modifiedHeader">
              <span>Date Modified</span>
            </div>
            <div className="fileSize sizeHeader">
              <span>Size</span>
            </div>
          </div>
          {files.sort((a, b) => {
            let name_a = a.name.toLowerCase()
            let name_b = b.name.toLowerCase()
            if(name_a < name_b) { return -1; }
            if(name_a > name_b) { return 1; }
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
              <div className="fileTag">
                {file.tags.map((tag, index) => (
                  <div key={index} className={"tag tag_" + tag.toLowerCase()}>
                    <span>{tag}</span>
                  </div>
                ))}
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
            background: ${theme.transparentBg};
            border-radius: 6px;
            border: ${theme.border};
          }
          .fileBrowserTitle {
            height: 25px;
            background: ${theme.accentBg};
            border-bottom: ${theme.border};
          }
          .fileBrowserTitle h4 {
            margin-left: 10px;
          }
          .fileBrowserInner {
            overflow-x: auto;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          .file {
            display: flex;
            flex-direction: row;
            // min-height: 20px;
            height: auto;
            border-bottom: ${theme.accentBorder};
            color: ${theme.text};
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .file:hover {
            background: ${theme.secondaryBg};
          }
          .file.selected {
            background: ${theme[primaryColor]};
            color: ${theme.white};
          }
          .file.fileHeader {
            background: ${theme.secondaryBg};
            cursor: default;
          }
          .file > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            border-right: ${theme.border};
            margin-left: 5px;
          }
          .file span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          .fileName {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .fileName i {
            margin: 3px 5px;
          }
          .file .fileTag {
            width: 100px;
            overflow: hidden;
            flex-direction: column;
          }
          .fileModified {
            width: 130px;
          }
          .fileSize {
            width: 50px;
          }
          .tag {
            width: auto;
            height: auto;
            padding: 3px 5px;
            border-radius: 3px;
            background: #888;
            color: #fff;
            font-size: 14px;
            margin: 2px 0;
          }
          .tag.tag_done {
            background: ${theme.orange};
          }
          .tag.tag_wip {
            background: ${theme.yellow};
          }
          .tag.tag_wfa {
            background: ${theme.blue};
          }
          .tag.tag_retake {
            background: ${theme.red};
          }
          .tag.tag_valid {
            background: ${theme.green};
          }
          .tag.tag_todo {
            background: ${theme.purple};
          }
        `}</style>
      </div>
    );
};

export default FileBrowser;
