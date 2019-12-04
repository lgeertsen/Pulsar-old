from pipeline.libs.db.FS.file_system import FileSystem
from spil.libs.sid.sid import Sid
from pipeline.libs.utils import pipe_exception as pe
from pipeline.libs.utils import log
from pipeline import conf


class Datas(object):

    def __init__(self):
        self.file_system = FileSystem()

    # region File System
    """
    =============
       FS DATA
    =============
    """
    def get(self, sid):
        """
        Glob one
        :return: The list
        """
        return self.file_system.get(sid)

    def get_next_version(self, sid):
        """
        Get the sid of the new version
        :return: the sid of the new version
        """
        return self.file_system.get_next_version(sid)

    def make_new_version(self, sid, tag, comment):
        """
        This function create a new directory af the max version and return the path
        Create a json with description
        :return The new sid
        """
        return self.file_system.make_new_version(sid, tag, comment)

    def get_projects(self):
        """
        Get the list of projects
        :return: the list of projects
        """
        return conf.projects

    def create_entity(self, sid, tag='', comment=''):  # TODO pass a entity object
        """
        Create entity
        """
        if sid.is_asset():
            return self.file_system.create_asset(sid, tag, comment)
        else:
            return self.file_system.create_shot(sid, tag, comment)

    def conform_entity(self, sid):  # TODO pass a entity object
        """
        Conform entity
        """
        if sid.is_asset():
            return self.file_system.conform_asset(sid)
        else:
            return self.file_system.conform_shot(sid)

    # endregion


if __name__ == '__main__':

    Datas.create_folders('c:/', ['folder1', 'folder2'])