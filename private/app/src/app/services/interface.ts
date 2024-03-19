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
    status: string;
    data: any;
    message: string;
}

export interface Notification {
    message: string;
    dismissed: boolean;
    remainingTime: number;
    intervalId: any;
}