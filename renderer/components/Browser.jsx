import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Modal from './Modal'

const Browser = ({ theme, primaryColor, title, directories, onChange, selectedDir, createNew, showCreateNew }) => {
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')

  const handleChange = dir => {
    onChange(dir)
  }

  const submit = () => {
    createNew(newName)
    setShowModal(false)
    setNewName('')
  }

  return (
    <div className={'card card-browser ' + theme}>
      <header className={'card-header ' + theme}>
        <p className={'card-header-title ' + theme}>{title}</p>
      </header>
      <div className="card-content browser-inner">
        {showCreateNew
          ? <div className={`directory ${theme}`} onClick={() => setShowModal(true)}>
            <i className="las la-plus-circle"></i>
            <span>Create New</span>
          </div>
          : ''
        }
        {directories.sort((a, b) => {
          if (a < b) { return -1 }
          if (a > b) { return 1 }
          return 0
        }).map((dir, index) => (
          <div key={index} className={dir === selectedDir ? `directory bg-${primaryColor} ${theme}` : `directory ${theme}`} onClick={(e) => handleChange(dir)}>
            <i className={dir === selectedDir ? 'las la-folder-open' : 'las la-folder'}></i>
            <span>{dir}</span>
          </div>
        ))}
      </div>

      <Modal
        theme={theme}
        primaryColor={primaryColor}
        title={`Create new ${title}`}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <div className="columns is-centered">
          <div className="column is-half">
            <label>Name:</label>
            <input className={'input browser-new-input bis ' + theme} type="text" value={newName} onChange={e => setNewName(e.target.value)}/>
            {newName
              ? <div className={'button ' + theme} onClick={() => submit()}>Create</div>
              : ''
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

Browser.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  directories: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedDir: PropTypes.string.isRequired,
  createNew: PropTypes.func.isRequired,
  showCreateNew: PropTypes.bool.isRequired
}

export default Browser
