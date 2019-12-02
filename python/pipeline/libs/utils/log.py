# -*- coding: utf-8 -*-
"""
Created in the past.

@author: michael.haussmann

A simple logger shortcut / wrapper.

Uses
https://logzero.readthedocs.io/


TODO: code clean.

"""
import sys

import logging
import logzero
from logzero import logger

__logFormat = '[%(asctime)s] %(levelname)-6s| [%(module)s.%(funcName)s] %(message)-80s (%(lineno)d)'

# we set a new handler

handler = logging.StreamHandler(sys.stdout)  # stream to stdout for pycharm
handler.setFormatter(logzero.LogFormatter(fmt=__logFormat))
logger.handlers = []
logger.addHandler(handler)

logger.setLevel(logging.INFO)  # set default level



"""
Code shortcuts
"""
debug = logger.debug
info = logger.info
warn = logger.warn
error = logger.error
critical = logger.critical

setLevel = logger.setLevel
getLevel = logger.getEffectiveLevel

DEBUG = logging.DEBUG
INFO = logging.INFO
WARN = logging.WARN
ERROR = logging.ERROR


if __name__ == '__main__':

    setLevel(INFO)
    debug('titi')

    info('toto')
    warn('toto')
    error('toto')
    critical('toto')

    setLevel(DEBUG)

    debug('titi')