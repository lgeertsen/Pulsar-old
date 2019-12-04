# Import
import os
from pipeline import conf

sid_sep = conf.sep
link_type = [
    'Root',
    'Projet',
    'Type',
    'Cat',
    'Task',
    'Subtask',
    'Version',
    'FileName'
]

"""

Ex link : Z:/PIPE/FILES/FILM_NAME/01_ASSETS/CHARACTERS/cg_doubble/lookdev/houdini/v001/cgDoubble_lookdev_v001.hipnc

Ex SID : Root | Project | Type | Categ | Task | Subtask | Version _ FileName

"""


class Sid():
    """
    Class de gestion des liens
    """

    def __init__(self, sid=None, *args, **kwargs):
        if sid:
            self.sid = sid
        else:
            self.sid = conf.root + sid_sep * 8  # 8 is the number of type in the link 8

    def get_sid(self):
        return self.sid

    def get_path(self):
        """
        Retourne le chemain total du sid
        """
        retour = ''
        for value in self.sid.split(sid_sep):
            if value:
                retour += value + os.sep
        if self.get_type('FileName'):
            retour = retour.rstrip(os.sep)
        return retour

    def get_type(self, type):
        split_sid = self.sid.split(sid_sep)
        return split_sid[link_type.index(type)]

    def get_link_type(self):
        return link_type

    def set_sid(self, type, value):
        """
        Set the sid : type is the type you want to change : Root, Project, Type, Categ, Task, Subtask, Version, FileName
        """
        split_sid = self.sid.split(sid_sep)
        split_sid[link_type.index(type)] = value
        self.sid = ''
        i = 0
        while i <= (len(split_sid) - 2):
            self.sid += split_sid[i] + sid_sep
            i = i + 1
        return self.sid


"""
Test
"""

if __name__ == '__main__':
    sid = Sid()
    print(sid.get_path())

    sid.get_sid()
    sid.set_sid('Projet', 'Aral')
    print(sid.get_path())
    print(sid.get_sid())
    sid.set_sid('Type', 'Type')
    sid.set_sid('Cat', 'Cat')
    sid.set_sid('Task', 'Task')
    sid.set_sid('Subtask', 'Subtask')
    sid.set_sid('Version', 'Version')
    sid.set_sid('FileName', 'FileName')
    print(sid.get_path())
    print(sid.get_sid())
    print(sid.get_type('Root'))

    print(sid.get_path())
