import { Component, inject, OnInit } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-invoice',
  imports: [SidebarComponent,ReactiveFormsModule],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss'
})
export class NewInvoiceComponent implements OnInit {
onSubmit() {
throw new Error('Method not implemented.');
}

  private formBuilder = inject(FormBuilder);
  invoiceForm!: FormGroup;

  constructor(private router: Router) { }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    this.items.push(
      this.formBuilder.group({
        name: [''],
        quantity: [1],
        price: [0],
        total: [0],
      })
    );
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  ngOnInit(): void {
    this.invoiceForm = this.formBuilder.group({

      id: ['RT3080'],
      createdAt: ['2021-08-18'],
      paymentDue: ['2021-08-19'],
      description: ['Re-branding', Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['Jensen Huang', Validators.required],
      clientEmail: ['jensenh@mail.com', [Validators.required, Validators.email]],
      status: ['paid'],

      senderAddress: this.formBuilder.group({
        street: ['19 Union Terrace'],
        city: ['London'],
        postCode: ['E1 3EZ'],
        country: ['United Kingdom'],
      }),

      clientAddress: this.formBuilder.group({
        street: ['106 Kendell Street'],
        city: ['Sharrington'],
        postCode: ['NR24 5WQ'],
        country: ['United Kingdom'],
      }),

      items: this.formBuilder.array([
        this.formBuilder.group({
          name: ['Brand Guidelines', Validators.required],
          quantity: [1, [Validators.required, Validators.min(1)]],
          price: [1800.90, Validators.required],
          total: [1800.90],
        }),
      ]),

      total: [1800.90],
    })
  }

}
