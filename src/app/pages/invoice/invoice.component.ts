import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { DeleteInvoiceModalComponent } from '../../components/delete-invoice-modal/delete-invoice-modal.component';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, DeleteInvoiceModalComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  invoice!: Invoice;
  showModal: Boolean = false;

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) { }

  onDelete(){
    this.showModal = true;
  }

  onClose(){
    this.showModal = false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) return;
    this.invoice = this.invoiceService.get(id as string) as Invoice;
  }

}
