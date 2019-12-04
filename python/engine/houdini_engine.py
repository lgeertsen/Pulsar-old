from engine import Engine
import os
import hou
import time
from spil.libs.sid.sid import Sid

class HoudiniEngine(Engine):

    def open(self, path):
        """
        Open file
        """
        hou.hipFile.load(path, suppress_save_prompt=True)
        """
        Workspace
        """
        workspace_path = path.split('/scenes')[0]
        pnum = ''
        snum = ''
        name = ''
        if '02_shot' in path.split('/'):
            shot_path = path.split('02_shot')[0] + '02_SHOT/3d'
            asset_path = path.split('02_shot')[0] + '01_asset_3d'
            pnum = path.split('/')[8]
            snum = path.split('/')[7]
            wipcache_path = os.path.join(path.split(
                '02_shot/3d/scenes')[0], '03_WIP_CACHE_FX', pnum, snum)
            pubcache_path = os.path.join(path.split(
                '02_shot/3d/scenes')[0], '04_PUBLISH_CACHE_FX', pnum, snum)
        else:
            shot_path = path.split('01_asset_3d')[0] + '02_SHOT/3d'
            asset_path = path.split('01_asset_3d')[0] + '01_asset_3d'
            name = path.split('/')[6]
            wipcache_path = os.path.join(path.split('01_asset_3d')[
                                         0], '03_WIP_CACHE_FX', name)
            pubcache_path = os.path.join(path.split('01_asset_3d')[
                                         0], '04_PUBLISH_CACHE_FX', name)

        hou.putenv('JOB', workspace_path)
        hou.putenv('WIPCACHE', wipcache_path)
        hou.putenv('PUBCACHE', pubcache_path)
        hou.putenv('ASSET', asset_path)
        hou.putenv('SHOT', shot_path)
        hou.putenv('PNUM', pnum)
        hou.putenv('SNUM', snum)
        hou.putenv('ASSET_NAME', name)

    def open_as(self, path):
        """
        Open file and rename it with a time value
        for keep the source file
        """
        path = self.conform(path)
        hou.hipFile.load(path, suppress_save_prompt=True)
        hou.hipFile.setName(path.replace(
            ".hipnc", "_{}.hipnc".format(time.time())))

    def save(self, path):
        """
        Save file as path
        """
        path = self.conform(path)
        hou.hipFile.save(path)

    def get_ext(self):
        """
        Get the main extension
        """
        return ('.hipnc', '.hip')

    def get_file_path(self):
        """
        Get the current file path (from the current open file)
        """
        return hou.hipFile.path()

    def set_workspace(self, path):
        """
        Set the workspace
        """
        path = self.conform(path)
        os.environ["JOB"] = path
        hou.allowEnvironmentToOverwriteVariable("JOB", True)

    def __str__(self):
        return 'houdini'


if __name__ == '__main__':
    """
    Test
    """
    # Create engine
    engine = HoudiniEngine()
    print("Engine : " + str(engine))
    # Get engine path
    print("Current file location : " + engine.get_file_path())
    # Save
    engine.save(r"C:\Users\Sylvain\Desktop\test" + engine.get_ext())
    print("Current file location after save : " + engine.get_file_path())
    # Open as
    engine.open_as(engine.get_file_path())
    print("Open as ")
    print("Current file location after open as : " + engine.get_file_path())
    engine.save(engine.get_file_path())
    # Open
    engine.open(r"C:\Users\Sylvain\Desktop\test" + engine.get_ext())
    print("Current file location after open : " + engine.get_file_path())
