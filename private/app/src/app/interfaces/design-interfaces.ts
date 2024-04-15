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

// Support Type --------------------------------------------------------
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

// Process Type --------------------------------------------------------
export interface ProcessStep {
    display_name: string;
    type: string;
    __function?: __Function;
    next_step: NextStep;
    manual_options?: { [key: string]: ManualOption };
  }
  
  export interface __Function {
    document_type: string;
    function_script: string;
  }
  
  export interface ManualOption {
    display_name: string;
    __function: __Function;
  }
  
  export interface NextStep {
    has_multiple_next_steps: boolean;
    next_step?: string;
    conditional_value?: string;
    conditions?: { [key: string]: Condition };
  }
  
  export interface Condition {
    comparison: { [key: string]: Comparison };
    next_step: string;
  }
  
  export interface Comparison {
    operator: string;
    value: string;
    logic: string;
    next_comparison?: string;
  }
  
  export interface ProcessTypeInterface {
    display_name: string;
    documents: string[];
    steps: { [key: string]: ProcessStep };
  }
  