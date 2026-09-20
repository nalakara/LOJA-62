export interface Category {
  id: number;
  name: string;
}

export interface RawMaterialCategory {
  id: number;
  name: string;
}

export type Unit = 'gram' | 'ml' | 'pcs';

export interface RawMaterial {
  id: number;
  name: string;
  categoryId: number;
  stock: number;
  unit: Unit;
  costPerUnit: number;
  supplierId?: number;
}

export interface RawMaterialWithDetails extends RawMaterial {
    categoryName: string;
    supplierName?: string;
}

export interface RecipeItem {
  itemId: number;
  itemType: 'raw-material' | 'product';
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  categoryId: number;
  recipe: RecipeItem[];
  sellPrice: number;
  imageUrl: string;
  directLaborCost?: number;
  productionOverheadCost?: number;
}

export interface ProductWithDetails extends Product {
    stock: number;
    materialCost: number;
    hpp: number;
    categoryName: string;
}

export interface CartItem extends ProductWithDetails {
  quantity: number;
}

export interface SoldItem {
  productId: number;
  name: string;
  quantity: number;
  sellPrice: number;
  hpp: number;
}

export interface SaleTransaction {
  id: string;
  timestamp: Date;
  items: SoldItem[];
  subtotal: number;
  tax: number;
  total: number;
  totalHpp: number;
  profit: number;
  customerId?: number;
  paymentStatus: 'paid' | 'unpaid';
}

export interface AppSettings {
  storeName: string;
  ownerName: string;
  tagline: string;
  storeType: string;
  address: string;
  city: string;
  province: string;
  logoUrl: string;
  taxRate: number;
  currencySymbol: string;
  invoicePrefix: string;
  invoiceFooter: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
}

export type POStatus = 'draft' | 'ordered' | 'partially-received' | 'completed' | 'cancelled';

export interface PurchaseOrderItem {
  rawMaterialId: number;
  quantityOrdered: number;
  quantityReceived: number;
  costPerUnit: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: number;
  items: PurchaseOrderItem[];
  status: POStatus;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  receivedDate?: Date;
  totalCost: number;
  notes?: string;
}

export type StockAdjustmentType = 'wastage' | 'correction' | 'internal-use' | 'return';

export interface StockAdjustmentItem {
  rawMaterialId: number;
  quantity: number; // can be positive or negative
  previousStock: number;
}

export interface StockAdjustment {
  id: string;
  date: Date;
  type: StockAdjustmentType;
  items: StockAdjustmentItem[];
  notes?: string;
}

export interface StoreAsset {
  id: number;
  name: string;
  purchaseDate: Date;
  purchasePrice: number;
  residualValue: number;
  usefulLife: number; // in years
}

export type ProductionStatus = 'draft' | 'in-progress' | 'completed' | 'cancelled';

export interface ProductionInputItem {
  itemId: number;
  itemType: 'raw-material' | 'product';
  plannedQuantity: number;
  actualQuantity: number;
  unit?: string;
  costPerUnit?: number;
}

export interface ProductionBatch {
  id: string; // e.g. PRD-0001
  batchNumber: string; // e.g. LOT-20260920-01
  targetProductId: number;
  targetQuantity: number; // planned output
  actualQuantity: number; // actual measured output
  productionDate: Date;
  roastDate?: Date;
  restingDays?: number; // resting period in days (e.g. 7)
  operatorName?: string;
  status: ProductionStatus;
  inputs: ProductionInputItem[];
  directLaborCost?: number;
  overheadCost?: number;
  totalCost?: number;
  unitCost?: number;
  yieldPercentage?: number;
  weightLossPercentage?: number; // roasting shrinkage %
  notes?: string;
}

export type View = 'pos' | 'inventory' | 'materials' | 'dashboard' | 'categories' | 'material-categories' | 'reports' | 'store-profile' | 'suppliers' | 'customers' | 'purchase-orders' | 'stock-adjustments' | 'store-assets' | 'invoice-settings' | 'production';