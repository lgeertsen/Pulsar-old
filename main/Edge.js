import Logger from './Logger';

export default class Edge {
  constructor(nodeIn, attribIn, nodeOut, attribOut) {
    this._inputNode = nodeIn;
    this._inputAttribute = attribIn;
    this._outputNode = nodeOut;
    this._outputAttribute = attribOut;
  }

  formatForRender() {
    return `${this._outputNode}#${this._outputAttribute}`
  }
}
