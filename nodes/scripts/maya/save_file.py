import maya.cmds as cmds

def main(arguments):
    print("Save file")
    try:
        cmds.file(save=True, force=True)
        return True;
    except Exception as e:
        return False
