from pipeline.conf.global_conf import *
from pipeline.conf.global_pass import *

# user config
from configio import ConfigIO

# function to override config into user config
def set(key, value):
	"""
	Sets a variable "key" with given "value" as a user config variable.

	This value will override the default config variable when called next time.

	Example :

	conf.set('prefered_project', self.ui.prod_CBB.currentText() or conf.prefered_project)
	# replaces the variable 'prefered_project' (or keeps the default one)

	See also fx.test.user_conf_test
	"""
	globals()[key] = value
	user_conf.save(key, value)


user_conf = ConfigIO()
globals().update(user_conf.read())


if __name__ == '__main__':

	from pprint import pprint
	#pprint(globals())

	print projects

	# user conf
	print project
	set('project', 'bla')
	print project

	pprint(globals())
