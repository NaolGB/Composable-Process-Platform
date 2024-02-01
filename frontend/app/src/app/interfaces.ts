export interface MasterDtypeParsedPostData {
    [key: string]: string
}

export interface MasterDtypeIdsRespose {
    ids: string[]
}

export interface DocumentTypeParsedPostData {
    [key: string]: string
}

export interface DocumentTypeIdsRespose {
    ids: Array<String>
}

export interface ProcessTypeParsedData {
    [key: string]: any
}

export interface ProcessTypeIdsResponse {
    ids: (string | number) []
}


enum StepEdgeStatus {
    NotEdge = 'NOT_EDGE'
}
enum ProcessInstanceOperationsStatus {
    ProcessCreated = 'PROCESS_CREATED'
}

export interfce MasterDataTypeInterface {

}


export interface DocumentInstanceInterface {
    name: string,
    lead_object: string,
    [key: string]: {}
}
export interface ProcessStepInterface {
    _id: string,
    options: {[key: string] : {label: string, actions: string}},
    next_steps: {steps: string[], requirements: string}
    event_type: string,
    edge_status: StepEdgeStatus,
    fields: {[key: string]: {}}
}
export interface ProcessInstanceInterface {
    _id: string,
    process_type: string,
    organization: string,
    operations_status: ProcessInstanceOperationsStatus,
    documentInstances: DocumentInstanceInterface,
    steps: {[key: string]: ProcessStepInterface}
}