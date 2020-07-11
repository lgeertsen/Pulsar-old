import os
import hou

def main(arguments):
    file = arguments["file"].replace(os.sep, '/')

    if(arguments["force"] == 0):
        hou.hipFile.load(file, suppress_save_prompt=True)
    else:
        hou.hipFile.save(file_name=None)
        hou.hipFile.load(file, suppress_save_prompt=False)

    # workspace_path = file.split('/scenes')[0]
    # wipcache_path = os.path.split(file.replace('02_shot/3d/scenes', '03_WIP_CACHE_FX'))[0]
    # wipcache_path = wipcache_path.replace('01_asset_3d/3d/scenes', '03_WIP_CACHE_FX')
    # pubcache_path = os.path.split(file.replace('02_shot/3d/scenes', '04_PUBLISH_CACHE_FX'))[0]
    # pubcache_path = pubcache_path.replace('01_asset_3d/3d/scenes', '04_PUBLISH_CACHE_FX')
    # hou.putenv('JOB', workspace_path)
    # hou.putenv('WIPCACHE', wipcache_path)
    # hou.putenv('PUBCACHE', pubcache_path)
