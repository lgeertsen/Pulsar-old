import React, { useState } from 'react'
import PropTypes from 'prop-types'

import CheckBox from '../components/CheckBox'
import RadioButton from '../components/RadioButton'

const FiltersContainer = ({ theme, primaryColor, filters, setFilter, groups }) => {
  const [open, setOpen] = useState(true)

  return (
    <div className="filter-container-inner">
      <div className="filter-types">
        <div className="filter-type">
          <div className="filter-title">
            <div>Filters</div>
            <div className="icon" onClick={(e) => setOpen(!open)}>
              <i className={open ? 'las la-angle-double-up' : 'las la-angle-double-down'}></i>
            </div>
          </div>
        </div>
        {Object.keys(filters).map((filter, index) => (
          (filter === 'scene2D3D' && !Object.keys(groups).includes('dimension')) || (filter === 'state' && !Object.keys(groups).includes('state'))
            ? ''
            : <div key={index} className={open ? 'filter-type' : 'filter-type filter-type-closed'}>
              <h6>{filters[filter].title}</h6>
              {Object.keys(filters[filter].options).map((option, index) => (
                <div key={index} className="filter-option">
                  { filters[filter].type === 'checkbox'
                    ? <CheckBox
                      theme={theme}
                      primaryColor={primaryColor}
                      label={(option.charAt(0).toUpperCase() + option.slice(1)).split('_').join(' ')}
                      checked={filters[filter].options[option]}
                      onCheck={() => setFilter(filter, option, !filters[filter].options[option])}
                    />
                    : <RadioButton
                      theme={theme}
                      primaryColor={primaryColor}
                      label={(option.charAt(0).toUpperCase() + option.slice(1)).split('_').join(' ')}
                      checked={filters[filter].options[option]}
                      onCheck={() => setFilter(filter, option, !filters[filter].options[option])}
                    />
                  }
                </div>
              ))}

            </div>
        ))}
      </div>
    </div>
  )
}

FiltersContainer.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  filters: PropTypes.any.isRequired,
  setFilter: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired
}

export default FiltersContainer
