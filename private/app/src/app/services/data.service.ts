import { Injectable } from '@angular/core';
import { TableDataInterface } from '../interfaces/design-interfaces';

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
}
