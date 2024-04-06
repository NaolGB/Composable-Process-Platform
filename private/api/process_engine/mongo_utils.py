from pymongo import MongoClient

CLUSTER_URIS = {
    'dev_cluster': f'mongodb+srv://{"x2dev"}:{"wE2xvCnjSaa"}@cluster0.eamf5pt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    '__internal__services': f'mongodb+srv://{"x2dev"}:{"wE2xvCnjSaa"}@cluster0.eamf5pt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
} # TODO: hide username and password


mongo_clients = {}

def get_services_client():
    if '__internal__services' not in mongo_clients:
        mongo_clients['__internal__services'] = MongoClient(CLUSTER_URIS['__internal__services'])
    return mongo_clients['__internal__services']

def get_mongo_client(cluster_identifier):
    if cluster_identifier not in mongo_clients:
        mongo_clients[cluster_identifier] = MongoClient(CLUSTER_URIS[cluster_identifier])
    return mongo_clients[cluster_identifier]

def get_client_for_user(user):
    cluster_identifier = get_user_cluster_identifier(user)
    
    client = get_mongo_client(cluster_identifier)
    db_name = get_user_db(user)
    db = client[db_name]
    return db

def get_user_cluster_identifier(user):
    return 'dev_cluster' # TODO: implement logic to determine the cluster

def get_user_db(user):
    return 'dev' # TODO: implement logic to determine the db