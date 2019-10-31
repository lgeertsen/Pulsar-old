import maya.cmds as cmds
import maya.mel as mel

import os

def main(arguments):
    file = arguments["file"].replace(os.sep, '/')
    new_name = arguments["name"]
    path_split = file.split("/")

    wip_path = '/'.join(path_split[:-2]) + '/wip'
    new_name_path = os.path.join(wip_path, new_name)


    count = 0
    while path_split[count] != "3d":
        count += 1

    workspace_index = count + 1

    workspace_path = '/'.join(path_split[:workspace_index])

    mel.eval('setProject \"' + workspace_path + '\"')

    if(arguments["force"] == 0):
        cmds.file(file, open=True, force=True)
    else:
        cmds.file(save=True)
        cmds.file(file, open=True, force=False)

    cmds.file(rn=new_name_path)
