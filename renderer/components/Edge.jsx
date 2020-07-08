import React from 'react'
import PropTypes from 'prop-types'

export default class Edge extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hovered: false
    }
  }

  render () {
    return (
      <path className={this.state.hovered
        ? `edge edge-big-${this.props.big} hovered stroke-${this.props.primaryColor} ${this.props.theme}`
        : `edge edge-big-${this.props.big} ${this.props.theme}`
      }
      d={`M${this.props.x1},${this.props.y1} C${this.props.x1 + Math.min(300, Math.abs(this.props.y1 - this.props.y2) / 2)},${this.props.y1} ${this.props.x2 - Math.min(300, Math.abs(this.props.y1 - this.props.y2) / 2)},${this.props.y2} ${this.props.x2},${this.props.y2}`}
      onMouseEnter={(e) => { console.log('enter', e.target); this.setState({ hovered: true }) }}
      onMouseLeave={(e) => { console.log('leave', e.target); this.setState({ hovered: false }) }}
      >
      </path>
    )
  };
};

Edge.propTypes = {
  theme: PropTypes.string.isRequired,
  primaryColor: PropTypes.string.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired,
  big: PropTypes.bool.isRequired
}
