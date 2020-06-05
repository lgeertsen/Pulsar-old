import React from 'react';

export default class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      readOnly: true,
      textDraggable: true
    }
  }

  render() {
    var x = this.props.x;
    var y = this.props.y;
    var nodePosition = {
        transform: `translate3d(${x}px, ${y}px, 0px)`
    };

    return (
      <div className={this.props.selected ? "node selected " + this.props.theme : "node " + this.props.theme } style={nodePosition}>
        <div className="node-top">
          <input nodeid={this.props.nodeId} draggable={this.state.textDraggable}
            className={this.state.readOnly ? "node-name " + this.props.theme : "node-name editing " + this.props.theme }
            readOnly={this.state.readOnly}
            value={this.props.name}
            onChange={(event) => this.props.editName(this.props.nodeId, event)}
            onDoubleClick={(event) => this.setState({readOnly: false, textDraggable: false})}
            onBlur={(event) => this.setState({readOnly: true, textDraggable: true})}
          />
        </div>
        <div className="node-inner">
          <div className={"node-header bg-" + this.props.color}></div>
          <div className="attribute-container">
            <div className="inputs-container">
              {this.props.inputs.map((input, index) => (
                <div className="input-container" key={index}>
                  <div className={`attribute-pin bg-${this.props.color} ${this.props.theme}`} attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} ref={input.ref}></div>
                  <div className="attribute-name-container" attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} >
                    <span className="attribute-name" attributetype="input" nodeid={this.props.nodeId} attributeid={input.name} >{input.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="outputs-container">
              {this.props.outputs.map((output, index) => (
                <div className="output-container" key={index}>
                  <div className="attribute-name-container" attributetype="output" nodeid={this.props.nodeId} attributeid={output.name}>
                    <span className="attribute-name" attributetype="output" nodeid={this.props.nodeId} attributeid={output.name}>{output.name}</span>
                  </div>
                  <div className={`attribute-pin bg-${this.props.color} ${this.props.theme}`} attributetype="output" nodeid={this.props.nodeId} attributeid={output.name} ref={output.ref}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={this.props.draggingEdge ? "no-overlay" : "drag-overlay"} nodeid={this.props.nodeId} draggable="true"></div>

        <style jsx>{`
        `}</style>
      </div>
    );
  };
};
