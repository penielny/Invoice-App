import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { DrawerModalLayoutComponent } from "../../components/drawer-modal-layout/drawer-modal-layout.component";
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, paymentTerm } from '../../interfaces/invoice';

@Component({
  selector: 'app-edit-invoice',
  imports: [DrawerModalLayoutComponent, NgFor, NgForOf, NgClass, NgIf, ReactiveFormsModule],
  templateUrl: './edit-invoice.component.html',
  styleUrl: './edit-invoice.component.scss'
})
export class EditInvoiceComponent {



  private formBuilder = inject(FormBuilder);
  invoiceForm!: FormGroup;
  invoice!: Invoice;

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

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (!id) router.navigate([""])
      let invoice: Invoice | undefined = this.invoiceService.get(id)
      if (invoice) {
        this.invoice = invoice
        this.buildForm(invoice)
      } else {
        router.navigate([""])
      }
    });

  }


  buildForm(defaultValue: Invoice | undefined = undefined) {

    this.invoiceForm = this.formBuilder.group({

      id: [defaultValue?.id || this.generateUID()],
      createdAt: [this.formatDate(new Date())],
      paymentDue: [defaultValue?.paymentDue || ''],
      description: [defaultValue?.description || '', Validators.required],
      paymentTerms: [defaultValue?.paymentTerms || 1, Validators.required],
      clientName: [defaultValue?.clientName || '', Validators.required],
      clientEmail: [defaultValue?.clientEmail || '', [Validators.required, Validators.email]],
      status: [defaultValue?.status || 'draft'],

      senderAddress: this.formBuilder.group({
        street: [defaultValue?.senderAddress.street || ''],
        city: [defaultValue?.senderAddress.city || ''],
        postCode: [defaultValue?.senderAddress.postCode || ''],
        country: [defaultValue?.senderAddress.country || ''],
      }),

      clientAddress: this.formBuilder.group({
        street: [defaultValue?.clientAddress.street || ''],
        city: [defaultValue?.clientAddress.city || ''],
        postCode: [defaultValue?.clientAddress.postCode || ''],
        country: [defaultValue?.clientAddress.country || ''],
      }),

      items: this.formBuilder.array(
        (defaultValue?.items || []).map(item => {
          const itemGroup = this.formBuilder.group({
            name: [item.name, Validators.required],
            quantity: [item.quantity, [Validators.required, Validators.min(1)]],
            price: [item.price, Validators.required],
            total: [item.total],
          })
          this.subscribeToPriceAndQuantityChanges(itemGroup);
          return itemGroup
        }
        ),),

      total: [defaultValue?.total || 0],
    })
  }

  onSave() {
    this.formElementRef.nativeElement.requestSubmit()
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.invoiceForm.valid) {
      this.invoiceService.update(this.invoiceForm.value)
      console.log("submit sent", this.invoiceForm.controls)
      this.invoiceForm.reset()
      this.close()
    } else {
      console.error("form error", this.invoiceForm.errors)

    }
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
