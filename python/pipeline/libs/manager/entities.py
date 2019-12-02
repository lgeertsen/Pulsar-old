from pipeline.libs.engine import engine
from pipeline.libs.db.datas import Datas
from pipeline import conf
from pipeline.libs.utils import pipe_exception as pe
from pipeline.libs.utils import log
from spil.libs.sid import Sid


class Entities(object):
    """"
    Class Entities manage all the shot/asset entities
    This is the ui => backend front
    """

    def __init__(self):
        self.engine = engine.get()
        self.datas = Datas()

    """
    ===============
        Create
    ===============
    """
    def create_entity(self, sid, tag='', comment=''):
        """
        Create entity
        """
        return self.datas.create_entity(sid, tag, comment)

    def conform_entity(self, sid):
        """
        Conform a existing file into the pipe nomenclature
        :return: The path where the file is conform
        """
        if not engine or engine == 'engine':
            raise pe.PipeException('Engine not valid')
        else:
            sid = self.datas.conform_entity(sid)
            self.engine.save(sid.path)
            return sid

    def make_new_version(self, sid, tag, comment):
        """
        Get the sid of the new version (Default sid : engine current)
        :return: the sid of the new version
        """
        if sid:
            new_sid = self.datas.make_new_version(sid, tag, comment)
            self.engine.save(new_sid.path)
            return new_sid
        else:
            new_sid = self.datas.make_new_version(self.get_engine_sid(), tag, comment)
            self.engine.save(new_sid.path)
            return new_sid



    """
    ===============
        Engine
    ===============
    """

    def get_engine(self):
        """
        Get the current engine
        :return: Str engine
        """
        return str(self.engine)

    def get_engine_sid(self):
        """
        Get the SID of the engine file open
        :return: SID of the engine file open
        """
        return Sid(path=self.engine.get_file_path())


    """
    ===============
        DATAS
    ===============
    """

    def get_next_version(self, sid=None):
        """
        Get the sid of the new version (Default sid : engine current)
        :return: the sid of the new version
        """
        if sid:
            return self.datas.get_next_version(sid)
        else:
            return self.datas.get_next_version(self.get_engine_sid())

    def get_projects(self):
        """
        Get list of projects
        :return: list of projects
        """
        return conf.projects


if __name__ == '__main__':
    entities = Entities()
    shotSid = Sid(path=r"I:\SynologyDrive\ARAL\03_WORK_PIPE\02_SHOT\3d\scenes\s010\p010\fx\pyro\work_v010\s010_p010.ma")
    assetSid = Sid(path=r"I:\SynologyDrive\ARAL\03_WORK_PIPE\01_ASSET_3D\01_characters\dieu\3d\scenes\02_modelinglowres\maya\work_v004\dieu.ma")

    entities.make_new_version(shotSid, '', '')