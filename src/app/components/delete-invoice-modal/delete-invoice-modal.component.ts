import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-invoice-modal',
  imports: [],
  templateUrl: './delete-invoice-modal.component.html',
  styleUrl: './delete-invoice-modal.component.scss'
})
export class DeleteInvoiceModalComponent {
  invoiceService = inject(InvoiceService)
  constructor(private router: Router){}
  @Input() id!: string;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

  onDelete() {
    this.invoiceService.delete(this.id)
    this.router.navigate([''])
  }

}
