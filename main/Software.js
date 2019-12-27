class Software {
  constructor(socket) {
    this._id = socket.id;
    this._socket = socket;
    this._software = undefined;
    this._scene = undefined;
  }

  get id () { return this._id }

  get socket () { return this._socket }

  get software () { return this._software }
  set software (software) { this._software = software }

  get scene () { return this._scene }
  set scene (scene) { this._scene = scene }
}
