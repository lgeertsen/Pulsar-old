import os
import sys
import json
import timeit
import time
import logging

import hou
import hdefereval

parent_dir = os.path.abspath(os.path.dirname(__file__))
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio

logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)

class Singleton(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]

class PulsarSocket(socketio.ClientNamespace):
    def __init__(self, namespace, pulsar):
        super(PulsarSocket, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self):
        print("----- Connected to Pulsar -----")
        self._pulsar._connected = True
        saved = self._pulsar.execute(self._pulsar.check_state)
        self.emit("software", {"software": "houdini", "scene": self._pulsar._scene, "saved": saved})

    def on_checkSaved(self, data):
        saved = self._pulsar.execute(self._pulsar.check_state)
        self.emit("saved", saved)

    def on_execTask(self, data):
        print(data)
        path = data["path"]
        file = data["file"]
        arguments = data["arguments"]

        print(path)

        if path not in sys.path:
            sys.path.append(path)
        print(sys.path)
        print(file)
        task = __import__(file)
        reload(task)
        self._pulsar.execute(task.main, arguments)

        self._pulsar._scene = self._pulsar.execute(self._pulsar.getSceneName)
        saved = self._pulsar.execute(self._pulsar.check_state)

        self.emit("software", {"software": "houdini", "scene": self._pulsar._scene, "saved": saved})


    def on_disconnect(self):
        print("disconnected")
        self._pulsar._connected = False
        self._pulsar._sio.disconnect()

class Pulsar():
    __metaclass__ = Singleton
    def __init__(self):
        print("---- Starting up Pulsar plugin ----")
        self._sio = socketio.Client(logger=logger, engineio_logger=logger)
        self._sio.register_namespace(PulsarSocket('/software', self))
        self._connected = False
        self._scene = self.getSceneName()

        self.launch()
        # pane_tab = hou.ui.curDesktop().createFloatingPaneTab(hou.paneTabType.PythonPanel, python_panel_interface=)
        # pane_tab.setCurrentNode(node)
        # pane_tab.setPin(True)
        # return pane_tab

    def getSceneName(self):
        raw_name, extension = os.path.splitext(hou.hipFile.basename())
        if(raw_name == ""):
            raw_name = "untitled"
        return raw_name


    def launch(self, *args):
        if not self._connected:
            print("----- Connecting to Pulsar... -----")
            try:
                self._sio.connect('http://localhost:7846', namespaces=['/software'])
            except Exception as e:
                pass

    def stop(self, *args):
        if self._connected:
            self._sio.emit("close", namespace="/software")

    def check_state(self):
        changed = hou.hipFile.hasUnsavedChanges()
        if changed:
            return 0
        return 1

    def execute(self, func, *args):
        return hdefereval.executeInMainThreadWithResult(func, *args)
