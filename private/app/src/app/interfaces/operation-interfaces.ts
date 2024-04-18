export interface ProcessInstanceInterface {
    _id: string;
    process_type: string;
    document_intsnces: string[];
    current_step: string;
    status: string;
    created_at: string;
    updated_at: string;
}