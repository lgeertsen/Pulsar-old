import os
import sys
import json
import timeit
import time
import logging

import maya.cmds as cmds

try:
    from shiboken2 import wrapInstance
except:
    from shiboken import wrapInstance

try:
    from PySide2 import QtGui, QtCore, QtWidgets
except ImportError:
    from PySide import QtGui, QtCore
    QtWidgets = QtGui

parent_dir = os.path.abspath(os.path.dirname(__file__))
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio

def maya_useNewAPI():
    """
    The presence of this function tells Maya that the plugin produces, and
    expects to be passed, objects created using the Maya Python API 2.0.
    """
    pass


logger = logging.getLogger(__name__)
logger.setLevel(logging.WARNING)

class MayaSocket(socketio.ClientNamespace):
    def __init__(self, namespace, pulsar):
        super(MayaSocket, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self):
        print("----- connected to maya namespace -----")
        self._pulsar._connected = True
        self.emit("software", {"software": "maya", "scene": "maya"})

    def on_disconnect(self):
        print("disconnected")
        self._pulsar._connected = False
        self._pulsar._sio.disconnect()

class Pulsar():
    def __init__(self):
        self._sio = socketio.Client(logger=logger, engineio_logger=logger)
        #self._sio = socketio.Client()
        self._sio.register_namespace(MayaSocket('/software', self))
        self._connected = False

        self.createUI()

    def createUI(self):
        self._window = cmds.window( title="Pulsar", iconName='Short Name', widthHeight=(300, 400), sizeable=False )
        cmds.columnLayout( adjustableColumn=True )

        cmds.button( label='Launch Pulsar', command=self.launch )
        cmds.button( label='Stop Pulsar', command=self.stop )
        cmds.button( label='Close', command=self.closeUI )

        cmds.setParent( '..' )

        cmds.showWindow( self._window )


    def launch(self, *args):
        if not self._connected:
            print("----- connecting to server... -----")
            self._sio.connect('http://localhost:7846', namespaces=['/software'])

    def stop(self, *args):
        if self._connected:
            self._sio.emit("close", namespace="/software")

    def closeUI(self, *args):
        if self._connected:
            self._sio.emit("close", namespace="/software")
        cmds.deleteUI( self._window, window=True)

    def execute(self, func, *args):
        utils.executeInMainThreadWithResult(func, *args)
