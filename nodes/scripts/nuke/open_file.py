import nuke


def main(arguments):
    if(arguments["force"]):
        nuke.load(arguments["file"], open=True, force=True)
    else:
        nuke.scriptSave(file_name=None)
        nuke.load(arguments["file"], open=True, force=False)
