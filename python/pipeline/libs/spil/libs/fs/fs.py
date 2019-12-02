# -*- coding: utf-8 -*-
"""

This file is part of SPIL, The Simple Pipeline Lib.

(C) copyright 2019 Michael Haussmann, spil@xeo.info

SPIL is free software: you can redistribute it and/or modify it under the terms of the GNU Lesser General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

SPIL is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License along with SPIL.
If not, see <https://www.gnu.org/licenses/>.

"""
import glob
import os
import six
from spil.conf.fs_conf import search_path_mapping
from spil.libs.util.exception import SpilException

from spil.libs.util.log import debug, warn, info

from spil.libs.sid.sid import Sid

if six.PY2:
    from pathlib2 import Path
else:
    from pathlib import Path


class FS(object):
    """
    File System Layer.

    Uses the Path and Glob to find Sids on the Filesystem.

    Still experimental...

    # TODO : more tests...

    """

    @staticmethod
    def get(search_sid):
        """
        Finds Sids based on the given search Sid, using the Glob syntax.

        Returns a sorted, uniqued list

        :param search_sid:
        :return: result list
        """

        search = Sid(search_sid)

        # filling intermediate values with *
        last_key = search.last_key()
        search = search.get_filled(by='*', until=last_key)

        debug('Search : ' + str(search))

        path = search.path
        if not path:
            warn('Search sid {} did not resolve to a path. Cancelled.'.format(search))
            return []

        debug('Search path : ' + str(path))

        project = Sid(search.project)
        # TODO need a way to find a root path depending on other sid parts (eg: fx caches)
        project_path = project.path

        pattern = path.split(project_path + '/')[-1]

        for key, value in six.iteritems(search_path_mapping):
            pattern = pattern.replace(key, value)

        debug('pattern : ' + str(pattern))
        debug('project_path : ' + str(project_path))

        if str(pattern) == str(project_path):
            warn('No valid search pattern')
            return []

        # TODO this is expensive (recursive) and limited to one project path.
        found = Path(project_path).glob(pattern)
        # found = glob.glob(search_sid.path)

        result = []
        for path in found:
            path = str(path).replace(os.sep, '/')
            sid = Sid(path=path)
            if not sid:
                warn('Path did not generate sid : {}'.format(path))
                raise SpilException('Path did not generate sid : {}'.format(path))
            result.append(sid)

        result = sorted(list(set(result)))
        return result

    @staticmethod
    def get_children(sid):
        sid = Sid(sid)  # make certain it is a Sid
        search_sid = sid + '*'
        if search_sid == sid:
            warn('Can not get children on a final sid.')
            return []
        return FS.get(search_sid)


if __name__ == '__main__':

    print('Most tests are in tests.fx')

    import pprint as pp
    sid = Sid('demo/s/s010/p010/*')
    pp.pprint(FS.get(sid))

    sid = Sid('demo/s/*/*/*')
    pp.pprint(FS.get(sid))

    sid = Sid('demo/s/./*')
    pp.pprint(FS.get(sid))

    print FS.get(Sid('demo/s/./*')) == FS.get(Sid('demo/s/*'))  # strange



    # produces errors :     sid = Sid('demo/s/../*')
