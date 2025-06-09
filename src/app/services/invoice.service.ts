import { Injectable } from '@angular/core';
import { Invoice } from '../interfaces/invoice';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
  public invoices$: Observable<Invoice[]> = this.invoicesSubject.asObservable();


  constructor(private http: HttpClient) {
    this.load()
  }


  get(id: string): Invoice | undefined {
    const currentInvoices = this.invoicesSubject.getValue();
    const invoice = currentInvoices.find(inv => inv.id === id);
    if (!invoice) {
      console.error('Invoice not found:', id);
      return undefined;
    }
    return invoice;
  }

  add(invoice: Invoice): void {
    const currentInvoices = this.invoicesSubject.getValue();
    console.log(invoice.total)
    const newInvoices = [invoice, ...currentInvoices];
    localStorage.setItem('invoice-app-default-value', JSON.stringify(newInvoices))
    this.invoicesSubject.next(newInvoices);
  }

  update(invoice: Invoice): Invoice {
    const currentInvoices = this.invoicesSubject.getValue();
    const toBeUpdatedInvoice = currentInvoices.filter(inv => inv.id === invoice.id)[0];
    if (!toBeUpdatedInvoice) {
      console.error('Invoice not found for update:', invoice.id);
      return toBeUpdatedInvoice;
    }
    const updatedInvoices = currentInvoices.map(inv =>
      inv.id === invoice.id ? { ...inv, ...invoice } : inv
    );
    localStorage.setItem('invoice-app-default-value', JSON.stringify(updatedInvoices))
    this.invoicesSubject.next(updatedInvoices);
    return updatedInvoices.filter(inv => inv.id === invoice.id)[0];
  }

  delete(id: string): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const updatedInvoices = currentInvoices.filter(inv => inv.id !== id);
    localStorage.setItem('invoice-app-default-value', JSON.stringify(updatedInvoices))
    this.invoicesSubject.next(updatedInvoices);
  }

  load(): Invoice[] {
    const localDataStr = localStorage.getItem('invoice-app-default-value')
    if (localDataStr) {
      const dataObject: Invoice[] = JSON.parse(localDataStr)
      this.invoicesSubject.next(dataObject);
      return dataObject;
    }

    this.http.get<Invoice[]>('assets/data/data.json').subscribe({
      next: (data) => {
        this.invoicesSubject.next(data);
      }
      , error: (error) => {
        console.error('Error loading invoices:', error);
      }
    });
    return this.invoicesSubject.getValue();
  }


}
