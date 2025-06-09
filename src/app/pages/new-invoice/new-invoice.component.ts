
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router, RouterLink } from '@angular/router';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { paymentTerm } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { DrawerModalLayoutComponent } from "../../components/drawer-modal-layout/drawer-modal-layout.component";

@Component({
  selector: 'app-new-invoice',
  imports: [SidebarComponent,RouterLink, ReactiveFormsModule, NgFor, NgForOf, NgClass, NgIf],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss'
})
export class NewInvoiceComponent {

  private formBuilder = inject(FormBuilder);
  invoiceForm!: FormGroup;

  private invoiceService = inject(InvoiceService)
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
      this.close()
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
