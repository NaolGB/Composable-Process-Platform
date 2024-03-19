import { Component, Input } from '@angular/core';
import { TableData } from '../../services/interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() tableData: TableData = {} as TableData;

  ngonInit() {}
}
