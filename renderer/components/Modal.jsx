import React from 'react';

const Modal = ({ theme, primaryColor, title, handleClose, show, children }) => {

  const close = e => {
    handleClose(false)
  };

  return (
    <div className={show ? "modal is-active" : "modal"}>
      <div className="modal-background" onClick={(e) => close(e)}></div>
      <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">
              {title}
            </div>
            <div className="close-modal icon" onClick={(e) => close(e)}>
              <i className="las la-times"></i>
            </div>
          </header>
        <div className="modal-card-body">
          {children}
        </div>
      </div>

      <style jsx>{`

      `}</style>
    </div>
  );
};

export default Modal
