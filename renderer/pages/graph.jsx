import electron from 'electron';
import React from 'react';
import Head from 'next/head';

import * as THREE from 'three';
import { Canvas } from 'react-three-fiber'

const ipcRenderer = electron.ipcRenderer || false;

import GhostNode from '../components/GhostNode';
import Nav from '../components/Nav';
import Node from '../components/Node';
import NodeProperties from '../containers/NodeProperties';
import Edge from '../components/Edge';

import Box from '../components/3D/Box';

import "../styles/graph.sass"

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "theme-light",
      primaryColor: "green",

      projects: {},

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
      moved: false,
      dragItem: undefined,
      dragType: "",
      moveGraph: false,

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

      selectedNode: undefined,

      ghostNodeActive: false,
      ghostNodeType: undefined,
      ghostNodeNode: undefined,
      ghostNodePos: {
        x: 0,
        y: 0
      },

      nodes: {},

      edges: {}
    }
  }

  componentDidMount() {
    console.log("----- Component mounted -----");
    if(ipcRenderer) {
      ipcRenderer.send("getConfig")
      ipcRenderer.send("getNodes")
      ipcRenderer.send("getGraph")

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
        if(data.projects) {
          this.setState({projects: data.projects});
        }
      });

      ipcRenderer.on('graph', (event, data) => {
        console.log(data);
        let nodes = this.state.nodes;
        for(let id in data.nodes) {
          if(!(id in nodes)) {
            nodes[id] = data.nodes[id];

            for(let i in nodes[id].inputs) {
              nodes[id].inputs[i].ref = React.createRef();
            }

            for(let i in nodes[id].outputs) {
              nodes[id].outputs[i].ref = React.createRef();
            }
          }
        }
        this.setState({nodes: nodes, edges: data.edges});
      });

      ipcRenderer.on('nodes', (event, data) => {
        console.log(data);
        this.setState({nodeList: data});
        // this.addBaseNodes();
        // this.createTemp();
      });

      ipcRenderer.on('selectedInputFile', (event, data) => {
        let nodes = this.state.nodes;
        console.log(data);
        let inputIndex = nodes[data.node].inputs.findIndex((item) => {return item.name == data.input});
        nodes[data.node].inputs[inputIndex].value = data.file;
        this.setState({nodes: nodes});
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

  createTemp() {
    // this.setState({ghostNodeType: "houdini", ghostNodeNode: "render"});
    // this.createNode({clientX: 590, clientY: 400});
    // this.setState({ghostNodeType: "constants", ghostNodeNode: "file"});
    // this.createNode({clientX: 300, clientY: 400});
    // this.setState({ghostNodeType: "constants", ghostNodeNode: "file"});
    // this.createNode({clientX: 300, clientY: 500});
    // this.setState({ghostNodeType: "constants", ghostNodeNode: "string"});
    // this.createNode({clientX: 300, clientY: 600});
    // let nodes = this.state.nodes;
    // nodes["constants.file_1"] = {
    //   color: "red",
    //   description: undefined,
    //   icon: "las la-file",
    //   id: "constants.file",
    //   inputs: [
    //     {
    //       description: "File",
    //       extensions: [],
    //       hidden: true,
    //       label: "File",
    //       name: "file",
    //       ref: {current: null},
    //       type: "file",
    //       value: ""
    //     }
    //   ],
    //   label: undefined,
    //   name: "file 1",
    //   outputs: [
    //     {
    //       description: undefined,
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: undefined,
    //       name: "output",
    //       ref: React.createRef(),
    //       type: "file",
    //       value: undefined
    //     }
    //   ],
    //   script: null,
    //   type: "constants",
    //   x: 10200,
    //   y: 10385
    // };
    // nodes["constants.file_2"] = {
    //   color: "red",
    //   description: undefined,
    //   icon: "las la-file",
    //   id: "constants.file",
    //   inputs: [
    //     {
    //       description: "File",
    //       extensions: [],
    //       hidden: true,
    //       label: "File",
    //       name: "file",
    //       ref: {current: null},
    //       type: "file",
    //       value: ""
    //     }
    //   ],
    //   label: undefined,
    //   name: "file 2",
    //   outputs: [
    //     {
    //       description: undefined,
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: undefined,
    //       name: "output",
    //       ref: React.createRef(),
    //       type: "file",
    //       value: undefined,
    //     }
    //   ],
    //   script: null,
    //   type: "constants",
    //   x: 10200,
    //   y: 10485
    // };
    // nodes["constants.string_1"] = {
    //   color: "green",
    //   description: undefined,
    //   icon: "las la-ad",
    //   id: "constants.string",
    //   inputs: [
    //     {
    //       description: "String",
    //       extensions: [],
    //       hidden: true,
    //       label: "String",
    //       name: "string",
    //       ref: {current: null},
    //       type: "string",
    //       value: ""
    //     }
    //   ],
    //   label: undefined,
    //   name: "file 1",
    //   outputs: [
    //     {
    //       description: undefined,
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: undefined,
    //       name: "output",
    //       ref: React.createRef(),
    //       type: "string",
    //       value: undefined
    //     }
    //   ],
    //   script: null,
    //   type: "constants",
    //   x: 10200,
    //   y: 10585
    // };
    // nodes["houdini.render_1"] = {
    //   color: "orange",
    //   description: undefined,
    //   icon: "houdini.png",
    //   id: "houdini.render",
    //   inputs: [
    //     {
    //       description: "hrender.py, normally located in: C:/Program Files/Side Effects Software/Houdini X.Y.ZZZ/bin/hrender.py",
    //       extensions: ["py"],
    //       hidden: undefined,
    //       label: "hrender.py",
    //       name: "hrender.py",
    //       ref: React.createRef(),
    //       type: "file",
    //       value: ""
    //     },
    //     {
    //       description: "The houdini scene file you'd like to render",
    //       extensions: (2) ["hip", "hipnc"],
    //       hidden: undefined,
    //       label: "Scene",
    //       name: "scene",
    //       ref: React.createRef(),
    //       type: "file",
    //       value: ""
    //     },
    //     {
    //       description: "The path of the node you want to render your scene with",
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: "Render Node",
    //       name: "render_node",
    //       ref: React.createRef(),
    //       type: "string",
    //       value: "/out/"
    //     },
    //     {
    //       description: "The frame range you want to render",
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: "Frame Range",
    //       name: "frames",
    //       ref: React.createRef(),
    //       type: "tuple.number",
    //       value: (2) [1, 100]
    //     }
    //   ],
    //   label: undefined,
    //   name: "render 1",
    //   outputs: [
    //     {
    //       description: "output",
    //       extensions: undefined,
    //       hidden: undefined,
    //       label: "output",
    //       name: "output",
    //       ref: React.createRef(),
    //       type: "bool",
    //       value: ""
    //     }
    //   ],
    //   script: "render.bat",
    //   type: "houdini",
    //   x: 10490,
    //   y: 10385
    // }
    // let edges = {
    //   "base.OUTPUT#output": "houdini.render_1#output",
    //   "houdini.render_1#output": "base.file_1#output",
    //   "houdini.render_1#output": "base.file_#output",
    //   "houdini.render_1#output": "base.string_1#output",
    // }
    // this.setState({nodes: nodes})
  }

  addBaseNodes() {
    let nodes = this.state.nodeList;
    if(!nodes.constants) {
      nodes.constants = {}
    }

    if(!nodes.constants.string) {
      let node = {
        id: "constants.string",
        type: "constants",
        name: "string",
        color: "green",
        icon: "las la-ad",
        script: null,
        inputs: [
          {
            name: "string",
            label: "String",
            description: "String",
            value: "",
            type: "string",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "string"
          }
        ]
      }
      nodes.constants[node.name] = node
    }
    if(!nodes.constants.number) {
      let node = {
        id: "constants.number",
        type: "constants",
        name: "number",
        color: "cyan",
        icon: "0",
        script: null,
        inputs: [
          {
            name: "number",
            label: "Number",
            description: "Number",
            value: 0,
            type: "number",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "number"
          }
        ]
      }
      nodes.constants[node.name] = node
    }

    if(!nodes.constants.bool) {
      let node = {
        id: "constants.bool",
        type: "constants",
        name: "bool",
        color: "purple",
        icon: "las la-check-square",
        script: null,
        inputs: [
          {
            name: "bool",
            label: "Bool",
            description: "Boolean",
            value: true,
            type: "bool",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "bool"
          }
        ]
      }
      nodes.constants[node.name] = node
    }

    if(!nodes.constants.file) {
      let node = {
        id: "constants.file",
        type: "constants",
        name: "file",
        color: "red",
        icon: "las la-file",
        script: null,
        inputs: [
          {
            name: "file",
            label: "File",
            description: "File",
            value: "",
            type: "file",
            extensions: [],
            hidden: true
          }
        ],
        outputs: [
          {
            name: "output",
            type: "file"
          }
        ]
      }
      nodes.constants[node.name] = node
    }

    if(!nodes.base) {
      nodes.base = {}
    }

    if(!nodes.base.OUTPUT) {
      let node = {
        id: "base.OUTPUT",
        type: "base",
        name: "OUTPUT",
        color: "black",
        icon: "las la-flag-checkered",
        script: null,
        inputs: [
          {
            name: "output",
            type: "any"
          }
        ],
        outputs: []
      }
      nodes.base[node.name] = node
    }

    if(!nodes.base.project_file) {
      let node = {
        id: "base.project_file",
        type: "base",
        name: "project_file",
        color: "red",
        icon: "las la-folder",
        script: null,
        inputs: [
          {
            name: "project",
            label: "Project",
            description: "Name of the project",
            value: "",
            type: "dropdown.project",
            hidden: true
          },
          {
            name: "assetshot",
            label: "Asset or Shot",
            description: "Asset or Shot",
            value: "asset",
            type: "switch.assetshot",
            hidden: true
          }
        ],
        outputs: [
          {
            name: "file",
            label: "file",
            type: "file"
          }
        ]
      }
      nodes.base[node.name] = node
    }

    this.setState({nodeList: nodes});
  }

  dragStart(e) {
    if(e.button != 2) {
      this.setState({nodeSearchOpen: false, nodeListType: ""});
    }
    if(e.button == 0 && this.state.ghostNodeActive) {
      this.createNode(e);
    } else if (e.button == 0 && e.target.getAttribute("draggable") == "true") {
      e.preventDefault();
      let active = true;
      let dragItem =  e.target.getAttribute("nodeid");
      let node = this.state.nodes[dragItem];
      console.log(dragItem);
      let initialX = e.clientX - node.x;
      let initialY = e.clientY - node.y;
      this.setState({initialX: initialX, initialY: initialY, active: active, dragItem: dragItem, dragType: "node"});
    } else if(e.button == 1) {
      e.preventDefault();
      let active = true;
      let dragItem = "46541654165graph465146541651";
      let initialX = e.clientX - this.state.graphPosition.x;
      let initialY = e.clientY - this.state.graphPosition.y;
      this.setState({initialX: initialX, initialY: initialY, active: active, dragItem: dragItem, dragType: "graph", moveGraph: true});
    } else if(e.button == 0 && e.target.getAttribute("attributetype")) {
      e.preventDefault();
      this.startEdgeDrag(e);
    } else if(e.button == 2  && e.target.getAttribute("draggable") != "true") {
      e.preventDefault();
      let pos = {
        x: e.clientX,
        y: e.clientY
      };
      this.setState({nodeSearchOpen: true, nodeSearchPosition: pos, nodeListType: "", ghostNodeActive: false});
    }
  }

  dragEnd(e) {
    let initialX = this.state.currentX;
    let initialY = this.state.currentY;

    let moved = this.state.moved;
    let dragType = this.state.dragType;
    let dragItem = this.state.dragItem
    let selectedNode = this.state.selectedNode;
    if(!moved) {
      if(dragType == "node") {
        selectedNode = dragItem;
      } else if(dragType == "graph") {
        selectedNode = undefined;
      }
    } else {
      if(dragType == "node") {
        let node = this.state.nodes[dragItem];
        ipcRenderer.send("setNodePosition", {id: dragItem, position: {x: node.x, y: node.y}});
      }
    }
    this.setState({
      moved: false,
      initialX: initialX,
      initialY: initialY,
      active: false,
      dragItem: undefined,
      draggingEdge: false,
      moveGraph: false,
      selectedNode: selectedNode
    });
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

        this.setState({moved: true, currentX: currentX, currentY: currentY, xOffset: xOffset, yOffset: yOffset, graphPosition: position});
      } else if (this.state.active && this.state.dragItem != undefined) {
        e.preventDefault();
        let currentX = e.clientX - this.state.initialX;
        let currentY = e.clientY - this.state.initialY;
        let xOffset = currentX;
        let yOffset = currentY;

        let nodes = this.state.nodes
        nodes[this.state.dragItem].x = currentX;
        nodes[this.state.dragItem].y = currentY;

        this.setState({moved: true, currentX: currentX, currentY: currentY, xOffset: xOffset, yOffset: yOffset, nodes: nodes});
      }
    } else if(this.state.draggingEdge) {
      this.dragEdge(e);
    } else if(this.state.ghostNodeActive) {
      let x = e.clientX - this.state.graphPosition.x + 10000 - 100;
      let y = e.clientY - this.state.graphPosition.y + 10000 - 15;
      let pos = {
        x: x,
        y: y
      };
      this.setState({ghostNodePos: pos});
    }
  }

  startEdgeDrag(e) {
    if(e.target.getAttribute("attributetype") == "input") {
      let targetPos = e.target.getBoundingClientRect();
      let x1 = 10000 + targetPos.x - this.state.graphPosition.x - 3;
      let y1 = 10000 + targetPos.y - this.state.graphPosition.y;
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
      let x2 = 10000 + targetPos.x - this.state.graphPosition.x - 3;
      let y2 = 10000 + targetPos.y - this.state.graphPosition.y - 3;
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
      let x1 = 10000 + e.clientX - this.state.graphPosition.x - 3;
      let y1 = 10000 + e.clientY - this.state.graphPosition.y - 3;
      let edgePos = this.state.dragEdge;
      edgePos.x1 = x1;
      edgePos.y1 = y1;

      this.setState({draggingEdge: true, dragEdge: edgePos});
    } else if(this.state.draggingType == "output") {
      let x2 = 10000 + e.clientX - this.state.graphPosition.x - 3;
      let y2 = 10000 + e.clientY - this.state.graphPosition.y - 3;
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
      //
      // let nodes = this.state.nodes;
      // let inIndex = nodes[nodeIn].inputs.findIndex((item) => {return item.name == attribIn});
      // let inType = nodes[nodeIn].inputs[inIndex].type;
      // let outIndex = nodes[nodeOut].outputs.findIndex((item) => {return item.name == attribOut});
      // let outType = nodes[nodeOut].outputs[outIndex].type;
      //
      // if(inType == outType || inType == "any") {
      //   let edges = this.state.edges;

        ipcRenderer.send("addEdge", {nodeIn: nodeIn, attribIn: attribIn, nodeOut: nodeOut, attribOut: attribOut});
        // edges[`${nodeIn}#${attribIn}`] = `${nodeOut}#${attribOut}`
        //   input: {
        //     node: nodeIn,
        //     attribute: attribIn
        //   },
        //   output: {
        //     node: nodeOut,
        //     attribute: attribOut
        //   }
        // }

        // this.setState({edges: edges});
      // }
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

  createNode(e) {
    let pos = {
      x: e.clientX - this.state.graphPosition.x + 10000 - 100,
      y:e.clientY - this.state.graphPosition.y + 10000 - 15
    }
    ipcRenderer.send("addNode", {type: this.state.ghostNodeType, task: this.state.ghostNodeNode, position: pos});

    let nodes = this.state.nodes;
    let node = this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode];
    console.log(node);
    let idCount = 0;
    for(let key in nodes) {
      if(key.startsWith(node.id)) {
        idCount += 1;
      }
    }
    let id = `${node.id}_${idCount+1}`;

    this.setState({ghostNodeActive: false, ghostNodeType: undefined, ghostNodeNode: undefined, selectedNode: id});

    // let nodes = this.state.nodes;
    // let node = this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode];
    // console.log(node);
    // let idCount = 0;
    // for(let key in nodes) {
    //   if(key.startsWith(node.id)) {
    //     idCount += 1;
    //   }
    // }
    // let id = `${node.id}_${idCount+1}`;
    // let newNode = {
    //   id: node.id,
    //   type: node.type,
    //   script: node.script,
    //   name: `${node.name} ${idCount+1}`,
    //   label: node.label,
    //   description: node.description,
    //   color: node.color,
    //   icon: node.icon,
    //   x: e.clientX - this.state.graphPosition.x + 10000 - 100,
    //   y: e.clientY - this.state.graphPosition.y + 10000 - 15,
    //   inputs: [],
    //   outputs: []
    // }
    //
    // for(let i in node.inputs) {
    //   newNode.inputs[i] = {
    //     name: node.inputs[i].name,
    //     label: node.inputs[i].label,
    //     description: node.inputs[i].description,
    //     value: node.inputs[i].value,
    //     type: node.inputs[i].type,
    //     extensions: node.inputs[i].extensions,
    //     hidden: node.inputs[i].hidden,
    //     ref: React.createRef()
    //   }
    // }
    //
    // for(let i in node.outputs) {
    //   newNode.outputs[i] = {
    //     name: node.outputs[i].name,
    //     label: node.outputs[i].label,
    //     description: node.outputs[i].description,
    //     value: node.outputs[i].value,
    //     type: node.outputs[i].type,
    //     extensions: node.outputs[i].extensions,
    //     hidden: node.outputs[i].hidden,
    //     ref: React.createRef()
    //   }
    // }
    //
    // nodes[id] = newNode;
    // this.setState({nodes: nodes, ghostNodeActive: false, ghostNodeType: undefined, ghostNodeNode: undefined, selectedNode: id});
  }

  changeInputValue(input, value) {
    let nodes = this.state.nodes;
    let inputIndex = nodes[this.state.selectedNode].inputs.findIndex((item) => {return item.name == input});
    nodes[this.state.selectedNode].inputs[inputIndex].value = value;
    this.setState({nodes: nodes});
  }

  selectInputFile(input, extensions) {
    ipcRenderer.send('selectInputFile', {node: this.state.selectedNode, input: input, extensions: extensions});
  }

  setNodeProject(project) {
    let nodes = this.state.nodes;
    let node = nodes[this.state.selectedNode];
    let inputIndex = node.inputs.findIndex((item) => {return item.name == "project"});
    node.inputs[inputIndex].value = project;
    nodes[this.state.selectedNode] = node;
    this.setState({nodes: nodes});
  }

  setNodePathType(type) {
    let nodes = this.state.nodes;
    let node = nodes[this.state.selectedNode];
    let inputIndex = node.inputs.findIndex((item) => {return item.name == "assetshot"});
    node.inputs[inputIndex].value = type;
    nodes[this.state.selectedNode] = node;
    this.setState({nodes: nodes});
  }

  executeGraph() {
    console.log(this.state.nodes);
    console.log(this.state.edges);
    ipcRenderer.send('executeGraph', {nodes: this.state.nodes, edges: this.state.edges});
  }

  renderNode(nodeId, index) {
    let node = this.state.nodes[nodeId];
    return (
      <Node
        theme={this.state.theme}
        primaryColor={this.state.primaryColor}
        key={index}
        selected={this.state.selectedNode == nodeId}
        dragging={this.state.dragItem == nodeId}
        nodeId={nodeId}
        name={node.name}
        icon={node.icon}
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

  renderEdge(edgeInput, index) {
    let edgeOutput = this.state.edges[edgeInput];
    let inSplit = edgeInput.split("#");
    let inNode = inSplit[0];
    let inAttrib = inSplit[1];
    let outSplit = edgeOutput.split("#");
    let outNode = outSplit[0];
    let outAttrib = outSplit[1];
    let pinOutIndex = this.state.nodes[outNode].outputs.findIndex((item) => {return item.name == outAttrib});
    let pinInIndex = this.state.nodes[inNode].inputs.findIndex((item) => {return item.name == inAttrib});
    let pinOut = this.state.nodes[outNode].outputs[pinOutIndex].ref.current;
    let pinIn = this.state.nodes[inNode].inputs[pinInIndex].ref.current;
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
          <link href="https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&display=swap" rel="stylesheet"/>
          {/* <link href="./static/fontawesome/css/all.css" rel="stylesheet"/> */}
          <link href="line-awesome/css/line-awesome.min.css" rel="stylesheet"/>
        </Head>

        <Nav
          open={this.state.navOpen}
          page="graph"
          theme={this.state.theme}
          primaryColor={this.state.primaryColor}
          toggleNav={(v) => this.setState({navOpen: v})}
        />

        <button style={{zIndex: 5000, position: "fixed", top: "50px", left: "100px"}} onClick={(e) => this.executeGraph()}>Execute</button>

        <div className={this.state.navOpen ? `main ${this.state.theme} main-${this.state.primaryColor}` : `main full ${this.state.theme} main-${this.state.primaryColor}`}>
          <NodeProperties
            theme={this.state.theme}
            primaryColor={this.state.primaryColor}
            projects={this.state.projects}
            node={this.state.nodes[this.state.selectedNode]}
            onValueChange={(input, value) => this.changeInputValue(input, value)}
            selectFile={(input, extensions) => this.selectInputFile(input, extensions)}
            setNodeProject={(project) => this.setNodeProject(project)}
            setNodePathType={(type) => this.setNodePathType(type)}
          />

          {/* <div className="scene-view">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
             <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} />
            </Canvas>
          </div> */}
          {/* <div className="resizer"
            onMouseDown={(e) => this.resizeStart(e)}
            onMouseMove={(e) => this.resize(e)}
            onMouseUp={(e) => this.resizeEnd(e)}
          ></div> */}
          <div className="graph-container">
            <div className={this.state.moveGraph ? `graph-editor move-graph` : "graph-editor"}
              style={graphTransform}
              onMouseDown={(e) => this.dragStart(e)}
              onMouseMove={(e) => this.drag(e)}
              onMouseUp={(e) => this.dragEnd(e)}
              onWheel={(e) => this.zoom(e)}
            >
              <div className="node-container">
                {this.state.ghostNodeActive ?
                  <GhostNode
                    theme={this.state.theme}
                    primaryColor={this.state.primaryColor}
                    name={this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode].name}
                    icon={this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode].icon}
                    color={this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode].color}
                    x={this.state.ghostNodePos.x}
                    y={this.state.ghostNodePos.y}
                    inputs={this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode].inputs}
                    outputs={this.state.nodeList[this.state.ghostNodeType][this.state.ghostNodeNode].outputs}
                  />
                  : ""
                }

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
                  {Object.keys(this.state.edges).map((edgeInput, index) => (
                    this.renderEdge(edgeInput, index)
                  ))}
                </svg>
              </div>

            </div>
          </div>
        </div>

        {this.state.nodeSearchOpen ?
          <div
            className="node-search-container"
            style={nodeSearchPosition}
            // onMouseLeave={(e) => this.setState({nodeListType: ""})}
          >
            <div className="node-type-list">
              {Object.keys(this.state.nodeList).map((type, index) => (
                <div key={index}
                  className="node-type"
                  onMouseEnter={(e) => this.setState({nodeListType: type})}
                  // onMouseLeave={(e) => this.setState({nodeListType: type})}
                >
                  <h4>{type}</h4>
                  <i className="las la-angle-right"></i>
                </div>
              ))}
            </div>
            {this.state.nodeListType != "" ?
              <div className="node-list">
                {Object.keys(this.state.nodeList[this.state.nodeListType]).map((node, index) => (
                  <div key={index} className="node-select" onClick={(e) => this.setState({nodeSearchOpen: false, ghostNodeActive: true, ghostNodeType: this.state.nodeListType, ghostNodeNode: node})}>{node}</div>
                ))}
              </div>
              : ""
            }
          </div>
          : ""
        }

        <style jsx global>{`
          @font-face {
              font-family: 'Architectural';
              src: url('./static/architectural/Architectural.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
                   url('./static/architectural/Architectural.woff') format('woff'), /* Modern Browsers */
                   url('./static/architectural/Architectural.ttf') format('truetype'); /* Safari, Android, iOS */
                       font-style: normal;
              font-weight: normal;
              text-rendering: optimizeLegibility;
          }

          @font-face {
              font-family: 'Apex Mk3 ExtraLight';
              src: url('./static/Apex/apex_mk3-extralight-webfont.woff2') format('woff2'),
                   url('./static/Apex/apex_mk3-extralight-webfont.woff') format('woff');
              font-weight: normal;
              font-style: normal;
          }
        `}</style>
        <style jsx>{`
        `}</style>
      </React.Fragment>
    );
  };
};
