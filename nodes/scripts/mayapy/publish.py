import maya.standalone
maya.standalone.initialize( name='python' )

import maya.cmds as cmds
import maya.mel as mel

import os

def import_references():
    refs = cmds.ls(type='reference')
    for i in refs:
    	rFile = cmds.referenceQuery(i, f=True)
    	cmds.file(rFile, importReference=True)

def main(arguments):

    file = arguments["file"].replace(os.sep, '/')
    path_split = file.split("/")

    state_version = path_split[-2]
    versions_dir = '/'.join(path_split[:-2])

    publish_dirs = []
    for f in os.listdir(versions_dir):
        if f.split("_")[0] == "publish":
            fpath = os.path.join(versions_dir, f)
            if os.path.isdir(fpath):
                publish_dirs.append(f)

    publish_version = 1

    for dir in publish_dirs:
        version = int(dir.split("_")[1].split("v")[1])
        if version > publish_version:
            publish_version = version

    publish_version += 1

    publish_dir = "publish_v"
    if publish_version > 99:
        publish_dir += str(publish_version)
    elif publish_version > 9:
        publish_dir += "0"
        publish_dir += str(publish_version)
    else:
        publish_dir += "00"
        publish_dir += str(publish_version)

    publish_split = path_split[:-2]
    publish_split.append(publish_dir)
    publish_path = "/".join(publish_split)
    os.mkdir(publish_path)

    publish_path = os.path.join(publish_path, path_split[-1])

    count = 0
    while path_split[count] != "3d":
        count += 1

    workspace_index = count + 1

    workspace_path = '/'.join(path_split[:workspace_index])

    mel.eval('setProject \"' + workspace_path + '\"')

    cmds.file(file, open=True, force=True)

    cmds.file(rn=publish_path)

    import_references()

    cmds.file(save=True)

    old_file = path_split[-2:-1]
    comment = "Published from {file}".format(file=old_file)

    comment_file = os.path.join("/".join(publish_split), "comment.txt")
    with open(comment_file, 'w') as filetowrite:
        filetowrite.write(comment)

main({
    "file": "C:/SynologyDrive/ARAL/03_WORK_PIPE/02_SHOT/3d/scenes/s010/p010/layout/main/work_v002/s010_p010.ma"
})
