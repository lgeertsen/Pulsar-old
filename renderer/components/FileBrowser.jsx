import React, { useState } from 'react';

const FileBrowser = ({ theme, primaryColor, title, files, onChange }) => {

  const [selectedFile, setSelectedFile] = useState(-1);
  const [sortType, setSortType] = useState("name");
  const [sortDirection, setSortDirection] = useState(true);

  const handleChange = (index, path) => {
    onChange(path);
    setSelectedFile(index);
  };

  const changeSort = type => {
    // if() {
    //
    // }
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
            <div className="pulsar-file-state state-header">
              <span>State</span>
              <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor}>
                <i className={sortType == "state" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
              </div>
            </div>
            <div className="pulsar-file-version version-header">
              <span>Version</span>
              <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor}>
                <i className={sortType == "state" ? sortDirection ? "las la-sort-numeric-down" : "las la-sort-numeric-down-alt" : "las la-sort-numeric-down"}></i>
              </div>
            </div>
            <div className="file-tag tag-header">
              <span>Tags</span>
              <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor}>
                <i className={sortType == "state" ? sortDirection ? "las la-sort-alpha-down" : "las la-sort-alpha-down-alt" : "las la-sort-alpha-down"}></i>
              </div>
            </div>
            <div className="file-modified modified-header">
              <span>Date Modified</span>
              <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor}>
                <i className={sortType == "state" ? sortDirection ? "las la-sort-numeric-down" : "las la-sort-numeric-down-alt" : "las la-sort-numeric-down"}></i>
              </div>
            </div>
            <div className="file-size size-header">
              <span>Size</span>
              <div className={sortType == "state" ? "icon sort-btn selected " + theme : "icon sort-btn hover-bg-" + primaryColor}>
                <i className={sortType == "state" ? sortDirection ? "las la-sort-amount-down" : "las la-sort-amount-down-alt" : "las la-sort-amount-down"}></i>
              </div>
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
            <div key={index} className={index == selectedFile ? `pulsar-file bg-${primaryColor} ${theme}` : `pulsar-file ${theme}`} onClick={(e) => handleChange(index, file.path)}>
              <div className="pulsar-file-name">
                <i className="las la-file"></i>
                <span>{file.name + "." + file.extension}</span>
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

export default FileBrowser;
