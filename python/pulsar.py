import os
import sys
import logging
import json

# Add vendor to sys.path, to correctly import third party modules
parent_dir = os.path.dirname(__file__)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio
import eventlet
import eventlet.wsgi

from file_manager import FileManager
from node_manager import NodeManager
from frontend_socket import FrontEnd
from software_socket import Software


config_path = "C:/Users/leege/Pulsar/config.json"


class Pulsar():
    def __init__(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.ERROR)
        self._sio = socketio.Server(logger=logger, engineio_logger=logger)
        self._app = socketio.WSGIApp(self._sio)
        self._sio.register_namespace(FrontEnd('/frontend', self))
        self._sio.register_namespace(Software('/software', self))

        self._type_to_func = {
            "project": {
                "type": "name",
                "func": self.get_types
            },
            "type": {
                "type": "name",
                "func": self.get_names
            },
            "name": {
                "type": "task",
                "func": self.get_tasks
            },
            "task": {
                "type": "subtask",
                "func": self.get_subtasks
            },
            "subtask": {
                "type": "file",
                "func": self.get_files
            }
        }

        self._frontend = None
        self._softwares = {}

        self._config = self.readConfig()
        self._sid = self.initSID()
        NodeManager.importNodes(self._config["nodes"])

    def readConfig(self):
        filename = config_path
        with open(filename, 'r') as data:
            config = json.load(data)
            return config
        return {}

    def saveConfig(self, config):
        self._config = config
        filename = "../config.json"
        with open(filename, 'w') as filetowrite:
            json.dump(config, filetowrite, sort_keys=True, indent=4)

    def initSID(self):
        sid = {
            "disk": self._config["disk"],
            "project": self._config["projects"][0],
            "switch": "assets",
            "type": None,
            "name": None,
            "task": None,
            "subtask": None,
            "state": None,
            "version": None,
            "file": None
        }
        return sid

    def cleanSid(self, sid_type):
        if sid_type == "project":
            self._sid["switch"] = None
            self._sid["type"] = None
            self._sid["name"] = None
            self._sid["task"] = None
            self._sid["subtask"] = None
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "switch":
            self._sid["type"] = None
            self._sid["name"] = None
            self._sid["task"] = None
            self._sid["subtask"] = None
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "type":
            self._sid["name"] = None
            self._sid["task"] = None
            self._sid["subtask"] = None
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "name":
            self._sid["task"] = None
            self._sid["subtask"] = None
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "task":
            self._sid["subtask"] = None
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "subtask":
            self._sid["state"] = None
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "state":
            self._sid["version"] = None
            self._sid["file"] = None
        elif sid_type == "version":
            self._sid["file"] = None

    def get_types(self):
        if(self._sid["switch"] == "assets"):
            dirs = FileManager.get_types(self._config["asset_path"], "assets", self._sid)
            print("----- asset type directories -----")
            print(dirs)
            return dirs
        else:
            dir_2d = FileManager.get_types(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_types(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- sequence directories -----")
            print(dirs)
            return dirs

    def get_names(self):
        if(self._sid["switch"] == "assets"):
            dirs = FileManager.get_names(self._config["asset_path"], "assets", self._sid)
            return dirs
        else:
            dir_2d = FileManager.get_names(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_names(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- shot directories -----")
            print(dirs)
            return dirs

    def get_tasks(self):
        if(self._sid["switch"] == "assets"):
            dirs = FileManager.get_tasks(self._config["asset_path"], "assets", self._sid)
            return dirs
        else:
            dir_2d = FileManager.get_tasks(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_tasks(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- task directories -----")
            print(dirs)
            return dirs

    def get_subtasks(self):
        if(self._sid["switch"] == "assets"):
            dirs = FileManager.get_subtasks(self._config["asset_path"], "assets", self._sid)
            return dirs
        else:
            dir_2d = FileManager.get_subtasks(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_subtasks(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- subtask directories -----")
            print(dirs)
            return dirs

    def assemble_dirs(self, dir1, dir2):
        in_dir1 = set(dir1)
        in_dir2 = set(dir2)
        in_dir2_but_not_in_dir1 = in_dir2 - in_dir1
        dirs = dir1 + list(in_dir2_but_not_in_dir1)
        return dirs

    def get_files(self):
        if(self._sid["switch"] == "assets"):
            files = FileManager.get_files(self._config["asset_path"], "assets", self._sid)
            return files
        else:
            files_2d = FileManager.get_files(self._config["shot_paths"]["2d"], "2d", self._sid)
            files_3d = FileManager.get_files(self._config["shot_paths"]["3d"], "3d", self._sid)
            files = files_2d + files_3d
            print("----- files -----")
            print(files)
            return files



if __name__ == '__main__':
    pulsar = Pulsar()
    eventlet.wsgi.server(eventlet.listen(('127.0.0.1', 7846)), pulsar._app)
    print('----- server running on port 7846 -----')
