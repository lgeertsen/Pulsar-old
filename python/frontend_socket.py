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

from node_manager import NodeManager

class FrontEnd(socketio.Namespace):
    def __init__(self, namespace, pulsar):
        super(FrontEnd, self).__init__(namespace)
        self._pulsar = pulsar

    def on_connect(self, sid, environ):
        print("----- connected frontend -----", sid)
        self._pulsar._frontend = sid
        print('----- sendings software list to frontend -----')
        self.emit("softwares", self._pulsar._softwares, room=sid)
        self.emit("configFile", self._pulsar._config, room=sid)

    def on_disconnect(self, sid):
        print("----- disconnected -----", sid)
        self._pulsar._frontend = None

    def on_getConfig(self, sid):
        self.emit("configFile", self._pulsar._config, room=sid)

    def on_setProject(self, sid, data):
        print("----- set project -----", data)
        self._pulsar._sid["project"] = data
        dirs = self._pulsar._type_to_func["project"]["func"]()
        self.emit("directories", {"type": "type", "dirs": dirs}, room=sid)

    def on_setSwitch(self, sid, data):
        print("----- set switch -----", data)
        self._pulsar._sid["switch"] = data
        dirs = self._pulsar._type_to_func["project"]["func"]()
        self.emit("directories", {"type": "type", "dirs": dirs}, room=sid)

    def on_setSidDir(self, sid, data):
        print("----- set sid dir -----", data)
        self._pulsar._sid[data["type"]] = data["dir"]
        self._pulsar.cleanSid(data["type"])
        dirs = self._pulsar._type_to_func[data["type"]]["func"]()
        self.emit("directories", {"type": self._pulsar._type_to_func[data["type"]]["type"], "dirs": dirs}, room=sid)

    def on_setFile(self, sid, data):
        print("----- set file -----", data)
        self._pulsar._sid["state"] = data["state"]
        self._pulsar._sid["version"] = data["version"]
        self._pulsar._sid["file"] = data

    def on_checkSotfwareSaved(self, sid):
        print("----- check if software is saved -----")
        self._pulsar._sio.emit("checkSaved", namespace="/software")

    def on_saveComment(self, sid, data):
        print("----- save comment -----", data)
        FileManager.save_comment(self._pulsar._config["shot_paths"]["3d"], self._pulsar._sid, data)

    def on_execTask(self, sid, data):
        print("----- exec task -----", data)
        type = data["type"]
        task = data["command"]

        if(type in ["maya", "houdini", "nuke"]):
            arguments = data["arguments"]
            # if(task == "open_file"):
            #     arguments["file"] = FileManager.get_file_path(self._pulsar._config["shot_paths"]["3d"], self._pulsar._sid)
            if data["id"] == "new":
                win_task = "{type}_{task}".format(type=type, task=task)
                node = NodeManager.getNode("windows", win_task)
                path = "{base_path}/scripts/{type}/".format(base_path=self._pulsar._config["nodes"], type="windows")
                file = node["script"]
                file_path = os.path.join(path, file)
                command = "start {script} {soft_path} {file}".format(script=file_path, soft_path=self._pulsar._config["softwares"][type], file=arguments["file"])
                print(command)
                os.system(command)
            else:
                node = NodeManager.getNode(type, task)
                path = "{base_path}/scripts/{type}/".format(base_path=self._pulsar._config["nodes"], type=type)
                file = node["script"].split(".")[0]
                self._pulsar._sio.emit("execTask", {"path": path, "file": file, "arguments": arguments}, namespace="/software", room=data["id"])
        elif data["id"] == "mayapy":
            node = NodeManager.getNode(type, task)
            path = "{base_path}/scripts/{type}/".format(base_path=self._pulsar._config["nodes"], type=type)
            file = node["script"]
            file_path = os.path.join(path, file)
            command = "{mayapy} {file} {args}".format(mayapy=self._pulsar._config["softwares"]["mayapy"], file=file_path, args=data["arguments"])
            print(command)
            os.system(command)



    # def on_getTypes(self, sid, data):
    #     if(self._pulsar._sid["switch"] == "shots"):
    #         dirs = []
    #         for type, path in self._pulsar._config["shot_paths"]:
    #             print(type, path)
    #     else:
    #         pass
