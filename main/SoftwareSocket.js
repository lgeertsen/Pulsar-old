import Renderer from './Renderer'
import Software from './Software'

export default class SoftwareSocket {
  constructor (io, server) {
    if (!!this.constructor.instance) {
      return this.constructor.instance
    }

    this.constructor.instance = this

    this._server = server
    this._softwares = {}

    this._io = io.of('/software').on('connection', (socket) => {
      console.log('----- software connected -----')
      console.log(`software.id: ${socket.id}`)

      const software = new Software(socket)
      // this._server.client = software
      this._softwares[socket.id] = software
      console.log(this._softwares)

      socket.on('software', data => {
        software.software = data.software
        software.scene = data.scene
        software.saved = data.saved
        this.sendSoftwares()
      })

      socket.on('disconnect', () => {
        console.log('----- software disconnected -----')
        console.log(`software.id: ${socket.id}`)
        delete this._softwares[socket.id]
        console.log(this._softwares)
        this.sendSoftwares()
      })
    })
  }

  get softwares () { return this._softwares }

  sendSoftwares () {
    const softs = {}
    for (const id in this._softwares) {
      const soft = this._softwares[id].formatForRender()
      softs[id] = soft
    }

    const render = new Renderer()
    render.sendMessageMainData('softwares', softs)
  }
}
