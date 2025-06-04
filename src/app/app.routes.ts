import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent)
    },
    {
        path: "invoice/:id",
        loadComponent: () => import("./pages/invoice/invoice.component").then(m => m.InvoiceComponent)
    }
];
