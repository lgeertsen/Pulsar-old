import React from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'

const Autocomplete = ({
  theme,
  primaryColor,
  setValue,
  items,
  value,
  placeholder
}) => {
  const autocompleteHandleChange = (changes) => {
    if (changes.hasOwnProperty('selectedItem')) {
      setValue(changes.selectedItem)
    } else if (changes.hasOwnProperty('inputValue')) {
      setValue(changes.inputValue)
    }
  }

  const getItems = (filter) => {
    return filter
      ? matchSorter(items, filter)
      : items
  }

  function getStringItems (filter) {
    return getItems(filter)
  }

  return (
    <div>
      <Downshift selectedItem={value} onStateChange={(changes) => autocompleteHandleChange(changes)}>
        {({
          getLabelProps,
          getInputProps,
          getToggleButtonProps,
          getMenuProps,
          getItemProps,
          isOpen,
          clearSelection,
          selectedItem,
          inputValue,
          highlightedIndex
        }) => (
          <div className="autocomplete">
            <div className="autocomplete-input-container">
              <input className={'autocomplete-input ' + theme}
                {...getInputProps({
                  // isOpen,
                  placeholder: placeholder
                })}
              />
              {selectedItem ? (
                <div className={'autocomplete-controller-button icon ' + theme}
                  onClick={clearSelection}
                  aria-label="clear selection"
                >
                  <i className="las la-times"></i>
                </div>
              ) : (
                <div className="autocomplete-controller-button icon" {...getToggleButtonProps()}>
                  <i className={isOpen ? 'las la-angle-up' : 'las la-angle-down'}></i>
                </div>
              )}
            </div>
            <div className="autocomplete-menu-container">
              <div className={isOpen ? 'autocomplete-menu open ' + theme : 'autocomplete-menu ' + theme}
                {...getMenuProps({ isOpen })}
              >
                {isOpen
                  ? getStringItems(inputValue).map((item, index) => (
                    <div className={'autocomplete-item ' + theme}
                      key={index}
                      {...getItemProps({
                        item,
                        index,
                        isActive: highlightedIndex === index,
                        isSelected: selectedItem === item
                      })}
                    >
                      {item}
                    </div>
                  ))
                  : null
                }
              </div>
            </div>
          </div>
        )}
      </Downshift>
    </div>
  )
}

Autocomplete.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired
}

export default Autocomplete
