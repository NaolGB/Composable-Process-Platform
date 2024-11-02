import { Injectable } from '@angular/core';
import { TableDataInterface } from '../interfaces/design-interfaces';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  filterTableData(data: TableDataInterface, filterText: string, filterColumn?: string): TableDataInterface {
    if (filterText.trim() === '') {
      return data;
    }

    const filterTextLowerCase = filterText.toLowerCase();

    let filteredRowValues = [];

    if (filterColumn) {
      // Filter based on a specific column
      filteredRowValues = data.rowValues.filter(item =>
        item[filterColumn]?.toString().toLowerCase().includes(filterTextLowerCase)
      );
    } else {
      // Filter based on all columns
      filteredRowValues = data.rowValues.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(filterTextLowerCase)
      );
    }

    // Return a new object conforming to TableDataInterface, with filteredRowValues
    return {
      headerValues: data.headerValues, // Keep the original headerValues unchanged
      rowValues: filteredRowValues // Use the filtered rowValues
    };
  }

  nameToId(name: string, variaiton: number = 0): string {
    if (variaiton === 0) {
      return name.trim().toLowerCase().replace(/ /g, '_');
    }
    return `${name.trim().toLowerCase().replace(/ /g, '_')}_${variaiton}`;
  }

  generateUUID(): string {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }
  

  generalFormInputValidator(): ValidatorFn {
    const reservedKeywords = [
      'admin', 'user', 'superuser',
      'login', 'logout', 'signup',
      '__button_master_data_type_overview', '__button_master_data_type_add_new',
      'start', 'end',
    ]
    return (control: AbstractControl): {[key: string]: any} | null => {
      const required = control.value.trim() === '';
      const minLength = control.value.trim().length < 1;
      const maxLength = control.value.trim().length > 64;
      const keywords = reservedKeywords.includes(control.value.trim().toLowerCase());

      if (required || minLength || maxLength || keywords) {
        return { 'invalidInput': { value: control.value } };
      } else {
        return null;
      }
    }
  }

  generateArrayFromNumber(num: number): number[] {
    return Array(num).fill(0).map((x, i) => i);
  }

}
