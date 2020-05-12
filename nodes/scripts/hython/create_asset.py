import os
import sys

def main(file_path):
    file = file_path.replace(os.sep, '/')
    path_split = file.split("/")

    dir_path = '/'.join(path_split[:-1])

    print(dir_path)

    if not os.path.exists(dir_path):
        os.mkdir(dir_path)

    hou.hipFile.save(file_name=file)

    comment = ""
    comment_file = os.path.join(dir_path, "comment.txt")
    with open(comment_file, 'w') as filetowrite:
        filetowrite.write(comment)

main(sys.argv[1])
