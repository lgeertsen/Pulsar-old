import React, { useState } from 'react';

import CheckBox from '../components/CheckBox'

const FiltersContainer = ({ theme, primaryColor, filters, setFilter }) => {

    return (
      <div className="filterContainer">
        <div className="filterTypes">
          <div className="filterType">
            <div className="filterTitle">
              <h4>Filters:</h4>
            </div>
          </div>
          {Object.keys(filters).map((filter, index) => (
            <div key={index} className="filterType">

              {Object.keys(filters[filter]).map((option, index) => (
                <div key={index} className="filterOption">
                  <CheckBox
                    theme={theme}
                    primaryColor={primaryColor}
                    label={(option.charAt(0).toUpperCase() + option.slice(1)).split("_").join(" ")}
                    checked={filters[filter][option]}
                    onCheck={() => setFilter(filter, option, !filters[filter][option])}
                  />
                </div>
              ))}
            </div>
          ))}
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
