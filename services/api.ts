import { Product, Category, RawMaterial, RawMaterialCategory, SaleTransaction, AppSettings, CartItem, Supplier, Customer, PurchaseOrder, PurchaseOrderItem, StockAdjustment, StoreAsset, ProductionBatch } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_RAW_MATERIALS, INITIAL_RAW_MATERIAL_CATEGORIES, INITIAL_SUPPLIERS, INITIAL_CUSTOMERS, INITIAL_PURCHASE_ORDERS, INITIAL_STOCK_ADJUSTMENTS, INITIAL_STORE_ASSETS, INITIAL_PRODUCTION_BATCHES } from '../constants';
import { getFlattenedRawMaterials } from '../lib/bomEngine';

// --- LocalStorage Utility Functions ---

const KEYS = {
    PRODUCTS: 'products',
    RAW_MATERIALS: 'rawMaterials',
    CATEGORIES: 'categories',
    RAW_MATERIAL_CATEGORIES: 'rawMaterialCategories',
    SALES_HISTORY: 'salesHistory',
    INVOICE_COUNTER: 'invoiceCounter',
    APP_SETTINGS: 'appSettings',
    SUPPLIERS: 'suppliers',
    CUSTOMERS: 'customers',
    PURCHASE_ORDERS: 'purchaseOrders',
    PO_COUNTER: 'poCounter',
    STOCK_ADJUSTMENTS: 'stockAdjustments',
    ADJUSTMENT_COUNTER: 'adjustmentCounter',
    STORE_ASSETS: 'storeAssets',
    PRODUCTION_BATCHES: 'productionBatches',
    PRODUCTION_COUNTER: 'productionCounter',
};

const initialAppSettings: AppSettings = {
    storeName: 'Loja-62',
    ownerName: '',
    tagline: '',
    storeType: '',
    address: '',
    city: '',
    province: '',
    logoUrl: '',
    taxRate: 11,
    currencySymbol: 'Rp',
    invoicePrefix: 'INV-',
    invoiceFooter: 'Terima kasih telah berbelanja!',
};

// Generic function to get data from localStorage or return initial value
const getData = <T>(key: string, initialValue: T): T => {
    try {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            const parsed = JSON.parse(storedValue);
             if (Array.isArray(parsed)) {
                // Re-hydrate dates for relevant types
                if (key === KEYS.SALES_HISTORY || key === KEYS.STOCK_ADJUSTMENTS || key === KEYS.STORE_ASSETS) {
                    return parsed.map((item: any) => ({ ...item, timestamp: new Date(item.timestamp), date: new Date(item.date), purchaseDate: new Date(item.purchaseDate) })) as T;
                }
                if (key === KEYS.PURCHASE_ORDERS) {
                    return parsed.map((po: any) => ({
                        ...po,
                        orderDate: new Date(po.orderDate),
                        expectedDeliveryDate: po.expectedDeliveryDate ? new Date(po.expectedDeliveryDate) : undefined,
                        receivedDate: po.receivedDate ? new Date(po.receivedDate) : undefined,
                    })) as T;
                }
                if (key === KEYS.PRODUCTION_BATCHES) {
                    return parsed.map((batch: any) => ({
                        ...batch,
                        productionDate: new Date(batch.productionDate),
                        roastDate: batch.roastDate ? new Date(batch.roastDate) : undefined,
                    })) as T;
                }
             }
            return parsed;
        }
        localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return initialValue;
    }
};

