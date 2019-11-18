import hou

import os

def main(arguments):
    file = arguments["file"].replace(os.sep, '/')
    new_name = arguments["name"]
    path_split = file.split("/")

    wip_path = '/'.join(path_split[:-2]) + '/wip'
    path = os.path.join(wip_path, new_name)
    new_name_path = path.replace(os.sep, '/')



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
