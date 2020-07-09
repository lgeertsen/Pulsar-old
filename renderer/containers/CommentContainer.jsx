import React, { useState } from 'react'
import PropTypes from 'prop-types'

const CommentContainer = ({ theme, comment, onChange, saveComment }) => {
  const [disabled, setDisabled] = useState(true)

  const handleClick = command => {
    if (command === 'edit') {
      setDisabled(false)
    } else if (command === 'save') {
      setDisabled(true)
      saveComment()
    }
  }

  const onChangeComment = e => {
    onChange(e)
  }

  return (
    <div className="comment-container">
      <div className="comment-title">
        <h3>Comment</h3>
      </div>
      <div className="comment-textarea">
        <textarea className={'textarea ' + theme} disabled={disabled} value={comment} onChange={(e) => onChangeComment(e)} placeholder="Create comment"/>
      </div>
      <div className="comment-commands">
        <div className={'button ' + theme} onClick={(e) => handleClick(disabled ? 'edit' : 'save')}>{disabled ? 'Edit' : 'Save'}</div>
      </div>
    </div>
  )
}

CommentContainer.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string,
  comment: PropTypes.string,
  directories: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired
}

export default CommentContainer
