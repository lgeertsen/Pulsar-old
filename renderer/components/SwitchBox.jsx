import React from 'react'
import PropTypes from 'prop-types'

const SwitchBox = ({ theme, primaryColor, value, onChange }) => {
  const handleChange = () => {
    onChange(!value)
  }

  return (
    <div className="switch-box">
      <input type="checkbox" className="switch-box-check" checked={value} onChange={(e) => handleChange()}/>
      <b className={value === true ? 'switch-box-b switch-box-switch checked' : 'switch-box-b switch-box-switch'}></b>
      <b className={value === true ? `switch-box-b switch-box-track checked bg-${primaryColor}` : 'switch-box-b switch-box-track'}></b>
    </div>
  )
}

SwitchBox.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default SwitchBox
