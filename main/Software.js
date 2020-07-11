export default class Software {
  constructor (socket) {
    this._id = socket.id
    this._socket = socket
    this._software = undefined
    this._scene = undefined
    this._saved = 1
  }

  get id () { return this._id }

  get socket () { return this._socket }

  get software () { return this._software }
  set software (software) { this._software = software }

  get scene () { return this._scene }
  set scene (scene) { this._scene = scene }

  get saved () { return this._saved }
  set saved (saved) { this._saved = saved }

  execTask (data) {
    this._socket.emit('execTask', data)
  }

  formatForRender () {
    return {
      id: this._id,
      software: this._software,
      scene: this._scene,
      saved: this._saved
    }
  }
}
