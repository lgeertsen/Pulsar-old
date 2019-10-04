import os
import sys

# Add vendor to sys.path, to correctly import third party modules
parent_dir = os.path.dirname(__file__)
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio
import eventlet

sio = socketio.Server()
app = socketio.WSGIApp(sio)

frontend = None

class FrontEnd(socketio.Namespace):
    def on_connect(self, sid, environ):
        print("connected", sid)
        frontend = sid

    def on_disconnect(self, sid):
        print("disconnected", sid)
        frontend = None

    def message(self, data):
        print('message', data)

sio.register_namespace(FrontEnd('/frontend'))

if __name__ == '__main__':
    eventlet.wsgi.server(eventlet.listen(('', 7846)), app)
    print('server running on port 7846')
