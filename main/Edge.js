import Logger from './Logger';

export default class Edge {
  constructor(nodeIn, attribIn, nodeOut, attribOut) {
    this._inputNode = nodeIn;
    this._inputAttribute = attribIn;
    this._outputNode = nodeOut;
    this._outputAttribute = attribOut;
  }

  get inputNode() { return this._inputNode }
  get inputAttribute() { return this._inputAttribute }
  get outputNode() { return this._outputNode }
  get outputAttribute() { return this._outputAttribute }

  formatForRender() {
    return `${this._outputNode}#${this._outputAttribute}`
  }
}
