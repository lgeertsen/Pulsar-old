import os

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

    def get_files(path_type, sid):
        files = []


    def format_for_types(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:7]
        elif(path_type == "3d"):
            stripped = stripped[:8]
        else:
            stripped = stripped[:6]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"])

        return format_path

    def format_for_names(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:8]
        elif(path_type == "3d"):
            stripped = stripped[:9]
        else:
            stripped = stripped[:7]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"])

        return format_path

    def format_for_tasks(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:9]
        elif(path_type == "3d"):
            stripped = stripped[:10]
        else:
            stripped = stripped[:8]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"])

        return format_path

    def format_for_subtasks(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:10]
        elif(path_type == "3d"):
            stripped = stripped[:11]
        else:
            stripped = stripped[:9]
        dir_path = "/".join(stripped)
        format_path = dir_path.format(disk=sid["disk"], project=sid["project"], type=sid["type"], name=sid["name"], task=sid["task"])

        return format_path

# sid = {
#     "disk": "C",
#     "project": "FILM1"
# }

#FileManager.get_types("{disk}:/SynologyDrive/pipeline/{project}/02_work/02_shot/2d/{type}/{name}/{task}/{subtask}/{state}_{version}", "2d", sid)
#FileManager.get_types("{disk}:/SynologyDrive/pipeline/{project}/02_work/02_shot/3d/scenes/{type}/{name}/{task}/{subtask}/{state}_{version}", "3d", sid)
#FileManager.get_type("{disk}:/SynologyDrive/pipeline/{project}/02_Work/01_Asset/{type}/{name}/{task}/{subtask}/{state}_{version}", "asset", sid)
