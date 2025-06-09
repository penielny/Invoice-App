import { Routes } from '@angular/router';
import {HomeComponent} from './pages/home/home.component'
import { InvoiceComponent } from './pages/invoice/invoice.component';
import { NewInvoiceComponent } from './pages/new-invoice/new-invoice.component';
import { EditInvoiceComponent } from './pages/edit-invoice/edit-invoice.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo:"invoices",
         pathMatch: 'full'
    },
    {
        path: "invoices",
        component:HomeComponent,
    },
    {
        path: "invoice/:id",
        component: InvoiceComponent
    },
    {
        path: "invoice/new",
        component: NewInvoiceComponent,
        outlet:"modal"
    },
    {
        path: "invoice/edit",
        component: EditInvoiceComponent,
        outlet:"modal"
    }
];
