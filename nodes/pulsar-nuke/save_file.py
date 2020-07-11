import nuke

def main(arguments):
    try:
        nuke.scriptSaveAs(filename=arguments["file"])
        return true;
    except Exception as e:
        return false
