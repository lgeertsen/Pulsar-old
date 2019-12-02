# -*- coding: utf-8 -*-
"""






"""


from spil.conf.sid_conf import test_sids
from spil.libs.sid import Sid

from spil.libs.util.log import setLevel, INFO, ERROR

setLevel(ERROR)
# setLevel(DEBUG)  # In case of problems, use DEBUG mode

for test in test_sids[:]:
    # print( test
    sid = Sid(test)
    print( sid )
    print( sid.copy() )

    for index, value in enumerate(sid):
        print('{} --> {} '.format(sid.keys[index], value ))
    print( '-' * 5 )

    # Copy
    for part in sid.keys:
        copied = sid.copy(until=part)
        if copied:
            print('until {} --> {}  ({})'.format(part, copied, copied.last_key()))

    # get as
    for part in sid.keys:
        new = sid.get_as(part)
        if new:
            print('As {} --> {}  ({})'.format(part, new, new.last_key()))
    print('')

    # len
    while len(sid):
        print('sid: {} - len: {} ({})'.format(sid, len(sid), sid.last_key()))  # , repr(sid)
        print('sid : {}'.format(sid.get_as(sid.last_key())))
        print( '-'*5 )
        if sid.parent() == sid:
            break
        sid = sid.parent()

    print( '*'*20 )


