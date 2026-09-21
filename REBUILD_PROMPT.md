# Master Rebuild Prompt: Loja-62

> Prompt ini dirancang untuk diberikan kepada AI Coding Agent (seperti Google AI Studio, Antigravity, Claude Code, Cursor, atau GitHub Copilot) guna mereproduksi atau membangun ulang aplikasi **Loja-62** secara mandiri dari nol tanpa perlu melihat kode sumber lama.

---

```markdown
# PROMPT: Build Loja-62 — Recipe-Based F&B Point of Sale & Micro-Manufacturing Inventory System

You are tasked with building a complete, production-ready web application named **Loja-62**.
Loja-62 is a specialized Point of Sale (POS) and inventory management system designed specifically for food and beverage (F&B) micro-enterprises, artisan coffee shops, bakeries, and micro-roasteries.

Read this specification thoroughly before writing any code.

---

## 1. Product Purpose & Core Concept

Standard retail POS software assumes products are bought and sold in the exact same physical state (1 bottle purchased = 1 bottle sold). In F&B businesses, products sold to customers are the result of a kitchen manufacturing process: a cup of Cappuccino is composed of an espresso shot (coffee beans + water) combined with steamed fresh milk, inside a disposable cup.

**Loja-62 models F&B products as a Multi-Tier Bill of Materials (BOM).**
Every time a cashier sells an item at the register:
1. The system automatically computes and deducts the exact physical quantities of raw materials (in grams, milliliters, or pieces) from the warehouse inventory.
2. The system tracks dynamic Cost of Goods Sold (HPP / COGS) consisting of Raw Material Cost + Direct Labor Cost + Production Overhead Cost, providing instant real-time profit margins per transaction.
3. The register dynamically computes **Virtual Stock**: the maximum number of servings of any product that can be prepared right now, determined by whichever raw material in its recipe is the most scarce (the bottleneck resource).

---

## 2. Target Users

1. **Frontline Cashiers & Baristas**: Need a high-speed, uncluttered ordering register with instant category filtering, visual stock indicators, cart management, and fast receipt generation.
2. **Shop Owners & Managers**: Need exact profit margin tracking per cup, recipe formula management, supplier purchase order management, and wastage/spoilage auditing.
3. **Roasters / Kitchen Operators**: Need a work-order tracking system to log batch production (e.g. coffee roasting lots), track raw input vs measured output, calculate shrinkage/weight loss %, and track degassing/resting days.

---

## 3. Core Modules & Features

### Module A: POS Register & Checkout
* **Visual Product Catalog**: Card grid showing product photo, name, category, selling price, and dynamic virtual stock badge. Products out of stock must be visually dimmed and unclickable.
* **Category Filter Tabs**: Fast switching between beverage, food, and custom categories.
* **Cart & Pricing Engine**:
  * Real-time calculation of subtotal, configurable sales tax (e.g., 11% PPN), and total.
  * Prevention of adding more items to the cart than the available virtual stock allows.
* **Payment Processing**:
  * **Direct Checkout (Paid)**: Completes the transaction, assigns a sequential invoice ID (e.g., `INV-0001`), deducts raw materials recursively from warehouse stock, and logs a snapshot of cost and profit.
  * **Create Invoice (Unpaid / Credit)**: Allows selecting a registered customer to create an open invoice for later settlement.
* **Receipt Modal & Printing**: Thermal-friendly printable receipt popup showing store header, itemized list, tax, totals, and invoice footer with a trigger for `window.print()`.

### Module B: Recipe & BOM Engine (The Core IP)
* **Polymorphic Recipe Items**: A recipe item can be either a `raw-material` OR another `product`.
* **Semi-Finished Goods (Sub-Products)**: Products created with a selling price of `0` (e.g. *Espresso Shot*) are designated as intermediate goods. They are excluded from the cashier POS screen but can be embedded into recipes for end-products (*Cappuccino*, *Latte*).
* **Recursive Cost Calculation (HPP)**:
  $$\text{Product HPP} = \sum (\text{Ingredient Quantity} \times \text{Unit Cost}) + \text{Direct Labor} + \text{Overhead}$$
  Must recursively evaluate nested sub-products and include circular dependency detection to prevent infinite loops.
* **Virtual Stock Resolver**:
  $$\text{Virtual Stock} = \min_{i \in \text{Ingredients}} \left\lfloor \frac{\text{Current Inventory}_i}{\text{Required Quantity per Serving}_i} \right\rfloor$$

### Module C: Raw Material & Inventory Management
* **Raw Material Catalog**: Table tracking Name, Category, Current Physical Stock, Measurement Unit (`gram`, `ml`, or `pcs`), Cost per Unit (Rp), and Default Supplier.
* **Independent Material Categories**: Grouping for green beans, dairy, syrups, packaging, etc.

### Module D: Procurement & Purchase Orders (PO)
* **PO Lifecycle**: Status progression from `draft` $\rightarrow$ `ordered` $\rightarrow$ `partially-received` $\rightarrow$ `completed` (or `cancelled`).
* **Receiving Modal**: Allows warehouse staff to check off delivered quantities item-by-item. Upon submission, the received quantities are automatically incremented into the physical raw material stock.

### Module E: Stock Adjustments & Wastage
* **Mutation Types**: Record inventory adjustments categorized as `wastage` (spoilage/accidents), `correction` (physical audit opname), `internal-use` (staff meals/barista calibration), and `return` (vendor return).
* **Stock Guard**: Prevents adjustments that would result in negative physical stock.

### Module F: Production Tracking & Batch Roasting
* **Batch Work Orders**: Create production batches tracking lot number, target product, planned output quantity, actual measured output quantity, production/roasting date, roaster operator name, and batch status (`draft`, `in-progress`, `completed`, `cancelled`).
* **Roastery Metrics**:
  * **Degassing / Resting Tracker**: Calculates remaining days until coffee reaches peak flavor window based on roast date + resting period.
  * **Weight Loss & Yield Calculator**: Computes green bean weight shrinkage:
    $$\text{Shrinkage \%} = \frac{\text{Total Green Input Weight} - \text{Roasted Output Weight}}{\text{Total Green Input Weight}} \times 100$$
  * **Automated Raw Stock Deduction**: Deducts green bean raw materials automatically when the batch transitions to `completed`, and restores stock if cancelled.

### Module G: Contacts, Fixed Assets & Store Configuration
* **Contacts**: Separate directories for Suppliers and Customers.
* **Store Assets**: Tracks equipment (espresso machines, grinders, ovens) with purchase date, cost, salvage value, useful life, and computed straight-line annual depreciation.
* **Settings**: Store name, address, tax percentage, currency symbol (`Rp`), invoice prefix, and footer message.
* **Localization**: Full instant toggle between Indonesian (`id`) and English (`en`).

---

## 4. Business Rules & Data Integrity

1. **Referential Integrity**:
   * Cannot delete a raw material if it is actively used in any product recipe.
   * Cannot delete a product if it is actively used as an ingredient in another product's recipe.
   * Cannot delete a category or supplier that has active linked items.
2. **Snapshot Immutability**:
   * Transactions must store a permanent snapshot of item names, quantities, selling prices, and HPP at the time of sale. Future raw material price changes must never alter historical profit reports.
3. **Circular Reference Prevention**:
   * Recipe building must reject assigning a product to its own recipe or creating circular dependency chains (Product A depends on Product B which depends on Product A).

---

## 5. Visual Direction & UX Requirements

* **Theme**: "Aurora Dark UI" — sophisticated, high-contrast dark slate (`from-gray-900 to-slate-900`) with subtle borders (`border-slate-700/60`), muted text (`text-slate-400`), crisp headers (`text-slate-100`), and indigo/purple accents (`bg-indigo-600`, `text-purple-400`).
* **Layout**:
  * Persistent top navigation bar displaying store identity, category dropdown menus, quick stats link, and an ID/EN language toggle switch.
  * Responsive split-view on POS: 65% Product Grid on the left, 35% Sticky Cart & Order Summary on the right.
  * Bottom floating action button (FAB) for quick item creation in management views.
* **Feedback**: Replace native browser `alert()` and `confirm()` with custom in-app Toast notifications and Confirmation Dialogs.

---

## 6. Technical Stack Expectations

* **Runtime**: React 19+ with Vite and TypeScript (strict mode).
* **Styling**: Tailwind CSS utility classes directly in code (avoid relying on uncompiled CDN script in production).
* **Persistence**:
  * Structure the data access layer via a clean repository/service interface (`services/api.ts` or similar).
  * Can use browser storage (IndexedDB or LocalStorage) for zero-setup demo, but write clean async methods (`async/await`) that can be swapped with a real backend (Firebase Firestore or PostgreSQL) with minimal friction.
* **Date Handling**: Store dates as ISO strings or Date objects, ensuring clean hydration upon loading.

---

## 7. What NOT to Build (Guardrails)

* **DO NOT** build complex microservices or separate backend containers if client-side or serverless API routes suffice.
* **DO NOT** integrate unsolicited LLM / generative AI features into the critical checkout path. All financial calculations, HPP, and inventory math must be 100% deterministic arithmetic.
* **DO NOT** use complex external state libraries (Redux, Mobx) unless necessary; clean React hooks, Context, or lightweight stores (Zustand) are preferred.
* **DO NOT** create empty placeholder files or dead stub components.

---

## 8. Definition of Done

1. A user can create raw materials, set up an intermediate sub-product (e.g. Espresso Shot), and create a sellable beverage (e.g. Cappuccino) that uses it.
2. The POS register displays Cappuccino with its real-time calculated virtual stock.
3. Completing a sale for 2 cups of Cappuccino immediately reduces the exact required quantities of raw coffee beans, water, and milk in the inventory.
4. The transaction log displays the exact total revenue, tax, total cost (HPP), and gross profit.
5. Creating a Purchase Order and receiving goods correctly increases warehouse inventory.
6. Creating a completed Roasting Production batch properly computes weight loss percentage and resting date countdown, and deducts input materials.
7. Switching language between ID and EN updates 100% of the UI labels instantly.
```
