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
    const newInvoices = [...currentInvoices, invoice];
    this.invoicesSubject.next(newInvoices);
  }

  update(invoice: Invoice): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const toBeUpdatedInvoice = currentInvoices.filter(inv => inv.id === invoice.id)[0];
    if (!toBeUpdatedInvoice) {
      console.error('Invoice not found for update:', invoice.id);
      return;
    }
    const updatedInvoices = currentInvoices.map(inv =>
      inv.id === invoice.id ? { ...inv, ...invoice } : inv
    );
    this.invoicesSubject.next(updatedInvoices);
  }

  delete(id: string): void {
    const currentInvoices = this.invoicesSubject.getValue();
    const updatedInvoices = currentInvoices.filter(inv => inv.id !== id);
    this.invoicesSubject.next(updatedInvoices);
  }

  load(): Invoice[] {
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
