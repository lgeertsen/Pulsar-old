import React, { useState } from 'react';

import Autocomplete from './Autocomplete';
import CheckBox from './CheckBox'
import CommentContainer from '../containers/CommentContainer';
import Modal from './Modal';

const tags = [
  "DONE",
  "RETAKE",
  "TODO",
  "VALID",
  "WFA",
  "WIP"
]

const SequenceViewver = ({ theme, primaryColor, assetId, execTask, onChangeComment, onSaveComment, softwares, selectSoftware, selectedSoftware, selectedSoft, checkSotfwareSaved, getWipName, refresh }) => {

  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [command, setCommand] = useState(undefined);
  const [newFileName, setNewFileName] = useState(undefined);
  const [newTag, setNewTag] = useState("");
  const [frameData, setFrameData] = useState({});

  const onBtnClick  = (command, openModal) => {
    setCommand(command);
    if(command = "open_file_as") {
      let wipName = getWipName()
      setNewFileName(wipName)
    }
    handleModal(openModal);
  }

  const handleClick = () => {
    handleModal(false);
    let task = {
      command: command,
      arguments: {
        file: assetId.file.path,
        force: checked ? 1 : 0
      }
    };
    if(command == "open_file_as") {
      refresh()
      task.arguments["name"] = newFileName;
    }
    execTask(task);
  };

  const onPublish = () => {
    console.log(assetId.file);
    if(["ma", "mb"].includes(assetId.file.extension)) {
      selectSoftware("mayapy", "mayapy")
    } else if(["hip", "hipnc"].includes(assetId.file.extension)) {
      selectSoftware("hython", "hython")
    } else if(["nk"].includes(assetId.file.extension)) {

    }
    let task = {
      command: "publish",
      arguments: {
        file: assetId.file.path
      }
    }
    execTask(task)
  }

  const handleModal = value => {
    if(value == true) {
      checkSotfwareSaved();
    } else {
      selectSoftware(undefined);
      setChecked(false);
    }
    setShowModal(value);
  }

  const editComment = e => {
    onChangeComment(e);
  }

  const onSave = () => {
    onSaveComment();
  }

  const onClickSoft = (id, software) => {
    selectSoftware(id, software);
  }

  const checkBox = () => {
    setChecked(!checked);
  }

  const onFileNameChange = value => {
    setNewFileName(value);
  }

  const getPath = (path, frame) => {
    var pathSplit = path.split(".");
    var fileName = `${pathSplit[0]}.${frame}.${pathSplit[2]}`
    return fileName
  }

  const getSize = bytes => {
    let suffixes =  ["B", "KB", "MB", "GB", "TB"];
    let counter = 0;
    while (Math.round(bytes / 1024) >= 1) {
      bytes = bytes / 1024;
      counter++;
    }
    bytes = Math.round(bytes);
    return bytes.toString() + suffixes[counter];
  }

    return (
      <div className={"file-viewer card " + theme}>
        <div className="file-viewer-inner card-content">
          <div className="file-viewer-info-container">
            <div className="file-viewer-file-info">

              <div className="file-viewer-file-state field is-grouped is-grouped-multiline">
                <div className="control">
                  <div className=" tags has-addons">
                    <span className="tag">{assetId.file.state ? assetId.file.state : "Version"}</span>
                    <span className="tag is-primary">{assetId.file.version}</span>
                  </div>
                </div>
                {assetId.file.tags ? assetId.file.tags.map((tag, index) => (
                  <div key={index} className="control">
                    <div className="tags has-addons">
                      <span className={`tag tag-${tag.toLowerCase()}`}>{tag}</span>
                      <a className="tag is-delete" onClick={(e) => deleteTag(tag)}></a>
                    </div>
                  </div>
                )) : ""}
                <form onSubmit={(e) => addTag(e)}>
                  <div className="field has-addons">
                    <div className={"tag-autocomplete control " + theme}>
                      {/* <input className="input" type="text" placeholder="Add Tag" value={newTag} onChange={(e) => setNewTag(e.target.value)}/> */}
                      {/* <Autocomplete
                        theme={theme}
                        primaryColor={primaryColor}

                      /> */}
                      <Autocomplete
                        theme={theme}
                        primaryColor={primaryColor}
                        setValue={value => setNewTag(value)}
                        items={tags}
                        value={newTag}
                        placeholder="Enter Tag"
                      />
                    </div>
                    <div className="control">
                      <input className={"button " + theme} type="submit" value="Add" />
                    </div>
                  </div>
                </form>
              </div>



              <h3>{assetId.file.name}</h3>
              <h3>{assetId.file.frames}</h3>
            {/* <h3>Frames : {(assetId.file.frames[0] + "-" + assetId.file.frames[assetId.file.frames.length - 1])}</h3> */}
              <h4>Last modified: {assetId.file.modified}</h4>
              <h4>File size: {getSize(assetId.file.size)}</h4>
              <h4>AssetId: {`${assetId.project}/${assetId.dimension}/${assetId.group}/${assetId.name}/${assetId.task}/${assetId.subtask}/${assetId.file.state}/${assetId.file.version}/${assetId.file.name}.${assetId.file.extension}`}</h4>
              <h4>Path: {assetId.file.path}</h4>
            </div>

            <div className="commands-container">
              {assetId.file.state != "publish" ?
                <div className="btn-container">
                  <div className={"button " + theme} onClick={(e) => onBtnClick("open_file", true)}>
                    <span>Open</span>
                  </div>
                  <div className={"button " + theme} onClick={(e) => onBtnClick("open_file_as", true)}>
                    <span>Open As</span>
                  </div>
                  {assetId.file.state == "work" ?
                    <div className={"button " + theme} onClick={() => onPublish()}>
                      <span>Publish</span>
                    </div>
                    : ""
                  }
                </div>
                : ""
              }
              {assetId.file.state == "publish" && assetId.file.version != "valid" ?
                <div className={"button " + theme}>
                  <span>Release</span>
                </div>
                : ""
              }
              {assetId.file.state == "work" ?
                <div className={"button " + theme}>
                  <span>Publish & Release</span>
                </div>
                : ""
              }
            </div>
          </div>

          {/* <div className="image-container">
            <select id="frames">
              {assetId.file.frames.map((frame) => (
                <option value={frame}>{frame}</option>
              ))}
            </select>
          </div> */}

          <div className="file-viewer-comment-container">
            <CommentContainer theme={theme} comment={assetId.file.comment} onChange={(e) => editComment(e)} saveComment={() => onSave()}/>
          </div>
          {/* <div className="file-screenshot">
            <h3>Screenshot</h3>
          </div> */}
        </div>

        <Modal theme={theme} primaryColor={primaryColor} title="Open file" show={showModal} handleClose={(value) => handleModal(value)}>
          <div className="open-soft-modal">
            <div className="modal-title">
              <h3>{assetId.file.name + "_" + assetId.file.state + "_" + assetId.file.version + "." + assetId.file.extension}</h3>
            </div>
            {command == "open_file_as" ?
              <div className="new-name-container">
                <div className="label"><h4>Open As:</h4></div>
                <div className="name-input-container">
                  <input className="name-input input" value={newFileName} onChange={(e) => onFileNameChange(e.target.value)}/>
                </div>
              </div>
              : ""
            }
            <div className="modal-software-container">
              <h4>Open in:</h4>
              <div className="software-selection">
                {softwares.map((soft, index) => (
                  <div key={index} className={soft.id == selectedSoftware ? "software selected " + theme : "software " + theme} onClick={(e) => onClickSoft(soft.id, soft.software)}>
                    <img className="software-img" src={"./static/" + soft.software + ".png"}></img>
                    <span>{soft.saved == 1 ? soft.scene : soft.scene + "*"}</span>
                  </div>
                ))}
              </div>
            </div>
            {selectedSoftware != undefined ?
                <div>
                  {!["new", "mayapy", "hython"].includes(selectedSoftware) && selectedSoft.saved == 0 ?
                    <CheckBox theme={theme} primaryColor={primaryColor} label="Save current open scene" checked={checked} onCheck={() => checkBox()}/>
                    : ""
                  }
                  <div className={"button " + theme} onClick={() => handleClick()}>Open</div>
                </div>
              :
              <h6>Please select a software.</h6>
            }
          </div>
        </Modal>


        <style jsx>{`

        `}</style>
      </div>
    );
};

export default SequenceViewver;
