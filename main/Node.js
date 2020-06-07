import Logger from './Logger';

export default class Node {
  constructor(id, node, position) {
    this.id = `${node.id}_id`;

    this.type = node.type;
    this.script = node.script;
    this.name = `${node.name} ${id}`;
    this.label = node.label;
    this.description = node.description;
    this.color = node.color;
    this.icon = node.icon;
    this.x = position.x;
    this.y = position.y;
    this.inputs = [];
    this.outputs = []

    for(let i in node.inputs) {
      this.inputs[i] = {
        name: node.inputs[i].name,
        label: node.inputs[i].label,
        description: node.inputs[i].description,
        value: node.inputs[i].value,
        type: node.inputs[i].type,
        extensions: node.inputs[i].extensions,
        hidden: node.inputs[i].hidden
      }
    }

    for(let i in node.outputs) {
      this.outputs[i] = {
        name: node.outputs[i].name,
        label: node.outputs[i].label,
        description: node.outputs[i].description,
        value: node.outputs[i].value,
        type: node.outputs[i].type,
        extensions: node.outputs[i].extensions,
        hidden: node.outputs[i].hidden
      }
    }
  }

  set position(position) {
    this.x = position.x;
    this.y = position.y;
  }
}
