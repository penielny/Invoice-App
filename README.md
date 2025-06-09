# 🧾 Invoice App

A simple Angular application to create, view, edit, and delete invoices. Built with standalone components, Angular routing, and service-based state management.


---

## 📦 Project Description

The **Invoice App** is a lightweight Angular SPA (Single Page Application) for managing invoices. It includes features like viewing invoice details, editing, and deletion through a modal interface. It demonstrates clean component design, route handling, local storage fallback, and form-driven input validation.


---
## 🚀 Setup & Run Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/penielny/Invoice-App
cd invoice-app

## 1. Install Dependencies
npm install

## 2. Development server
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## ✨ Application Features
✅ View invoice details

✏️ Edit invoice with prefilled form

❌ Delete invoice with confirmation modal

💾 Save and fetch invoices from local storage

🔁 Client-side routing with deep link support

🧪 Form validation with user-friendly error handling


## 🧱 Component Structure
```
src/
├── app/
│   ├── components/
│   │   └── delete-invoice-modal/
│   │   └── invoice-list-item/
│   │   └── drawer-modal-layout/
│   │   └── sidebar/
│   ├── pages/
│   │   └── home/
│   │   └── invoice/
│   │   └── new-invoice/
│   │   └── edit-invoice/
│   ├── services/
│   │   └── invoice.service.ts
│   ├── interfaces/
│   │   └── invoice.ts
│   └── app.routes.ts

```
---

## 🔀 Routing Overview

The app uses Angular Router for navigation. Key routes include:
```
/ — redirect to /invoice

/invoices — list all invoices

/invoice/:id — View invoice details by ID

/invoice/123(modal:invoice/:id/edit) — Edit invoice in a modal outlet

/invoices(modal:invoice/new) — Creat invoice in a modal outlet
```
Make sure to configure fallback routes (e.g., with _redirects file on Netlify) to handle client-side routing properly on page reloads.

---
## 📝 Form Implementation
Uses Reactive Forms with FormBuilder

Includes validation for required fields like client name, amount, and due date

Handles error display for user-friendly feedback

Submits data back to the service for updating invoice records

---
## 🔁 Git Workflow
Branching Strategy

main – Stable production branch

dev – Development/integration branch

feature/* – New features or changes