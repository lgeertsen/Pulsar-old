import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import * as THREE from 'three';
import { Canvas } from 'react-three-fiber'

const ipcRenderer = electron.ipcRenderer || false;

import Nav from '../components/Nav'
import Node from '../components/Node';
import Edge from '../components/Edge';

import Box from '../components/3D/Box';

import "../styles/graph.sass"

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "theme-light",
      primaryColor: "green",

      navOpen: false,
      nodeSearchOpen: false,
      nodeSearchPosition: {
        x: 500,
        y: 500
      },

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

      nodeList: {},
      nodeListType: "",

      nodes: {
        "node1": {
          name: "Node 1",
          color: "red",
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
          color: "green",
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
          color: "cyan",
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
            attribute: "input1"
          },
          output: {
            node: "node1",
            attribute: "output1"
          }
        },
        // edge2: {
        //   input: {
        //     node: "node3",
        //     attribute: "input3"
        //   },
        //   output: {
        //     node: "node2",
        //     attribute: "output1"
        //   }
        // },
        // edge3: {
        //   input: {
        //     node: "node3",
        //     attribute: "input1"
        //   },
        //   output: {
        //     node: "node1",
        //     attribute: "output2"
        //   }
        // }
      }
    }
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig")
      ipcRenderer.send("getNodes")

      console.log("----- ipcRenderer exists -----");
      ipcRenderer.on('config', (event, data) => {
        console.log("----- receive config file -----", data);
        this.setState({config: data})
        if(data.theme) {
          console.log(data.theme);
          this.setState({theme: data.theme});
        }
        if(data.color) {
          this.setState({primaryColor: data.color});
        }
        if(data.overlay.save) {
          this.setState({saveShortcut: data.overlay.save})
        }
        if(data.overlay.increment) {
          this.setState({incrementShortcut: data.overlay.increment})
        }
      });

      ipcRenderer.on('nodes', (event, data) => {
        console.log(data);
        this.setState({nodeList: data});
      });
    }

    document.addEventListener("keydown", this.onKeyDown, false);
  }

  componentWillUnmount(){
    document.removeEventListener("keydown", this.onKeyDown, false);
  }

  onKeyDown(e) {
    if(e.keyCode == 9) {
      e.preventDefault();
      console.log(e);
    }
  }

  dragStart(e) {
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
    } else if(e.button == 0 && e.target.getAttribute("attributetype")) {
      e.preventDefault();
      this.startEdgeDrag(e);
    } else if(e.button == 2) {
      e.preventDefault();
      let pos = {
        x: e.clientX,
        y: e.clientY
      };
      this.setState({nodeSearchOpen: true, nodeSearchPosition: pos, nodeListType: ""});
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
    let nodes = this.state.nodes;
    nodes[nodeId].name = event.target.value;
    this.setState({nodes: nodes});
  }

  renderNode(nodeId, index) {
    let node = this.state.nodes[nodeId];
    return (
      <Node
        theme={this.state.theme}
        primaryColor={this.state.primaryColor}
        key={index}
        selected={this.state.dragItem == nodeId}
        nodeId={nodeId}
        name={node.name}
        color={node.color}
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
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
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

    var nodesSearchX = this.state.nodeSearchPosition.x;
    var nodesSearchY = this.state.nodeSearchPosition.y;
    var nodeSearchPosition = {
        left: `${nodesSearchX}px`,
        top: `${nodesSearchY}px`
    };

    return (
      <React.Fragment>
        <Head>
          <title>Pulsar</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <link href="https://fonts.googleapis.com/css?family=Oswald&display=swap" rel="stylesheet"/>
          <link href="https://fonts.googleapis.com/css?family=Big+Shoulders+Text:400,500,700&display=swap" rel="stylesheet"/>
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="./static/line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <Nav
          open={this.state.navOpen}
          page="graph"
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <div className={this.state.navOpen ? "main " + this.state.theme : "main full " + this.state.theme}>
          <div className="scene-view">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
             <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
            </Canvas>
          </div>
          <div className="resizer"
            onMouseDown={(e) => this.resizeStart(e)}
            onMouseMove={(e) => this.resize(e)}
            onMouseUp={(e) => this.resizeEnd(e)}
          ></div>
          <div className="graph-container">
            <div className="graph-editor"
              style={graphTransform}
              onMouseDown={(e) => this.dragStart(e)}
              onMouseMove={(e) => this.drag(e)}
              onMouseUp={(e) => this.dragEnd(e)}
              onWheel={(e) => this.zoom(e)}
            >
              <div className="node-container">
                {Object.keys(this.state.nodes).map((nodeId, index) => (
                  this.renderNode(nodeId, index)
                ))}
              </div>
              <div className="edge-container">
                <svg>
                  {this.state.draggingEdge ?
                    <path className={"drag-edge stroke-" + this.state.primaryColor}
                      d={`M${this.state.dragEdge.x1},${this.state.dragEdge.y1} C${this.state.dragEdge.x1 + Math.min(300, Math.abs(this.state.dragEdge.y1 - this.state.dragEdge.y2)/2)},${this.state.dragEdge.y1} ${this.state.dragEdge.x2 - Math.min(300, Math.abs(this.state.dragEdge.y1 - this.state.dragEdge.y2)/2)},${this.state.dragEdge.y2} ${this.state.dragEdge.x2},${this.state.dragEdge.y2}`}
                      stroke="#888"
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
        </div>

        {this.state.nodeSearchOpen ?
          <div className="node-search-container" style={nodeSearchPosition}>
            <div className="node-type-list">
              {Object.keys(this.state.nodeList).map((type, index) => (
                <div key={index} className="node-type" onClick={(e) => this.setState({nodeListType: type})}>
                  <h4>{type}</h4>
                  <i className="las la-angle-right"></i>
                </div>
              ))}
            </div>
            {this.state.nodeListType != "" ?
              <div className="node-list">
                {Object.keys(this.state.nodeList[this.state.nodeListType]).map((node, index) => (
                  <div key={index} className="node-select">{node}</div>
                ))}
              </div>
              : ""
            }
          </div>
          : ""
        }

        <style jsx global>{`
        `}</style>
        <style jsx>{`
        `}</style>
      </React.Fragment>
    );
  };
};
