import React, { useState } from 'react';

import CheckBox from '../components/CheckBox'
import RadioButton from '../components/RadioButton';
import RadioButton from '../components/RadioButton'

const FiltersContainer = ({ theme, primaryColor, filters, setFilter }) => {
  const [open, setOpen] = useState(true);

    return (
      <div className="filter-container-inner">
        <div className="filter-types">
          <div className="filter-type">
            <div className="filter-title">
              <div>Filters</div>
              <div className="icon" onClick={(e) => setOpen(!open)}>
                <i className={open ? "las la-angle-double-up" : "las la-angle-double-down"}></i>
              </div>
            </div>
          </div>
          {Object.keys(filters).map((filter, index) => (

            <div key={index} className={open ? "filter-type" : "filter-type filter-type-closed"}>

              {Object.keys(filters[filter]['options']).map((option, index) => (
                <div key={index} className="filter-option">
                  { filters[filter].type == "checkbox" ?
                    <CheckBox
                      theme={theme}
                      primaryColor={primaryColor}
                      label={(option.charAt(0).toUpperCase() + option.slice(1)).split("_").join(" ")}
                      checked={filters[filter]['options'][option]}
                      onCheck={() => setFilter(filter, option, !filters[filter]['options'][option])}
                      />
                    :
                    <RadioButton
                      theme={theme}
                      primaryColor={primaryColor}
                      label={(option.charAt(0).toUpperCase() + option.slice(1)).split("_").join(" ")}
                      checked={filters[filter]['options'][option]}
                      onCheck={() => setFilter(filter, option, !filters[filter]['options'][option])}
                      />
                   }
                </div>
              ))
            :
              Object.keys(filters[filter].options).map((option, index) => (
                <div key={index} className="filter-option">
                <CheckBox
                theme={theme}
                primaryColor={primaryColor}
                label={(option.charAt(0).toUpperCase() + option.slice(1)).split("_").join(" ")}
                checked={filters[filter].options[option]}
                onCheck={() => setFilter(filter, option, !filters[filter].options[option])}
                />
                </div>
              ))
            }

            </div>
          ))}
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default FiltersContainer;
