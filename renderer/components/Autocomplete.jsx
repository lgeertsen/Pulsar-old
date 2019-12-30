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
          <div className="autocompleteInputContainer">
            <input className="autocompleteInput"
              {...getInputProps({
                // isOpen,
                placeholder: 'Enter a name',
              })}
            />
            {selectedItem ? (
              <div className="controllerButton"
                onClick={clearSelection}
                aria-label="clear selection"
              >
                <i className="fas fa-times"></i>
              </div>
            ) : (
              <div className="controllerButton" {...getToggleButtonProps()}>
                <i className={isOpen ? "fas fa-angle-up" : "fas fa-angle-down"}></i>
              </div>
            )}
          </div>
          <div className="autocompleteMenuContainer">
            <div className={isOpen ? "autocompleteMenu open" : "autocompleteMenu"}
                {...getMenuProps({isOpen})}
              >
              {isOpen ?
                getStringItems(type, inputValue).map((item, index) => (
                  <div className="autocompleteItem"
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
          .autocompleteInputContainer {
            display: flex;
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          .autocompleteInput {
            margin-left: 10px;
            flex: 1;
            border: none;
            border-right: 1px solid ${theme.borderColor};
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            font-size: 16px;
          }
          .autocompleteInput:focus {
            outline: none;
          }
          .controllerButton {
            width: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all ease 0.2s;
          }
          .controllerButton:hover {
            background: ${theme.secondaryBg};
          }
          .autocompleteMenu.open {
            position: absolute;
            height: auto;
            width: 100%;
            left: 0;
            top: 29px;
            background: ${theme.background};
            border-radius: 6px;
            box-shadow: 0 2px 3px rgba(10,10,10,0.1), 0 0 0 1px rgba(10,10,10,0.1);
            z-index: 10;
          }
          .autocompleteItem {
            width: auto;
            padding-left: 10px;
            border-bottom: ${theme.border};
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            transition: all ease 0.2s;
            cursor: pointer;
          }
          .autocompleteItem:hover,
          .autocompleteItem[aria-selected="true"] {
            background: ${theme.secondaryBg};
          }
        `}</style>
        </div>
    );
};

export default Autocomplete;
