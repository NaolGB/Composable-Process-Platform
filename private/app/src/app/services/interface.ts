export interface MasterDataType {
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