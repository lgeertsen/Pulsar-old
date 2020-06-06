import React, { useState } from 'react';

const CheckBox = ({ theme, primaryColor, label, checked, onCheck }) => {
  // const [checked, setChecked] = useState(false);

  const checkBox = () => {
    onCheck();
  }

    return (
      <div className="checkbox-container" onClick={(e) => checkBox()}>
        <div className={checked ? `checkbox icon checked bg-${primaryColor} ${theme}` : "checkbox icon " + theme}>
          <i className={checked ? "las la-check" : "las la-check hidden"}></i>
        </div>
        {label != undefined ?
          <div className="checkbox-label">
          <span>{label}</span>
          </div>
          : ""
        }

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default CheckBox;
