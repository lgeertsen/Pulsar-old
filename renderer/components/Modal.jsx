import React from 'react'
import PropTypes from 'prop-types'

const Modal = ({ theme, primaryColor, title, handleClose, show, children }) => {
  const close = e => {
    handleClose(false)
  }

  return (
    <div className={show ? 'modal is-active' : 'modal'}>
      <div className="modal-background" onClick={(e) => close(e)}></div>
      <div className="modal-card">
        <header className={'modal-card-head ' + theme}>
          <div className={'modal-card-title ' + theme}>
            {title}
          </div>
          <div className="close-modal icon" onClick={(e) => close(e)}>
            <i className="las la-times"></i>
          </div>
        </header>
        <div className={'modal-card-body ' + theme}>
          {children}
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  children: PropTypes.any
}

export default Modal
