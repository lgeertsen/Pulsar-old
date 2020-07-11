import os
import sys
import maya

sys.path.append(os.environ["MAYA_PULSAR"])

from Pulsar_Maya import Pulsar

def startPulsar(standalone=False):
    Pulsar()

maya.utils.executeDeferred(startPulsar, standalone=True)
