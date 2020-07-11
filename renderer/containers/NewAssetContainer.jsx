import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import { ipcRenderer } from 'electron'

import format from 'string-format'

import Autocomplete from '../components/Autocomplete'
import CheckBox from '../components/CheckBox'
import Dropdown from '../components/Dropdown'
import Modal from '../components/Modal'
import RadioButton from '../components/RadioButton'
import Switch from '../components/Switch'

const NewAssetContainer = ({
  theme,
  primaryColor,
  show,
  handleClose,
  assetId,
  setAssetIdValue
}) => {
  const [newFileName, setNewFileName] = useState('')
  const [newFileType, setNewFileType] = useState('maya')
  const [useExistingFile, setUseExistingFile] = useState(true)
  const [existingFilePath, setExistingFilePath] = useState('')

  const close = () => {
    handleClose()
  }

  const selectFile = () => {
    const extensionTypes = []
    switch (newFileType) {
      case 'maya':
        extensionTypes.push({
          name: 'Maya',
          extensions: ['ma', 'mb']
        })
        break
      case 'houdini':
        extensionTypes.push({
          name: 'Houdini',
          extensions: ['hip', 'hipnc']
        })
        break
      case 'nuke':
        extensionTypes.push({
          name: 'Nuke',
          extensions: ['nk']
        })
        break
      default:
        extensionTypes.push({
          name: 'All',
          extensions: ['*']
        })
    }
    ipcRenderer.send('selectFile', { response: 'existingFilePath', extensions: extensionTypes })
  }

  const canCreate = () => {
    if (assetId.group == '') return false
    if (assetId.name == '') return false
    if (assetId.task == '') return false
    if (assetId.subtask == '') return false
    if (newFileName == '') return false
    if (useExistingFile && existingFilePath == '') return false
    return true
  }

  const createAsset = () => {
    const asset = assetId
    asset.project = asset.projectPath
    asset.state = '<>'

    let formattedPath = format(asset.path, asset)
    const index = formattedPath.indexOf('<>')
    formattedPath = formattedPath.slice(0, index)
    const path = `${formattedPath}work_v001/`

    if (useExistingFile) {
      const pathSplit = existingFilePath.split('.')
      const ext = pathSplit[pathSplit.length - 1]

      const filePath = `${path}${newFileName}.${ext}`

      const data = {
        type: newFileType,
        id: 'new',
        command: 'create_asset_from_existing',
        customArgs: true,
        arguments: [
          existingFilePath,
          filePath,
          path
        ]
      }
      ipcRenderer.send('execTask', data)
    } else {
      const softType = newFileType == 'maya' ? 'mayapy' : newFileType == 'houdini' ? 'hython' : ''
      const ext = newFileType == 'maya' ? 'ma' : newFileType == 'houdini' ? 'hipnc' : 'nk'
      const filePath = `${path}${newFileName}.${ext}`

      const data = {
        type: softType,
        id: softType,
        command: 'create_asset',
        arguments: [
          filePath
        ]
      }

      ipcRenderer.send('execTask', data)
    }
  }

  useEffect(() => {
    ipcRenderer.on('existingFilePath', (event, data) => {
      setExistingFilePath(data)
    })
  })

  return (
    <Modal
      theme={theme}
      primaryColor={primaryColor}
      show={show}
      title="Create Asset"
      handleClose={() => close()}
    >
      <div className="new-asset-container">
        <div className="new-asset-inner-container">
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Project:</h3>
              </div>
              <div className="new-asset-dropdown">
                <Dropdown
                  theme={theme}
                  primaryColor={primaryColor}
                  value={assetId.project}
                  options={assetId.projects}
                  onChange={(element) => setAssetIdValue('project', element)}
                />
              </div>
            </div>
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Asset or Shot:</h3>
              </div>
              <div className="new-asset-dropdown">
                <Switch
                  theme={theme}
                  primaryColor={primaryColor}
                  value={assetId.pathType}
                  option1="Assets"
                  value1="asset"
                  option2="Shots"
                  value2="shot"
                  onChange={(choice) => setAssetIdValue('pathType', choice)}
                />
              </div>
            </div>
          </div>
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Dimension:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-file-type-list">
                <RadioButton
                  theme={theme}
                  primaryColor={primaryColor}
                  label="3d"
                  checked={assetId.dimension == '3d'}
                  onCheck={() => setAssetIdValue('dimension', '3d')}
                />
                <RadioButton
                  theme={theme}
                  primaryColor={primaryColor}
                  label="2d"
                  checked={assetId.dimension == '2d'}
                  onCheck={() => setAssetIdValue('dimension', '2d')}
                />
              </div>
            </div>
          </div>
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Asset Type:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                <Autocomplete
                  theme={theme}
                  primaryColor={primaryColor}
                  setValue={(value) => setAssetIdValue('group', value)}
                  items={assetId.groups}
                  value={assetId.group}
                  placeholder=""
                />
              </div>
            </div>
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Asset Name:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                <Autocomplete
                  theme={theme}
                  primaryColor={primaryColor}
                  setValue={(value) => setAssetIdValue('name', value)}
                  items={assetId.names}
                  value={assetId.name}
                  placeholder=""
                />
              </div>
            </div>
          </div>
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Task:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                <Autocomplete
                  theme={theme}
                  primaryColor={primaryColor}
                  assetId={assetId}
                  setValue={(value) => setAssetIdValue('task', value)}
                  items={assetId.tasks}
                  value={assetId.task}
                  placeholder=""
                />
              </div>
            </div>
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>Subtask:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                {/* <Autocomplete
                    theme={theme}
                    primaryColor={primaryColor}
                    assetId={assetId}
                    setValue={(value) => setAssetIdValue("subtask", value)}
                    items={assetId["subtasks"]}
                    value={assetId["subtask"]}
                    placeholder=""
                  /> */}
                <input className={`input ${theme}`} value={assetId.subtask} onChange={(e) => setAssetIdValue('subtask', e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>File Name:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-option-autocomplete">
                <input className={`input ${theme}`} onChange={(e) => setNewFileName(e.target.value)}/>
              </div>
            </div>
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <h3>File Type:</h3>
              </div>
              <div className="new-asset-dropdown new-asset-file-type-list">
                <div className={newFileType == 'maya' ? 'new-asset-file-type selected' : 'new-asset-file-type'} onClick={(e) => setNewFileType('maya')}>
                  <div className="new-asset-type-file-type-img">
                    <img src="softwareLogos/maya.png"/>
                  </div>
                  {/* <div className="new-asset-file-type-title">Maya</div> */}
                </div>
                <div className={newFileType == 'houdini' ? 'new-asset-file-type selected' : 'new-asset-file-type'} onClick={(e) => setNewFileType('houdini')}>
                  <div className="new-asset-type-file-type-img">
                    <img src="softwareLogos/houdini.png"/>
                  </div>
                  {/* <div className="new-asset-file-type-title">Houdini</div> */}
                </div>
                <div className={newFileType == 'nuke' ? 'new-asset-file-type selected' : 'new-asset-file-type'} onClick={(e) => setNewFileType('nuke')}>
                  <div className="new-asset-type-file-type-img">
                    <img src="softwareLogos/nuke.png"/>
                  </div>
                  {/* <div className="new-asset-file-type-title">Nuke</div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="new-asset-option-row">
            <div className="new-asset-option">
              <div className="new-asset-option-title">
                <CheckBox
                  theme={theme}
                  primaryColor={primaryColor}
                  label="Use existing file or template"
                  checked={useExistingFile}
                  // onCheck={() => setUseExistingFile(!useExistingFile)}
                  onCheck={() => console.log('noooo')}
                />
              </div>
              {useExistingFile
                ? <div className="new-asset-dropdown new-asset-option-autocomplete">
                  <div className="file-label" onClick={(e) => selectFile()}>
                    <div className={`file-cta ${theme}`}>
                      <span className="file-icon">
                        <i className="las la-file"></i>
                      </span>
                      <span className="file-label">
                        {existingFilePath == '' ? 'Select Project File' : existingFilePath}
                      </span>
                    </div>
                  </div>
                </div>
                : ''
              }
            </div>
          </div>
          {canCreate()
            ? <div className="new-asset-option-row">
              <div className="new-asset-option">
                <div className={'button create-asset-btn ' + theme} onClick={(e) => createAsset()}>Create</div>
              </div>
            </div>
            : ''
          }
        </div>
      </div>
    </Modal>
  )
}

export default NewAssetContainer
