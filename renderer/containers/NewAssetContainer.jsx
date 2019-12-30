import React, { useState } from 'react';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';

import Autocomplete from '../components/Autocomplete';
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
    console.log(assetId);
    return filter
      ? matchSorter(assetId[type], filter)
      : assetId[type]
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
                <div className="optionDropdown optionAutocomplete">
                  <Autocomplete
                    theme={theme}
                    primaryColor={primaryColor}
                    assetId={assetId}
                    setAssetIdValue={(type, value) => setAssetIdValue(type, value)}
                    type="groups"
                    value="group"
                  />
                </div>
              </div>
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Asset Name:</h3>
                </div>
                <div className="optionDropdown optionAutocomplete">
                  <Autocomplete
                    theme={theme}
                    primaryColor={primaryColor}
                    assetId={assetId}
                    setAssetIdValue={(type, value) => setAssetIdValue(type, value)}
                    type="names"
                    value="name"
                  />
                </div>
              </div>
            </div>
            <div className="optionRow">
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Task:</h3>
                </div>
                <div className="optionDropdown optionAutocomplete">
                  <Autocomplete
                    theme={theme}
                    primaryColor={primaryColor}
                    assetId={assetId}
                    setAssetIdValue={(type, value) => setAssetIdValue(type, value)}
                    type="tasks"
                    value="task"
                  />
                </div>
              </div>
              <div className="assetOption">
                <div className="optionTitle">
                  <h3>Subtask:</h3>
                </div>
                <div className="optionDropdown optionAutocomplete">
                  <Autocomplete
                    theme={theme}
                    primaryColor={primaryColor}
                    assetId={assetId}
                    setAssetIdValue={(type, value) => setAssetIdValue(type, value)}
                    type="subtasks"
                    value="subtask"
                  />
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
          .optionAutocomplete {
            border-radius: 6px;
            border: ${theme.border};
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
