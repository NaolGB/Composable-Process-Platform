import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss'
})
/**
 * Represents a component that holds multiple types of data as a form.
 * Each card is responsible for bundling its content as an object and sending it to the caller.
 * Only one form card data sent for one form card component.
 */
export class FormCardComponent {
  @Input() cardFields: any[] = [];
  @Output() cardDataChange = new EventEmitter<any>();

  onFieldChange() {
    const cardData: any = {};
    this.cardFields.forEach(field => {
      cardData[field.label] = field.value;
    });
    this.cardDataChange.emit(cardData);
  }
}
