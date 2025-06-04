import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {

  invoice!: Invoice;

  constructor(private route: ActivatedRoute, private invoiceService: InvoiceService) { }


  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if(!id) return;
    this.invoice = this.invoiceService.get(id as string) as Invoice;
  }

}
