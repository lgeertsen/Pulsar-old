import React, { useState } from 'react';

import Modal from '../components/Modal'

const SettingsContainer = ({ theme, primaryColor, show, handleClose }) => {
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
        <div className="settingsContainer">
          <h1>Settings Container</h1>
        </div>

        <style jsx>{`

        `}</style>
      </Modal>
    );
};

export default SettingsContainer;
