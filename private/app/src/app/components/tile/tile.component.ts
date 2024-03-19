import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.scss'
})
export class TileComponent {
  @Input() isSelected: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() hasDivider: boolean = false;
}
