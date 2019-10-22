import maya.cmds as cmds

def main(arguments):
    if(arguments["force"]):
        cmds.file(arguments["file"], open=True, force=True)
    else:
        cmds.file(save=True)
        cmds.file(arguments["file"], open=True, force=False)
