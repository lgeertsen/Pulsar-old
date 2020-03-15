import hou

def main(arguments):
    try:
        hou.hipFile.save()
        print("File saved")
        return True;
    except Exception as e:
        return False
