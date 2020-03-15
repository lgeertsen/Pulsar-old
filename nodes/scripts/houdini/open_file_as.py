import hou

import os

def main(arguments):
    file = arguments["file"].replace(os.sep, '/')
    new_name = arguments["name"]
    path_split = file.split("/")

    wip_path = '/'.join(path_split[:-2]) + '/wip'
    path = os.path.join(wip_path, new_name)
    new_name_path = path.replace(os.sep, '/')

    if not os.path.exists(wip_path):
        os.mkdir(wip_path)



    # count = 0
    # while path_split[count] != "3d":
    #     count += 1
    #
    # workspace_index = count + 1
    #
    # workspace_path = '/'.join(path_split[:workspace_index])
    #
    # mel.eval('setProject \"' + workspace_path + '\"')

    if(arguments["force"] == 0):
        hou.hipFile.load(file, suppress_save_prompt=True)
    else:
        hou.hipFile.save(file_name=None)
        hou.hipFile.load(file, suppress_save_prompt=False)

    hou.hipFile.setName(new_name_path)
    hou.hipFile.save(file_name=None)

    workspace_path = file.split('/scenes')[0]
    wipcache_path = os.path.split(file.replace('02_shot/3d/scenes', '03_WIP_CACHE_FX'))[0]
    wipcache_path = wipcache_path.replace('01_asset_3d/3d/scenes', '03_WIP_CACHE_FX')
    pubcache_path = os.path.split(file.replace('02_shot/3d/scenes', '04_PUBLISH_CACHE_FX'))[0]
    pubcache_path = pubcache_path.replace('01_asset_3d/3d/scenes', '04_PUBLISH_CACHE_FX')

    hou.putenv('JOB', workspace_path)
    hou.putenv('WIPCACHE', wipcache_path)
    hou.putenv('PUBCACHE', pubcache_path)
