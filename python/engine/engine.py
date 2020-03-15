import os
import platform
import subprocess
import sys
import time
import webbrowser
import warnings
from spil.libs.sid import sid

def get():
    """
    Get the correct engine
    """
    if 'houdini' in sys.executable:
        import houdini_engine as he
        reload(he)
        return he.HoudiniEngine()
    elif 'maya' in sys.executable:
        import maya_engine as me
        return me.MayaEngine()
    elif 'Nuke' in sys.executable:
        import nuke_engine as nuke
        return nuke.NukeEngine()
    else:
        return Engine()


class Engine(object):
    @staticmethod
    def conform(file_path):
        """
        Replace the os path with pysep change
        """
        file_path = file_path.replace(os.sep, '/')
        return file_path

    def explore(self, path):

        if not os.path.exists(path):
            print('Path does not exist: {}'.format(path))
            return

        path = os.path.normcase(path)

        if platform.system() == "Windows":
            subprocess.Popen(["explorer", "/open,", path])
        elif platform.system() == "Darwin":
            subprocess.Popen(["open", path])
        else:
            subprocess.Popen(["xdg-open", path])

    def open(self, file_path):
        """
        Open file
        """
        webbrowser.open(self.sid.path)

    def open_as(self, file_path):
        """
        Open file and rename it with a time value
        for keep the source file
        """
        pass

    def save(self, file_path):
        """
        Save file as path
        """
        pass
    
    def create_reference(self, sid_ref):
        """
        create a new reference into the current scene to the scene defined by "sid_ref.path"
        """
        pass

    def get_ext(self):
        """
        Get the main extension
        """
        pass

    def get_file_path(self):
        """
        Get the current file path (from the current open file)
        """
        pass
        
    def get_sid(self):
        """
        return the current sid
        """
        return sid.Sid(path=self.get_file_path())

    def set_workspace(self, path):
        """
        Set the workspace
        """
        pass

    def publish(self):
        """
        Publish the current scene
        """
        pass

    def __str__(self):
        """
        Return the soft name
        """
        return "engine"
