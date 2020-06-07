import Edge from './Edge';
import Logger from './Logger';
import Node from './Node';

export default class Graph {
  constructor(nodeManager, sendToRenderer) {
    this._nodeManager = nodeManager;
    this._sendToRenderer = sendToRenderer;
    this._nodes = {};
    // for(let id in nodes) {
    //   this._nodes[id] = new Node(nodes[id]);
    // }

    this._edges = {};
    // for(let input in edges) {
    //   this._edges[input] = new Edge(input, edges[input]);
    // }
  }

  addNode(type, task, position) {
    let node = this._nodeManager.getNode(type, task);
    console.log(node);

    let idCount = 0;
    for(let key in this._nodes) {
      if(key.startsWith(node.id)) {
        idCount += 1;
      }
    }
    idCount += 1;
    let id = `${node.id}_${idCount}`;
    this._nodes[id] = new Node(idCount, node, position);
    return id;
  }

  addEdge(nodeIn, attribIn, nodeOut, attribOut) {
    let inIndex = this._nodes[nodeIn].inputs.findIndex((item) => {return item.name == attribIn});
    let inType = this._nodes[nodeIn].inputs[inIndex].type;
    let outIndex = this._nodes[nodeOut].outputs.findIndex((item) => {return item.name == attribOut});
    let outType = this._nodes[nodeOut].outputs[outIndex].type;

    this._edges[`${nodeIn}#${attribIn}`] = new Edge(nodeIn, attribIn, nodeOut, attribOut);
  }

  setNodePosition(id, position) {
    this._nodes[id].position = position;
  }

  formatForRender() {
    let edges = {};
    for(let id in this._edges) {
      edges[id] = this._edges[id].formatForRender();
    }
    this._sendToRenderer({nodes: this._nodes, edges: edges});
  }
}
