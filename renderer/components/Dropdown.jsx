import React, { useEffect, useState, useRef } from 'react';

const Dropdown = ({ theme, primaryColor, value, options, onChange }) => {

  const node = useRef();
  const [open, setOpen] = useState(false);

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setOpen(false);
  };

  const handleChange = selectedValue => {
    onChange(selectedValue);
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

    return (
      <div ref={node} className={open ? "dropdown is-active" : "dropdown"}>
        <div className="dropdown-trigger">
          <div className="button" aria-haspopup="true" aria-controls="dropdown-menu" onClick={e => setOpen(!open)}>
            <h3>{value}</h3>
            <span className="icon is-small">
              <i className="las la-angle-down" aria-hidden="true"></i>
            </span>
          </div>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {options.map((element, index) => (
              <a key={index} className="dropdown-item" onClick={e => handleChange(element)}>
                {element}
              </a>
            ))}
          </div>
        </div>

        <style jsx>{`

        `}</style>
      </div>
    );
};

export default Dropdown;
