import { Product, Category, RawMaterial, Unit, RawMaterialCategory, Supplier, Customer, PurchaseOrder, StockAdjustment, StockAdjustmentType, StoreAsset, ProductionBatch, ProductionStatus } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: 'Kopi Panas' },
  { id: 2, name: 'Kopi Dingin' },
  { id: 3, name: 'Jajanan' },
  { id: 4, name: 'Produk Setengah Jadi' },
  { id: 5, name: 'Biji Kopi (Retail)' },
  { id: 6, name: 'Layanan & Roastery' },
];

export const UNITS: Unit[] = ['gram', 'ml', 'pcs'];

export const INITIAL_RAW_MATERIAL_CATEGORIES: RawMaterialCategory[] = [
  { id: 1, name: 'Biji Kopi' },
  { id: 2, name: 'Susu & Sirup' },
  { id: 3, name: 'Bahan Pokok' },
  { id: 4, name: 'Lainnya' },
];

export const INITIAL_RAW_MATERIALS: RawMaterial[] = [
    { id: 1, name: 'Biji Kopi Arabika', categoryId: 1, stock: 1000, unit: 'gram', costPerUnit: 200, supplierId: 1 },
    { id: 2, name: 'Air Mineral', categoryId: 4, stock: 50000, unit: 'ml', costPerUnit: 2 },
    { id: 3, name: 'Susu Segar', categoryId: 2, stock: 10000, unit: 'ml', costPerUnit: 15, supplierId: 2 },
    { id: 4, name: 'Gula Pasir', categoryId: 3, stock: 5000, unit: 'gram', costPerUnit: 15, supplierId: 2 },
    { id: 5, name: 'Sirup Karamel', categoryId: 2, stock: 2000, unit: 'ml', costPerUnit: 50 },
    { id: 6, name: 'Bubuk Coklat', categoryId: 3, stock: 1000, unit: 'gram', costPerUnit: 40 },
    { id: 7, name: 'Tepung Terigu', categoryId: 3, stock: 10000, unit: 'gram', costPerUnit: 10 },
    { id: 8, name: 'Telur', categoryId: 3, stock: 100, unit: 'pcs', costPerUnit: 2000 },
    { id: 9, name: 'Mentega', categoryId: 3, stock: 2000, unit: 'gram', costPerUnit: 25 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Espresso Shot',
    categoryId: 4, // Produk Setengah Jadi
    recipe: [
        { itemId: 1, itemType: 'raw-material', quantity: 18 }, // 18g Biji Kopi
        { itemId: 2, itemType: 'raw-material', quantity: 60 }, // 60ml Air
    ],
    sellPrice: 0, // Not for direct sale
    imageUrl: 'https://picsum.photos/seed/espresso/400/300',
    directLaborCost: 500,
    productionOverheadCost: 200,
    itemType: 'product',
  },
  {
    id: 2,
    name: 'Cappuccino',
    categoryId: 1, // Kopi Panas
    recipe: [
        { itemId: 1, itemType: 'product', quantity: 1 }, // 1 Espresso Shot
        { itemId: 3, itemType: 'raw-material', quantity: 150 }, // 150ml Susu Segar
    ],
    sellPrice: 25000,
    imageUrl: 'https://picsum.photos/seed/cappuccino/400/300',
    directLaborCost: 1500,
    productionOverheadCost: 500,
    itemType: 'product',
    description: 'Espresso bold berpadu dengan steamed milk lembut dan foam susu tebal.',
    options: [
      { name: 'Sweetness', choices: ['Normal', 'Less Sweet', 'No Sugar'] },
      { name: 'Milk Option', choices: ['Fresh Milk', 'Oat Milk'] },
    ],
  },
  {
    id: 3,
    name: 'Iced Latte',
    categoryId: 2, // Kopi Dingin
    recipe: [
        { itemId: 1, itemType: 'product', quantity: 1 }, // 1 Espresso Shot
        { itemId: 3, itemType: 'raw-material', quantity: 180 }, // 180ml Susu Segar
    ],
    sellPrice: 28000,
    imageUrl: 'https://picsum.photos/seed/latte/400/300',
    directLaborCost: 1200,
    productionOverheadCost: 400,
    itemType: 'product',
    description: 'Kopi susu dingin segar dengan rasa creamy yang seimbang.',
    options: [
      { name: 'Ice Level', choices: ['Normal Ice', 'Less Ice'] },
      { name: 'Sweetness', choices: ['Normal', 'Less Sweet', 'No Sugar'] },
    ],
  },
  {
    id: 4,
    name: 'Croissant',
    categoryId: 3, // Jajanan
    recipe: [
        { itemId: 7, itemType: 'raw-material', quantity: 100 },
        { itemId: 8, itemType: 'raw-material', quantity: 1 },
        { itemId: 9, itemType: 'raw-material', quantity: 50 },
        { itemId: 4, itemType: 'raw-material', quantity: 20 },
    ],
    sellPrice: 18000,
    imageUrl: 'https://picsum.photos/seed/croissant/400/300',
    directLaborCost: 3000,
    productionOverheadCost: 1000,
    itemType: 'product',
    description: 'Pastry mentega renyah dan lembut dipanggang setiap pagi.',
  },
  {
    id: 5,
    name: 'Gayo Arabica Beans (250g)',
    categoryId: 5, // Biji Kopi (Retail)
    recipe: [
        { itemId: 1, itemType: 'raw-material', quantity: 250 },
    ],
    sellPrice: 85000,
    imageUrl: 'https://picsum.photos/seed/gayobeans/400/300',
    directLaborCost: 5000,
    productionOverheadCost: 2000,
    itemType: 'product',
    description: 'Single origin Arabika Gayo dengan notes floral, citrus, dan caramel sweetness.',
    options: [
      { name: 'Grind Size', choices: ['Whole Bean (Biji Utuh)', 'Coarse (Manual Brew/French Press)', 'Medium (V60/Aeropress)', 'Fine (Espresso/Moka Pot)'] },
      { name: 'Roast Profile', choices: ['Medium Roast', 'Medium-Dark Roast'] },
    ],
  },
  {
    id: 6,
    name: 'Jasa Custom Roasting (per Batch 1kg)',
    categoryId: 6, // Layanan & Roastery
    recipe: [],
    sellPrice: 45000,
    imageUrl: 'https://picsum.photos/seed/customroast/400/300',
    directLaborCost: 25000,
    productionOverheadCost: 10000,
    itemType: 'service',
    description: 'Layanan jasa sangrai biji kopi mentah (green bean) pelanggan dengan profil sangrai yang dapat disesuaikan.',
    options: [
      { name: 'Target Profile', choices: ['Light-Medium (Filter / Fruity)', 'Medium Roast (Balance)', 'Dark Roast (Bold / Espresso)'] },
      { name: 'Packaging', choices: ['Standard Valve Pouch', 'Vacuum Bag'] },
    ],
  },
  {
    id: 7,
    name: 'Jasa Pembersihan & Kalibrasi Grinder Mesin Kopi',
    categoryId: 6, // Layanan & Roastery
    recipe: [],
    sellPrice: 75000,
    imageUrl: 'https://picsum.photos/seed/grindercleaning/400/300',
    directLaborCost: 40000,
    productionOverheadCost: 15000,
    itemType: 'service',
    description: 'Layanan servis deep cleaning burr, alignment, dan kalibrasi akurasi gilingan mesin kopi espresso / commercial grinder.',
    options: [
      { name: 'Service Type', choices: ['In-store Drop-off', 'On-site Inspection'] },
    ],
  },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'Pemasok Kopi Jaya', contactPerson: 'Budi Santoso', phone: '081234567890', email: 'budi@kopijaya.com', address: 'Jl. Kopi No. 1, Jakarta' },
  { id: 2, name: 'Susu Murni Sejahtera', contactPerson: 'Siti Aminah', phone: '082345678901', email: 'siti@sususejahtera.com', address: 'Jl. Susu No. 2, Bandung' },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Andi Pratama', phone: '085678901234', email: 'andi.p@email.com' },
  { id: 2, name: 'Rina Wati', phone: '087890123456', email: 'rina.w@email.com' },
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];

