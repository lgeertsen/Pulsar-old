import os
import sys

import hou

if not os.path.exists(__file__):
    # __file__ is not a path to an existing file on disk
    # script might be launched from ScriptEditor
    # => try to resolve absolute path to source file
    try:
        __file__ = bpy.data.texts[os.path.basename(__file__)].filepath
    except Exception:
        raise RuntimeError("Failed to resolve __file__ to an existing path")

# Add vendor to sys.path, to correctly import third party modules
parent_dir = os.path.dirname(__file__)
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import socketio

cameras = {}

# standard Python
sio = socketio.Client()

class HoudiniSocket(socketio.ClientNamespace):
    def on_connect(self):
        print("connected to soft namespace")
        sio.emit("soft", {"soft": "houdini", "scene": "houdini"}, namespace="/soft")

    def on_disconnect(self):
        print("disconnected")

    def on_phoneConnect(self, data):
        print('Create new camera')
        success = None
        if data["id"] in cameras:
            success = True
        else:
            success = do_create_new_camera(data["id"])
        if success:
            sio.emit("cameraCreated", data, namespace="/soft")
        
    def on_transform(self, data):
        id = data["id"]
        transform = data["transform"]
        position = transform["position"]
        rotation = transform["rotation"]
        translation = (float(position[0]) * 10, float(position[1]) * 10, float(position[2]) * 10)
        rotate = (float(rotation[0]), float(rotation[1]), float(rotation[2]))
        transform_dict = {
            "translate": translation,
            "rotate": rotate
        }
        matrix = hou.hmath.buildTransform(transform_dict)
        do_set_camera_transform(id, matrix)


sio.register_namespace(HoudiniSocket('/soft'))
sio.connect('http://localhost:7845')


def do_create_new_camera(id):
    success = True
    try:
        cam_node = hou.node('/obj').createNode('cam')
        cameras[id] = cam_node
    except:
        success = False
    return success
        

def do_set_camera_transform(id, matrix):
    try:
        cameras[id].setWorldTransform(matrix)
    except:
        pass

# io.emit("close")
