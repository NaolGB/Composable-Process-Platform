import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  filterData(data: any[], filterText: string, filterColumn?: string) {
    if (filterText.trim() === '') {
      console.log('filterText is empty')
      return data;
    }

    const filterTextLowerCase = filterText.toLowerCase();


    if (filterColumn) {
      return data.filter(item =>
        item[filterColumn].toString().toLowerCase().includes(filterTextLowerCase)
      );
    } else {
      return data.filter(item =>
        Object.values(item).join(' ').toLowerCase().includes(filterTextLowerCase)
      );
    }
  }
}
