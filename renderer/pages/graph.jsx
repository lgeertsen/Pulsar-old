import electron from 'electron';
import React from 'react';
import Head from 'next/head';

const ipcRenderer = electron.ipcRenderer || false;

import Node from '../components/Node';
import Edge from '../components/Edge';

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      graphPosition: {
        x: 0,
        y: 0
      },
      initialX: 0,
      initialY: 0,
      xOffset: undefined,
      yOffset: undefined,
      currentX: 0,
      currentX: 0,
      active: false,
      dragItem: undefined,

      graphScale: 1,

      dragEdge: {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0
      },
      draggingEdge: false,
      draggingType: undefined,
      draggingEdgeNodeId: undefined,
      draggingEdgeAttribId: undefined,

      nodes: {
        "node1": {
          name: "Node 1",
          x: 10200,
          y: 10400,
          inputs: {
            "input1": {
              name: "input1",
              ref: React.createRef()
            },
            "input2": {
              name: "input2",
              ref: React.createRef()
            },
            "input3": {
              name: "input3",
              ref: React.createRef()
            },
          },
          outputs: {
            "output1": {
              name: "output1",
              ref: React.createRef()
            },
            "output2": {
              name: "output2",
              ref: React.createRef()
            },
          }
        },
        "node2": {
          name: "Node 2",
          x: 10700,
          y: 10500,
          inputs: {
            "input1": {
              name: "input1",
              ref: React.createRef()
            },
            "input2": {
              name: "input2",
              ref: React.createRef()
            },
          },
          outputs: {
            "output1": {
              name: "output1",
              ref: React.createRef()
            },
            "output2": {
              name: "output2",
              ref: React.createRef()
            },
          }
        },
        "node3": {
          name: "Node 3",
          x: 11000,
          y: 10300,
          inputs: {
            "input1": {
              name: "input1",
              ref: React.createRef()
            },
            "input2": {
              name: "input2",
              ref: React.createRef()
            },
            "input3": {
              name: "input3",
              ref: React.createRef()
            }
          },
          outputs: {
            "output1": {
              name: "output1",
              ref: React.createRef()
            },
            "output2": {
              name: "output2",
              ref: React.createRef()
            },
            "output3": {
              name: "output3",
              ref: React.createRef()
            },
            "output4": {
              name: "output4",
              ref: React.createRef()
            }
          }
        }
      },

      edges: {
        edge1: {
          input: {
            node: "node2",
            attribute: "input2"
          },
          output: {
            node: "node1",
            attribute: "output1"
          }
        },
        edge2: {
          input: {
            node: "node3",
            attribute: "input3"
          },
          output: {
            node: "node2",
            attribute: "output1"
          }
        },
        edge3: {
          input: {
            node: "node3",
            attribute: "input1"
          },
          output: {
            node: "node1",
            attribute: "output2"
          }
        }
      },
      softwares: {

      }
    }
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getSoftwares")




      console.log("----- ipcRenderer exists -----");
      ipcRenderer.on('softwares', (event, data) => {
        console.log("----- receive list of open softwares -----");
        this.setState({softwares: data})
      })
    }
  }

  dragStart(e) {
    console.log(e.target);
    if (e.button == 0 && e.target.getAttribute("draggable") == "true") {
      e.preventDefault();
      let active = true;
      let dragItem =  e.target.getAttribute("nodeid");
      let node = this.state.nodes[dragItem];
      let initialX = e.clientX - node.x;
      let initialY = e.clientY - node.y;
      this.setState({initialX: initialX, initialY: initialY, active: active, dragItem: dragItem});
    } else if(e.button == 1) {
      e.preventDefault();
      let active = true;
      let dragItem = "46541654165graph465146541651";
      let initialX = e.clientX - this.state.graphPosition.x;
      let initialY = e.clientY - this.state.graphPosition.y;
      this.setState({initialX: initialX, initialY: initialY, active: active, dragItem: dragItem});
    } else if(e.target.getAttribute("attributetype")) {
      e.preventDefault();
      this.startEdgeDrag(e);
    }
  }

  dragEnd(e) {
    let initialX = this.state.currentX;
    let initialY = this.state.currentY;
    let active = false;
    let dragItem = undefined;
    this.setState({initialX: initialX, initialY: initialY, active: active, dragItem: dragItem, draggingEdge: false});
    if(this.state.draggingEdge) {
      this.endEdgeDrag(e);
    }
  }

  drag(e) {
    e.preventDefault();
    if(this.state.active) {
      if(this.state.dragItem == "46541654165graph465146541651") {
        let currentX = e.clientX - this.state.initialX;
        let currentY = e.clientY - this.state.initialY;
        let xOffset = currentX;
        let yOffset = currentY;
        let position =  { x: currentX, y: currentY };

        this.setState({currentX: currentX, currentY: currentY, xOffset: xOffset, yOffset: yOffset, graphPosition: position});
      } else if (this.state.active && this.state.dragItem != undefined) {
        e.preventDefault();
        let currentX = e.clientX - this.state.initialX;
        let currentY = e.clientY - this.state.initialY;
        let xOffset = currentX;
        let yOffset = currentY;

        let nodes = this.state.nodes
        nodes[this.state.dragItem].x = currentX;
        nodes[this.state.dragItem].y = currentY;

        this.setState({currentX: currentX, currentY: currentY, xOffset: xOffset, yOffset: yOffset, nodes: nodes});
      }
    } else if(this.state.draggingEdge) {
      this.dragEdge(e);
    }
  }

  startEdgeDrag(e) {
    if(e.target.getAttribute("attributetype") == "input") {
      let x1 = 10000 + e.screenX - this.state.graphPosition.x - 3;
      let y1 = 10000 + e.screenY - this.state.graphPosition.y - 47;
      let targetPos = e.target.getBoundingClientRect();
      let x2 = 10000 + targetPos.x - this.state.graphPosition.x - 3;
      let y2 = 10000 + targetPos.y - this.state.graphPosition.y;

      let edgePos = this.state.dragEdge;
      edgePos.x1 = x1;
      edgePos.y1 = y1;
      edgePos.x2 = x2;
      edgePos.y2 = y2;

      let nodeId = e.target.getAttribute("nodeid");
      let attribId = e.target.getAttribute("attributeid");

      this.setState({draggingEdge: true, dragEdge: edgePos, draggingType: "input", draggingEdgeNodeId: nodeId, draggingEdgeAttribId: attribId});
    } else {
      let targetPos = e.target.getBoundingClientRect();
      let x1 = 10000 + targetPos.x - this.state.graphPosition.x + 3;
      let y1 = 10000 + targetPos.y - this.state.graphPosition.y;
      let x2 = 10000 + e.screenX - this.state.graphPosition.x - 3;
      let y2 = 10000 + e.screenY - this.state.graphPosition.y - 47;
      let edgePos = this.state.dragEdge;
      edgePos.x1 = x1;
      edgePos.y1 = y1;
      edgePos.x2 = x2;
      edgePos.y2 = y2;

      let nodeId = e.target.getAttribute("nodeid");
      let attribId = e.target.getAttribute("attributeid");

      this.setState({draggingEdge: true, dragEdge: edgePos, draggingType: "output", draggingEdgeNodeId: nodeId, draggingEdgeAttribId: attribId});
    }
  }

  dragEdge(e) {
    if(this.state.draggingType == "input") {
      let x1 = 10000 + e.screenX - this.state.graphPosition.x - 3;
      let y1 = 10000 + e.screenY - this.state.graphPosition.y - 47;
      let edgePos = this.state.dragEdge;
      edgePos.x1 = x1;
      edgePos.y1 = y1;

      this.setState({draggingEdge: true, dragEdge: edgePos});
    } else if(this.state.draggingType == "output") {
      let x2 = 10000 + e.screenX - this.state.graphPosition.x - 3;
      let y2 = 10000 + e.screenY - this.state.graphPosition.y - 47;
      let edgePos = this.state.dragEdge;
      edgePos.x2 = x2;
      edgePos.y2 = y2;

      this.setState({draggingEdge: true, dragEdge: edgePos});
    }
  }

  endEdgeDrag(e) {
    console.log(e.target);
    let attributeType = e.target.getAttribute("attributetype");
    if(attributeType) {
      if(attributeType == this.state.draggingType) { return; }

      let edgeNum = Object.keys(this.state.edges).length+1;
      let edgeId = "edge" + edgeNum;

      let nodeIn, nodeOut, attribIn, attribOut;

      if(attributeType == "input") {
        nodeIn = e.target.getAttribute("nodeid");
        attribIn = e.target.getAttribute("attributeid");
        nodeOut = this.state.draggingEdgeNodeId;
        attribOut = this.state.draggingEdgeAttribId;
      } else {
        nodeIn = this.state.draggingEdgeNodeId;
        attribIn = this.state.draggingEdgeAttribId;
        nodeOut = e.target.getAttribute("nodeid");
        attribOut = e.target.getAttribute("attributeid");
      }

      let edges = this.state.edges;

      edges[edgeId] = {
        input: {
          node: nodeIn,
          attribute: attribIn
        },
        output: {
          node: nodeOut,
          attribute: attribOut
        }
      }

      this.setState({edges: edges});
    }
  }

  zoom(e) {
    let scale = this.state.graphScale;

    if(e.deltaY > 0 && scale > 0.1) {
      scale -= 0.05;
    } else if (e.deltaY < 0 && scale < 2) {
      scale += 0.05;
    }

    this.setState({graphScale: scale});
  }

  editNodeName(nodeId, event) {
    console.log("smqdlkfjsdklmqfjsklmqdfjklm");
    let nodes = this.state.nodes;
    nodes[nodeId].name = event.target.value;
    this.setState({nodes: nodes});
  }

  renderNode(nodeId, index) {
    let node = this.state.nodes[nodeId];
    return (
      <Node
        key={index}
        selected={this.state.dragItem == nodeId}
        nodeId={nodeId}
        name={node.name}
        editName={(nodeId, event) => this.editNodeName(nodeId, event)}
        x={node.x}
        y={node.y}
        inputs={node.inputs}
        outputs={node.outputs}
        draggingEdge={this.state.draggingEdge}
      />
    )
  }

  renderEdge(edgeId, index) {
    let edge = this.state.edges[edgeId];
    let pinOut = this.state.nodes[edge.output.node].outputs[edge.output.attribute].ref.current;
    let pinIn = this.state.nodes[edge.input.node].inputs[edge.input.attribute].ref.current;
    if(pinOut != null && pinIn != null) {
      let pinOutPos = pinOut.getBoundingClientRect();
      let pinInPos = pinIn.getBoundingClientRect();

      let x1 = 10000 + pinOutPos.x - this.state.graphPosition.x;
      let y1 = 10000 + pinOutPos.y - this.state.graphPosition.y;
      let x2 = 10000 + pinInPos.x - this.state.graphPosition.x;
      let y2 = 10000 + pinInPos.y - this.state.graphPosition.y;
      return (
        <Edge key={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
      )
    }
    return null;
  }

  render() {
    var x = this.state.graphPosition.x;
    var y = this.state.graphPosition.y;
    var scale = this.state.graphScale;
    var graphTransform = {
      transform: `translate3d(${x}px, ${y}px, 0px) scale3d(${scale}, ${scale}, 1)`
    }

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
        </Head>

        <div className="main">
          <div className="graphContainer">
            <div className="graphEditor"
              style={graphTransform}
              onMouseDown={(e) => this.dragStart(e)}
              onMouseMove={(e) => this.drag(e)}
              onMouseUp={(e) => this.dragEnd(e)}
              onWheel={(e) => this.zoom(e)}
            >
              <div className="nodeContainer">
                {Object.keys(this.state.nodes).map((nodeId, index) => (
                  this.renderNode(nodeId, index)
                ))}
              </div>
              <div className="svgContainer">
                <svg>
                  {this.state.draggingEdge ?
                    <path className="dragEdge"
                      d={`M${this.state.dragEdge.x1},${this.state.dragEdge.y1} C${this.state.dragEdge.x1 + Math.min(300, Math.abs(this.state.dragEdge.y1 - this.state.dragEdge.y2)/2)},${this.state.dragEdge.y1} ${this.state.dragEdge.x2 - Math.min(300, Math.abs(this.state.dragEdge.y1 - this.state.dragEdge.y2)/2)},${this.state.dragEdge.y2} ${this.state.dragEdge.x2},${this.state.dragEdge.y2}`}
                      stroke="#444"
                      strokeWidth="1"
                      fill="none"
                    />
                    :
                    ""
                  }
                  {Object.keys(this.state.edges).map((edgeId, index) => (
                    this.renderEdge(edgeId, index)
                  ))}
                </svg>
              </div>

            </div>
          </div>
          {/* <div className="softwaresContainer">
              <h2>Open softwares</h2>
            <div className="softwares">
              {Object.keys(this.state.softwares).map((softwareId, index) => (
                <div key={index} className="software">
                  <h4 className="softwareName">{this.state.softwares[softwareId].software}</h4>
                  <img className="softwareImg" src={"./static/" + this.state.softwares[softwareId].software + ".jpg"}></img>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        <style jsx global>{`
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #eee;
          }
          * {
            font-family: "Oswald", sans-serif;
            margin: 0;
          }
          div {
            height: 100%;
            width: 100%;
          }
        `}</style>
        <style jsx>{`
          .main {
            display: flex;
            flex-direction: column;
          }
          .main > div {
            width: auto;
            height: auto;
          }
          .main .softwaresContainer {
            position: relative;
            z-index: 2;
            height: 200px;
            width: 100%;
            background: #ddd;
            border-top: 3px solid #444;
            display: flex;
            flex-direction: column;
            padding: 25px;
          }
          .main .softwaresContainer .softwares {
            flex: 1;
            display: flex;
            flex-direction: row;
          }
          .main .softwaresContainer .softwares .software {
            height: auto;
            width: 150px;
            margin-right: 25px;
          }
          .main .softwaresContainer .softwares .software .softwareImg {
            width: 75%;
          }
          .main .graphContainer {
            position: relative;
            z-index: 2;
            flex: 1;
            width: 100%;
          }
          .graphEditor {
            z-index: 1;
            position: absolute;
            width: 20000px;
            height: 20000px;
            left: -10000px;
            top: -10000px;
            background: transparent;
            border: 5px solid #444;
            overflow: hidden;
            touch-action: none;
          }
          .nodeContainer {
            position: absolute;
            width: 0;
            top: 0;
            left: 0;
            z-index: 3;
          }
          .svgContainer {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
          }
          .svgContainer svg {
            position: absolute;
            width: 100%;
            height 100%;
          }
        `}</style>
      </React.Fragment>
    );
  };
};
