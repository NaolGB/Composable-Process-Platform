export interface ProcessInstanceInterface {
    _id: string;
    process_type: {_id: string, display_name: string};
    document_intances: string[];
    current_step: string;
    status: string;
    created_at: string;
    updated_at: string;
}

export interface DocumentInstanceInterface {
    _id: string;
    document_type: string;
    attributes: {[key: string]: any};
    master_data_accessed_fields: string[];
    master_data: {[key: string]: any}[];
    _functions: {[key: string]: any};
}