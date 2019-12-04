
import json
import gazu

from spil.libs.sid import Sid
from pipeline.libs.utils.singleton import Singleton

# TODO : mapping confs or change in cgwire to match pipeline: projects, entity types

from pipeline import conf


class CgWire(Singleton):

    def __init__(self):

        gazu.client.set_host("https://artfx.cg-wire.com/api")
        gazu.log_in(conf.cgwuser, conf.cgwpassword)  # Create entries cgwuser & cgwpassword in your artfx_pipeline/conf.json

    def all_open_projects(self):

        result = []
        for project_dict in gazu.project.all_open_projects():
            project_name = project_dict.get('name').lower()
            sid = Sid(project_name)   # FIXME Mapping
            if not sid:
                print('Project {} is not conform - skipped'.format(project_name))
                continue
            sid.conform()
            result.append(sid)

        return sorted(result)

    def all_assets_for_project(self, project_sid):

        sid = Sid(project_sid)  # handling the incoming sid or string # FIXME Mapping

        sid = Sid(sid.project + '/a')
        sids = []

        project = gazu.project.get_project_by_name(sid.project)

        assets = gazu.asset.all_assets_for_project(project)
        for asset in assets:
            asset_sid = sid.copy()
            asset_sid.name = asset.get('name')
            asset_sid.cat = gazu.asset.get_asset_type(asset.get('entity_type_id')).get('name')
            # print 'entity', asset_sid.cat, '->', asset.get('entity_type_id')
            asset_sid.conform()
            sids.append(asset_sid)

        return sorted(sids)

    def all_shots_for_project(self, project_sid):

        sid = Sid(project_sid)  # handling the incoming sid or string # FIXME Mapping

        sid = Sid(sid.project + '/s')
        sids = []

        project = gazu.project.get_project_by_name(sid.project)

        shots = gazu.shot.all_shots_for_project(project)
        for shot in shots:
            shot_sid = sid.copy()
            shot_sid.shot = shot.get('name')
            shot_sid.seq = gazu.shot.get_sequence(shot.get('parent_id')).get('name')
            shot_sid.conform()
            sids.append(shot_sid)

        return sorted(sids)



if __name__ == '__main__':

    from pprint import pprint
    from pipeline.libs.utils.log import setLevel, INFO, DEBUG

    setLevel(INFO)

    cgw = CgWire()

    pprint(cgw.all_open_projects())

    print
    print 'Aral all shots'

    for asset in cgw.all_shots_for_project('aral'):
        print asset

    print
    print 'Aral all assets'

    for asset in cgw.all_assets_for_project('aral'):
        print asset

    print
    print 'Breach all assets'

    for asset in cgw.all_assets_for_project('breach'):
        print unicode(asset)

