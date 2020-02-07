import React from 'react';

export default class Edge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false
    }
  }

  render() {
    var x = this.props.x;
    var y = this.props.y;
    var nodePosition = {
        transform: `translate3d(${x}px, ${y}px, 0px)`
    };

    return (
      <path className={this.state.hovered ? `edge hovered stroke-${this.props.primaryColor} ${this.props.theme}` : `edge ${this.props.theme}`}
        d={`M${this.props.x1},${this.props.y1} C${this.props.x1 + Math.min(300, Math.abs(this.props.y1 - this.props.y2)/2)},${this.props.y1} ${this.props.x2 - Math.min(300, Math.abs(this.props.y1 - this.props.y2)/2)},${this.props.y2} ${this.props.x2},${this.props.y2}`}
        onMouseEnter={(e) => {console.log("enter", e.target); this.setState({hovered: true})}}
        onMouseLeave={(e) => {console.log("leave", e.target); this.setState({hovered: false})}}
      >


        <style jsx>{`

        `}</style>
      </path>
    );
  };
};
