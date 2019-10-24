import maya.cmds as cmds


def main(arguments):
    try:
        cmds.file(arguments["file"], save=True)
        return true;
    except Exception as e:
        return false
