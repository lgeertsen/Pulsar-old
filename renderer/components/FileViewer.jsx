import React, { useState } from 'react';

import CheckBox from './CheckBox'
import CommentContainer from '../containers/CommentContainer';
import Modal from './Modal';

const FileViewer = ({ theme, primaryColor, sid, execTask, onChangeComment, onSaveComment, softwares, selectSoftware, selectedSoftware, selectedSoft, checkSotfwareSaved, getWipName, refresh }) => {

  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const [command, setCommand] = useState(undefined);
  const [newFileName, setNewFileName] = useState(undefined);

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
        file: sid.file.path,
        force: checked ? 1 : 0
      }
    };
    if(command == "open_file_as") {
      refresh()
      task.arguments["name"] = newFileName;
    }
    execTask(task);
  };

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
      <div className="fileViewer">
        <div className="fileContainer">
          <div className="fileContainerInner">
            <div className="fileInfoContainer">
              <div className="fileInfo">
                <h3>{sid.file.name + "_" + sid.file.state + "_" + sid.file.version + "." + sid.file.extension}</h3>
                <h4>{sid.file.modified}</h4>
                <h4>{getSize(sid.file.size)}</h4>
              </div>

              <div className="commandsContainer">
                {sid.file.state != "publish" ?
                  <div className="btnContainer">
                    <div className="btn" onClick={(e) => onBtnClick("open_file", true)}>
                      <span>Open</span>
                    </div>
                    <div className="btn" onClick={(e) => onBtnClick("open_file_as", true)}>
                      <span>Open As</span>
                    </div>
                    {/* <div className="btn">
                      <span>Save</span>
                    </div>
                    <div className="btn">
                      <span>Save As</span>
                    </div> */}
                    {sid.file.state == "work" ?
                      <div className="btn">
                        <span>Publish</span>
                      </div>
                      : ""
                    }
                  </div>
                  : ""
                }
                {sid.file.state == "publish" && sid.file.version != "valid" ?
                  <div className="btn">
                    <span>Release</span>
                  </div>
                  : ""
                }
                {sid.file.state == "work" ?
                  <div className="btn">
                    <span>Publish & Release</span>
                  </div>
                  : ""
                }
              </div>
            </div>
            <div className="fileComment">
              <CommentContainer theme={theme} comment={sid.file.comment} onChange={(e) => editComment(e)} saveComment={() => onSave()}/>
            </div>
            <div className="fileScreenshot">
              <h3>Screenshot</h3>
            </div>
          </div>
        </div>

        <Modal theme={theme} primaryColor={primaryColor} show={showModal} handleClose={(value) => handleModal(value)}>
          <div className="openSoftModal">
            <div className="modalTitle">
              <h3>{sid.file.name + "_" + sid.file.state + "_" + sid.file.version + "." + sid.file.extension}</h3>
            </div>
            {command == "open_file_as" ?
              <div className="newNameContainer">
                <div className="label"><h4>Open As:</h4></div>
                <div className="nameInputContainer">
                  <input className="nameInput" value={newFileName} onChange={(e) => onFileNameChange(e.target.value)}/>
                </div>
              </div>
              : ""
            }
            <div className="softwareContainer">
              <h4>Open in:</h4>
              <div className="softwareSelection">
                {softwares.map((soft, index) => (
                  <div key={index} className={soft.id == selectedSoftware ? "software selected" : "software"} onClick={(e) => onClickSoft(soft.id, soft.software)}>
                    <img className="softwareImg" src={"./static/" + soft.software + ".png"}></img>
                    <span>{soft.saved == 1 ? soft.scene : soft.scene + "*"}</span>
                  </div>
                ))}
              </div>
            </div>
            {selectedSoftware != undefined ?
                <div>
                  {selectedSoftware != "new" && selectedSoft.saved == 0 ?
                    <CheckBox theme={theme} primaryColor={primaryColor} label="Save current open scene" checked={checked} onCheck={() => checkBox()}/>
                    : ""
                  }
                  <div className="btn" onClick={() => handleClick()}>Open</div>
                </div>
              :
              <h6>Please select a software.</h6>
            }
          </div>
        </Modal>


        <style jsx>{`
          .fileViewer {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .fileContainer {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .fileContainerInner {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            height: 100%;
            margin: 15px 25px;
            background: ${theme.background};
            border-radius: 6px;
            border: ${theme.border};
          }

          .fileInfoContainer {
            width: 400px;
            display: flex;
            flex-direction: row;
            padding-top: 10px;
            margin: 0 15px;
            border-right: ${theme.accentBorder};
          }
          .fileInfo {
            flex: 1;
          }
          .fileInfo h3 {
            width: 95%;
            word-break: break-word;
          }



          .fileComment {
            display: flex;
            flex-direction: column;
            width: 350px;
            padding-top: 10px;
            margin-right: 15px;
            border-right: ${theme.accentBorder};
          }





          .fileScreenshot {
            flex: 1;
            padding-top: 10px;
            margin-right: 15px;
          }



          .commandsContainer {
            width: auto;
            display: flex;
            flex-direction: column;
            // flex-wrap: wrap;
          }
          .btnContainer {
            width: auto;
            height: auto;
            display: flex;
            flex-direction: column;
          }
          .btn {
            display: flex;
            align-items: center;
            width: 100px;
            height: 25px;
            margin: 5px;
            padding: 2px 5px;
            border-radius: 6px;
            font-size: 14px;
            background: ${theme.background};
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border: ${theme.border};
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn:hover {
            background: ${theme.secondaryBg};
          }

          .openSoftModal {
            width: 500px;
            padding-left: 15px;
            padding-right: 15px;
          }

          .modalTitle {
            margin-bottom: 20px;
          }

          .newNameContainer {
            margin: 15px 0;
          }
          .nameInput {
            width: 450px;
            height: 30px;
            margin-top: 10px;
            padding-left: 10px;
            border: ${theme.border};
            border-radius: 3px;
          }

          .softwareContainer h4 {
            margin-bottom: 10px;
          }
          .softwareSelection {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
          }
          .software {
            min-width: 100px;
            width: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 5px 8px;
            padding: 10px 5px;
            border: ${theme.border};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            transition: all ease 0.2s;
          }
          .software.selected {
            background: ${theme.colors[primaryColor]};
          }
          .software img {
            width: 80px;
            margin-bottom: 10px;
          }
          .software:hover {
            box-shadow: 0 3px 10px 4px rgba(0,0,0,0.04);
          }

          .checkboxContainer {
            margin: 10px 0;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
          .checkbox {
            position: relative;
            width: 20px;
            height: 20px;
            background: ${theme.secondaryBg};
            border: ${theme.border};
            border-radius: 3px;
            margin: 0 8px;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .checkbox.checked:after {
            content: "";
            position: absolute;
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid ${theme.colors.white};
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
          }
          .checkbox:hover {
            border-color: ${theme.colors[primaryColor]};
          }
          .checkbox.checked {
            background: ${theme.colors[primaryColor]};
          }
          .checkboxLabel {
            flex: 1;
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
        `}</style>
      </div>
    );
};

export default FileViewer;
