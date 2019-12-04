from pipeline.libs.utils import log


class PipeException(Exception):

    def __init__(self, msg):
        log.error(msg)
        self.message = msg

    def __str__(self):
        return self.message

