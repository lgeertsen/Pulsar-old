

projects = dict()

from fs_conf import path_mapping

for long_name, sidname in path_mapping['project'].iteritems():
    projects[sidname] = {'long_name': long_name.replace('_', ' ').title()}

project_order = sorted(list(projects))


if __name__ == '__main__':

    from pprint import pprint
    pprint(projects)
    print(list(projects))

    # pprint(globals())

