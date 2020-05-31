import React, { useState } from 'react';

const SequenceBrowser = ({ theme, primaryColor, title, files, onChange, groups }) => {

  const [selectedFile, setSelectedFile] = useState(-1);
  const [sortType, setSortType] = useState("version");
  const [sortDirection, setSortDirection] = useState(true);

  const handleChange = (index, path) => {
    onChange(path);
    setSelectedFile(index);
  };

  const changeSort = type => {
    if(type == sortType) {
      let dir = sortDirection;
      setSortDirection(!dir);
    } else {
      setSortType(type);
      setSortDirection(true);
    }
  }

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
      <div className={"card file-browser " + theme}>
        <header className={"card-header " + theme}>
          <p className={"card-header-title " + theme}>{title}</p>
        </header>
        <div className="card-content file-browser-inner">
          <div className="file-header pulsar-file">
            <div className="pulsar-file-name name-header">
              <span>Name</span>
              <div className={sortType == "name" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("name")}>
                <i className={sortType == "name" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
              </div>
            </div>
            <div className="pulsar-file-sequence state-header">
              <span>Frames</span>
              <div className={sortType == "frame" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("frame")}>
                <i className={sortType == "frame" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
              </div>
            </div>
            {Object.keys(groups).includes("state") ?
              <div className="pulsar-file-state state-header">
                <span>State</span>
                <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("state")}>
                  <i className={sortType == "state" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
                </div>
              </div>
              : ""
            }
            {Object.keys(groups).includes("version") ?
              <div className="pulsar-file-version version-header">
                <span>Version</span>
                <div className={sortType == "version" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("version")}>
                  <i className={sortType == "version" ? sortDirection ? "las la-sort-numeric-down" : "las la-sort-numeric-down-alt" : "las la-sort-numeric-down"}></i>
                </div>
              </div>
              : ""
            }
            <div className="file-tag tag-header">
              <span>Tags</span>
              <div className={sortType == "tag" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("tag")}>
                <i className={sortType == "tag" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
              </div>
            </div>
            <div className="file-modified modified-header">
              <span>Date Modified</span>
              <div className={sortType == "date" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("date")}>
                <i className={sortType == "date" ? sortDirection ? "las la-sort-numeric-down" : "las la-sort-numeric-down-alt" : "las la-sort-numeric-down"}></i>
              </div>
            </div>
            <div className="file-size size-header">
              <span>Size</span>
              <div className={sortType == "size" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor} onClick={(e) => changeSort("size")}>
                <i className={sortType == "size" ? sortDirection ? "las la-sort-amount-down" : "las la-sort-amount-down-alt" : "las la-sort-amount-down"}></i>
              </div>
            </div>
          </div>
          {files.sort((a, b) => {
            // let sortUp = sortDirection ? -1 : 1;
            // let sortDown = sortDirection ? 1 : -1;
            // if(sortType == "name") {
            //   let name_a = a.name.toLowerCase();
            //   let name_b = b.name.toLowerCase();
            //   if(name_a < name_b) { return sortUp; }
            //   if(name_a > name_b) { return sortDown; }
            // } else if(sortType == "state") {
            //   if(a.state < b.state) { return sortUp; }
            //   if(a.state > b.state) { return sortDown; }
            // } else if(sortType == "version") {
            //   if(a.version < b.version) { return sortUp; }
            //   if(a.version > b.version) { return sortDown; }
            // } else if(sortType == "tag") {
            //   if(a.tags.length > 0 && b.tags.length == 0) { return sortUp; }
            //   if(a.tags.length == 0 && b.tags.length > 0) { return sortDown; }
            //   if(a.tags.sort()[0] < b.tags.sort()[0]) { return sortUp; }
            //   if(a.tags.sort()[0] > b.tags.sort()[0]) { return sortDown; }
            // } else if(sortType == "date") {
            //   let splitA = a.modified.split(" ");
            //   let splitB = b.modified.split(" ");
            //   let dateA = splitA[0].split("/");
            //   let timeA = splitA[1].split(":");
            //   let dateB = splitB[0].split("/");
            //   let timeB = splitB[1].split(":");
            //   if(dateA[2] < dateB[2]) { return sortUp; }
            //   if(dateA[2] > dateB[2]) { return sortDown; }
            //   if(dateA[0] < dateB[0]) { return sortUp; }
            //   if(dateA[0] > dateB[0]) { return sortDown; }
            //   if(dateA[1] < dateB[1]) { return sortUp; }
            //   if(dateA[1] > dateB[1]) { return sortDown; }
            //   if(timeA[0] < timeB[0]) { return sortUp; }
            //   if(timeA[0] > timeB[0]) { return sortDown; }
            //   if(timeA[1] < timeB[1]) { return sortUp; }
            //   if(timeA[1] > timeB[1]) { return sortDown; }
            // } else if(sortType == "size") {
            //   if(a.size < b.size) { return sortDown; }
            //   if(a.size > b.size) { return sortUp; }
            // }
            //
            // let name_a = a.name.toLowerCase();
            // let name_b = b.name.toLowerCase();
            // if(name_a < name_b) { return sortUp; }
            // if(name_a > name_b) { return sortDown; }
            // if(a.version < b.version) { return sortUp; }
            // if(a.version > b.version) { return sortDown; }
            // if(a.state < b.state) { return sortDown; }
            // if(a.state > b.state) { return sortUp; }
            return 0;
          }).map((file, index) => (
            <div key={index} className={index == selectedFile ? `pulsar-file bg-${primaryColor} ${theme}` : `pulsar-file ${theme}`} onClick={(e) => handleChange(index, file)}>
              <div className="pulsar-file-name">
                <i className="las la-file"></i>
                <span>{file._base + "." + file._pad+ file._ext}</span>
              </div>
              <div className="pulsar-file-sequence">
                <span>{file.frames}</span>
              </div>
              <div className="pulsar-file-state">
                <span>{file.state}</span>
              </div>
              <div className="pulsar-file-version">
                <span>{file.version}</span>
              </div>
              <div className="file-tag">
                {file.tags.sort().map((tag, index) => (
                  <div key={index} className={"tag tag-" + tag.toLowerCase()}>
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
              <div className="file-modified">
                <span>{file.modified}</span>
              </div>
              <div className="file-size">
                <span>{getSize(file.size)}</span>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default SequenceBrowser;
