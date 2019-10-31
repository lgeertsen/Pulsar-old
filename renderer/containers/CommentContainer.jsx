import React, { useState } from 'react';

const CommentContainer = ({ comment, onChange, saveComment }) => {

  const [disabled, setDisabled] = useState(true);

  const handleClick = command => {
    if(command == "edit") {
      setDisabled(false);
    } else if(command == "save") {
      setDisabled(true);
      saveComment();
    }
  };

  const onChangeComment = e => {
    onChange(e);
  }

    return (
      <div className="commentContainer">
        <div className="titleContainer">
          <h3>Comment</h3>
        </div>
        <div className="textContainer">
          <textarea disabled={disabled} value={comment} onChange={(e) => onChangeComment(e)}/>
        </div>
        <div className="commandsContainer">
          {disabled ?
              <div className="btn" onClick={(e) => handleClick("edit")}>Edit</div>
            :
              <div className="btn" onClick={(e) => handleClick("save")}>Save</div>
          }
        </div>

        <style jsx>{`
          .commentContainer {
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
          }
          .titleContainer {
            height: auto;
            margin-bottom: 15px;
          }
          .textContainer {
            flex: 1;
            display: flex;
          }
          textarea {
            width: 100%;
            margin-right: 15px;
            resize: none;
          }
          .commandsContainer {
            margin-top: 15px;
            height: 36px;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: flex-start;
          }
          .btn {
            display: flex;
            align-items: center;
            width: 100px;
            height: 25px;
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
        `}</style>
      </div>
    );
};

export default CommentContainer;
