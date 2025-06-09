import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Invoice, paymentTerm } from '../../interfaces/invoice';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-form-component',
  imports: [ReactiveFormsModule, RouterLink, NgClass, NgFor, NgIf, NgForOf],
  templateUrl: './form-component.component.html',
  styleUrl: './form-component.component.scss'
})
export class FormComponentComponent {
  private formBuilder = inject(FormBuilder);
  private invoiceService = inject(InvoiceService)
  invoiceForm!: FormGroup;
  showPaymentTerm: Boolean = false;
  selectedTermId: number = 1;
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

      items: this.formBuilder.array([], [Validators.minLength(1)]),

      total: [0],
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
    this.updateTotal(itemGroup);
  }

  subscribeToPriceAndQuantityChanges(itemGroup: FormGroup) {
    itemGroup.get('quantity')!.valueChanges.subscribe(() => this.updateTotal(itemGroup));
    itemGroup.get('price')!.valueChanges.subscribe(() => this.updateTotal(itemGroup));

    this.updateTotal(itemGroup);
  }

  updateTotal(itemGroup: FormGroup) {
    const quantity = itemGroup.get('quantity')!.value;
    const price = itemGroup.get('price')!.value;

    const total = parseFloat((quantity * price).toFixed(2));

    itemGroup.get('total')!.setValue(total, { emitEvent: false });

    this.updateInvoiceTotal();
  }

  updateInvoiceTotal(): void {
    const items = this.invoiceForm.get('items') as FormArray;
    const total = items.controls.reduce((sum, itemGroup: AbstractControl) => {
      const itemTotal = itemGroup.get('total')!.value || 0;
      return sum + itemTotal;
    }, 0);

    this.invoiceForm.get('total')!.setValue(total, { emitEvent: false });
  }


  onSubmit(event: Event) {
    event.preventDefault();
    if (this.invoiceForm.valid) {
      this.invoiceService.add(this.invoiceForm.value)
      console.log("submit sent", this.invoiceForm.controls)
      this.invoiceForm.reset()
      this.close()
    } else {
      console.error("form error", this.invoiceForm.errors)
    }
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }

  public getFormData(): { form: FormGroup, ref: ElementRef<HTMLFormElement> } {
    return {
      form: this.invoiceForm,
      ref: this.formElementRef
    };
  }

}
