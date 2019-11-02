import React, { useState } from 'react';

import CheckBox from '../components/CheckBox'

const FiltersContainer = ({ theme, primaryColor }) => {
    return (
      <div className="filterContainer">
        <div className="filterTypes">
          <div className="filterType">
            <div className="filterTitle">
              <h4>Filters:</h4>
            </div>
            <div className="filterOption">
              <CheckBox theme={theme} primaryColor={primaryColor} label="Work" checked={false} onCheck={() => console.log("check")} />
            </div>
            <div className="filterOption">
              <CheckBox theme={theme} primaryColor={primaryColor} label="Publish" checked={false} onCheck={() => console.log("check")} />
            </div>
          </div>
          <div className="filterType">
            <CheckBox theme={theme} primaryColor={primaryColor} label="2D" checked={false} onCheck={() => console.log("check")} />
            <CheckBox theme={theme} primaryColor={primaryColor} label="3D" checked={true} onCheck={() => console.log("check")} />
          </div>
        </div>

        <style jsx>{`
          .filterContainer {
            display: flex;
            align-items: center;
            flex-direction: row;
            margin: 0 25px;
            height: 100px;
            width: 100%;
            background: ${theme.background};
          }
          .filterTypes {
            margin-left: 25px;
            flex: 1;
            display: flex;
            flex-direction: row;
          }
          .filterType {
            display: flex;
            flex-direction: column;
            width: 100px;
          }
          .filterTitle {
            margin-top: 5px;
            height: auto;
          }
          .filterOption {
            flex: 1;
          }
        `}</style>
      </div>
    );
};

export default FiltersContainer;
