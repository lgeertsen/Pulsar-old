import React, { useState } from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';

import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal'
import Switch from '../components/Switch';

const NewAssetContainer = ({
  theme,
  primaryColor,
  show,
  handleClose,
  assetId,
  setAssetIdValue
}) => {
  const close = () => {
    handleClose();
  }

  const autocompleteHandleChange = (type, changes) => {
    if (changes.hasOwnProperty('selectedItem')) {
      setAssetIdValue(type, changes.selectedItem)
    } else if (changes.hasOwnProperty('inputValue')) {
      setAssetIdValue(type, changes.inputValue)
    }
  }

  const getItems = (type, filter) => {
    console.log(assetDirectories);
  return filter
    ? matchSorter(assetDirectories[type], filter)
    : assetDirectories[type]
}

function getStringItems(type, filter) {
  return getItems(type, filter)
}

    return (
      <Modal
        theme={theme}
        primaryColor={primaryColor}
        show={show}
        handleClose={() => close()}
      >
        <div className="newAssetContainer">
          <div className="settingsTitle">
            <h1>Create Asset</h1>
          </div>
          <div className="innerContainer">
            <div className="optionRow">
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Project:</h3>
                </div>
                <div className="optionDropdown">
                  <Dropdown
                    theme={theme}
                    primaryColor={primaryColor}
                    value={assetId.project}
                    options={assetId.projects}
                    onChange={(element) => setAssetIdValue("project", element)}
                  />
                </div>
              </div>
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Asset or Shot:</h3>
                </div>
                <div className="optionDropdown">
                  <Switch
                    theme={theme}
                    primaryColor={primaryColor}
                    option1="Assets"
                    value1="asset"
                    option2="Shots"
                    value2="shot"
                    onChange={(choice) => setAssetIdValue("pathType", choice)}
                  />
                </div>
              </div>
            </div>
            <div className="optionRow">
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Asset Type:</h3>
                </div>
                <div className="optionDropdown">
                  <Downshift selectedItem={assetId.group} onStateChange={(changes) => autocompleteHandleChange("type", changes)}>
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
                          <input
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
                          <div className="autocompleteMenu"
                            // {...getMenuProps({isOpen})}
                            >
                            {isOpen ?
                              getStringItems("type", inputValue).map((item, index) => (
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
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .newAssetContainer {
            display: flex;
            flex-direction: column;
            width: 800px;
            height: 600px;
          }
          .settingsTitle {
            width: 100%;
            height: 70px;
            border-bottom: ${theme.border};
          }
          .settingsTitle h1 {
            margin-left: 25px;
            margin-bottom: 15px;
          }
          .innerContainer {
            display: flex;
            flex-direction: column;
            border-bottom: ${theme.border};
          }
          .optionRow {
            height: auto;
            display: flex;
            flex-direction: row;
            margin-bottom: 10px;
          }
          .assetOption {
            flex: 1;
            height: auto;
            padding: 0 25px;
          }
          .optionTitle {
            width: auto;
            height: auto;
            margin: 5px 0;
          }
          .optionDropdown {
            position: relative;
            height: 25px;
          }

          .autocompleteInputContainer {
            position: relative;
          }
          .autocompleteMenuContainer {
            position: relative;
          }
        `}</style>
      </Modal>
    );
};

export default NewAssetContainer;
