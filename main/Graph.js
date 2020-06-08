import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

import Edge from './Edge';
import Logger from './Logger';
import Node from './Node';

export default class Graph {
  constructor(nodeManager, server, sendToRenderer) {
    this._nodeManager = nodeManager;
    this._server = server;
    this._sendToRenderer = sendToRenderer;

    this._name = undefined;
    this._path = undefined;

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

  get name() {return this._name}

  set graph(data) {
    this._name = data.name;
    this._path = data.path;
    this._nodes = {};
    for(let id in data.nodes) {
      let pos = {
        x: data.nodes[id].x,
        y: data.nodes[id].y
      }
      this._nodes[id] = new Node(data.nodes[id].id, data.nodes[id].name, data.nodes[id], pos);
    }
    this._edges = {};
    for(let id in data.edges) {
      this._edges[id] = new Edge(data.edges[id]._inputNode, data.edges[id]._inputAttribute, data.edges[id]._outputNode, data.edges[id]._outputAttribute);
    }
    this.formatForRender();
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
    this._nodes[id] = new Node(id, `${node.name} ${idCount}`, node, position);
    return id;
  }

  addEdge(nodeIn, attribIn, nodeOut, attribOut) {
    if(nodeIn == attribIn && nodeOut == attribOut) {
      this._edges[`${nodeIn}#${attribIn}`] = new Edge(nodeIn, attribIn, nodeOut, attribOut);
    } else {
      let inIndex = this._nodes[nodeIn].inputs.findIndex((item) => {return item.name == attribIn});
      let inType = this._nodes[nodeIn].inputs[inIndex].type;
      let outIndex = this._nodes[nodeOut].outputs.findIndex((item) => {return item.name == attribOut});
      let outType = this._nodes[nodeOut].outputs[outIndex].type;
      if(inType == outType || inType == "any") {
        this._edges[`${nodeIn}#${attribIn}`] = new Edge(nodeIn, attribIn, nodeOut, attribOut);
      }
    }

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
    this._executionPriority = {};
    this._executionOrder = [];
    let node = this._nodes[id];
    let d = 0;
    if(node.type == "tractor" && node.subType == "submit") {
      this.submitTractor(id);
    } else {
      if(node.subType != "merge" && node.type != "constants") {
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
        } else if(task.inputs[i].type.split(".")[0] == "software") {
          args.push(this._server._config.config.softwares[task.inputs[i].type.split(".")[1]]);
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




  submitTractor(id) {
    let node = this._nodes[id];
    this._executionPriority[0] = [];
    this._executionPriority[0].push(node)
    let walked = this.walkGraph(node, 1);
    console.log(this._executionPriority);

    let data = {
      pool: node.inputs[0].value,
      nodes: this._executionPriority
    }
    let jsonContent = JSON.stringify(data, null, 2);
    console.log(jsonContent);

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let timestamp = `${month}-${day}-${year}_${hours}-${minutes}-${seconds}`;
    console.log(timestamp);

    let dir = path.join("\\\\marvin\\PFE_RN_2020\\_UTILITY\\05_PULSAR\\graphs", `${this.name}_${timestamp}`);

    fs.mkdir(dir, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');

      fs.writeFile(path.join(dir, "input.json"), jsonContent, 'utf8', function (err) {
        if (err) {
          console.log("An error occured while writing JSON Object to File.");
          // return console.log(err);
        }
      });
    });

  }













  formatForRender() {
    let edges = {};
    for(let id in this._edges) {
      edges[id] = this._edges[id].formatForRender();
    }
    this._sendToRenderer({nodes: this._nodes, edges: edges});
  }

  formatForSave() {
    let data = {
      name: this._name,
      path: this._path,
      nodes: this._nodes,
      edges: this._edges
    }
    return data;
  }
}
