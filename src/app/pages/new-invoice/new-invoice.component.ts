
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router } from '@angular/router';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { paymentTerm } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-new-invoice',
  imports: [SidebarComponent, ReactiveFormsModule, NgFor, NgForOf, NgClass, NgIf],
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

  private formBuilder = inject(FormBuilder);
  private invoiceService = inject(InvoiceService)
  invoiceForm!: FormGroup;
  paymentTerms: paymentTerm[] = [
    {
      id: 1,
      label: "Net 1 Day"
    },
    {
      id: 2,
      label: "Net 7 Day"
    },
    {
      id: 3,
      label: "Net 14 Day"
    },
    {
      id: 4,
      label: "Net 30 Day"
    },
  ]
  showPaymentTerm: Boolean = false;
  selectedTermId: number = 1;

  @ViewChild('newForm') formElementRef!: ElementRef<HTMLFormElement>;

  constructor(private router: Router) {
    this.invoiceForm = this.formBuilder.group({

      id: [this.generateUID()],
      createdAt: [this.formatDate(new Date())],
      paymentDue: [''],
      description: ['', Validators.required],
      paymentTerms: [1, Validators.required],
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      status: ['draft'],

      senderAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        postCode: [''],
        country: [''],
      }),

      clientAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        postCode: [''],
        country: [''],
      }),

      items: this.formBuilder.array([],[Validators.minLength(1)]),

      total: [],
    })
  }

  generateUID(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const prefix = Array.from({ length: 2 }, () =>
      letters.charAt(Math.floor(Math.random() * letters.length))
    ).join('');

    const digits = Math.floor(1000 + Math.random() * 9000); // ensures 4 digits

    return `${prefix}${digits}`;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  toggleShowTerm() {
    this.showPaymentTerm = !this.showPaymentTerm;
  }

  getSelectedTermLabel() {
    return this.paymentTerms.find(data => data.id == this.selectedTermId)?.label
  }

  setSelectedTerm(id: number) {
    this.selectedTermId = id;
    this.invoiceForm.get('paymentTerms')?.setValue(String(this.selectedTermId));
    this.toggleShowTerm()
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.invoiceForm.valid) {
      this.invoiceService.add(this.invoiceForm.value)
      console.log("submit sent", this.invoiceForm.controls)
      this.invoiceForm.reset()
    } else {
      console.error("form error", this.invoiceForm.errors)

    }
  }

  onSaveDraft() {
    this.invoiceForm.get('status')?.setValue("draft")
    this.formElementRef.nativeElement.requestSubmit();
  }

  onSaveAndSend() {
    this.invoiceForm.get('status')?.setValue("pending")
    this.formElementRef.nativeElement.requestSubmit();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {

    const itemGroup = this.formBuilder.group({
      name: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      price: [1800.90, Validators.required],
      total: [{ value: 0, disabled: true }],
    });

    this.subscribeToPriceAndQuantityChanges(itemGroup);

    this.items.push(itemGroup);
  }

  subscribeToPriceAndQuantityChanges(itemGroup: FormGroup) {
    itemGroup.get('quantity')!.valueChanges.subscribe(() => this.updateTotal(itemGroup));
    itemGroup.get('price')!.valueChanges.subscribe(() => this.updateTotal(itemGroup));

    // Initialize total immediately
    this.updateTotal(itemGroup);
  }

  updateTotal(itemGroup: FormGroup) {
    const quantity = itemGroup.get('quantity')!.value;
    const price = itemGroup.get('price')!.value;
    const total = quantity * price;

    itemGroup.get('total')!.setValue(total.toFixed(2), { emitEvent: false });
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }


}
