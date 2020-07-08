import React from 'react'
import PropTypes from 'prop-types'

const Switch = ({ theme, primaryColor, value, option1, value1, option2, value2, onChange }) => {
  // const [selected, setSelected] = useState(1)

  const handleChange = selectedValue => {
    onChange(selectedValue === 1 ? value1 : value2)
  }

  return (
    <div className="switch buttons has-addons">
      <div className={value === value1 ? `button is-selected bg-${primaryColor} ${theme}` : `button ${theme}`} onClick={(e) => handleChange(1)}>
        <span>{option1}</span>
      </div>
      <div className={value === value2 ? `button is-selected bg-${primaryColor} ${theme}` : `button ${theme}`} onClick={(e) => handleChange(2)}>
        <span>{option2}</span>
      </div>

      <style jsx>{`
        `}</style>
    </div>
  )
}

Switch.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  option1: PropTypes.string.isRequired,
  value1: PropTypes.string.isRequired,
  option2: PropTypes.string.isRequired,
  value2: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Switch
