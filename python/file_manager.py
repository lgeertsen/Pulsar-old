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
            if dir != "release":
                splitted = dir.split("_")
                projFiles = os.listdir(dir_path + "/" + dir)
                for f in projFiles:
                    fpath = os.path.join(dir_path + "/" + dir, f)
                    if os.path.isfile(fpath):
                        size = os.path.getsize(fpath)
                        modified = os.path.getmtime(fpath)
                        date = datetime.datetime.fromtimestamp(modified).strftime('%d/%m/%Y %H:%M')
                        splitFile = f.split(".")
                        file = {
                            "state": splitted[0],
                            "version": splitted[1],
                            "name": splitFile[0],
                            "extension": splitFile[1],
                            "size": size,
                            "modified": date
                        }
                        files.append(file)

        return files

    def get_file_path(path, sid):
        format_path = path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"], subtask=sid["subtask"], version=sid["file"]["version"], state=sid["file"]["state"], file=sid["file"]["name"], ext=sid["file"]["extension"])
        return format_path



    def format_for_types(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:6]
        elif(path_type == "3d"):
            stripped = stripped[:7]
        else:
            stripped = stripped[:5]
        dir_path = "/".join(stripped)
        print(dir_path)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"])

        return format_path

    def format_for_names(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:7]
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
            stripped = stripped[:8]
        elif(path_type == "3d"):
            stripped = stripped[:9]
        else:
            stripped = stripped[:7]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"])

        return format_path

    def format_for_subtasks(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:9]
        elif(path_type == "3d"):
            stripped = stripped[:10]
        else:
            stripped = stripped[:8]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"])

        return format_path

    def format_for_state_version(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:10]
        elif(path_type == "3d"):
            stripped = stripped[:11]
        else:
            stripped = stripped[:9]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"], subtask=sid["subtask"])

        return format_path

sid = {
    "disk": "C",
    "project": "FILM1",
    "type": "S10",
    "name": "SH110",
    "task": "anim",
    "subtask": "main"
}

#FileManager.get_types("{disk}:/SynologyDrive/pipeline/{project}/02_work/02_shot/2d/{type}/{name}/{task}/{subtask}/{state}_{version}", "2d", sid)
#FileManager.get_files("{disk}:/SynologyDrive/pipeline/{project}/02_work/02_shot/3d/scenes/{type}/{name}/{task}/{subtask}/{state}_{version}", "3d", sid)
#FileManager.get_type("{disk}:/SynologyDrive/pipeline/{project}/02_Work/01_Asset/{type}/{name}/{task}/{subtask}/{state}_{version}", "asset", sid)
