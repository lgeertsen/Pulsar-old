"""

Writer and Reader for User config

"""

import os
import json
from pipeline.libs.utils.log import info, error
from pipeline.libs.utils.singleton import Singleton
from pathlib2 import Path

user_config_path = str(Path.home() / 'artfx_pipeline' / 'conf.json')


class ConfigIO(Singleton):
    '''
    Writer and Reader for User config
    '''

    conf_path = None

    def __init__(self):

        # CREATING FOLDER
        if not os.path.exists(os.path.dirname(user_config_path)):
            os.makedirs(os.path.dirname(user_config_path))

        self.conf_path = user_config_path

    def save(self, key, value=None):

        data = self.read() or {}

        if value is None:
            data.pop(key, None)  # remove the key if None
        else:
            data[key] = value

        with open(user_config_path, 'w') as conf_file:
            json.dump(data, conf_file)

    def read(self, key=None, default=None):

        data = {}
        try:
            with open(user_config_path) as conf_file:
                data = json.load(conf_file)
        except Exception as e:
            error('Problem reading Conf file : {}'.format(e))

        if key is None:
            return data
        else:
            return data.get(key, default)


if __name__ == '__main__':

    info('Path is : {}'.format(user_config_path))

    cfio = ConfigIO()
    info(cfio.read())
    cfio.save('test', 'brief test ...')
    info(cfio.read())
    cfio.save('test', None)
    info(cfio.read())

