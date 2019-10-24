import hou


def main(arguments):
    if(arguments["force"]):
        hou.hipFile.load(arguments["file"], open=True, force=True)
    else:
        hou.hipFile.save(file_name=None)
        hou.hipFile.load(arguments["file"], open=True, force=False)
