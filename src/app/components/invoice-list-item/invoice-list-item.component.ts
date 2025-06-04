import { Component, Input } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-list-item',
  imports: [CommonModule,RouterModule],
  templateUrl: './invoice-list-item.component.html',
  styleUrl: './invoice-list-item.component.scss'
})
export class InvoiceListItemComponent {

  @Input() invoice!: Invoice;


}
