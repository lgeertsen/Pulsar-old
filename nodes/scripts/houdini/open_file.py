import os
import hou

def main(arguments):
    file = arguments["file"].replace(os.sep, '/')

    if(arguments["force"] == 0):
        hou.hipFile.load(file, suppress_save_prompt=True)
    else:
        hou.hipFile.save(file_name=None)
        hou.hipFile.load(file, suppress_save_prompt=False)
