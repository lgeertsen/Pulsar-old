import React, { useState } from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';

const Autocomplete = ({
  theme,
  primaryColor,
  assetId,
  setAssetIdValue,
  type,
  value
}) => {
  const autocompleteHandleChange = (type, changes) => {
    if (changes.hasOwnProperty('selectedItem')) {
      setAssetIdValue(type, changes.selectedItem)
    } else if (changes.hasOwnProperty('inputValue')) {
      setAssetIdValue(type, changes.inputValue)
    }
  }

  const getItems = (type, filter) => {
    console.log(assetId);
    return filter
      ? matchSorter(assetId[type], filter)
      : assetId[type]
  }

  function getStringItems(type, filter) {
    return getItems(type, filter)
  }

  return (
    <div>
    <Downshift selectedItem={assetId[value]} onStateChange={(changes) => autocompleteHandleChange(value, changes)}>
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
        highlightedIndex,
      }) => (
        <div className="autocomplete">
          <div className="autocomplete-input-container">
            <input className="autocomplete-input"
              {...getInputProps({
                // isOpen,
                placeholder: 'Enter a name',
              })}
            />
            {selectedItem ? (
              <div className="autocomplete-controller-button icon"
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <i className="las la-times"></i>
              </div>
            ) : (
              <div className="autocomplete-controller-button icon" {...getToggleButtonProps()}>
                <i className={isOpen ? "las la-angle-up" : "las la-angle-down"}></i>
              </div>
            )}
          </div>
          <div className="autocomplete-menu-container">
            <div className={isOpen ? "autocomplete-menu open" : "autocomplete-menu"}
                {...getMenuProps({isOpen})}
              >
              {isOpen ?
                getStringItems(type, inputValue).map((item, index) => (
                  <div className="autocomplete-item"
                    key={index}
                    {...getItemProps({
                      item,
                      index,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item,
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

        <style jsx>{`
          
        `}</style>
        </div>
    );
};

export default Autocomplete;
