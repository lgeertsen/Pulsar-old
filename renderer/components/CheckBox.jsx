import React, { useState } from 'react';

const CheckBox = ({ theme, primaryColor, label, checked, onCheck }) => {
  // const [checked, setChecked] = useState(false);

  const checkBox = () => {
    onCheck();
  }

    return (
      <div className="checkbox-container" onClick={(e) => checkBox()}>
        <div className={checked ? "checkbox icon checked" : "checkbox icon"}>
          <i className={checked ? "las la-check" : "las la-check hidden"}></i>
        </div>
        <div className="checkbox-label">
          <span>{label}</span>
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default CheckBox;
