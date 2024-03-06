import { Component } from '@angular/core';
import { FormCardComponent } from '../../../components/form-card/form-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-design-master-create-new',
  standalone: true,
  imports: [FormCardComponent, CommonModule],
  templateUrl: './design-master-create-new.component.html',
  styleUrl: './design-master-create-new.component.scss'
})
export class DesignMasterCreateNewComponent {
  formCards = [
    { id: 1, fields: [
      { type: 'select', options: ['string'], label: 'data_type', value: 'string', disabled: true }, 
      { type: 'text', label: 'Name', value: '', disabled: false }] 
    },
  ];
  
  formData: any = {};
  
  onCardDataChange(cardId: number, data: any) {
    this.formData[cardId] = data;
  }

  addFormCard() {
    const newCardId = this.formCards.length + 1;
    const newCard = {
      id: newCardId,
      fields: [
        { type: 'select', options: ['string', 'number', 'boolean', 'datetime'], label: 'data_type', value: 'string', disabled: false }, 
        { type: 'text', label: 'New Field', value: '', disabled: false },
      ]
    };
    this.formCards.push(newCard);
  }
  
  
  onSubmit() {
    console.log('Form submitted:', this.formData);
    // Handle the form submission
  }
}
