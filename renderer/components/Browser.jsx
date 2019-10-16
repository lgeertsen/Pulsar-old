import React, { useState } from 'react';

const Browser = ({ title, directories, onChange }) => {

  const [selectedDir, setSelectedDir] = useState(-1);

  const handleChange = index => {
    onChange(index);
    setSelectedDir(index);
  };

    return (
      <div className="browser">
        <div className="browserTitle">
          <h4>{title}</h4>
        </div>
        <div className="browserInner">
          {directories.map((dir, index) => (
            <div key={index} className={index == selectedDir ? "directory selected" : "directory"} onClick={(e) => handleChange(index)}>
              <i className={index == selectedDir ? "fas fa-folder-open" : "fas fa-folder"}></i>
              <span>{dir}</span>
            </div>
          ))}
        </div>

        <style jsx>{`
          .browser {
            display: flex;
            flex-direction: column;
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }
          .browserTitle {
            height: 25px;
            background: #f2f2f2;
          }
          .browserTitle h4 {
            margin-left: 10px;
          }
          .browserInner {
            overflow-x: auto;
            overflow-y: auto;
          }
          .directory {
            height: auto;
            border-bottom: 1px solid #f2f2f2;
            color: #444F60;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .directory:hover {
            background: #f2f2f2;
          }
          .directory.selected {
            background: #f2f244;
          }
          .directory i {
            margin: 3px 5px;
          }
          .directory span {
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
        `}</style>
      </div>
    );
};

export default Browser;
