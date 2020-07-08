import React from 'react'
import PropTypes from 'prop-types'

const CheckBox = ({ theme, primaryColor, label, checked, onCheck }) => {
  // const [checked, setChecked] = useState(false);

  const checkBox = () => {
    onCheck()
  }

  return (
    <div className="checkbox-container" onClick={(e) => checkBox()}>
      <div className={checked ? `checkbox icon checked bg-${primaryColor} ${theme}` : 'checkbox icon ' + theme}>
        <i className={checked ? 'las la-check' : 'las la-check hidden'}></i>
      </div>
      {label !== undefined
        ? <div className="checkbox-label">
          <span>{label}</span>
        </div>
        : ''
      }
    </div>
  )
}

CheckBox.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onCheck: PropTypes.func.isRequired
}

export default CheckBox
