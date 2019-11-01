import React, { useState } from 'react';

const CommentContainer = ({ theme, comment, onChange, saveComment }) => {

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
            background: ${theme.background};
            color: ${theme.text};
            font-family: "Open Sans Condensed", "Oswald", sans-serif;
            border:  ${theme.border};
            cursor: pointer;
            transition: all ease 0.3s;
          }
          .btn:hover {
            background: ${theme.secondaryBg};
          }
        `}</style>
      </div>
    );
};

export default CommentContainer;