export const INITIAL_STOCK_ADJUSTMENTS: StockAdjustment[] = [];

export const INITIAL_STORE_ASSETS: StoreAsset[] = [];

export const ADJUSTMENT_TYPES: StockAdjustmentType[] = ['wastage', 'correction', 'internal-use', 'return'];

export const PRODUCTION_STATUSES: ProductionStatus[] = ['draft', 'in-progress', 'completed', 'cancelled'];

export const INITIAL_PRODUCTION_BATCHES: ProductionBatch[] = [
  {
    id: 'PRD-0001',
    batchNumber: 'LOT-20260918-01',
    targetProductId: 1, // Espresso Shot
    targetQuantity: 100,
    actualQuantity: 96,
    productionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    roastDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    restingDays: 7,
    operatorName: 'Master Roaster Budi',
    status: 'completed',
    inputs: [
      { itemId: 1, itemType: 'raw-material', plannedQuantity: 1800, actualQuantity: 1850, unit: 'gram', costPerUnit: 200 },
      { itemId: 2, itemType: 'raw-material', plannedQuantity: 6000, actualQuantity: 6000, unit: 'ml', costPerUnit: 2 },
    ],
    directLaborCost: 50000,
    overheadCost: 20000,
    totalCost: 452000,
    unitCost: 4708,
    yieldPercentage: 96,
    weightLossPercentage: 15.5,
    notes: 'Medium Roast profil Gayo Honey. First crack di 09:15, drop temp 208°C. Karakter sweet fruity.',
  }
];