import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CategoryTabs from './components/CategoryTabs';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Modal from './components/Modal';
import ProductForm from './components/ProductForm';
import Inventory from './components/Inventory';
import RawMaterials from './components/RawMaterials';
import RawMaterialForm from './components/RawMaterialForm';
import Dashboard from './components/Dashboard';
import Categories from './components/Categories';
import CategoryForm from './components/CategoryForm';
import RawMaterialCategories from './components/RawMaterialCategories';
import RawMaterialCategoryForm from './components/RawMaterialCategoryForm';
import Settings from './components/Settings';
import InvoiceSettings from './components/InvoiceSettings';
import SalesHistory from './components/SalesHistory';
import TransactionDetailModal from './components/TransactionDetailModal';
import Suppliers from './components/Suppliers';
import SupplierForm from './components/SupplierForm';
import Customers from './components/Customers';
import CustomerForm from './components/CustomerForm';
import PurchaseOrders from './components/PurchaseOrders';
import PurchaseOrderForm from './components/PurchaseOrderForm';
import ReceivePOModal from './components/ReceivePOModal';
import StockAdjustments from './components/StockAdjustments';
import StockAdjustmentForm from './components/StockAdjustmentForm';
import StoreAssets from './components/StoreAssets';
import StoreAssetForm from './components/StoreAssetForm';
import CreateInvoiceModal from './components/CreateInvoiceModal';
import ProductionOrders from './components/ProductionOrders';
import ProductionOrderForm from './components/ProductionOrderForm';
import { AddIcon } from './components/icons';
import { Product, CartItem, Category, View, RawMaterial, ProductWithDetails, RawMaterialCategory, RawMaterialWithDetails, SaleTransaction, AppSettings, Supplier, Customer, PurchaseOrder, StockAdjustment, StoreAsset, ProductionBatch } from './types';
import { UNITS, ADJUSTMENT_TYPES } from './constants';
import * as api from './services/api';
import { useTranslation } from './context/LanguageContext';

