import os
import sys
import logging
import json

parent_dir = os.path.dirname(__file__)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio

class Software(socketio.Namespace):
    def __init__(self, namespace, pulsar):
        super(Software, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self, sid, environ):
        print("----- connected software -----", sid)
        self._pulsar._softwares[sid] = {
            "id": sid,
            "software": None,
            "scene": None
        }

    def on_software(self, sid, data):
        print(sid, "----- software -----", data)
        data["id"] = sid
        self._pulsar._softwares[sid] = data

        if not self._pulsar._frontend == None:
            print('----- sendings software list to frontend -----')
            self._pulsar._sio.emit("softwares", self._pulsar._softwares, namespace="/frontend")

    def on_saved(self, sid, data):
        print("----- software saved -----", data)
        self._pulsar._softwares[sid]["saved"] = data
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
