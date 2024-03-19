import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { APIResponse, Notification, TableData } from '../../../services/interface';

@Injectable({
  providedIn: 'root'
})
export class DesignMasterGeneralService {

  constructor() { }

  prepareAttributePreviewDataForTableFromFormArray(attributes: FormArray) {
    /**
     * From the masterDataFromClient's attribute formArray, prepare the data to be \
     * displayed in the table
     * 
     * input: masterDataFromClient's attribute formArray
     * output: TableData
     */
    const rowData: { [key: string]: any } = {};
    const columnsToDisplay: { columnIdentifier: string, displayName: string }[] = [];
  
    attributes.controls.forEach((attributeControl, index) => {
      const attribute = attributeControl.value;
      // Assume display_name serves as a unique identifier for columnIdentifier
      const columnIdentifier = `attribute_${index}`;
      rowData[columnIdentifier] = attribute.default_value;
      columnsToDisplay.push({
        columnIdentifier: columnIdentifier,
        displayName: attribute.display_name
      });
    });
  
    const tableData: TableData = {
      rowContent: [rowData], // we only have one row of data
      columnsToDisplay: columnsToDisplay
    };

    return tableData;
  }

  isAPIResponse(object: any): object is APIResponse {
    return Object.keys(object).includes('success') &&
            Object.keys(object).includes('message') &&
           (object.success === true || object.success === false);
  }

  createNotificationFromAPIResponse(response: any): Notification {
    let notification: Notification;
    if (this.isAPIResponse(response)) {
      console.log('APIResponse');
      // Convert APIResponse to Notification
      notification = {
        type: response.success ? 'success' : 'error', 
        message: response.message || response.success ? 'Success' : 'Failed', // Use API response message or a default one
        dismissed: false,
        remainingTime: 5000
      };
    } else {
      // Response does not fit APIResponse; default to info type Notification
      const fallbackMessage = `Status: ${response.status} ${response.statusText}.`;
      notification = {
        type: 'info',
        message: fallbackMessage,
        dismissed: false,
        remainingTime: 5000
      };
    }

    return notification;
  }

  createNotificationFromError(error: any): Notification {
    const fallbackMessage = `Status: ${error.status} ${error.statusText}.`;
    const notification: Notification = {
      type: 'error',
      message: fallbackMessage ? fallbackMessage : 'An error occurred.',
      dismissed: false,
      remainingTime: 5000
    };

    return notification; 
  }

}
