/**
 * Class that represents an Edge in the graph editor
 */
class Edge {
  /**
   * constructor - Construcor for the Edge class
   *
   * @param {string} nodeIn    Id of the connected input node
   * @param {string} attribIn  Id of the connected input attribute
   * @param {string} nodeOut   Id of the connected output node
   * @param {string} attribOut Id of the connected output attribute
   */
  constructor (nodeIn, attribIn, nodeOut, attribOut) {
    this._inputNode = nodeIn
    this._inputAttribute = attribIn
    this._outputNode = nodeOut
    this._outputAttribute = attribOut
  }

  /**
   * inputNode - getter for the input node
   *
   * @returns {string} the connected input node
   */
  get inputNode () { return this._inputNode }

  /**
   * inputAttribute - getter for the input attribute
   *
   * @returns {string} the connected input attribute
   */
  get inputAttribute () { return this._inputAttribute }

  /**
   * outputNode - getter for the output node
   *
   * @returns {string} the connected output node
   */
  get outputNode () { return this._outputNode }

  /**
   * outputAttribute - getter for the output attribute
   *
   * @returns {string} the connected output attribute
   */
  get outputAttribute () { return this._outputAttribute }

  /**
   * formatForRender - Representation of the Edge instance as a string
   *
   * @returns {string} Representation of the Edge instance as a string
   */
  formatForRender () {
    return `${this._outputNode}#${this._outputAttribute}`
  }
}

export default Edge
