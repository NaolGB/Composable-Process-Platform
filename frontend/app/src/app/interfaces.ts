export interface IdsListInterface {
    ids: string[]
}


export interface MasterDataTypeInterface {
    _id: string,
    organization: string,
    name: string,
    attributes: {[key: string]: string}
}
export interface DocumentTypeInterface {
    _id: string,
    name: string,
    lead_object_type: string
    lead_object: string
    editable_fields: string[]
    attributes: {[key: string]: string}
}
export interface ProcessTypeInterface {
    _id: string,
    organization: string,
    documents: string[]
    design_status: string[]
    steps: {[key: string]: ProcessStepInterface}
}
export interface NewProcessProcessTypeInterface {
    name: string,
    documents: string[]
    steps: string
}


export interface ProcessStepInterface {
    _id: string,
    options: {[key: string] : {label: string, actions: string}},
    next_steps: {steps: string[], requirements: string}
    event_type: string,
    edge_status: string,
    fields: {[key: string]: {document_fields: string[], lead_object_fields: string[]}}
    row: number,
    column: number
}


export interface DocumentInstanceInterface {
    name: string,
    lead_object: string,
    [key: string]: {}
}
export interface ProcessInstanceInterface {
    _id: string,
    process_type: string,
    organization: string,
    operations_status: string,
    document_instances: {[key: string]: DocumentInstanceInterface},
    steps: {[key: string]: ProcessStepInterface}
}


export interface SidebarPackage {
    identifier: string,
    sidebarType: string,
    contentType: string,
    sidebarData: {[key: string]: any},
    metaData: {
        editableFields: string[]
    }
}