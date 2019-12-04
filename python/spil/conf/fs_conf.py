# -*- coding: utf-8 -*-
"""
Example File System resolver config.

Maps file paths to Sid components.
The order is important, first match is returned.

#TODO : one root path per project
#IDEA config per project

"""
from collections import OrderedDict

###########################################################################################
# SOFT CONFIG
###########################################################################################
import six
from spil.libs.util.utils import is_fs_case_sensitive

"""
SID TEMPLATES AS MEMO
sid_templates = {
    'asset': '{project}/a/{cat}/{name}/{task}/{subtask}/{version}/{state}/{ext}',
    'shot':  '{project}/s/{seq}/{shot}/{task}/{subtask}/{version}/{state}/{ext}',
    'project': '{project}',
}

"""

###########################################################################################
# PATHS The order is important, first match is returned.
# TODO frame caches, versioned caches, images with passes, etc.
###########################################################################################
path_templates = OrderedDict([

    #  FIXME : {frames} {namespace} not handled yet

    ('project_root', r'I:/SynologyDrive/{project}'),
    # ('project_root', r'/home/mh/Bureau/I_SynologyDrive/{project}'),  # FIXME

    ('asset_file', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/scenes/{task}/{subtask}/{state}_{version}/{name}.{ext}'),

    ('asset_image_file', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/images/{task}/{subtask}/{state}_{version}/{name}.{frames}.{ext}'),
    ('asset_movie_file', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/images/{task}/{subtask}/{state}_{version}/{name}.{ext}'),

    ('asset_cache_file', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/caches/{task}/{subtask}/{state}_{version}/{name}.{ext}'),

    ('asset_state', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/scenes/{task}/{subtask}/{state}_{version}'),
    #('asset_version', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/scenes/{task}/{subtask}/{state}_{version}'),
    ('asset_subtask', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/scenes/{task}/{subtask}'),
    ('asset_task', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}/3d/scenes/{task}'),
    ('asset_name', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}/{name}'),
    ('asset_cat', r'{@project_root}/03_WORK_PIPE/01_ASSET_3D/{cat}'),

    ('shot_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{ext}'),

    ('shot_cache_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/caches/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}_{namespace}.{ext}'),

    ('shot_image_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/images/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{frames}.{ext}'),
    ('shot_movie_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/images/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{ext}'),

    ('shot_state', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}/{task}/{subtask}/{state}_{version}'),
    # ('shot_version', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}/{task}/{subtask}/{state}_{version}'),
    ('shot_subtask', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}/{task}/{subtask}'),
    ('shot_task', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}/{task}'),
    ('shot_shot', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}/{shot}'),
    ('shot_seq', r'{@project_root}/03_WORK_PIPE/02_SHOT/3d/scenes/{seq}'),

    ('shot_2d_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{ext}'),

    ('shot_2d_image_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/images/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{frames}.{ext}'),
    ('shot_2d_movie_file', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/images/{seq}/{shot}/{task}/{subtask}/{state}_{version}/{seq}_{shot}.{ext}'),

    ('shot_2d_state', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}/{shot}/{task}/{subtask}/{state}_{version}'),
    ('shot_2d_subtask', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}/{shot}/{task}/{subtask}'),
    ('shot_2d_task', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}/{shot}/{task}'),
    ('shot_2d_shot', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}/{shot}'),
    ('shot_2d_seq', r'{@project_root}/03_WORK_PIPE/02_SHOT/2d/scenes/{seq}'),

    ('project', r'{@project_root}'),

])


# we lowercase on windows -- or TODO: handle with os.path.normcase ?
if not is_fs_case_sensitive():
    for key, value in six.iteritems(path_templates):
        path_templates[key] = value.lower()


path_templates_reference = 'project_root'

path_defaults = {

#    'state': 'w',
    'frame': '#'  # does not need to be part of the sid, but may be needed for path creation
}


path_mapping = {  # TODO put into project_conf

    'project': {            # 3 words : initials, otherwise 6 first letters, lowercased
        'DEMO': 'demo',
        'ARAL': 'aral',
        'ASCEND': 'ascend',
        'BREACH': 'breach',
        'FORGOT_YOUR_PASSWORD': 'fyp',
        'VERLAN': 'verlan',
        'ISSEN_SAMA': 'issens',
        'MOON_KEEPER': 'moonke',
        'LONE': 'lone',
        'TIMES_DOWN': 'timesd',
        'HARU': 'haru',
        'RESURGENCE': 'resurg',
        'LOREE': 'loree',
        'CLAIR_DE_LUNE': 'cdl',
    },
    'state': {
        'work': 'w',
        'publish': 'p',
        '*': '*',  # FIXME : needed for search
    },
    'type': {
        'asset': 'a',
        'shot': 's',
    },
}

search_path_mapping = {
    '/3d/scenes/': '/*/scenes/',
}




###########################################################################################
# TEST DATA - # TODO add types to test types
###########################################################################################

test_paths = [

]

not_covered = [
]


search_sids = [
    'demo/*',       # ?
    'demo/a/*',     # cats
    'demo/a/characters/*',     #
    'demo/a/characters/crab/*',     #
    'demo/a/characters/crab/01_modeling/*',     #
    'demo/a/characters/crab/01_modeling/maya/*',     #
    'demo/a/characters/crab/01_modeling/maya/work_v001/*',     #
    'demo/a/characters/crab/01_modeling/maya/work_v001/ma',     #
]


if __name__ == '__main__':

    from pprint import pprint

    pprint(globals())

    for key in path_templates:
        print path_templates.get(key)

