import os
import uuid
from datetime import datetime
from . import helpers
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
db_folder = os.path.join(current_dir, 'db')

class Node:
    def __init__(self, node_id: uuid.UUID, node_name: str, node_type: str, properties=None) -> None:
        self.node_id = node_id
        self.node_name = node_name
        self.node_type = node_type
        self.properties = properties or {}

        # TODO validate node variables

class Edge:
    def __init__(self, src: Node, dst: Node, edge_name: str, properties=None) -> None:
        self.edge_name = edge_name
        self.src = src
        self.dst = dst
        self.properties = properties or {}

        # TODO validate edge variables


class ProcessGraphDB:
    """
    a graph database for process engine
    """
    def __init__(self, version='V1') -> None:
        self.version = version
        self.nodes = {}
        self.edges = {} # edges stored as {'src_id'>'dest_id'}
        self.table_types = ['TYPE']

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
    
    def save(self, table_type: str):
        table_path = os.path.join(db_folder, f'{table_type}_{self.version}.json')

        data = self.represent()

        with open(table_path, 'w') as file:
            json.dump(data, file, indent=4)
    
    def load(self, table_type: str):
        table_path = os.path.join(db_folder, f'{table_type}_{self.version}.json')

        with open(table_path, 'r') as file:
            data = json.load(file)
        
        nodes = data['nodes']
        edges = data['edges']

        for k, v in nodes.items():
            self.add_node(Node(node_id=k, node_name=v['name'], node_type='type', properties=v['properties']))

        for k, v in edges.items():
            self.add_edge(Edge(edge_name=v['name'], src=v['src'], dst=v['dst'], properties=v['properties']))

    def represent(self) -> str:
        nodes = {}
        for node in self.nodes.values():
            nodes[node.node_id] = {
                'name': node.node_name,
                'type': node.node_type,
                'properties': node.properties
            }

        edges = {}
        for edge in self.edges.values():
            edges[f'{edge.src.node_id}>{edge.dst.node_id}'] = {
                'name': edge.edge_name,
                'src': edge.src.node_id, 
                'dst': edge.dst.node_id, 
                'properties': edge.properties
            }

        data = {
            "nodes": nodes,
            "edges": edges
        }

        return data

    # DBMS methods
    def INSERT(self, table_type: str, data: json, **kwargs):
        table_type = table_type.upper()
        # TODO validate table type

        node = Node(
            node_id=str(uuid.uuid4()), 
            node_name=data['name'], 
            node_type=kwargs['node_type'], 
            properties=data
        )
        self.add_node(node=node)
        self.save(table_type=table_type)

        return 'node.node_id'