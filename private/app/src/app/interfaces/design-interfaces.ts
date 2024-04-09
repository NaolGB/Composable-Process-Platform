export interface TableDataInterface {
    headerValues: {
        column_identifier: string;
        display_name: string;
    }[];
    rowValues: {
        [key: string]: string | number | boolean;
    }[];
}

// Master Data Type --------------------------------------------------------
export interface MasterDataAttributeInterface {
    display_name: string;
    type: string;
    is_required: boolean;
    default_value: string;
}

export interface MasterDataTypeInterface {
    id?: string;
    display_name: string;
    attributes: {[key: string]: MasterDataAttributeInterface};
}
// Master Data Type --------------------------------------------------------

// Document Type --------------------------------------------------------
export interface DocumentAttributeInterface {
    display_name: string;
    type: string;
    is_required: boolean;
    default_value: string;
}

export interface DocumentTypeInterface {
    id?: string;
    display_name: string;
    attributes: {[key: string]: DocumentAttributeInterface};
}
// Document Type --------------------------------------------------------


export interface ApiResponsePackageInterface {
    success: boolean;
    message: string;
    data?: any;
}

export interface NotificationInterface {
    message: string;
    type: 'success' | 'error' | 'info';
    dismissed: boolean;
    remainingTime: number;
    intervalId?: any; // Make it optional as it will be used internally
}