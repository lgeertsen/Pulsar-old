import maya.cmds as cmds
import os

def main(arguments):
    print("Save & Increment File")
    try:
        scene_path = cmds.file(query=True, sceneName=True)
        path_split = scene_path.split("/")

        versions_dir = '/'.join(path_split[:-2])

        dirs = os.listdir(versions_dir)
        version = 1
        for dir in dirs:
            state_version = dir.split("_")
            if state_version[0] == "work":
                v = int(state_version[1].split("v")[1])
                if v > version:
                    version = v

        version += 1

        work_dir = "work_v{zeros}{version}";
        if version > 99:
            work_dir = work_dir.format(zeros="", version=version)
        elif version > 9:
            work_dir = work_dir.format(zeros="0", version=version)
        else:
            work_dir = work_dir.format(zeros="00", version=version)

        work_path = os.path.join(versions_dir, work_dir)

        if not os.path.exists(work_path):
            os.mkdir(work_path)

        new_path = os.path.join(work_path, path_split[-1])
        cmds.file(rn=new_path)
        cmds.file(save=True, force=True)

        old_file = path_split[-2:-1]
        comment = "New Version from {file}".format(file=old_file)

        comment_file = os.path.join(work_path, "comment.txt")
        with open(comment_file, 'w') as filetowrite:
            filetowrite.write(comment)
        return True;
    except Exception as e:
        return False
