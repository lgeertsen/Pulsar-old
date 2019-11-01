import React, { useState } from 'react';

const CheckBox = ({ theme, label, checked, onCheck }) => {
  // const [checked, setChecked] = useState(false);

  const checkBox = () => {
    onCheck();
  }

    return (
      <div className="checkboxContainer" onClick={(e) => checkBox()}>
        <div className={checked ? "checkbox checked" : "checkbox"}></div>
        <div className="checkboxLabel">
          <span>{label}</span>
        </div>

        <style jsx>{`
          .checkboxContainer {
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .checkbox {
            position: relative;
            width: 20px;
            height: 20px;
            background: ${theme.secondaryBg};
            border: ${theme.border};
            border-radius: 3px;
            margin: 0 8px;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .checkbox.checked:after {
            content: "";
            position: absolute;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid ${theme.white};
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
          }
          .checkbox:hover {
            border-color: ${theme.blue};
          }
          .checkbox.checked {
            background: ${theme.blue};
          }
          .checkboxLabel {
            flex: 1;
            display: flex;
            flex-direction: row;
            align-items: center;
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
};

export default CheckBox;
