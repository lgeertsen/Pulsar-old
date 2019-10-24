import React from 'react';

const Modal = ({ handleClose, show, children }) => {

  const close = e => {
    handleClose(false)
  };

  return (
    <div className={show ? "modal" : "modal display-none"} onClick={(e) => close(e)}>
      <section className="modal-main">
        <div className="close" onClick={(e) => close(e)}></div>
        {children}
      </section>

      <style jsx>{`
        .modal {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          top: 0;
          left: 0;
          width:100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          cursor: pointer;
        }

        .modal-main {
          position: relative;
          background: white;
          width: 400px;
          height: auto;
          // top:50%;
          // left:50%;
          // transform: translate(-50%,-50%);
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