// Generic function to save data to localStorage
const saveData = <T>(key: string, data: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Error saving ${key} to localStorage`, error);
    }
};

// --- API Service Functions ---

// Products
export const getProducts = async (): Promise<Product[]> => getData(KEYS.PRODUCTS, INITIAL_PRODUCTS);
export const saveProduct = async (productData: Omit<Product, 'id'>, id?: number): Promise<void> => {
    const products = await getProducts();
    if (id) {
        const updatedProducts = products.map(p => p.id === id ? { ...p, ...productData, id } : p);
        saveData(KEYS.PRODUCTS, updatedProducts);
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        const newProduct = { ...productData, id: newId };
        saveData(KEYS.PRODUCTS, [...products, newProduct]);
    }
};
export const deleteProduct = async (productId: number, t: (key: string) => string): Promise<void> => {
    const products = await getProducts();
    if (products.some(p => p.recipe.some(r => r.itemType === 'product' && r.itemId === productId))) {
        throw new Error(t('errorDeleteProductInRecipe'));
    }
    saveData(KEYS.PRODUCTS, products.filter(p => p.id !== productId));
};

// Raw Materials
export const getRawMaterials = async (): Promise<RawMaterial[]> => getData(KEYS.RAW_MATERIALS, INITIAL_RAW_MATERIALS);
export const saveRawMaterial = async (materialData: Omit<RawMaterial, 'id'>, id?: number): Promise<void> => {
    const materials = await getRawMaterials();
    if (id) {
        const updatedMaterials = materials.map(m => m.id === id ? { ...m, ...materialData, id } : m);
        saveData(KEYS.RAW_MATERIALS, updatedMaterials);
    } else {
        const newId = materials.length > 0 ? Math.max(...materials.map(m => m.id)) + 1 : 1;
        const newMaterial = { ...materialData, id: newId };
        saveData(KEYS.RAW_MATERIALS, [...materials, newMaterial]);
    }
};
export const deleteRawMaterial = async (materialId: number, t: (key: string) => string): Promise<void> => {
    const products = await getProducts();
    if (products.some(p => p.recipe.some(r => r.itemType === 'raw-material' && r.itemId === materialId))) {
        throw new Error(t('errorDeleteRawMaterialInRecipe'));
    }
    const materials = await getRawMaterials();
    saveData(KEYS.RAW_MATERIALS, materials.filter(m => m.id !== materialId));
};

// Categories
export const getCategories = async (): Promise<Category[]> => getData(KEYS.CATEGORIES, INITIAL_CATEGORIES);
export const saveCategory = async (categoryData: Omit<Category, 'id'>, id?: number): Promise<void> => {
    const categories = await getCategories();
    if (id) {
        saveData(KEYS.CATEGORIES, categories.map(c => c.id === id ? { ...c, ...categoryData, id } : c));
    } else {
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        saveData(KEYS.CATEGORIES, [...categories, { ...categoryData, id: newId }]);
    }
};
export const deleteCategory = async (categoryId: number, t: (key: string) => string): Promise<void> => {
    const products = await getProducts();
    if (products.some(p => p.categoryId === categoryId)) {
        throw new Error(t('errorDeleteCategoryInUse'));
    }
    const categories = await getCategories();
    saveData(KEYS.CATEGORIES, categories.filter(c => c.id !== categoryId));
};

// Raw Material Categories
export const getRawMaterialCategories = async (): Promise<RawMaterialCategory[]> => getData(KEYS.RAW_MATERIAL_CATEGORIES, INITIAL_RAW_MATERIAL_CATEGORIES);
export const saveRawMaterialCategory = async (categoryData: Omit<RawMaterialCategory, 'id'>, id?: number): Promise<void> => {
    const categories = await getRawMaterialCategories();
    if (id) {
        saveData(KEYS.RAW_MATERIAL_CATEGORIES, categories.map(c => c.id === id ? { ...c, ...categoryData, id } : c));
    } else {
        const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
        saveData(KEYS.RAW_MATERIAL_CATEGORIES, [...categories, { ...categoryData, id: newId }]);
    }
};
export const deleteRawMaterialCategory = async (categoryId: number, t: (key: string) => string): Promise<void> => {
    const materials = await getRawMaterials();
    if (materials.some(m => m.categoryId === categoryId)) {
        throw new Error(t('errorDeleteMaterialCategoryInUse'));
    }
    const categories = await getRawMaterialCategories();
    saveData(KEYS.RAW_MATERIAL_CATEGORIES, categories.filter(c => c.id !== categoryId));
};

// Suppliers
export const getSuppliers = async (): Promise<Supplier[]> => getData(KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
export const saveSupplier = async (supplierData: Omit<Supplier, 'id'>, id?: number): Promise<void> => {
    const suppliers = await getSuppliers();
    if (id) {
        saveData(KEYS.SUPPLIERS, suppliers.map(s => s.id === id ? { ...s, ...supplierData, id } : s));
    } else {
        const newId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
        saveData(KEYS.SUPPLIERS, [...suppliers, { ...supplierData, id: newId }]);
    }
};
export const deleteSupplier = async (supplierId: number, t: (key: string) => string): Promise<void> => {
    const rawMaterials = await getRawMaterials();
    if (rawMaterials.some(rm => rm.supplierId === supplierId)) {
        throw new Error(t('errorDeleteSupplierInUse'));
    }
    const suppliers = await getSuppliers();
    saveData(KEYS.SUPPLIERS, suppliers.filter(s => s.id !== supplierId));
};

// Customers
export const getCustomers = async (): Promise<Customer[]> => getData(KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
export const saveCustomer = async (customerData: Omit<Customer, 'id'>, id?: number): Promise<void> => {
    const customers = await getCustomers();
    if (id) {
        saveData(KEYS.CUSTOMERS, customers.map(c => c.id === id ? { ...c, ...customerData, id } : c));
    } else {
        const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        saveData(KEYS.CUSTOMERS, [...customers, { ...customerData, id: newId }]);
    }
};
export const deleteCustomer = async (customerId: number): Promise<void> => {
    const customers = await getCustomers();
    saveData(KEYS.CUSTOMERS, customers.filter(c => c.id !== customerId));
};

// Sales & Settings
export const getSalesHistory = async (): Promise<SaleTransaction[]> => getData(KEYS.SALES_HISTORY, []);
export const getInvoiceCounter = async (): Promise<number> => getData(KEYS.INVOICE_COUNTER, 1);
export const getSettings = async (): Promise<AppSettings> => {
    const storedValue = localStorage.getItem(KEYS.APP_SETTINGS);
    if (storedValue) {
        try {
            const storedSettings = JSON.parse(storedValue);
            return { ...initialAppSettings, ...storedSettings };
        } catch (error) {
            console.error(`Error reading ${KEYS.APP_SETTINGS} from localStorage`, error);
        }
    }
    saveData(KEYS.APP_SETTINGS, initialAppSettings);
    return initialAppSettings;
};
export const saveSettings = async (settings: AppSettings): Promise<void> => saveData(KEYS.APP_SETTINGS, settings);

// Purchase Orders
export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => getData(KEYS.PURCHASE_ORDERS, INITIAL_PURCHASE_ORDERS);
const getPOCounter = async (): Promise<number> => getData(KEYS.PO_COUNTER, 1);
export const savePurchaseOrder = async (poData: Omit<PurchaseOrder, 'id' | 'totalCost'>, rawMaterials: RawMaterial[], id?: string): Promise<void> => {
    const purchaseOrders = await getPurchaseOrders();
    const totalCost = poData.items.reduce((sum, item) => sum + (item.costPerUnit * item.quantityOrdered), 0);
    
    if (id) {
        const updatedPOs = purchaseOrders.map(po => po.id === id ? { ...po, ...poData, totalCost, id } : po);
        saveData(KEYS.PURCHASE_ORDERS, updatedPOs);
    } else {
        const poCounter = await getPOCounter();
        const newId = `PO-${String(poCounter).padStart(4, '0')}`;
        const newPO = { ...poData, id: newId, totalCost };
        saveData(KEYS.PURCHASE_ORDERS, [...purchaseOrders, newPO]);
        saveData(KEYS.PO_COUNTER, poCounter + 1);
    }
};
export const receivePurchaseOrderItems = async (poId: string, itemsToReceive: { rawMaterialId: number, quantity: number }[]): Promise<void> => {
    const purchaseOrders = await getPurchaseOrders();
    const rawMaterials = await getRawMaterials();
    const poIndex = purchaseOrders.findIndex(p => p.id === poId);
    if (poIndex === -1) return;

    const po = { ...purchaseOrders[poIndex] };
    
    // Update received quantities in PO
    itemsToReceive.forEach(itemToReceive => {
        const poItem = po.items.find(i => i.rawMaterialId === itemToReceive.rawMaterialId);
        if (poItem) {
            poItem.quantityReceived += itemToReceive.quantity;
        }

        // Update raw material stock
        const materialIndex = rawMaterials.findIndex(m => m.id === itemToReceive.rawMaterialId);
        if (materialIndex !== -1) {
            rawMaterials[materialIndex].stock += itemToReceive.quantity;
        }
    });

    // Update PO status
    const totalOrdered = po.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
    const totalReceived = po.items.reduce((sum, item) => sum + item.quantityReceived, 0);

    if (totalReceived >= totalOrdered) {
        po.status = 'completed';
        po.receivedDate = new Date();
    } else if (totalReceived > 0) {
        po.status = 'partially-received';
    }

    purchaseOrders[poIndex] = po;

    saveData(KEYS.PURCHASE_ORDERS, purchaseOrders);
    saveData(KEYS.RAW_MATERIALS, rawMaterials);
};

// Stock Adjustments
export const getStockAdjustments = async (): Promise<StockAdjustment[]> => getData(KEYS.STOCK_ADJUSTMENTS, INITIAL_STOCK_ADJUSTMENTS);
const getAdjustmentCounter = async (): Promise<number> => getData(KEYS.ADJUSTMENT_COUNTER, 1);
export const saveStockAdjustment = async (adjustmentData: Omit<StockAdjustment, 'id' | 'date'>, t: (key: string) => string): Promise<void> => {
    const rawMaterials = await getRawMaterials();
    const stockAdjustments = await getStockAdjustments();
    const adjustmentCounter = await getAdjustmentCounter();
    
    const updatedMaterials = [...rawMaterials];
    const itemsWithPreviousStock = [];

    for (const item of adjustmentData.items) {
        const materialIndex = updatedMaterials.findIndex(m => m.id === item.rawMaterialId);
        if (materialIndex === -1) continue;

        const material = updatedMaterials[materialIndex];
        const previousStock = material.stock;

        if (material.stock + item.quantity < 0) {
            throw new Error(t('errorNegativeStock').replace('{itemName}', material.name));
        }
        
        material.stock += item.quantity;
        itemsWithPreviousStock.push({ ...item, previousStock });
    }

    const newId = `ADJ-${String(adjustmentCounter).padStart(4, '0')}`;
    const newAdjustment: StockAdjustment = {
        ...adjustmentData,
        id: newId,
        date: new Date(),
        items: itemsWithPreviousStock,
    };

    saveData(KEYS.RAW_MATERIALS, updatedMaterials);
    saveData(KEYS.STOCK_ADJUSTMENTS, [newAdjustment, ...stockAdjustments]);
    saveData(KEYS.ADJUSTMENT_COUNTER, adjustmentCounter + 1);
};

// Store Assets
export const getStoreAssets = async (): Promise<StoreAsset[]> => getData(KEYS.STORE_ASSETS, INITIAL_STORE_ASSETS);
export const saveStoreAsset = async (assetData: Omit<StoreAsset, 'id'>, id?: number): Promise<void> => {
    const assets = await getStoreAssets();
    if (id) {
        saveData(KEYS.STORE_ASSETS, assets.map(a => a.id === id ? { ...a, ...assetData, id } : a));
    } else {
        const newId = assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1;
        saveData(KEYS.STORE_ASSETS, [...assets, { ...assetData, id: newId }]);
    }
};
export const deleteStoreAsset = async (assetId: number): Promise<void> => {
    const assets = await getStoreAssets();
    saveData(KEYS.STORE_ASSETS, assets.filter(a => a.id !== assetId));
};

// Production Batches (Batch Roasting / Work Orders)
export const getProductionBatches = async (): Promise<ProductionBatch[]> => getData(KEYS.PRODUCTION_BATCHES, INITIAL_PRODUCTION_BATCHES);
export const getProductionCounter = async (): Promise<number> => getData(KEYS.PRODUCTION_COUNTER, 2);

export const saveProductionBatch = async (
    batchData: Omit<ProductionBatch, 'id'>,
    id?: string
): Promise<{ updatedRawMaterials?: RawMaterial[], newBatch: ProductionBatch }> => {
    const batches = await getProductionBatches();
    const rawMaterials = await getRawMaterials();
    const updatedMaterials = [...rawMaterials];
    let newBatch: ProductionBatch;

    if (id) {
        const existingBatch = batches.find(b => b.id === id);
        newBatch = { ...batchData, id };
        
        // If changing to 'completed' from non-completed -> deduct inputs
        if (newBatch.status === 'completed' && existingBatch?.status !== 'completed') {
            newBatch.inputs.forEach(input => {
                if (input.itemType === 'raw-material') {
                    const idx = updatedMaterials.findIndex(m => m.id === input.itemId);
                    if (idx !== -1) {
                        const deduction = input.actualQuantity || input.plannedQuantity;
                        updatedMaterials[idx].stock -= deduction;
                    }
                }
            });
            saveData(KEYS.RAW_MATERIALS, updatedMaterials);
        }
        // If previously completed and now changed to cancelled/draft -> revert stock
        else if (existingBatch?.status === 'completed' && newBatch.status !== 'completed') {
            existingBatch.inputs.forEach(input => {
                if (input.itemType === 'raw-material') {
                    const idx = updatedMaterials.findIndex(m => m.id === input.itemId);
                    if (idx !== -1) {
                        const restoreQty = input.actualQuantity || input.plannedQuantity;
                        updatedMaterials[idx].stock += restoreQty;
                    }
                }
            });
            saveData(KEYS.RAW_MATERIALS, updatedMaterials);
        }

        saveData(KEYS.PRODUCTION_BATCHES, batches.map(b => b.id === id ? newBatch : b));
    } else {
        const counter = await getProductionCounter();
        const generatedId = `PRD-${String(counter).padStart(4, '0')}`;
        newBatch = { ...batchData, id: generatedId };

        if (newBatch.status === 'completed') {
            newBatch.inputs.forEach(input => {
                if (input.itemType === 'raw-material') {
                    const idx = updatedMaterials.findIndex(m => m.id === input.itemId);
                    if (idx !== -1) {
                        const deduction = input.actualQuantity || input.plannedQuantity;
                        updatedMaterials[idx].stock -= deduction;
                    }
                }
            });
            saveData(KEYS.RAW_MATERIALS, updatedMaterials);
        }

        saveData(KEYS.PRODUCTION_BATCHES, [newBatch, ...batches]);
        saveData(KEYS.PRODUCTION_COUNTER, counter + 1);
    }

    return { updatedRawMaterials: updatedMaterials, newBatch };
};

export const deleteProductionBatch = async (batchId: string): Promise<{ updatedRawMaterials?: RawMaterial[] }> => {
    const batches = await getProductionBatches();
    const batchToDelete = batches.find(b => b.id === batchId);
    let updatedMaterials: RawMaterial[] | undefined;

    if (batchToDelete && batchToDelete.status === 'completed') {
        const rawMaterials = await getRawMaterials();
        updatedMaterials = [...rawMaterials];
        batchToDelete.inputs.forEach(input => {
            if (input.itemType === 'raw-material') {
                const idx = updatedMaterials!.findIndex(m => m.id === input.itemId);
                if (idx !== -1) {
                    const restoreQty = input.actualQuantity || input.plannedQuantity;
                    updatedMaterials![idx].stock += restoreQty;
                }
            }
        });
        saveData(KEYS.RAW_MATERIALS, updatedMaterials);
    }

    saveData(KEYS.PRODUCTION_BATCHES, batches.filter(b => b.id !== batchId));
    return { updatedRawMaterials };
};


// Complex Business Logic: Checkout
export const processSale = async (
    cart: CartItem[],
    products: Product[],
    settings: AppSettings,
    invoiceCounter: number,
    paymentStatus: 'paid' | 'unpaid' = 'paid',
    customerId?: number,
    channel: 'pos' | 'commerce' = 'pos',
    paymentMethod?: string
) => {
    const rawMaterials = await getRawMaterials();
    const materialDeductions = new Map<number, number>();

    cart.forEach(cartItem => {
        const product = products.find(p => p.id === cartItem.id);
        if (product) {
            const itemDeductions = getFlattenedRawMaterials(product, cartItem.quantity, products);
            itemDeductions.forEach((qty, materialId) => {
                const current = materialDeductions.get(materialId) || 0;
                materialDeductions.set(materialId, current + qty);
            });
        }
    });

    const updatedRawMaterials = [...rawMaterials];
    for (const [materialId, totalDeduction] of materialDeductions.entries()) {
        const materialIndex = updatedRawMaterials.findIndex(m => m.id === materialId);
        if (materialIndex !== -1) {
            updatedRawMaterials[materialIndex].stock -= totalDeduction;
        }
    }
    saveData(KEYS.RAW_MATERIALS, updatedRawMaterials);

    const invoiceNumber = `${settings.invoicePrefix || 'INV-'}${String(invoiceCounter).padStart(4, '0')}`;
    const subtotal = cart.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0);
    const tax = subtotal * (settings.taxRate / 100);
    const total = subtotal + tax;
    const totalHpp = cart.reduce((acc, item) => acc + item.hpp * item.quantity, 0);

    const newTransaction: SaleTransaction = {
      id: invoiceNumber,
      timestamp: new Date(),
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        sellPrice: item.sellPrice,
        hpp: item.hpp,
        selectedOptions: item.selectedOptions,
        notes: item.notes,
      })),
      subtotal,
      tax,
      total,
      totalHpp,
      profit: subtotal - totalHpp,
      paymentStatus,
      customerId,
      channel,
      paymentMethod,
    };
    
    const salesHistory = await getSalesHistory();
    const updatedSalesHistory = [newTransaction, ...salesHistory];
    saveData(KEYS.SALES_HISTORY, updatedSalesHistory);
    saveData(KEYS.INVOICE_COUNTER, invoiceCounter + 1);
    
    return { updatedRawMaterials, newTransaction };
};