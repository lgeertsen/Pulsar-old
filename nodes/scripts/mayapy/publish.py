import maya.standalone
maya.standalone.initialize( name='python' )

import maya.cmds as cmds
import maya.mel as mel

import os
import sys

def import_references():
    refs = cmds.ls(type='reference')
    for i in refs:
    	rFile = cmds.referenceQuery(i, f=True)
    	cmds.file(rFile, importReference=True)

def main(file_path):
    file = file_path.replace(os.sep, '/')
    path_split = file.split("/")

    state_version = path_split[-2]
    versions_dir = '/'.join(path_split[:-2])

    publish_dir = os.path.join(versions_dir, "publish_{version}".format(version=state_version.split("_")[1]))

    if not os.path.exists(publish_dir):
        os.mkdir(publish_dir)

    publish_path = os.path.join(publish_dir, path_split[-1])

    cmds.file(file, open=True, force=True)

    cmds.file(rn=publish_path)

    import_references()

    cmds.file(save=True, force=True)

    old_file = path_split[-2:-1]
    comment = "Published from {file}".format(file=old_file)

    comment_file = os.path.join(publish_dir, "comment.txt")
    with open(comment_file, 'w') as filetowrite:
        filetowrite.write(comment)

main(sys.argv[1])
