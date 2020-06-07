import { spawn } from 'child_process';

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

    this._executionPriority = {};
    this._executionOrder = [];
  }

  addNode(type, task, position) {
    let node = this._nodeManager.getNode(type, task);

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

    if(this._nodes[nodeIn].subType == "merge") {
      let count = this._nodes[nodeIn].inputs.length;
      let newInput = {
        name: `input${count+1}`,
        label: `Input ${count+1}`,
        description: "Input",
        value: "",
        type: "any"
      }
      this._nodes[nodeIn].inputs.push(newInput);
    }
  }

  setNodeName(id, name) {
    this._nodes[id].newName = name;
  }

  setNodePosition(id, position) {
    this._nodes[id].position = position;
  }

  setNodeInputValue(id, input, value) {
    this._nodes[id].setInputValue(input, value);
  }

  walkGraph(node, depth) {
    for(let input in this._edges) {
      if(this._edges[input].inputNode == node.id) {
        let outputId = this._edges[input].outputNode;
        let outputNode = this._nodes[outputId];
        if(outputNode.subType == "merge") {
          this.walkGraph(outputNode, depth);
        } else if(outputNode.type == "constants") {
          let inputAttribute = this._edges[input].inputAttribute;
          let inputIndex = node.inputs.findIndex((item) => {return item.name == inputAttribute});
          node.inputs[inputIndex].value = outputNode.inputs[0].value;
        } else {
          if(this._executionPriority[depth] == undefined) {
            this._executionPriority[depth] = [];
          }
          this._executionPriority[depth].push(outputNode);
          this.walkGraph(outputNode, depth+1);
        }
      }
    }
    return true;
  }

  execute(id) {
    let node = this._nodes[id];
    let d = 0;
    if(node.subType != "merge" && node.type != constants) {
      this._executionPriority[0] = [];
      this._executionPriority[0].push(node)
      d += 1;
    }
    let walked = this.walkGraph(node, d);
    let depth = Object.keys(this._executionPriority).length;
    for(let i = depth-1; i >= 0; i--) {
      for(let j in this._executionPriority[i]) {
        this._executionOrder.push(this._executionPriority[i][j])
      }
    }
    console.log(this._executionOrder);
    this.executeTask();
  }

  executeTask() {
    Logger.info("Execute Task")
    let task = this._executionOrder.shift();

    if(task.software == "bat") {
      let args = [];
      for(let i in task.inputs) {
        if(task.inputs[i].type.split(".")[0] == "tuple") {
          for(let j in task.inputs[i].value) {
            args.push(task.inputs[i].value[j]);
          }
        } else {
          args.push(task.inputs[i].value);
        }
      }

      let dirPath;
      // if (process.env.NODE_ENV === 'production') {
      //   dirPath = path.join(__dirname, '../../../nodes/scripts');
      //   // result = spawn.sync(executable, [], { encoding: 'utf8' });
      // } else {
        dirPath = `${this._nodeManager._path}/scripts`;
      // }

      let cmd = `${dirPath}/${task.type}/${task.script}`;

      for(let i in args) {
        if(args[i].toString().includes(" ")) {
          cmd += ` "${args[i]}"`;
        } else {
          cmd += ` ${args[i]}`;
        }
      }

      const bat = spawn(cmd, { shell: true });

      bat.stdout.on('data', (data) => {
        console.log(data.toString());
      });

      bat.stderr.on('data', (data) => {
        console.error(data.toString());
      });

      bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
        console.log(this._executionOrder);
        if(this._executionOrder.length > 0) {
          this.executeTask();
        }
      });
    }
  }

  formatForRender() {
    let edges = {};
    for(let id in this._edges) {
      edges[id] = this._edges[id].formatForRender();
    }
    this._sendToRenderer({nodes: this._nodes, edges: edges});
  }
}
