import React, { useState, useRef } from 'react';

const Switch = ({ theme, primaryColor, option1, value1, option2, value2, onChange }) => {

  const [selected, setSelected] = useState(1);

  const handleChange = selectedValue => {
    onChange(selectedValue == 1 ? value1 : value2);
    setSelected(selectedValue);
  };

    return (
      <div className="switch buttons has-addons">
        <div className={selected == 1 ? "button is-selected is-success" : "button"} onClick={(e) => handleChange(1)}>
          <span>{option1}</span>
        </div>
        <div className={selected == 2 ? "button is-selected is-success" : "button"} onClick={(e) => handleChange(2)}>
          <span>{option2}</span>
        </div>

        <style jsx>{`
        `}</style>
      </div>
    );
};

export default Switch;
