import uuid
from datetime import datetime
import helpers
import json

class Node:
    def __init__(self, node_id: uuid.UUID, attributes=None) -> None:
        self.node_id = node_id
        self.attributes = attributes or {}

class Edge:
    def __init__(self, src: Node, dst: Node, properties=None) -> None:
        self.src = src
        self.dst = dst
        self.properties = properties or {}

class ProcessGraphDB:
    """
    a graph database for process engine
    """
    def __init__(self, version=f'{datetime.now().timestamp()}') -> None:
        self.version = version
        self.nodes = {}
        self.edges = {} # edges stored as {'src_id'>'dest_id'}

    def add_node(self, node: Node):
        if self.nodes.get(node.node_id):
            raise helpers.PGDBDuplicateNode(f"Duplicate Node with id {node.node_id} found")
        self.nodes[node.node_id] = node
    
    def add_edge(self, edge: Edge):
        if self.get_node(edge.src.node_id) and self.get_node(edge.dst.node_id):
            # unique id validation
            if self.edges.get(f'{edge.src.node_id}>{edge.dst.node_id}'):
                raise helpers.PGDBDuplicateEdge(f"Duplicate edge from {edge.src.node_id} to {edge.dst.node_id} found")
            
            self.edges[f'{edge.src.node_id}>{edge.dst.node_id}'] = edge

    def get_node(self, node_id: uuid.UUID):
        node = self.nodes.get(node_id)
        if node == None:
            raise helpers.PGDBNodeNotFound(f"Node with id: {node_id} not found")
        return node
    
    def save(self):
        nodes = []
        for node in self.nodes.values():
            nodes.append({node.node_id: node.attributes})

        edges = []
        for edge in self.edges.values():
            edges.append({'src': edge.src.node_id, 'dst': edge.dst.node_id, 'properties': edge.properties})
        
        data = {
            "nodes": [elem_nodes for elem_nodes in nodes],
            "edges": [elem_edges for elem_edges in edges]
        }

        with open(f'db/PDGB_{self.version}.json', 'w') as file:
            json.dump(data, file, indent=4)
    
    def load(self, file_name: str):
        with open(file_name, 'r') as file:
            data = json.load(file)
        print(data['nodes'])
        print(data['edges'])
        
        for node in data['nodes']:
            for k, v in node.items():
                self.add_node(node=Node(node_id=k, attributes=v))
        
        for edge in data['edges']:
            self.add_edge(
                Edge(
                    src=self.get_node(node_id=edge['src']),
                    dst=self.get_node(node_id=edge['dst']),
                    properties = edge['properties']
                )
            )
