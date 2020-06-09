import os
import sys
import json

paths = ['', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\lib\\site-packages\\setuptools-0.6c11-py2.7.egg', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\DLLs\\python27.zip', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\DLLs', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\lib',
         'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\lib\\plat-win', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\lib\\lib-tk', 'C:\\Program Files\\Pixar\\Tractor-2.3\\bin', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7', 'C:\\Program Files\\Pixar\\Tractor-2.3\\lib\\python2.7\\lib\\site-packages']

for path in paths:
    if not os.path.exists(r'C:\\Program Files\\Pixar\\Tractor-2.3'):
        path = path.replace(r'C:\Program Files\Pixar\Tractor-2.3',
                            '//multifct/tools/pipeline/global/softwares/Tractor-2.3')
    sys.path.append(path)

import tractor.api.author as author

parent_dir = os.path.abspath(os.path.dirname(__file__))
vendor_dir = os.path.join(parent_dir, 'vendor')
if vendor_dir not in sys.path:
    sys.path.append(vendor_dir)

import fileseq

class TractorSubmitter(object):
    def __init__(self, graph_file, start_id, pool):
        super(TractorSubmitter, self).__init__()
        self.graph_file = graph_file
        self.start_id = start_id
        self.pool = pool

        self.executionPriority = {}

    def loadGraph(self):
        with open(self.graph_file) as json_file:
            data = json.load(json_file)

        self.nodes = data['nodes']
        self.edges = data['edges']

    def sortTasks(self, task):
        return task["depth"]

    def execute(self):
        self.start_node = self.nodes[self.start_id]
        self.walkGraph(self.start_node)
        taskNodes = [];
        for id, node in self.nodes.iteritems():
            if("depth" in node):
                taskNodes.append(node)

        # self.taskNodes.sort(reverse=True, key=self.sortTasks)
        for node in taskNodes:
            if(not(node["depth"] in self.executionPriority)):
                self.executionPriority[node["depth"]] = []
            self.executionPriority[node["depth"]].append(node["id"]);

        self.createJob()


    def walkGraph(self, node):
        for id, edge in self.edges.iteritems():
            if(edge["_inputNode"] == node["id"]):
                outputId = edge["_outputNode"]
                outputNode = self.nodes[outputId]
                if("subType" in outputNode and outputNode["subType"] == "merge"):
                    if(not "dependency" in outputNode):
                        outputNode["dependency"] = []
                    outputNode["dependency"].append(node["id"])
                    self.walkGraph(outputNode)
                elif(outputNode["type"] == "constants"):
                    inputAttribute = edge["_inputAttribute"]
                    inputIndex = next(i for i, item in enumerate(node["inputs"]) if item["name"] == inputAttribute)
                    node["inputs"][inputIndex]["value"] = outputNode["inputs"][0]["value"]
                else:
                    # if(not depth in self.executionPriority):
                    #     self.executionPriority[depth] = []
                    # self.executionPriority[depth].append(outputNode)
                    # self.walkGraph(outputNode, depth+1)
                    # if(not("subType" in node and node["subType"] == "merge")):
                    if(not "dependency" in outputNode):
                        outputNode["dependency"] = []
                    outputNode["dependency"].append(node["id"])
                    outputNode["depth"] = 0
                    self.incrementDepth(outputNode)

                    self.walkGraph(outputNode)

    def incrementDepth(self, node):
        for id in node["dependency"]:
            if("depth" in self.nodes[id]):
                self.nodes[id]["depth"] += 1
                self.incrementDepth(self.nodes[id])



    def createJob(self):
        self.job = author.Job(title="pulsar-test", priority=100, service=self.pool, projects=["TD"])
        self.job.serialsubtasks = 1

        self.job.newDirMap(src="I:/SynologyDrive/A_PIPE",
                      dst="/marvin/A_PIPE", zone="NFS")

        self.job.newDirMap(src="C:/Houdini17/bin/hython.exe",
                      dst="/opt/hfs17.5/bin/hython", zone="NFS")
        self.job.newDirMap(src="C:/Houdini17/bin/hrender.py",
                      dst="/opt/hfs17.5/bin/hrender.py", zone="NFS")

        ###########################
        ##### DIR MAP WINDOWS #####
        ###########################

        ##### DIR MAP MARVIN #####
        self.job.newDirMap(src="I:/SynologyDrive/ARAL",
                      dst="//marvin/PFE_RN_2020/ARAL", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/CLAIR_DE_LUNE",
                      dst="//marvin/PFE_RN_2020/CLAIR_DE_LUNE", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/FORGOT_YOUR_PASSWORD",
                      dst="//marvin/PFE_RN_2020/FORGOT_YOUR_PASSWORD", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/LOREE",
                      dst="//marvin/PFE_RN_2020/LOREE", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/RESURGENCE",
                      dst="//marvin/PFE_RN_2020/RESURGENCE", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/TIMES_DOWN",
                      dst="//marvin/PFE_RN_2020/TIMES_DOWN", zone="UNC")

        ##### DIR MAP TARS #####
        self.job.newDirMap(src="I:/SynologyDrive/ASCEND",
                      dst="//tars/PFE_RN_2020/ASCEND", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/ISSEN_SAMA",
                      dst="//tars/PFE_RN_2020/ISSEN_SAMA", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/LONE",
                      dst="//tars/PFE_RN_2020/LONE", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/MOON_KEEPER",
                      dst="//tars/PFE_RN_2020/MOON_KEEPER", zone="UNC")

        ##### DIR MAP ANA #####
        self.job.newDirMap(src="I:/SynologyDrive/BREACH",
                      dst="//ana/PFE_RN_2020/BREACH", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/HARU",
                      dst="//ana/PFE_RN_2020/HARU", zone="UNC")
        self.job.newDirMap(src="I:/SynologyDrive/VERLAN",
                      dst="//ana/PFE_RN_2020/VERLAN", zone="UNC")

        #########################
        ##### DIR MAP LINUX #####
        #########################

        ##### DIR MAP MARVIN #####
        self.job.newDirMap(src="I:/SynologyDrive/ARAL", dst="/marvin/ARAL", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/CLAIR_DE_LUNE",
                      dst="/marvin/CLAIR_DE_LUNE", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/FORGOT_YOUR_PASSWORD",
                      dst="/marvin/FORGOT_YOUR_PASSWORD", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/LOREE",
                      dst="/marvin/LOREE", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/RESURGENCE",
                      dst="/marvin/RESURGENCE", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/TIMES_DOWN",
                      dst="/marvin/TIMES_DOWN", zone="NFS")

        ##### DIR MAP TARS #####
        self.job.newDirMap(src="I:/SynologyDrive/ASCEND",
                      dst="/tars/ASCEND", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/ISSEN_SAMA",
                      dst="/tars/ISSEN_SAMA", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/LONE", dst="/tars/LONE", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/MOON_KEEPER",
                      dst="/tars/MOON_KEEPER", zone="NFS")

        ##### DIR MAP ANA #####
        self.job.newDirMap(src="I:/SynologyDrive/BREACH", dst="/ana/BREACH", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/HARU", dst="/ana/HARU", zone="NFS")
        self.job.newDirMap(src="I:/SynologyDrive/VERLAN", dst="/ana/VERLAN", zone="NFS")

        # node = self.taskNodes.pop(0)
        # self.addTask(job, node)
        self.executionOrder = self.executionPriority.keys()
        self.executionOrder.sort()

        self.addTaskLayers()

    def addTaskLayers(self):
        for i in self.executionOrder:
            layer = author.Task(title="Layer {id}".format(id=i))
            self.job.addChild(layer)
            for id in self.executionPriority[i]:
                self.addTask(layer, self.nodes[id])

        # print(self.job.asTcl())
        self.job.spool()


    def addTask(self, parent, node):
        parentTask = author.Task(title="{title}".format(title=node["id"].split(".")[1]))
        parent.addChild(parentTask)
        if(node["subType"] == "render_houdini"):
            pool = next(input for input in node["inputs"] if input["name"] == "pool")["value"]
            renderNode = next(input for input in node["inputs"] if input["name"] == "render_node")["value"]
            frames = next(input for input in node["inputs"] if input["name"] == "frames")["value"]
            frame_set = fileseq.FrameSet(frames)

            for i in range(0, len(frame_set.items), 1 if len(frame_set.items) == 3 else (len(frame_set.items) // 3) + 1):
                file_path = next(input for input in node["inputs"] if input["name"] == "scene")["value"]
                cmd = [
                    "%D(C:/Houdini17/bin/hython.exe)",
                    "%D(//marvin/PFE_RN_2020/_UTILITY/04_FARM/01_HOUDINI/hrender_artfx.py)",
                    "%D({file_path})".format(file_path=file_path),
                    "-d",
                    str(renderNode),
                    "-F"
                ]
                task_name = "frame"
                for j in range((len(frame_set.items) // 3) + 1):
                    if((i+j) < len(frame_set.items)):
                        f = str(list(frame_set.items)[i+j])
                        cmd.extend([f])
                        task_name += " {f}".format(f=f)

                task = author.Task(title=task_name, argv=cmd, service=str(pool))
                parentTask.addChild(task)





def main(graph_file, start_id, pool):
    submitter = TractorSubmitter(graph_file, start_id, pool)
    submitter.loadGraph()
    submitter.execute()


main(sys.argv[1], sys.argv[2], sys.argv[3])
