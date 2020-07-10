import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ipcRenderer } from 'electron'

import SwitchBox from './SwitchBox'
import Modal from './Modal'

const availableSoftwares = [
  'houdini',
  'maya',
  'nuke'
]

const FileBrowser = ({ theme, primaryColor, title, files, onChange, groups, showCreateNew, createNew, softwares }) => {
  const [selectedFile, setSelectedFile] = useState(-1)
  const [sortType, setSortType] = useState('version')
  const [sortDirection, setSortDirection] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newFileType, setNewFileType] = useState('')
  const [useTemplate, setUseTemplate] = useState(false)
  const [templateFilePath, setTemplateFilePath] = useState('')

  useEffect(() => {
    ipcRenderer.on('selectedTemplate', (event, data) => {
      setTemplateFilePath(data)
    })
  })

  const handleChange = (index, path) => {
    onChange(path)
    setSelectedFile(index)
  }

  const changeSort = type => {
    if (type === sortType) {
      const dir = sortDirection
      setSortDirection(!dir)
    } else {
      setSortType(type)
      setSortDirection(true)
    }
  }

  const selectTemplate = () => {
    ipcRenderer.send('selectFile', { response: 'selectedTemplate' })
  }

  const submit = () => {
    const data = {
      name: newName,
      template: useTemplate ? templateFilePath : undefined,
      type: useTemplate ? undefined : newFileType
    }
    createNew(data)
    setShowModal(false)
    setNewName('')
  }

  const toReadableDate = (date) => {
    const now = new Date(date)
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()

    const timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    return timestamp
  }

  const getSize = bytes => {
    const suffixes = ['B', 'KB', 'MB', 'GB', 'TB']
    let counter = 0
    while (Math.round(bytes / 1024) >= 1) {
      bytes = bytes / 1024
      counter++
    }
    bytes = Math.round(bytes)
    return bytes.toString() + suffixes[counter]
  }

  return (
    <div className={'card file-browser ' + theme}>
      <header className={'card-header ' + theme}>
        <p className={'card-header-title ' + theme}>{title}</p>
      </header>
      <div className="card-content file-browser-inner">
        {showCreateNew
          ? <div className={`pulsar-new-file ${theme}`} onClick={() => setShowModal(true)}>
            <i className="las la-plus-circle"></i>
            <span>Create New</span>
          </div>
          : ''
        }
        <div className="file-header pulsar-file">
          <div className="pulsar-file-name name-header">
            <span>Name</span>
            <div className={sortType === 'name' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('name')}>
              <i className={sortType === 'name' ? sortDirection ? 'las la-sort-alpha-down' : 'las la-sort-alpha-down-alt' : 'las la-sort-alpha-down'}></i>
            </div>
          </div>
          {Object.keys(groups).includes('state')
            ? <div className="pulsar-file-state state-header">
              <span>State</span>
              <div className={sortType === 'state' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('state')}>
                <i className={sortType === 'state' ? sortDirection ? 'las la-sort-alpha-down' : 'las la-sort-alpha-down-alt' : 'las la-sort-alpha-down'}></i>
              </div>
            </div>
            : ''
          }
          {Object.keys(groups).includes('version')
            ? <div className="pulsar-file-version version-header">
              <span>Version</span>
              <div className={sortType === 'version' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('version')}>
                <i className={sortType === 'version' ? sortDirection ? 'las la-sort-numeric-down' : 'las la-sort-numeric-down-alt' : 'las la-sort-numeric-down'}></i>
              </div>
            </div>

            : ''
          }
          <div className="file-tag tag-header">
            <span>Tags</span>
            <div className={sortType === 'tag' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('tag')}>
              <i className={sortType === 'tag' ? sortDirection ? 'las la-sort-alpha-down' : 'las la-sort-alpha-down-alt' : 'las la-sort-alpha-down'}></i>
            </div>
          </div>
          <div className="file-modified modified-header">
            <span>Date Modified</span>
            <div className={sortType === 'date' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('date')}>
              <i className={sortType === 'date' ? sortDirection ? 'las la-sort-numeric-down' : 'las la-sort-numeric-down-alt' : 'las la-sort-numeric-down'}></i>
            </div>
          </div>
          <div className="file-size size-header">
            <span>Size</span>
            <div className={sortType === 'size' ? 'icon sort-btn selected ' + theme : 'icon sort-btn hover-bg-' + primaryColor} onClick={(e) => changeSort('size')}>
              <i className={sortType === 'size' ? sortDirection ? 'las la-sort-amount-down' : 'las la-sort-amount-down-alt' : 'las la-sort-amount-down'}></i>
            </div>
          </div>
        </div>
        {files.sort((a, b) => {
          const sortUp = sortDirection ? -1 : 1
          const sortDown = sortDirection ? 1 : -1
          if (sortType === 'name') {
            const nameA = a.name.toLowerCase()
            const nameB = b.name.toLowerCase()
            if (nameA < nameB) { return sortUp }
            if (nameA > nameB) { return sortDown }
          } else if (sortType === 'state' && Object.keys(groups).includes('state')) {
            if (a.state < b.state) { return sortUp }
            if (a.state > b.state) { return sortDown }
          } else if (sortType === 'version' && Object.keys(groups).includes('version')) {
            if (a.version < b.version) { return sortUp }
            if (a.version > b.version) { return sortDown }
          } else if (sortType === 'tag') {
            if (a.tags.length > 0 && b.tags.length === 0) { return sortUp }
            if (a.tags.length === 0 && b.tags.length > 0) { return sortDown }
            if (a.tags.sort()[0] < b.tags.sort()[0]) { return sortUp }
            if (a.tags.sort()[0] > b.tags.sort()[0]) { return sortDown }
          } else if (sortType === 'date') {
            const splitA = a.modified.split(' ')
            const splitB = b.modified.split(' ')
            const dateA = splitA[0].split('/')
            const timeA = splitA[1].split(':')
            const dateB = splitB[0].split('/')
            const timeB = splitB[1].split(':')
            if (dateA[2] < dateB[2]) { return sortUp }
            if (dateA[2] > dateB[2]) { return sortDown }
            if (dateA[0] < dateB[0]) { return sortUp }
            if (dateA[0] > dateB[0]) { return sortDown }
            if (dateA[1] < dateB[1]) { return sortUp }
            if (dateA[1] > dateB[1]) { return sortDown }
            if (timeA[0] < timeB[0]) { return sortUp }
            if (timeA[0] > timeB[0]) { return sortDown }
            if (timeA[1] < timeB[1]) { return sortUp }
            if (timeA[1] > timeB[1]) { return sortDown }
          } else if (sortType === 'size') {
            if (a.size < b.size) { return sortDown }
            if (a.size > b.size) { return sortUp }
          }

          const nameA = a.name.toLowerCase()
          const nameB = b.name.toLowerCase()
          if (nameA < nameB) { return sortUp }
          if (nameA > nameB) { return sortDown }
          if (a.version < b.version) { return sortUp }
          if (a.version > b.version) { return sortDown }
          if (a.state < b.state) { return sortDown }
          if (a.state > b.state) { return sortUp }
          return 0
        }).map((file, index) => (
          <div key={index} className={index === selectedFile ? `pulsar-file bg-${primaryColor} ${theme}` : `pulsar-file ${theme}`} onClick={(e) => handleChange(index, file)}>
            <div className="pulsar-file-name">
              <i className="las la-file"></i>
              <span>{file.name + '.' + file.extension}</span>
            </div>
            {Object.keys(groups).includes('state')
              ? <div className="pulsar-file-state">
                <span>{file.state}</span>
              </div>
              : ''
            }
            {Object.keys(groups).includes('version')
              ? <div className="pulsar-file-version">
                <span>{file.version}</span>
              </div>
              : ''
            }
            <div className="file-tag">
              {file.tags.sort().map((tag, index) => (
                <div key={index} className={'tag tag-' + tag.toLowerCase()}>
                  <span>{tag}</span>
                </div>
              ))}
            </div>
            <div className="file-modified">
              <span>{toReadableDate(file.modified)}</span>
            </div>
            <div className="file-size">
              <span>{getSize(file.size)}</span>
            </div>
          </div>
        ))}
      </div>
      <Modal
        theme={theme}
        primaryColor={primaryColor}
        title={'Create new file'}
        show={showModal}
        handleClose={() => setShowModal(false)}
      >
        <div className="columns is-centered">
          <div className="column is-two-thirds">
            <label>Name:</label>
            <input className={'input browser-new-input bis ' + theme} type="text" value={newName} onChange={e => setNewName(e.target.value)}/>
          </div>
        </div>
        <div className="columns is-centered is-multiline">
          <div className="column is-narrow">Use Template:</div>
          <div className="column is-half">
            <SwitchBox
              theme={theme}
              primaryColor={primaryColor}
              value={useTemplate}
              onChange={value => setUseTemplate(value)}
            />
          </div>
          {useTemplate
            ? <div className="column is-two-thirds">
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                <div className="file-label" onClick={(e) => selectTemplate()}>
                  <div className={`file-cta ${theme}`}>
                    <span className="file-icon">
                      <i className="las la-file"></i>
                    </span>
                    <span className="file-label">
                      {templateFilePath === '' ? 'Select Project File' : templateFilePath}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            : ''
          }
        </div>
        {!useTemplate
          ? <div className="columns">
            <div className="column">
              <div className="new-asset-softwares">
                {Object.keys(softwares).map((soft, index) => (
                  availableSoftwares.includes(soft)
                    ? <div key={index} className={newFileType === soft ? 'new-asset-file-type selected' : 'new-asset-file-type'} onClick={() => setNewFileType(soft)}>
                      <div className="new-asset-type-file-type-img">
                        <img src={`softwareLogos/${soft}.png`}/>
                      </div>
                    </div>
                    : ''
                ))}
              </div>
            </div>
          </div>
          : ''
        }
        {(newName && !useTemplate && newFileType) || (newName && useTemplate && templateFilePath)
          ? <div className={'button ' + theme} onClick={() => submit()}>Create</div>
          : ''
        }
      </Modal>
    </div>
  )
}

FileBrowser.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  groups: PropTypes.object.isRequired,
  showCreateNew: PropTypes.bool.isRequired,
  createNew: PropTypes.func.isRequired,
  softwares: PropTypes.object.isRequired
}

export default FileBrowser
