import { Component, inject, OnInit } from '@angular/core';
import { Invoice, paymentTerm } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceListItemComponent } from "../../components/invoice-list-item/invoice-list-item.component";
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [InvoiceListItemComponent, NgIf],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  protected invoiceService = inject(InvoiceService);

  constructor(private router: Router) { }
  protected invoices: Invoice[] = [];
  filteredStatus: string[] = [];
  allInvoices: Invoice[] = [];
  showFilterOption: Boolean = false;
  paymentStatus: { label: string, value: string }[] = [
    {
      label: "Draft",
      value: "draft"
    },
    {
      label: "Pending",
      value: "pending"
    },
    {
      label: "Paid",
      value: "paid"
    }
  ]

  toggleFilter() {
    this.showFilterOption = !this.showFilterOption;
  }
  onNewInvoice() {
    this.router.navigate([{ outlets: { modal: ['invoice', 'new'] } }]);
  }

  onFilter(filterValue: string) {
    const index = this.filteredStatus.indexOf(filterValue);
    if (index !== -1) {
      this.filteredStatus.splice(index, 1);
    } else {
      this.filteredStatus.push(filterValue);
    }

    this.filterInvoices(this.filteredStatus);
  }

  filterInvoices(status: string[] = []) {
    if (status.length === 0) {
      this.invoices = this.allInvoices;
    } else {
      this.invoices = this.allInvoices.filter(invoice =>
        status.includes(invoice.status)
      );
    }
  }


  ngOnInit(): void {
    this.invoiceService.invoices$.subscribe({
      next: (invoices) => {
        this.allInvoices = invoices;
        this.filterInvoices(this.filteredStatus);
      }
      , error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
  }
}
