import { Component, Input } from '@angular/core';
import { TableDataInterface } from '../../interfaces/design-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {
  @Input() tableData: TableDataInterface | undefined;
}
