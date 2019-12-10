import React, { useState } from 'react';

import Dropdown from '../components/Dropdown';
import Modal from '../components/Modal'

const NewAssetContainer = ({
  theme,
  primaryColor,
  show,
  handleClose,
  assetDirectories,
  assetSid,
  setAssetSid
}) => {
  const close = () => {
    handleClose();
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
            <div className="assetOption">
              <div className="optionTitle">
                <h3>Project:</h3>
              </div>
              <div className="optionDropdown">
                <Dropdown
                  theme={theme}
                  primaryColor={primaryColor}
                  value={assetSid.project}
                  options={assetDirectories.project}
                  onChange={(element) => setAssetSid("project", element)}
                />
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
            flex-direction: row;
            border-bottom: ${theme.border};
          }
          .assetOption {
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
        `}</style>
      </Modal>
    );
};

export default NewAssetContainer;
