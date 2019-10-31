import React from 'react';

const Modal = ({ handleClose, show, children }) => {

  const close = e => {
    handleClose(false)
  };

  return (
    <div className={show ? "modal" : "modal display-none"}>
      <div className="backdrop" onClick={(e) => close(e)}></div>
      <div className="modal-main">
        <div className="close" onClick={(e) => close(e)}></div>
        {children}
      </div>

      <style jsx>{`
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .backdrop {
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          cursor: pointer;
          z-index: 2;
        }

        .modal-main {
          display: flex;
          flex-direction: column;
          position: absolute;
          left: 50%;
          top: 50%;
          background: #fff;
          min-width: 400px;
          width: auto;
          height: auto;
          padding: 15px;
          padding-top: 25px;
          border-radius: 6px;
          border: 1px solid #e3e3e3;
          box-shadow: 0 3px 10px 4px rgba(0,0,0,0.04);
          cursor: default;
          transform: translate(-50%, -50%);
          z-index: 5
        }

        .display-none {
          display: none;
        }

        .close {
          position: absolute;
          right: 10px;
          top: 10px;
          width: 20px;
          height: 20px;
          opacity: 0.3;
        }
        .close:hover {
          opacity: 1;
        }
        .close:before, .close:after {
          position: absolute;
          left: 10px;
          content: ' ';
          height: 21px;
          width: 2px;
          background-color: #444;
        }
        .close:before {
          transform: rotate(45deg);
        }
        .close:after {
          transform: rotate(-45deg);
        }
      `}</style>
    </div>
  );
};

export default Modal
