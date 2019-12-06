import React, { useState } from 'react';

const Browser = ({ theme, primaryColor, title, directories, onChange, selectedDir }) => {

  const handleChange = index => {
    onChange(index);
  };

    return (
      <div className="browser">
        <div className="browserTitle">
          <h4>{title}</h4>
        </div>
        <div className="browserInner">
          {directories.sort((a, b) => {
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
          }).map((dir, index) => (
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
            background: ${theme.transparentBg};
            border: ${theme.border};
            border-radius: 6px;
          }
          .browserTitle {
            height: 25px;
            background: ${theme.accentBg};
            border-bottom: ${theme.border};
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
            border-bottom: ${theme.accentBorder};
            color: ${theme.text};
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .directory:hover {
            background: ${theme.secondaryBg};
          }
          .directory.selected {
            background: ${theme.colors[primaryColor]};
            color: ${theme.colors.white};
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
