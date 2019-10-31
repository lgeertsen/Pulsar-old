import React, { useState } from 'react';

import CommentContainer from '../containers/CommentContainer';
import Modal from './Modal';

const FileViewer = ({ file, execTask, onChangeComment, onSaveComment, softwares, selectSoftware, selectedSoftware, selectedSoft, checkSotfwareSaved }) => {

  const [showModal, setShowModal] = useState(false);

  const handleClick = command => {
    handleModal(false);
    execTask(command);
  };

  const handleModal = value => {
    if(value == true) {
      checkSotfwareSaved();
    } else {
      selectSoftware(undefined);
    }
    setShowModal(value);
  }

  const editComment = e => {
    onChangeComment(e);
  }

  const onSave = () => {
    onSaveComment();
  }

  const onClickSoft = (id) => {
    selectSoftware(id);
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
                <h3>{file.name + "_" + file.state + "_" + file.version + "." + file.extension}</h3>
                <span></span>
              </div>

              <div className="commandsContainer">
                {file.state == "work" ?
                  <div className="btnContainer">
                    <div className="btn" onClick={(e) => handleModal(true)}>
                      <span>Open</span>
                    </div>
                    <div className="btn">
                      <span>Open As</span>
                    </div>
                    {/* <div className="btn">
                      <span>Save</span>
                    </div>
                    <div className="btn">
                      <span>Save As</span>
                    </div> */}
                    <div className="btn">
                      <span>Publish</span>
                    </div>
                  </div>
                  : ""
                }
                {file.state == "publish" && file.version != "valid" ?
                  <div className="btn">
                    <span>Release</span>
                  </div>
                  : ""
                }
                {file.state == "work" ?
                  <div className="btn">
                    <span>Publish & Release</span>
                  </div>
                  : ""
                }
              </div>
            </div>
            <div className="fileComment">
              <CommentContainer comment={file.comment} onChange={(e) => editComment(e)} saveComment={() => onSave()}/>
            </div>
            <div className="fileScreenshot">
              <h3>Screenshot</h3>
            </div>
          </div>
        </div>

        <Modal show={showModal} handleClose={(value) => handleModal(value)}>
          <div className="modalTitle">
            <h3>{file.name + "_" + file.state + "_" + file.version + "." + file.extension}</h3>
          </div>
          <div className="softwareContainer">
            <h4>Open in:</h4>
            <div className="softwareSelection">
              {softwares.map((soft, index) => (
                <div key={index} className={soft.id == selectedSoftware ? "software selected" : "software"} onClick={(e) => onClickSoft(soft.id)}>
                  <img className="softwareImg" src={"./static/" + soft.software + ".jpg"}></img>
                  <span>{soft.saved == 1 ? soft.scene : soft.scene + "*"}</span>
                </div>
              ))}
              <div className={selectedSoftware == "new" ? "software selected" : "software"} onClick={(e) => onClickSoft("new")}>
                <img className="softwareImg" src={"./static/maya.jpg"}></img>
                <span>Open new maya</span>
              </div>
            </div>
          </div>
          {selectedSoftware != undefined ?
              <div>
                {selectedSoftware != "new" && selectedSoft.saved == 0 ?
                  <div className="checkboxContainer">
                    <div className="checkbox"></div>
                    <div className="checkboxLabel">Save current open scene</div>
                  </div>
                  : ""
                }
                <div className="btn" onClick={() => handleClick("open_file")}>Open</div>
              </div>
            :
            <h6>Please select a software.</h6>
          }
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
            background: #fff;
            border-radius: 6px;
            border: 1px solid #e3e3e3;
          }

          .fileInfoContainer {
            width: 400px;
            display: flex;
            flex-direction: row;
            padding-top: 10px;
            margin: 0 15px;
            border-right: 1px solid #f2f2f2;
          }
          .fileInfo {
            flex: 1;
          }



          .fileComment {
            display: flex;
            flex-direction: column;
            width: 350px;
            padding-top: 10px;
            margin-right: 15px;
            border-right: 1px solid #f2f2f2;
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
            background: #fff;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border:  1px solid #e3e3e3;
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn:hover {
            background: #f2f2f2;
          }

          .modalTitle {
            margin-bottom: 20px;
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
            border: 1px solid #e3e3e3;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            transition: all ease 0.2s;
          }
          .software.selected {
            background: #3498db;
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
            background: #f2f2f2;
            border: 1px solid #e3e3e3;
            border-radius: 3px;
            margin: 0 8px;
            cursor: pointer;
            transition: all ease 0.2s;
          }
          .checkbox:after {
            content: "";
            position: relative;
            left: 9px;
            top: 5px;
            width: 5px;
            height: 10px;
            border: solid red;
            border-width: 0 3px 3px 0;
            transform: rotate(45deg);
          }
          .checkbox:hover {
            border-color: #3498db;
          }
          .checkbox.checked {
            background: #3498db;
          }
          .checkboxLabel {
            flex: 1;
            color: #444F60;
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
          }
        `}</style>
      </div>
    );
};

export default FileViewer;
