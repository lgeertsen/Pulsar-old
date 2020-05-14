import React, { useState, useRef } from 'react';

const SwitchBox = ({ theme, primaryColor, value, onChange }) => {

  const handleChange = () => {
    onChange(!value);
  };

    return (
      <div className="switch-box">
        <input type="checkbox" className="switch-box-check" checked={value} onChange={(e) => handleChange()}/>
        <b className={value == true ? "switch-box-b switch-box-switch checked" : "switch-box-b switch-box-switch"}></b>
        <b className={value == true ? `switch-box-b switch-box-track checked bg-${primaryColor}` : "switch-box-b switch-box-track"}></b>
      </div>
    );
};

export default SwitchBox;
