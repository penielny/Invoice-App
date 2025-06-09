
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { Router, RouterLink } from '@angular/router';
import { Form, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgFor, NgForOf, NgIf } from '@angular/common';
import { paymentTerm } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { DrawerModalLayoutComponent } from "../../components/drawer-modal-layout/drawer-modal-layout.component";
import { FormComponentComponent } from '../../components/form-component/form-component.component';

@Component({
  selector: 'app-new-invoice',
  imports: [SidebarComponent, ReactiveFormsModule,FormComponentComponent],
  templateUrl: './new-invoice.component.html',
  styleUrl: './new-invoice.component.scss'
})
export class NewInvoiceComponent {

  @ViewChild(FormComponentComponent) formComponent!: FormComponentComponent;

  constructor(private router: Router) { }

  onSaveDraft() {
    const { form, ref } = this.formComponent.getFormData();
    form.get('status')?.setValue("draft")
    ref.nativeElement.requestSubmit();
  }

  onSaveAndSend() {
    const { form, ref } = this.formComponent.getFormData();
    form.get('status')?.setValue("pending")
    ref.nativeElement.requestSubmit();
  }

  close() {
    this.router.navigate([{ outlets: { modal: null } }]);
  }


}
