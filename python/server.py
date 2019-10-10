import os
import sys
import logging

# Add vendor to sys.path, to correctly import third party modules
parent_dir = os.path.dirname(__file__)
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio
import eventlet



class FrontEnd(socketio.Namespace):
    def __init__(self, namespace, pulsar):
        super(FrontEnd, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self, sid, environ):
        print("----- connected frontend -----", sid)
        self._pulsar._frontend = sid
        print('----- sendings software list to frontend -----')
        self.emit("softwares", self._pulsar._softwares, room=sid)

    def on_disconnect(self, sid):
        print("----- disconnected -----", sid)
        self._pulsar._frontend = None




class Software(socketio.Namespace):
    def __init__(self, namespace, pulsar):
        super(Software, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self, sid, environ):
        print("----- connected software -----", sid)
        self._pulsar._softwares[sid] = {
            "software": None,
            "scene": None
        }

    def on_software(self, sid, data):
        print(sid, "----- software -----", data)
        self._pulsar._softwares[sid] = data

        if not self._pulsar._frontend == None:
            print('----- sendings software list to frontend -----')
            self._pulsar._sio.emit("softwares", self._pulsar._softwares, namespace="/frontend")

    def on_close(self, sid):
        self._pulsar._sio.disconnect(sid, namespace="/software")

    def on_disconnect(self, sid):
        print("----- disconnected -----", sid)
        del self._pulsar._softwares[sid]
        if not self._pulsar._frontend == None:
            print('----- sendings software list to frontend -----')
            self._pulsar._sio.emit("softwares", self._pulsar._softwares, namespace="/frontend")

class Pulsar():
    def __init__(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.ERROR)
        self._sio = socketio.Server(logger=logger, engineio_logger=logger)
        self._app = socketio.WSGIApp(self._sio)
        self._sio.register_namespace(FrontEnd('/frontend', self))
        self._sio.register_namespace(Software('/software', self))

        self._frontend = None
        self._softwares = {}



if __name__ == '__main__':
    pulsar = Pulsar()
    eventlet.wsgi.server(eventlet.listen(('', 7846)), pulsar._app)
    print('----- server running on port 7846 -----')

#python 2TD\Geertsen_Lee\Pulsar\python\server.py
