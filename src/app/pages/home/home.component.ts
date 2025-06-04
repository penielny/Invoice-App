import { Component, inject, OnInit } from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceListItemComponent } from "../../components/invoice-list-item/invoice-list-item.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [InvoiceListItemComponent,NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  protected invoiceService = inject(InvoiceService);
  protected invoices: Invoice[] = [];


  ngOnInit(): void {
    this.invoiceService.load();
    this.invoiceService.invoices$.subscribe({
      next: (invoices) => {
        this.invoices = invoices;
      }
      , error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
  }
}
