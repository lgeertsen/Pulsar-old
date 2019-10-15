import React, { useEffect, useState, useRef } from 'react';

const Dropdown = ({ value, options, onChange }) => {

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
      <div ref={node} className="dropdownContainer" onClick={e => setOpen(!open)}>
        <div className="selectedElement">
          <div className="elementName">
            <span>{value}</span>
          </div>
          <div className="dropdownIcon">
            <i className="fas fa-angle-down"></i>
          </div>

          <div className={open ? "dropdown" : "dropdown hidden"}>
            {options.map((element, index) => (
              <div key={index} className="dropdownElement" onClick={e => handleChange(element)}>
                <span>{element}</span>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          .dropdownContainer {
            border-radius: 6px;
            background: #fff;
            border:  1px solid #e3e3e3;
            cursor: pointer;
          }
          .selectedElement {
            display: flex;
            align-items: center;
            flex-direction: row;
            width: 100%;
            height: 100%;
          }
          .elementName {
            flex: 1;
            margin-left: 10px;
          }
          .selectedElement span {
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
          .dropdownIcon {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            border-radius: 50%;
            background: #fff;
            transition: all ease 0.2s;
          }
          .dropdownContainer:hover .dropdownIcon {
            background: #e3e3e3;
          }
          .dropdownIcon i {
            margin-bottom: -2px;
            color: #444F60;
            font-size: 20px;
          }
          .dropdown {
            position: absolute;
            height: auto;
            width: 100%;
            left: 0;
            top: 29px;
            background: #fff;
            // border:  1px solid #e3e3e3;
            border-radius: 6px;
            box-shadow: 0 2px 3px rgba(10,10,10,0.1), 0 0 0 1px rgba(10,10,10,0.1);
          }
          .dropdown.hidden {
            display: none;
          }
          .dropdownElement {
            width: auto;
            padding-left: 10px;
            border-bottom: 1px solid #e3e3e3;
            transition: all ease 0.2s;
          }
          .dropdownElement:hover {
            background: #f2f2f2;
          }
        `}</style>
      </div>
    );
};

export default Dropdown;
