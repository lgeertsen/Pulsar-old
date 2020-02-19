import React, { useState } from 'react';

const RadioButton = ({ theme, primaryColor, label, checked, onCheck }) => {
  // const [checked, setChecked] = useState(false);

  const RadioButton = () => {
    
    onCheck();
  }

    return (
      <div className="radioButton-container" onClick={(e) => RadioButton()}>
        <div className={checked ? `radioButton icon checked bg-${primaryColor} ${theme}` : "radioButton icon " + theme}>
          <i></i>
        </div>
        <div className="radioButton-label">
          <span>{label}</span>
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default RadioButton;
