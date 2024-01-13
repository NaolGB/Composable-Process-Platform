export interface MasterDtypeParsedPostData {
    [key: string]: string
}

export interface MasterDtypeIdsRespose {
    ids: Array<String>
}

export interface TransactionTypeParsedPostData {
    [key: string]: string
}

export interface TransactionTypeIdsRespose {
    ids: Array<String>
}

export interface DocumentTypeParsedPostData {
    [key: string]: string
}

export interface DocumentTypeIdsRespose {
    ids: Array<String>
}

export interface ProcessTypeParsedData {
    name: string,
    steps: string,
    documents: Array<String>
}