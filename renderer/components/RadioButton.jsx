import React from 'react'
import PropTypes from 'prop-types'

const RadioButton = ({ theme, primaryColor, label, checked, onCheck }) => {
  const RadioButton = () => {
    onCheck()
  }

  return (
    <div className="radioButton-container" onClick={(e) => RadioButton()}>
      <div className={checked ? `radioButton icon checked bg-${primaryColor} ${theme}` : 'radioButton icon ' + theme}>
        <i></i>
      </div>
      <div className="radioButton-label">
        <span>{label}</span>
      </div>

      <style jsx>{`

        `}</style>
    </div>
  )
}

RadioButton.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired
}

export default RadioButton
