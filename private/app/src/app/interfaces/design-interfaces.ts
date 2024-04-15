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
    _id: string;
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
    master_data_type: {
        id: string;
        fields_to_update: string;
        fields_to_display: string;
    };
    functions: {
        [key: string]: {
            inputs: {
                [key: string]:  {
                    source: string;
                    field: string;
                }
            };
            outputs: {
                [key: string]: {
                    destination: string;
                    field: string;
                }
            };
        };
    };
    attributes: {[key: string]: DocumentAttributeInterface};
}
// Document Type --------------------------------------------------------


export interface CheckboxDataInterface {
    id: string;
    display_name: string;
    is_checked: boolean;
}

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