import os
import json

class NodeManager:
    nodes = {}

    def importNodes(path):
        nodes = {}
        node_files = os.listdir(path)

        for file in node_files:
            file_path = os.path.join(path, file)
            if os.path.isfile(file_path):
                with open(file_path, 'r') as data:
                    nodeObj = json.load(data)
                    node = nodeObj["node"]

                    if(node["type"] in nodes):
                        nodes[node["type"]][node["name"]] = node
                    else:
                        nodes[node["type"]] = {}
                        nodes[node["type"]][node["name"]] = node

            NodeManager.nodes = nodes

    def getNode(type, task):
        return NodeManager.nodes[type][task]
