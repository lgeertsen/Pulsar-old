class FileManager:
    def get_type(path, path_type, sid):
        FileManager.format_for_type(path, path_type, sid)

    def format_for_type(path, path_type, sid):
        stripped = path.split("/")
        if(path_type == "2d"):
            stripped = stripped[:7]
        elif(path_type == "3d"):
            stripped = stripped[:8]
        else:
            stripped = stripped[:6]
        dir_path = "/".join(stripped)
        print(dir_path)
        # path.format(project=sid.project)


FileManager.get_type("I:/SynologyDrive/pipeline/{project}/02_work/02_shot/2d/{type}/{name}/{task}/{subtask}/{state}_{version}", "2d", 4)
FileManager.get_type("I:/SynologyDrive/pipeline/{project}/02_work/02_shot/3d/scenes/{type}/{name}/{task}/{subtask}/{state}_{version}", "3d", 4)
FileManager.get_type("I:/SynologyDrive/pipeline/{project}/02_Work/01_Asset/{type}/{name}/{task}/{subtask}/{state}_{version}", "asset", 4)
