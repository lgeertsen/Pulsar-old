"""
Created in the past

@author: michael.haussmann

https://en.wikipedia.org/wiki/Singleton_pattern
"""


class Singleton (object):

    instances = {}

    def __new__(cls, *args, **kargs): 
        if Singleton.instances.get(cls) is None:
            Singleton.instances[cls] = object.__new__(cls, *args, **kargs)
        return Singleton.instances[cls]


if __name__ == '__main__':

    john = Singleton()
    jane = Singleton()

    assert (john == jane)

    print(john)
    print(jane)
