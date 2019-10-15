import React, { useState, useRef } from 'react';

const Switch = ({ option1, option2, onChange }) => {

  const [selected, setSelected] = useState(1);

  const handleChange = selectedValue => {
    onChange(selectedValue);
    setSelected(selectedValue);
  };

    return (
      <div className="switch">
        <div className={selected == 1 ? "option selected" : "option"} onClick={(e) => handleChange(1)}>
          <span>{option1}</span>
        </div>
        <div className={selected == 2 ? "option selected" : "option"} onClick={(e) => handleChange(2)}>
          <span>{option2}</span>
        </div>

        <style jsx>{`
          .switch {
            display: flex;
            flex-direction: row;
          }
          .option {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f2f2f2;
            border: 1px solid #e3e3e3;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .option.selected {
            border-color: #f2f244;
            background: #fff;
          }
          .option:first-child {
            border-top-left-radius: 6px;
            border-bottom-left-radius: 6px;
          }
          .option:last-child {
            border-top-right-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        `}</style>
      </div>
    );
};

export default Switch;
