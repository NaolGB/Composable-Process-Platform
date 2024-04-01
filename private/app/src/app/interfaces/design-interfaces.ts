export interface TableDataInterface {
    headerValues: {
        column_identifier: string;
        display_name: string;
    }[];
    rowValues: {
        [key: string]: string | number | boolean;
    }[];
}