const App: React.FC = () => {
  const { t } = useTranslation();
  // All state is now local component state, managed by the API service
  const [products, setProducts] = useState<Product[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rawMaterialCategories, setRawMaterialCategories] = useState<RawMaterialCategory[]>([]);
  const [salesHistory, setSalesHistory] = useState<SaleTransaction[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([]);
  const [storeAssets, setStoreAssets] = useState<StoreAsset[]>([]);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [invoiceCounter, setInvoiceCounter] = useState<number>(1);
  const [settings, setSettings] = useState<AppSettings>({
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
  });
  const [isLoading, setIsLoading] = useState(true);

  // Non-persistent state remains the same
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | 'All'>('All');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMaterialCategoryModalOpen, setIsMaterialCategoryModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPOFormModalOpen, setIsPOFormModalOpen] = useState(false);
  const [isReceivePOModalOpen, setIsReceivePOModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isProductionModalOpen, setIsProductionModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('pos');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMaterialCategory, setEditingMaterialCategory] = useState<RawMaterialCategory | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingPO, setEditingPO] = useState<PurchaseOrder | null>(null);
  const [receivingPO, setReceivingPO] = useState<PurchaseOrder | null>(null);
  const [editingAsset, setEditingAsset] = useState<StoreAsset | null>(null);
  const [editingProductionBatch, setEditingProductionBatch] = useState<ProductionBatch | null>(null);
  const [viewingTransaction, setViewingTransaction] = useState<SaleTransaction | null>(null);

  // Load all data from API service on initial mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [
          productsData,
          rawMaterialsData,
          categoriesData,
          rawMaterialCategoriesData,
          salesHistoryData,
          invoiceCounterData,
          settingsData,
          suppliersData,
          customersData,
          purchaseOrdersData,
          stockAdjustmentsData,
          storeAssetsData,
          productionBatchesData,
        ] = await Promise.all([
          api.getProducts(),
          api.getRawMaterials(),
          api.getCategories(),
          api.getRawMaterialCategories(),
          api.getSalesHistory(),
          api.getInvoiceCounter(),
          api.getSettings(),
          api.getSuppliers(),
          api.getCustomers(),
          api.getPurchaseOrders(),
          api.getStockAdjustments(),
          api.getStoreAssets(),
          api.getProductionBatches(),
        ]);
        setProducts(productsData);
        setRawMaterials(rawMaterialsData);
        setCategories(categoriesData);
        setRawMaterialCategories(rawMaterialCategoriesData);
        setSalesHistory(salesHistoryData);
        setInvoiceCounter(invoiceCounterData);
        setSettings(settingsData);
        setSuppliers(suppliersData);
        setCustomers(customersData);
        setPurchaseOrders(purchaseOrdersData);
        setStockAdjustments(stockAdjustmentsData);
        setStoreAssets(storeAssetsData);
        setProductionBatches(productionBatchesData);
      } catch (error) {
        console.error("Failed to load data from storage:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return `${settings.currencySymbol} ${new Intl.NumberFormat('id-ID', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  }, [settings.currencySymbol]);

  const productsWithDetails: ProductWithDetails[] = useMemo(() => {
    const hppCache = new Map<number, number>();
    const stockCache = new Map<number, number>();

    const getProductById = (id: number) => products.find(p => p.id === id);
    const getRawMaterialById = (id: number) => rawMaterials.find(m => m.id === id);

    const calculateHpp = (product: Product, visited: Set<number> = new Set()): number => {
        if (visited.has(product.id)) {
            console.error("Circular dependency detected in recipes for product:", product.name);
            return Infinity; // Prevent infinite loops
        }
        if (hppCache.has(product.id)) {
            return hppCache.get(product.id)!;
        }

        visited.add(product.id);

        const materialCost = product.recipe.reduce((total, item) => {
            let itemCost = 0;
            if (item.itemType === 'raw-material') {
                const material = getRawMaterialById(item.itemId);
                itemCost = material ? material.costPerUnit * item.quantity : 0;
            } else { // 'product'
                const subProduct = getProductById(item.itemId);
                itemCost = subProduct ? calculateHpp(subProduct, new Set(visited)) * item.quantity : 0;
            }
            return total + itemCost;
        }, 0);

        visited.delete(product.id);

        const totalHpp = materialCost + (product.directLaborCost || 0) + (product.productionOverheadCost || 0);
        hppCache.set(product.id, totalHpp);
        return totalHpp;
    };
    
    const calculateStock = (product: Product, visited: Set<number> = new Set()): number => {
        if (visited.has(product.id)) {
            console.error("Circular dependency detected in recipes for product:", product.name);
            return 0;
        }
        if (stockCache.has(product.id)) {
            return stockCache.get(product.id)!;
        }
        if (!product.recipe || product.recipe.length === 0) {
            return 0;
        }

        visited.add(product.id);

        const stockLevels = product.recipe.map(item => {
            if (item.quantity <= 0) return Infinity;
            if (item.itemType === 'raw-material') {
                const material = getRawMaterialById(item.itemId);
                return material ? Math.floor(material.stock / item.quantity) : 0;
            } else { // 'product'
                const subProduct = getProductById(item.itemId);
                if (!subProduct) return 0;
                const subProductStock = calculateStock(subProduct, new Set(visited));
                return Math.floor(subProductStock / item.quantity);
            }
        });

        visited.delete(product.id);
        const minStock = Math.min(...stockLevels);
        stockCache.set(product.id, minStock);
        return minStock;
    };

    return products.map(p => {
      const hpp = calculateHpp(p);
      return {
        ...p,
        stock: calculateStock(p),
        materialCost: hpp - (p.directLaborCost || 0) - (p.productionOverheadCost || 0),
        hpp: hpp,
        categoryName: categories.find(c => c.id === p.categoryId)?.name || 'N/A',
      };
    });
  }, [products, rawMaterials, categories]);

  const rawMaterialsWithDetails: RawMaterialWithDetails[] = useMemo(() => {
      return rawMaterials.map(m => ({
          ...m,
          categoryName: rawMaterialCategories.find(c => c.id === m.categoryId)?.name || 'N/A',
          supplierName: suppliers.find(s => s.id === m.supplierId)?.name || '-',
      }));
  }, [rawMaterials, rawMaterialCategories, suppliers]);


  const handleAddToCart = (product: ProductWithDetails) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return prevCart;
      } else {
        if (product.stock > 0) {
          return [...prevCart, { ...product, quantity: 1 }];
        }
        return prevCart;
      }
    });
  };

  const handleUpdateQuantity = (productId: number, amount: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === productId) {
          const newQuantity = item.quantity + amount;
          if (newQuantity > 0 && newQuantity <= item.stock) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  
  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: number) => {
    await api.saveProduct(productData, id);
    setProducts(await api.getProducts()); // Re-fetch
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };
  
  const handleSaveRawMaterial = async (materialData: Omit<RawMaterial, 'id'>, id?: number) => {
    await api.saveRawMaterial(materialData, id);
    setRawMaterials(await api.getRawMaterials()); // Re-fetch
    setIsMaterialModalOpen(false);
    setEditingMaterial(null);
  };

  const handleSaveCategory = async (categoryData: Omit<Category, 'id'>, id?: number) => {
    await api.saveCategory(categoryData, id);
    setCategories(await api.getCategories()); // Re-fetch
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleSaveRawMaterialCategory = async (categoryData: Omit<RawMaterialCategory, 'id'>, id?: number) => {
    await api.saveRawMaterialCategory(categoryData, id);
    setRawMaterialCategories(await api.getRawMaterialCategories()); // Re-fetch
    setIsMaterialCategoryModalOpen(false);
    setEditingMaterialCategory(null);
  };

  const handleSaveSupplier = async (supplierData: Omit<Supplier, 'id'>, id?: number) => {
    await api.saveSupplier(supplierData, id);
    setSuppliers(await api.getSuppliers());
    setIsSupplierModalOpen(false);
    setEditingSupplier(null);
  };

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id'>, id?: number) => {
    await api.saveCustomer(customerData, id);
    setCustomers(await api.getCustomers());
    setIsCustomerModalOpen(false);
    setEditingCustomer(null);
  };
  
  const handleSaveSettings = async (newSettings: AppSettings) => {
    await api.saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleSavePO = async (poData: Omit<PurchaseOrder, 'id' | 'totalCost'>, id?: string) => {
    await api.savePurchaseOrder(poData, rawMaterials, id);
    setPurchaseOrders(await api.getPurchaseOrders());
    setIsPOFormModalOpen(false);
    setEditingPO(null);
  }

  const handleSaveStockAdjustment = async (adjustmentData: Omit<StockAdjustment, 'id' | 'date'>) => {
    try {
        await api.saveStockAdjustment(adjustmentData, t);
        setRawMaterials(await api.getRawMaterials());
        setStockAdjustments(await api.getStockAdjustments());
        setIsAdjustmentModalOpen(false);
    } catch (error: any) {
        alert(error.message);
    }
  };

  const handleSaveStoreAsset = async (assetData: Omit<StoreAsset, 'id'>, id?: number) => {
    await api.saveStoreAsset(assetData, id);
    setStoreAssets(await api.getStoreAssets());
    setIsAssetModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      if (window.confirm(t('confirmDeleteProduct'))) {
        await api.deleteProduct(productId, t);
        setProducts(await api.getProducts()); // Re-fetch
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  
  const handleDeleteRawMaterial = async (materialId: number) => {
    try {
      if (window.confirm(t('confirmDeleteRawMaterial'))) {
        await api.deleteRawMaterial(materialId, t);
        setRawMaterials(await api.getRawMaterials()); // Re-fetch
      }
    } catch (error: any) {
      alert(error.message);
    }
  };
  
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      if (window.confirm(t('confirmDeleteCategory'))) {
        await api.deleteCategory(categoryId, t);
        setCategories(await api.getCategories()); // Re-fetch
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteRawMaterialCategory = async (categoryId: number) => {
    try {
      if (window.confirm(t('confirmDeleteMaterialCategory'))) {
        await api.deleteRawMaterialCategory(categoryId, t);
        setRawMaterialCategories(await api.getRawMaterialCategories()); // Re-fetch
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteSupplier = async (supplierId: number) => {
    try {
      if (window.confirm(t('confirmDeleteSupplier'))) {
        await api.deleteSupplier(supplierId, t);
        setSuppliers(await api.getSuppliers());
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      if (window.confirm(t('confirmDeleteCustomer'))) {
        await api.deleteCustomer(customerId);
        setCustomers(await api.getCustomers());
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteStoreAsset = async (assetId: number) => {
    if (window.confirm(t('confirmDeleteAsset'))) {
      await api.deleteStoreAsset(assetId);
      setStoreAssets(await api.getStoreAssets());
    }
  };

  const handleOpenEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenAddProductModal = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };
  
  const handleOpenEditMaterialModal = (material: RawMaterial) => {
    setEditingMaterial(material);
    setIsMaterialModalOpen(true);
  };

  const handleOpenAddMaterialModal = () => {
    setEditingMaterial(null);
    setIsMaterialModalOpen(true);
  };
  
  const handleOpenEditCategoryModal = (category: Category) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddCategoryModal = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditMaterialCategoryModal = (category: RawMaterialCategory) => {
    setEditingMaterialCategory(category);
    setIsMaterialCategoryModalOpen(true);
  };

  const handleOpenAddMaterialCategoryModal = () => {
    setEditingMaterialCategory(null);
    setIsMaterialCategoryModalOpen(true);
  };

  const handleOpenEditSupplierModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setIsSupplierModalOpen(true);
  };

  const handleOpenAddSupplierModal = () => {
    setEditingSupplier(null);
    setIsSupplierModalOpen(true);
  };

  const handleOpenEditCustomerModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsCustomerModalOpen(true);
  };

  const handleOpenAddCustomerModal = () => {
    setEditingCustomer(null);
    setIsCustomerModalOpen(true);
  };

  const handleOpenAddPOModal = () => {
    setEditingPO(null);
    setIsPOFormModalOpen(true);
  }

  const handleOpenEditPOModal = (po: PurchaseOrder) => {
    setEditingPO(po);
    setIsPOFormModalOpen(true);
  }

  const handleOpenReceivePOModal = (po: PurchaseOrder) => {
    setReceivingPO(po);
    setIsReceivePOModalOpen(true);
  }

  const handleOpenAddAdjustmentModal = () => {
    setIsAdjustmentModalOpen(true);
  };
  
  const handleOpenAddAssetModal = () => {
    setEditingAsset(null);
    setIsAssetModalOpen(true);
  };

  const handleOpenEditAssetModal = (asset: StoreAsset) => {
    setEditingAsset(asset);
    setIsAssetModalOpen(true);
  };

  const handleOpenAddProductionBatchModal = () => {
    setEditingProductionBatch(null);
    setIsProductionModalOpen(true);
  };

  const handleOpenEditProductionBatchModal = (batch: ProductionBatch) => {
    setEditingProductionBatch(batch);
    setIsProductionModalOpen(true);
  };

  const handleSaveProductionBatch = async (batchData: Omit<ProductionBatch, 'id'>, id?: string) => {
    const { updatedRawMaterials } = await api.saveProductionBatch(batchData, id);
    if (updatedRawMaterials) {
      setRawMaterials(updatedRawMaterials);
    }
    setProductionBatches(await api.getProductionBatches());
    setIsProductionModalOpen(false);
    setEditingProductionBatch(null);
    if (batchData.status === 'completed') {
      alert(t('batchCompletedAlert'));
    } else {
      alert(t('batchSavedSuccess'));
    }
  };

  const handleDeleteProductionBatch = async (batchId: string) => {
    const { updatedRawMaterials } = await api.deleteProductionBatch(batchId);
    if (updatedRawMaterials) {
      setRawMaterials(updatedRawMaterials);
    }
    setProductionBatches(await api.getProductionBatches());
  };

  const handleReceivePOItems = async (poId: string, itemsToReceive: { rawMaterialId: number, quantity: number }[]) => {
    await api.receivePurchaseOrderItems(poId, itemsToReceive);
    setPurchaseOrders(await api.getPurchaseOrders());
    setRawMaterials(await api.getRawMaterials());
    setIsReceivePOModalOpen(false);
    setReceivingPO(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
        alert(t('cartIsEmpty'));
        return;
    }
    const { updatedRawMaterials, newTransaction } = await api.processSale(cart, products, settings, invoiceCounter, 'paid');
    
    // Update state from API response
    setRawMaterials(updatedRawMaterials);
    setSalesHistory(prev => [newTransaction, ...prev]);
    setInvoiceCounter(prev => prev + 1);

    const alertMessage = t('checkoutSuccess').replace('{invoiceId}', newTransaction.id);
    alert(alertMessage);
    setCart([]);
  };

  const handleCreateInvoice = () => {
    if (cart.length === 0) {
      alert(t('cartIsEmpty'));
      return;
    }
    setIsInvoiceModalOpen(true);
  };

  const handleConfirmInvoice = async (customerId: number) => {
    if (cart.length === 0) return;
    
    const { updatedRawMaterials, newTransaction } = await api.processSale(cart, products, settings, invoiceCounter, 'unpaid', customerId);
    
    setRawMaterials(updatedRawMaterials);
    setSalesHistory(prev => [newTransaction, ...prev]);
    setInvoiceCounter(prev => prev + 1);

    const alertMessage = t('invoiceCreatedSuccess').replace('{invoiceId}', newTransaction.id);
    alert(alertMessage);
    
    setCart([]);
    setIsInvoiceModalOpen(false);
  };

  const filteredProducts = useMemo(() => {
    const finalProducts = productsWithDetails.filter(p => p.sellPrice > 0);
    if (selectedCategory === 'All') {
      return finalProducts;
    }
    return finalProducts.filter((product) => product.categoryId === selectedCategory);
  }, [productsWithDetails, selectedCategory]);

  const salesToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return salesHistory.filter(sale => new Date(sale.timestamp) >= today);
  }, [salesHistory]);

  const cartSubtotal = useMemo(() => cart.reduce((acc, item) => acc + item.sellPrice * item.quantity, 0), [cart]);
  const cartTax = useMemo(() => cartSubtotal * (settings.taxRate / 100), [cartSubtotal, settings.taxRate]);
  const cartTotal = useMemo(() => cartSubtotal + cartTax, [cartSubtotal, cartTax]);

  const fabAction = currentView === 'inventory' ? handleOpenAddProductModal :
                    currentView === 'materials' ? handleOpenAddMaterialModal :
                    currentView === 'categories' ? handleOpenAddCategoryModal :
                    currentView === 'material-categories' ? handleOpenAddMaterialCategoryModal :
                    currentView === 'suppliers' ? handleOpenAddSupplierModal :
                    currentView === 'customers' ? handleOpenAddCustomerModal :
                    currentView === 'purchase-orders' ? handleOpenAddPOModal :
                    currentView === 'stock-adjustments' ? handleOpenAddAdjustmentModal :
                    currentView === 'store-assets' ? handleOpenAddAssetModal :
                    currentView === 'production' ? handleOpenAddProductionBatchModal :
                    null;
  const fabLabel = currentView === 'inventory' ? t('fabAddProduct') :
                   currentView === 'materials' ? t('fabAddRawMaterial') :
                   currentView === 'categories' ? t('fabAddProductCategory') :
                   currentView === 'material-categories' ? t('fabAddMaterialCategory') :
                   currentView === 'suppliers' ? t('fabAddSupplier') :
                   currentView === 'customers' ? t('fabAddCustomer') :
                   currentView === 'purchase-orders' ? t('fabAddPO') :
                   currentView === 'stock-adjustments' ? t('fabAddAdjustment') :
                   currentView === 'store-assets' ? t('fabAddAsset') :
                   currentView === 'production' ? t('fabAddProductionBatch') :
                   '';

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-300">Loading your store...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans">
      <Header currentView={currentView} onNavigate={setCurrentView} storeName={settings.storeName} />
      <main className="p-4 md:p-8 max-w-screen-2xl mx-auto">
        {currentView === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-slate-100 mb-4">{t('selectProduct')}</h2>
                <CategoryTabs
                  categories={categories.filter(c => products.some(p => p.categoryId === c.id && p.sellPrice > 0))}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
                <ProductList products={filteredProducts} onAddToCart={handleAddToCart} formatCurrency={formatCurrency} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Cart
                cartItems={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onCheckout={handleCheckout}
                onCreateInvoice={handleCreateInvoice}
                formatCurrency={formatCurrency}
                taxRate={settings.taxRate}
              />
            </div>
          </div>
        )}
        {currentView === 'inventory' && (
          <Inventory 
            products={productsWithDetails}
            onEdit={handleOpenEditProductModal}
            onDelete={handleDeleteProduct}
            formatCurrency={formatCurrency}
          />
        )}
        {currentView === 'materials' && (
            <RawMaterials
                materials={rawMaterialsWithDetails}
                onEdit={handleOpenEditMaterialModal}
                onDelete={handleDeleteRawMaterial}
            />
        )}
        {currentView === 'categories' && (
          <Categories 
            categories={categories}
            onEdit={handleOpenEditCategoryModal}
            onDelete={handleDeleteCategory}
          />
        )}
        {currentView === 'material-categories' && (
          <RawMaterialCategories
            categories={rawMaterialCategories}
            onEdit={handleOpenEditMaterialCategoryModal}
            onDelete={handleDeleteRawMaterialCategory}
          />
        )}
        {currentView === 'purchase-orders' && (
          <PurchaseOrders
            purchaseOrders={purchaseOrders}
            suppliers={suppliers}
            onEdit={handleOpenEditPOModal}
            onReceive={handleOpenReceivePOModal}
            formatCurrency={formatCurrency}
          />
        )}
        {currentView === 'stock-adjustments' && (
          <StockAdjustments
            adjustments={stockAdjustments}
            rawMaterials={rawMaterials}
          />
        )}
        {currentView === 'dashboard' && (
            <Dashboard 
                salesToday={salesToday}
                rawMaterials={rawMaterials}
                formatCurrency={formatCurrency}
            />
        )}
        {currentView === 'reports' && (
          <SalesHistory 
            transactions={salesHistory} 
            onViewDetails={setViewingTransaction} 
            formatCurrency={formatCurrency} 
            customers={customers}
          />
        )}
        {currentView === 'suppliers' && (
          <Suppliers
            suppliers={suppliers}
            onEdit={handleOpenEditSupplierModal}
            onDelete={handleDeleteSupplier}
          />
        )}
        {currentView === 'customers' && (
          <Customers
            customers={customers}
            onEdit={handleOpenEditCustomerModal}
            onDelete={handleDeleteCustomer}
          />
        )}
        {currentView === 'store-profile' && (
          <Settings settings={settings} onSave={handleSaveSettings} />
        )}
        {currentView === 'invoice-settings' && (
          <InvoiceSettings settings={settings} onSave={handleSaveSettings} />
        )}
        {currentView === 'store-assets' && (
          <StoreAssets
            assets={storeAssets}
            onEdit={handleOpenEditAssetModal}
            onDelete={handleDeleteStoreAsset}
            formatCurrency={formatCurrency}
          />
        )}
        {currentView === 'production' && (
          <ProductionOrders
            batches={productionBatches}
            products={products}
            rawMaterials={rawMaterials}
            onOpenCreateModal={handleOpenAddProductionBatchModal}
            onEditBatch={handleOpenEditProductionBatchModal}
            onDeleteBatch={handleDeleteProductionBatch}
            formatCurrency={formatCurrency}
          />
        )}
      </main>
      
      {fabAction && (
          <button
            onClick={fabAction}
            className="fixed bottom-8 right-8 bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-50 transition-transform transform hover:scale-110"
            aria-label={fabLabel}
          >
            <AddIcon className="h-8 w-8" />
          </button>
      )}

      <Modal isOpen={isProductModalOpen} onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}>
        <ProductForm 
            onSaveProduct={handleSaveProduct} 
            onClose={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
            categories={categories}
            editingProduct={editingProduct}
            rawMaterials={rawMaterials}
            products={products}
            formatCurrency={formatCurrency}
        />
      </Modal>
      
      <Modal isOpen={isMaterialModalOpen} onClose={() => { setIsMaterialModalOpen(false); setEditingMaterial(null); }}>
        <RawMaterialForm
            onSave={handleSaveRawMaterial}
            onClose={() => { setIsMaterialModalOpen(false); setEditingMaterial(null); }}
            editingMaterial={editingMaterial}
            units={UNITS}
            categories={rawMaterialCategories}
            suppliers={suppliers}
        />
      </Modal>

      <Modal isOpen={isCategoryModalOpen} onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}>
        <CategoryForm
          onSave={handleSaveCategory}
          onClose={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
          editingCategory={editingCategory}
        />
      </Modal>
      
      <Modal isOpen={isMaterialCategoryModalOpen} onClose={() => { setIsMaterialCategoryModalOpen(false); setEditingMaterialCategory(null); }}>
        <RawMaterialCategoryForm
          onSave={handleSaveRawMaterialCategory}
          onClose={() => { setIsMaterialCategoryModalOpen(false); setEditingMaterialCategory(null); }}
          editingCategory={editingMaterialCategory}
        />
      </Modal>

      <Modal isOpen={isSupplierModalOpen} onClose={() => { setIsSupplierModalOpen(false); setEditingSupplier(null); }}>
        <SupplierForm
          onSave={handleSaveSupplier}
          onClose={() => { setIsSupplierModalOpen(false); setEditingSupplier(null); }}
          editingSupplier={editingSupplier}
        />
      </Modal>

      <Modal isOpen={isCustomerModalOpen} onClose={() => { setIsCustomerModalOpen(false); setEditingCustomer(null); }}>
        <CustomerForm
          onSave={handleSaveCustomer}
          onClose={() => { setIsCustomerModalOpen(false); setEditingCustomer(null); }}
          editingCustomer={editingCustomer}
        />
      </Modal>
      
      <Modal isOpen={isPOFormModalOpen} onClose={() => { setIsPOFormModalOpen(false); setEditingPO(null); }}>
        <PurchaseOrderForm
          onSave={handleSavePO}
          onClose={() => { setIsPOFormModalOpen(false); setEditingPO(null); }}
          editingPO={editingPO}
          suppliers={suppliers}
          rawMaterials={rawMaterials}
          formatCurrency={formatCurrency}
        />
      </Modal>

      <Modal isOpen={isReceivePOModalOpen} onClose={() => { setIsReceivePOModalOpen(false); setReceivingPO(null); }}>
        {receivingPO && (
            <ReceivePOModal
                purchaseOrder={receivingPO}
                onReceive={handleReceivePOItems}
                onClose={() => { setIsReceivePOModalOpen(false); setReceivingPO(null); }}
                rawMaterials={rawMaterials}
            />
        )}
      </Modal>

      <Modal isOpen={isAdjustmentModalOpen} onClose={() => setIsAdjustmentModalOpen(false)}>
        <StockAdjustmentForm
            onSave={handleSaveStockAdjustment}
            onClose={() => setIsAdjustmentModalOpen(false)}
            rawMaterials={rawMaterials}
            adjustmentTypes={ADJUSTMENT_TYPES}
        />
      </Modal>
      
      <Modal isOpen={isAssetModalOpen} onClose={() => { setIsAssetModalOpen(false); setEditingAsset(null); }}>
        <StoreAssetForm
          onSave={handleSaveStoreAsset}
          onClose={() => { setIsAssetModalOpen(false); setEditingAsset(null); }}
          editingAsset={editingAsset}
          formatCurrency={formatCurrency}
        />
      </Modal>

      <Modal isOpen={isInvoiceModalOpen} onClose={() => setIsInvoiceModalOpen(false)}>
        <CreateInvoiceModal
          customers={customers}
          onConfirm={handleConfirmInvoice}
          onClose={() => setIsInvoiceModalOpen(false)}
          cartTotal={cartTotal}
          formatCurrency={formatCurrency}
        />
      </Modal>

      <Modal isOpen={isProductionModalOpen} onClose={() => { setIsProductionModalOpen(false); setEditingProductionBatch(null); }}>
        <ProductionOrderForm
          onSave={handleSaveProductionBatch}
          onClose={() => { setIsProductionModalOpen(false); setEditingProductionBatch(null); }}
          editingBatch={editingProductionBatch}
          products={products}
          rawMaterials={rawMaterials}
          formatCurrency={formatCurrency}
        />
      </Modal>

      <Modal isOpen={!!viewingTransaction} onClose={() => setViewingTransaction(null)}>
        {viewingTransaction && (
          <TransactionDetailModal 
            transaction={viewingTransaction}
            onClose={() => setViewingTransaction(null)}
            formatCurrency={formatCurrency}
            settings={settings}
            customers={customers}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;