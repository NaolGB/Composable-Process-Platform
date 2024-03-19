export interface MasterDataType {
    _id?: string;
    display_name: string;
    attributes: {
        [key: string]: {
            display_name: string;
            type: string;
            is_required: boolean;
            default_value: string;
        }
    };
}

export interface APIResponse {
    success: string;
    data: any;
    message: string;
}

export interface Notification {
    type: 'success' | 'error' | 'info'; 
    message: string;
    dismissed: boolean;
    remainingTime: number;
    intervalId?: any; // Make it optional as it will be used internally
}

export interface TableData {
    rowContent: { [key: string]: string | number | boolean }[];
    columnsToDisplay: {
        columnIdentifier: string;
        displayName: string;
    }[];
}