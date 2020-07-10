import maya.standalone
maya.standalone.initialize(name='python')

import maya.cmds as cmds
import maya.mel as mel

import os
import sys

def main(file_path):
    file = file_path.replace(os.sep, '/')
    path_split = file.split("/")

    dir_path = '/'.join(path_split[:-1])

    if((not file.endswith(".ma")) or (not file.endswith(".mb"))):
        file += ".ma"

    if not os.path.exists(dir_path):
        os.mkdir(dir_path)

    cmds.file(rn=file)
    cmds.file(save=True)

    comment = ""
    comment_file = os.path.join(dir_path, "comment.txt")
    with open(comment_file, 'w') as filetowrite:
        filetowrite.write(comment)

main(sys.argv[1])
