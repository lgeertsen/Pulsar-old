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
        title="Create Asset"
        handleClose={() => close()}
      >
        <div className="new-asset-container">
          <div className="new-asset-inner-container">
            <div className="new-asset-option-row">
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Project:</h3>
                </div>
                <div className="new-asset-dropdown">
                  <Dropdown
                    theme={theme}
                    primaryColor={primaryColor}
                    value={assetId.project}
                    options={assetId.projects}
                    onChange={(element) => setAssetIdValue("project", element)}
                  />
                </div>
              </div>
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Asset or Shot:</h3>
                </div>
                <div className="new-asset-dropdown">
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
            <div className="new-asset-option-row">
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Asset Type:</h3>
                </div>
                <div className="new-asset-dropdown new-asset-option-autocomplete">
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
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Asset Name:</h3>
                </div>
                <div className="new-asset-dropdown new-asset-option-autocomplete">
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
            <div className="new-asset-option-row">
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Task:</h3>
                </div>
                <div className="new-asset-dropdown new-asset-option-autocomplete">
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
              <div className="new-asset-option">
                <div className="new-asset-option-title">
                  <h3>Subtask:</h3>
                </div>
                <div className="new-asset-dropdown new-asset-option-autocomplete">
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

        `}</style>
      </Modal>
    );
};

export default NewAssetContainer;
