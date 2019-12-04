import math
import sys
import os
import time
from datetime import datetime
import glob
import shutil

# Engine
from pipeline.libs.engine import engine
# from pipeline.libs.splil.libs.sid import Sid
# Init import values
engine = engine.get()

#custom packages
from pipeline.libs.utils import pipe_exception as pe
from pipeline.libs.utils.pipe_exception import PipeException
from spil.libs import sid
from pipeline import conf

sproject_folder = '03_WORK_PIPE'

class FileSystem():
    #Attributes
    shot_file_name = conf.shot_file_name
    shot_template_name = conf.shot_template_name
    shot_workspace_path = conf.shot_workspace_path
    asset_workspace_path = conf.asset_workspace_path
    asset_file_name = conf.asset_file_name
    asset_template_name = conf.asset_template_name

    scene_templates = conf.scene_templates
    default_scene_templates = conf.default_scene_templates
    workspace_template = conf.workspace_template
    default_workspace_template = conf.default_workspace_template

    # Constructor
    def __init__(self):
        self.projects = conf.projects
        self.root = conf.root
        self.sid = sid.Sid()

        if self.projects:
            self.current_project = self.projects[0]
        else:  # gerer avec un raise exception
            raise PipeException('FileSystem :: Warning no project have been loaded !')


    # Methods
    def get_dirs(self, path):
        """
        Return the list of folder in the path
        """
        folders = []
        if os.path.exists(path):
            for f in os.listdir(path):
                if os.path.isdir(os.path.join(path, f)):
                    folders.append(f)
        return folders

    def get_files(self, path):
        """
        Return the list of files in the path
        """
        files = []
        if os.path.exists(path):
            for f in os.listdir(path):
                files.append(f)
        return files



    """
    ====================
    ERROR TRACKER
    ====================
    """

    def check_shot_input(self, sequence, shot, task, subtask, version=None):
        # check if errors
        error = False
        errors = []
        # sequence
        if sequence == '':
            errors.append('Sequence')
            error = True
        else:
            sequence = 's' + sequence
        # shot
        if shot == '':
            errors.append('Shot')
            error = True
        elif shot == 'master':
            pass
        else:
            shot = 'p' + shot
        # task
        if task == '-- Select a task --':
            errors.append('Task')
            error = True
            tasksplit = ''
        else:
            tasksplit = task.split("_")
            taskname = tasksplit[1]
        # subtask
        if subtask == '':
            subtask = 'main'
        else:
            subtask = str(subtask).replace(' ', '_').lower()
        # version
        if version == '':
            errors.append('Version')
            error = True
        elif version == None :
            pass
        else:
            version = 'v' + version.zfill(3)

        return error, errors, sequence, shot, tasksplit, taskname, subtask, version

    def check_asset_input(self, cat, name, task, subtask, version=None):
        # check if errors
        error = False
        errors = []
        # cat
        if cat == '-- Select a category --':
            errors.append('Category')
            error = True
        # asset
        if name == '':
            errors.append('Name')
            error = True
        # task
        if task == '-- Select a task --':
            errors.append('Task')
            error = True
        else:
            tasksplit = task.split("_")
            taskname = tasksplit[1]
        # subtask
        if subtask == '-- Select a subtask --':
            errors.append('Subtask')
            error = True
        # version
        if version == '':
            errors.append('Version')
            error = True
        elif version == None :
            pass
        else:
            version = 'v' + version.zfill(3)


        return error, errors, cat, name, tasksplit, taskname, subtask, version



    """
    ====================
    ?
    ====================
    """

    def make_new_version(self, file_path, tag, description):
        """
        This function create a new directory af the max version and return the path
        Create a json with description
        """
        file_path_array = file_path.split('/')
        fpa_size = len(file_path_array)
        version = file_path_array[fpa_size - 2]
        file_type = version.split('_')[0]
        max_version = 0
        folders_list = self.get_dirs(os.path.dirname(os.path.dirname(file_path)))
        for f in folders_list:
            folder_name_spit = f.split('_')
            if file_type == folder_name_spit[0]:
                if max_version < folder_name_spit[1]:
                    max_version = folder_name_spit[1]
        max_version = max_version[1:]  # Remove the v
        max_version = 'v' + str(int(max_version) + 1).zfill(3)
        new_path = ''
        for i in file_path_array:
            if i == version:
                new_path += file_type + '_' + str(max_version) + os.sep
                if os.path.isdir(new_path) == False:
                    os.mkdir(new_path)
            else:
                new_path += i + os.sep

        new_path = new_path[:-1]  # Remove end sep

        # File setup
        file_base = os.path.dirname(new_path)

        if tag != '':
            self.create_tag_file(file_base, tag)

        self.create_txt_file(file_base, description)

        return new_path

    def get_last_version(self, file_path):
        file_path_array = file_path.split('/')
        fpa_size = len(file_path_array)
        version = file_path_array[fpa_size - 2]
        file_type = version.split('_')[0]
        max_version = 0
        folders_list = self.get_dirs(os.path.dirname(os.path.dirname(file_path)))
        for f in folders_list:
            folder_name_spit = f.split('_')
            if file_type == folder_name_spit[0]:
                if max_version < folder_name_spit[1]:
                    max_version = folder_name_spit[1]
        max_version = max_version[1:]  # Remove the v
        max_version = 'v' + str(int(max_version) + 1).zfill(3)
        return max_version

    def create_txt_file(self, path, value):
        """
        Create a txt file in the path with the value writen in
        """
        # Path ajust
        txt_path = os.path.join(path, 'comment.txt')
        # opening
        fichier = open(os.path.normpath(txt_path), "w+")
        # writing
        # fichier.write("Date : %s\n\n" % time.strftime('%A %d/%m/%Y %H:%M'))
        fichier.write(value)
        # closing
        fichier.close()

    def create_tag_file(self, path, tag):
        """
        Create a .tag file in the path with the value writen in
        """
        # Path ajust
        tag_name = tag.replace(' ', '_') + '.tag'
        txt_path = os.path.join(path, tag_name)
        # opening
        fichier = open(os.path.normpath(txt_path), "w+")
        # closing
        fichier.close()

    def get_extension(self, path):
        """
        Get the extension inside the folder (path)
        """
        ext = ''
        for f in self.get_files(path+os.sep):
            if os.path.splitext(f)[1] in conf.extensions:
                ext = os.path.splitext(f)[1]
        return ext

    def get_tag(self, path):
        """
        Get the tag inside the folder (path)
        """
        tag = ''
        for f in self.get_files(path + os.sep):
            if os.path.splitext(f)[1] == '.tag':
                tag = os.path.splitext(f)[0]
        return tag

    def get_date(self, path):
        """
        Get the date inside the folder (path)
        """
        date = '00/00/0000 00:00'
        for f in self.get_files(path + os.sep):
            if os.path.splitext(f)[1].replace('.', '') in conf.extensions:
                time_span = os.path.getctime(os.path.join(path, f))
                date = '  ' + str(datetime.fromtimestamp(time_span).strftime('%d/%m/%Y %H:%M')) + '  '
        return date

    def get_size(self, path):
        size = 0
        for f in self.get_files(path + os.sep):
            if os.path.splitext(f)[1].replace('.', '') in conf.extensions:
                size = self.convert_size(os.path.getsize(os.path.join(path, f)))
        return size

    def convert_size(self, size_bytes):
        if size_bytes == 0:
            return "0B"
        size_name = ("B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB")
        i = int(math.floor(math.log(size_bytes, 1024)))
        p = math.pow(1024, i)
        s = round(size_bytes / p, 2)
        return "%s %s" % (s, size_name[i])




if __name__ == '__main__':
    fs = FileSystem()
