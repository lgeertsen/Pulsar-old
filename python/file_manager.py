import os
import datetime

class FileManager:
    def get_directories(path):
        try:
            dirs = []
            for file in os.listdir(path):
                fpath = os.path.join(path, file)
                if os.path.isdir(fpath):
                    dirs.append(file)
            return dirs
        except:
            return []

    def get_types(path, path_type, sid):
        dir_path = FileManager.format_for_types(path, path_type, sid)
        return FileManager.get_directories(dir_path)

    def get_names(path, path_type, sid):
        dir_path = FileManager.format_for_names(path, path_type, sid)
        return FileManager.get_directories(dir_path)

    def get_tasks(path, path_type, sid):
        dir_path = FileManager.format_for_tasks(path, path_type, sid)
        return FileManager.get_directories(dir_path)

    def get_subtasks(path, path_type, sid):
        dir_path = FileManager.format_for_subtasks(path, path_type, sid)
        return FileManager.get_directories(dir_path)

    def get_stat_version(path, path_type, sid):
        dir_path = FileManager.format_for_state_version(path, path_type, sid)
        return dir_path, FileManager.get_directories(dir_path)

    def get_files(path, path_type, sid):
        files = []
        dir_path, state_version_dirs = FileManager.get_stat_version(path, path_type, sid)
        for dir in state_version_dirs:
            splitted = dir.split("_")
            projFiles = os.listdir(dir_path + "/" + dir)
            tags = []
            for f in projFiles:
                splitFile = f.split(".")
                if(splitFile[-1] == "tag"):
                    tags.append(splitFile[0])

            for f in projFiles:
                extension = f.split(".")[-1]
                if f != "comment.txt" and extension != "tag":
                    fpath = os.path.join(dir_path + "/" + dir, f)
                    if os.path.isfile(fpath):
                        size = os.path.getsize(fpath)
                        modified = os.path.getmtime(fpath)
                        date = datetime.datetime.fromtimestamp(modified).strftime('%d/%m/%Y %H:%M')
                        splitFile = f.split(".")

                        comment = ""
                        comment_file = os.path.join(dir_path + "/" + dir, "comment.txt")
                        if os.path.exists(comment_file):
                            with open(comment_file, 'r') as data:
                                comment = data.read()

                        try:
                            file = {
                                "state": splitted[0],
                                "version": "_" if splitted[0] == "wip" else splitted[1],
                                "name": splitFile[0],
                                "extension": splitFile[1],
                                "size": size,
                                "modified": date,
                                "comment": comment,
                                "tags": tags,
                                "path": fpath
                            }
                            files.append(file)
                        except:
                            pass
        return files

    def get_file_path(path, sid):
        format_path = path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"], subtask=sid["subtask"], version=sid["version"], state=sid["state"], file=sid["file"]["name"], ext=sid["file"]["extension"])
        return format_path

    def save_comment(path, sid, comment):
        format_path = FileManager.format_for_file(path, "3d", sid)
        file = "comment.txt"
        comment_file = os.path.join(format_path, file)
        with open(comment_file, 'w') as filetowrite:
            filetowrite.write(comment)

    



    def format_for_types(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:7]
        elif(path_type == "3d"):
            stripped = stripped[:7]
        else:
            stripped = stripped[:5]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"])

        return format_path

    def format_for_names(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:8]
        elif(path_type == "3d"):
            stripped = stripped[:8]
        else:
            stripped = stripped[:6]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"])

        return format_path

    def format_for_tasks(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:9]
        elif(path_type == "3d"):
            stripped = stripped[:9]
        else:
            stripped = stripped[:9]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"])

        return format_path

    def format_for_subtasks(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:10]
        elif(path_type == "3d"):
            stripped = stripped[:10]
        else:
            stripped = stripped[:10]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"])

        return format_path

    def format_for_state_version(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:11]
        elif(path_type == "3d"):
            stripped = stripped[:11]
        else:
            stripped = stripped[:11]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"], subtask=sid["subtask"])

        return format_path

    def format_for_file(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:12]
        elif(path_type == "3d"):
            stripped = stripped[:12]
        else:
            stripped = stripped[:12]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"], subtask=sid["subtask"], state=sid["state"], version=sid["version"])

        return format_path
