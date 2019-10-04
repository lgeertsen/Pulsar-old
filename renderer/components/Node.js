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
      <div className={this.props.selected ? "node selected" : "node" } style={nodePosition}>
        <div className="nodeTop">
          <input nodeid={this.props.nodeId} draggable={this.state.textDraggable}
            className={this.state.readOnly ? "nodeName" : "nodeName editing" }
            readOnly={this.state.readOnly}
            value={this.props.name}
            onChange={(event) => this.props.editName(this.props.nodeId, event)}
            onDoubleClick={(event) => this.setState({readOnly: false, textDraggable: false})}
            onBlur={(event) => this.setState({readOnly: true, textDraggable: true})}
          />
        </div>
        <div className="nodeInner">
          <div className="nodeHeader"></div>
          <div className="attributeContainer">
            <div className="inputsContainer">
              {Object.keys(this.props.inputs).map((inputId, index) => (
                <div className="inputContainer" key={index}>
                  <div className="attributePin" attributetype="input" nodeid={this.props.nodeId} attributeid={inputId} ref={this.props.inputs[inputId].ref}></div>
                  <div className="attributeNameContainer" attributetype="input" nodeid={this.props.nodeId} attributeid={inputId} >
                    <span className="attributeName" attributetype="input" nodeid={this.props.nodeId} attributeid={inputId} >{inputId}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="outputsContainer">
              {Object.keys(this.props.outputs).map((outputId, index) => (
                <div className="outputContainer" key={index}>
                  <div className="attributeNameContainer" attributetype="output" nodeid={this.props.nodeId} attributeid={outputId}>
                    <span className="attributeName" attributetype="output" nodeid={this.props.nodeId} attributeid={outputId}>{outputId}</span>
                  </div>
                  <div className="attributePin" attributetype="output" nodeid={this.props.nodeId} attributeid={outputId} ref={this.props.outputs[outputId].ref}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={this.props.draggingEdge ? "noOverlay" : "dragOverlay"} nodeid={this.props.nodeId} draggable="true"></div>

        <style jsx>{`
          .node {
            width: 200px;
            height: auto;
            border-radius: 3px;
            background: #fff;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);

            position: relative;
            z-index: 2;
            touch-action: none;
            user-select: none;

            transition: box-shadow 0.2s;
          }

          .node.selected {
            z-index: 100;
            box-shadow: 0 8px 17px 2px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2);
          }

          .nodeTop {
            position: absolute;
            width: 100%;
            height: auto;
            top: -32px;
            left: 0;
            display: flex;
            align-items: center;
          }
          .nodeTop .nodeName {
            width: 100%;
            outline: none;
            overflow: visible;
            height: 28px;
            padding: 0;
            padding-left: 5px;
            border: none;
            background: transparent;
            color: #444;
            font-size: 20px;
            border-radius: 3px;
          }
          .nodeTop .nodeName.editing {
            background: #fff;
            border: 1px solid #444;
          }
          .nodeHeader {
            width: 100%;
            height: 20px;
            background: linear-gradient(to right, #3494e6, #ec6ead);
            cursor: move;
            touch-action: none;
            user-select: none;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
          }
          .attributeContainer {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: row
          }
          .inputContainer,
          .outputContainer {
            height: 20px;
            width: 100%;
            display: flex;
            align-items: center;
          }
          .inputContainer .attributePin,
          .outputContainer .attributePin {
            z-index: 12;
            width: 8px;
            height: 8px;
            background: #3494e6;
            border-radius: 4px;
            margin-left: -4px;
            margin-right: 5px;
            box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2);
          }
          .outputContainer .attributePin {
            background: #ec6ead;
            margin-left: 5px;
            margin-right: -4px;
          }
          .inputContainer .attributePin:hover,
          .outputContainer .attributePin:hover {
            background: #fff;
          }

          .inputContainer .attributeNameContainer,
          .outputContainer .attributeNameContainer {
            display: flex;
            align-items: center;
          }
          .attributeName {
            font-size: 12px;
            font-family: sans-serif;
          }
          .outputContainer .attributeNameContainer {
            justify-content: flex-end;
          }

          .dragOverlay,
          .noOverlay {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 10;
          }
          .noOverlay {
            z-index: -1;
          }
        `}</style>
      </div>
    );
  };
};
