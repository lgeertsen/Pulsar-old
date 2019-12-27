import Software from "./Software"

export default class SoftwareSocket {
  constructor(io, server) {
    this._server = server

    this.io = io.of('/software').on('connection', (socket) => {
      console.log("----- software connected -----")
      console.log(`software.id: ${socket}`)

      let software = new Software(socket)
      this._server.client = software
    });
  }
}
