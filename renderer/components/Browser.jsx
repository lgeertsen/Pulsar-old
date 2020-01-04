import React, { useState } from 'react';

const Browser = ({ theme, primaryColor, title, directories, onChange, selectedDir }) => {

  const handleChange = dir => {
    onChange(dir);
  };

    return (
      <div className="card browser">
        <header className="card-header">
          <p className="card-header-title">{title}</p>
        </header>
        <div className="card-content browser-inner">
          {directories.sort((a, b) => {
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
          }).map((dir, index) => (
            <div key={index} className={dir == selectedDir ? "directory selected" : "directory"} onClick={(e) => handleChange(dir)}>
              <i className={dir == selectedDir ? "las la-folder-open" : "las la-folder"}></i>
              <span>{dir}</span>
            </div>
          ))}
        </div>

        <style jsx>{`
    
        `}</style>
      </div>
    );
};

export default Browser;
