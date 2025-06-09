import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { DeleteInvoiceModalComponent } from '../../components/delete-invoice-modal/delete-invoice-modal.component';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, DeleteInvoiceModalComponent, RouterLink],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  invoice!: Invoice;
  showModal: Boolean = false;

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceService, private router: Router) { }

  onEdit() {
    this.router.navigate([{ outlets: { modal: ['invoice', 'edit'] } }], { queryParams: { id: this.invoice.id } });
  }

  onDelete() {
    this.showModal = true;
  }

  onClose() {
    this.showModal = false;
  }
  onMarkAsPaid(){
    const inv_updated:Invoice = {
      ...this.invoice,
      status: "paid"
    }
   this.invoice = this.invoiceService.update(inv_updated)
  }

  ngOnInit() {

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.invoice = this.invoiceService.get(id as string) as Invoice;
    if (!this.invoice) {
      const storedInvoice = localStorage.getItem('invoice-app-invoice');
      if (storedInvoice) {
        const invoice = JSON.parse(storedInvoice) as Invoice;
        if (invoice) {
          this.invoice = invoice;
        } else {
          this.router.navigate(['/']);
        }
      }
    } else {
      localStorage.setItem('invoice-app-invoice', JSON.stringify(this.invoice));
    }
  }
}
