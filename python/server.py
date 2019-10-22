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



from file_manager import FileManager



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
        dirs = self._pulsar._type_to_func[data["type"]]["func"]()
        self.emit("directories", {"type": self._pulsar._type_to_func[data["type"]]["type"], "dirs": dirs}, room=sid)

    def on_setFile(self, sid, data):
        print("----- set file -----", data)
        self._pulsar._sid["file"] = data

    def on_execTask(self, sid, data):
        soft = self._pulsar._softwares[data["id"]]
        if soft["software"] == "maya":
            if data["command"] == "open_file":
                #self._nodes[data.task]
                path = self._pulsar._config["nodes"] + "." + "/scripts/maya/"
                file = "open_file"
                file_path = os.path.join(path, file)
                arguments = {
                    "file": FileManager.get_file_path(self._pulsar._config["shot_paths"]["3d"], self._pulsar._sid),
                    "force": True
                }
                print(arguments)
                self._pulsar._sio.emit("execTask", {"path": path, "file": file, "arguments": arguments}, namespace="/software", room=data["id"])



    # def on_getTypes(self, sid, data):
    #     if(self._pulsar._sid["switch"] == "shots"):
    #         dirs = []
    #         for type, path in self._pulsar._config["shot_paths"]:
    #             print(type, path)
    #     else:
    #         pass






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

    def readConfig(self):
        filename = "../config.json"
        with open(filename, 'r') as data:
            config = json.load(data)
            return config

        print("----- config file: -----")
        print(self._config)
        print("----- end file -----")

        return {}

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

    def get_types(self):
        if(self._sid["switch"] == "assets"):
            return []
        else:
            dir_2d = FileManager.get_types(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_types(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- sequence directories -----")
            print(dirs)
            return dirs

    def get_names(self):
        if(self._sid["switch"] == "assets"):
            return []
        else:
            dir_2d = FileManager.get_names(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_names(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- shot directories -----")
            print(dirs)
            return dirs

    def get_tasks(self):
        if(self._sid["switch"] == "assets"):
            return []
        else:
            dir_2d = FileManager.get_tasks(self._config["shot_paths"]["2d"], "2d", self._sid)
            dir_3d = FileManager.get_tasks(self._config["shot_paths"]["3d"], "3d", self._sid)
            dirs = self.assemble_dirs(dir_2d, dir_3d)
            print("----- task directories -----")
            print(dirs)
            return dirs

    def get_subtasks(self):
        if(self._sid["switch"] == "assets"):
            return []
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
        files_2d = FileManager.get_files(self._config["shot_paths"]["2d"], "2d", self._sid)
        files_3d = FileManager.get_files(self._config["shot_paths"]["3d"], "3d", self._sid)
        files = files_2d + files_3d
        print("----- files -----")
        print(files)
        return files



if __name__ == '__main__':
    pulsar = Pulsar()
    eventlet.wsgi.server(eventlet.listen(('', 7846)), pulsar._app)
    print('----- server running on port 7846 -----')
