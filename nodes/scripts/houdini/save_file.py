import hou


def main(arguments):
    try:
        hou.hipFile.save(arguments["file"])
        return true;
    except Exception as e:
        return false
