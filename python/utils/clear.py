'''
Created on 19 oct. 2015

@author: michael.haussmann

Unloads all modules (forces a general reload in maya)
'''
import sys


def do():

    tmp_modules = sys.modules.copy()
    for key, value in tmp_modules.iteritems():
        """
        if 'WS_PIPELINE\pipeline' in value: # doesn't work because it clears itself.
            sys.modules.pop(key, None)
        """
        if key.startswith('pipeline.'):
            sys.modules.pop(key, None)
        if key.startswith('spil.'):
            sys.modules.pop(key, None)

def do_silent():

    tmp_modules = sys.modules.copy()
    for key, value in tmp_modules.iteritems():
        """
        if 'WS_PIPELINE\pipeline' in value: # doesn't work because it clears itself.
            sys.modules.pop(key, None)
        """
        if key.startswith('pipeline.'):
            sys.modules.pop(key, None)
        if key.startswith('spil.'):
            sys.modules.pop(key, None)
