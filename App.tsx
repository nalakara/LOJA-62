import React, { useState } from 'react';
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
import { CommerceView } from './components/commerce/CommerceView';
import { AddIcon } from './components/icons';
import { Product, View, RawMaterial, Category, RawMaterialCategory, Supplier, Customer, PurchaseOrder, StockAdjustment, StoreAsset, ProductionBatch } from './types';
import { UNITS, ADJUSTMENT_TYPES } from './constants';
import { useTranslation } from './context/LanguageContext';
import { useModal } from './context/ModalContext';
import { useToast } from './context/ToastContext';
import { useSettings } from './context/SettingsContext';
import { useInventory } from './context/InventoryContext';
import { useContacts } from './context/ContactsContext';
import { useSales } from './context/SalesContext';
import { useProcurement } from './context/ProcurementContext';
import { useProduction } from './context/ProductionContext';
import { useStockAdjustments } from './context/StockAdjustmentsContext';
import { useStoreAssets } from './context/StoreAssetsContext';
import { usePOS } from './context/POSContext';
import { ConfirmDialog } from './components/ConfirmDialog';

const App: React.FC = () => {
  const { t } = useTranslation();
  const { activeModal, openModal, closeModal, confirmState, showConfirm, closeConfirm } = useModal();
  const toast = useToast();

  // Domain Hooks
  const { settings, saveSettings, formatCurrency, isLoading: isSettingsLoading } = useSettings();
  const {
    products,
    rawMaterials,
    categories,
    rawMaterialCategories,
    productsWithDetails,
    rawMaterialsWithDetails,
    saveProduct,
    deleteProduct,
    saveRawMaterial,
    deleteRawMaterial,
    saveCategory,
    deleteCategory,
    saveRawMaterialCategory,
    deleteRawMaterialCategory,
    isLoading: isInventoryLoading,
  } = useInventory();
  const { suppliers, customers, saveSupplier, deleteSupplier, saveCustomer, deleteCustomer } = useContacts();
  const { salesHistory, salesToday } = useSales();
  const { purchaseOrders, savePurchaseOrder, receiveItems } = useProcurement();
  const { productionBatches, saveBatch, deleteBatch } = useProduction();
  const { stockAdjustments, saveAdjustment } = useStockAdjustments();
  const { storeAssets, saveAsset, deleteAsset } = useStoreAssets();
  const {
    cart,
    selectedCategory,
    filteredProducts,
    cartTotal,
    addToCart,
    updateQuantity,
    removeItem,
    setSelectedCategory,
    checkout,
  } = usePOS();

  // App Navigation Shell State
  const [currentView, setCurrentView] = useState<View>('pos');

  // Modal Action Handlers
  const handleOpenEditProductModal = (product: Product) => openModal({ type: 'PRODUCT_FORM', data: product });
  const handleOpenAddProductModal = () => openModal({ type: 'PRODUCT_FORM', data: null });
  const handleOpenEditMaterialModal = (material: RawMaterial) => openModal({ type: 'RAW_MATERIAL_FORM', data: material });
  const handleOpenAddMaterialModal = () => openModal({ type: 'RAW_MATERIAL_FORM', data: null });
  const handleOpenEditCategoryModal = (category: Category) => openModal({ type: 'CATEGORY_FORM', data: category });
  const handleOpenAddCategoryModal = () => openModal({ type: 'CATEGORY_FORM', data: null });
  const handleOpenEditMaterialCategoryModal = (category: RawMaterialCategory) => openModal({ type: 'RAW_MATERIAL_CATEGORY_FORM', data: category });
  const handleOpenAddMaterialCategoryModal = () => openModal({ type: 'RAW_MATERIAL_CATEGORY_FORM', data: null });
  const handleOpenEditSupplierModal = (supplier: Supplier) => openModal({ type: 'SUPPLIER_FORM', data: supplier });
  const handleOpenAddSupplierModal = () => openModal({ type: 'SUPPLIER_FORM', data: null });
  const handleOpenEditCustomerModal = (customer: Customer) => openModal({ type: 'CUSTOMER_FORM', data: customer });
  const handleOpenAddCustomerModal = () => openModal({ type: 'CUSTOMER_FORM', data: null });
  const handleOpenAddPOModal = () => openModal({ type: 'PURCHASE_ORDER_FORM', data: null });
  const handleOpenEditPOModal = (po: PurchaseOrder) => openModal({ type: 'PURCHASE_ORDER_FORM', data: po });
  const handleOpenReceivePOModal = (po: PurchaseOrder) => openModal({ type: 'RECEIVE_PO', data: po });
  const handleOpenAddAdjustmentModal = () => openModal({ type: 'STOCK_ADJUSTMENT_FORM' });
  const handleOpenAddAssetModal = () => openModal({ type: 'STORE_ASSET_FORM', data: null });
  const handleOpenEditAssetModal = (asset: StoreAsset) => openModal({ type: 'STORE_ASSET_FORM', data: asset });
  const handleOpenAddProductionBatchModal = () => openModal({ type: 'PRODUCTION_ORDER_FORM', data: null });
  const handleOpenEditProductionBatchModal = (batch: ProductionBatch) => openModal({ type: 'PRODUCTION_ORDER_FORM', data: batch });

  // Domain Actions with Feedback & Modal Closing
  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: number) => {
    await saveProduct(productData, id);
    closeModal();
    toast.success(id ? t('productUpdatedSuccess') : t('productAddedSuccess'));
  };

  const handleDeleteProduct = (productId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteProduct'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteProduct(productId);
          closeConfirm();
          toast.success(t('productDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveRawMaterial = async (materialData: Omit<RawMaterial, 'id'>, id?: number) => {
    await saveRawMaterial(materialData, id);
    closeModal();
    toast.success(id ? t('materialUpdatedSuccess') : t('materialAddedSuccess'));
  };

  const handleDeleteRawMaterial = (materialId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteRawMaterial'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteRawMaterial(materialId);
          closeConfirm();
          toast.success(t('materialDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveCategory = async (categoryData: Omit<Category, 'id'>, id?: number) => {
    await saveCategory(categoryData, id);
    closeModal();
    toast.success(id ? t('categoryUpdatedSuccess') : t('categoryAddedSuccess'));
  };

  const handleDeleteCategory = (categoryId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteCategory'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteCategory(categoryId);
          closeConfirm();
          toast.success(t('categoryDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveRawMaterialCategory = async (categoryData: Omit<RawMaterialCategory, 'id'>, id?: number) => {
    await saveRawMaterialCategory(categoryData, id);
    closeModal();
    toast.success(id ? t('materialCategoryUpdatedSuccess') : t('materialCategoryAddedSuccess'));
  };

  const handleDeleteRawMaterialCategory = (categoryId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteMaterialCategory'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteRawMaterialCategory(categoryId);
          closeConfirm();
          toast.success(t('materialCategoryDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveSupplier = async (supplierData: Omit<Supplier, 'id'>, id?: number) => {
    await saveSupplier(supplierData, id);
    closeModal();
    toast.success(id ? t('supplierUpdatedSuccess') : t('supplierAddedSuccess'));
  };

  const handleDeleteSupplier = (supplierId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteSupplier'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteSupplier(supplierId);
          closeConfirm();
          toast.success(t('supplierDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveCustomer = async (customerData: Omit<Customer, 'id'>, id?: number) => {
    await saveCustomer(customerData, id);
    closeModal();
    toast.success(id ? t('customerUpdatedSuccess') : t('customerAddedSuccess'));
  };

  const handleDeleteCustomer = (customerId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteCustomer'),
      isDestructive: true,
      onConfirm: async () => {
        try {
          await deleteCustomer(customerId);
          closeConfirm();
          toast.success(t('customerDeletedSuccess'));
        } catch (error: any) {
          closeConfirm();
          toast.error(error.message);
        }
      },
    });
  };

  const handleSaveSettings = async (newSettings: any) => {
    await saveSettings(newSettings);
    toast.success(t('settingsSaved'));
  };

  const handleSavePO = async (poData: Omit<PurchaseOrder, 'id' | 'totalCost'>, id?: string) => {
    await savePurchaseOrder(poData, id);
    closeModal();
    toast.success(id ? t('poUpdatedSuccess') : t('poCreatedSuccess'));
  };

  const handleReceivePOItems = async (poId: string, itemsToReceive: { rawMaterialId: number; quantity: number }[]) => {
    await receiveItems(poId, itemsToReceive);
    closeModal();
    toast.success(t('goodsReceivedSuccess'));
  };

  const handleSaveStockAdjustment = async (adjustmentData: Omit<StockAdjustment, 'id' | 'date'>) => {
    try {
      await saveAdjustment(adjustmentData);
      closeModal();
      toast.success(t('stockAdjustmentSavedSuccess'));
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSaveStoreAsset = async (assetData: Omit<StoreAsset, 'id'>, id?: number) => {
    await saveAsset(assetData, id);
    closeModal();
    toast.success(id ? t('assetUpdatedSuccess') : t('assetAddedSuccess'));
  };

  const handleDeleteStoreAsset = (assetId: number) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteAsset'),
      isDestructive: true,
      onConfirm: async () => {
        await deleteAsset(assetId);
        closeConfirm();
        toast.success(t('assetDeletedSuccess'));
      },
    });
  };

  const handleSaveProductionBatch = async (batchData: Omit<ProductionBatch, 'id'>, id?: string) => {
    const { isCompleted } = await saveBatch(batchData, id);
    closeModal();
    if (isCompleted) {
      toast.success(t('batchCompletedAlert'));
    } else {
      toast.success(t('batchSavedSuccess'));
    }
  };

  const handleDeleteProductionBatch = (batchId: string) => {
    showConfirm({
      title: t('delete'),
      message: t('confirmDeleteBatch'),
      isDestructive: true,
      onConfirm: async () => {
        await deleteBatch(batchId);
        closeConfirm();
        toast.success(t('batchDeletedSuccess'));
      },
    });
  };

  const handleCheckout = async () => {
    const invoiceId = await checkout('paid');
    if (invoiceId) {
      const alertMessage = t('checkoutSuccess').replace('{invoiceId}', invoiceId);
      toast.success(alertMessage, 5000);
    }
  };

  const handleCreateInvoice = () => {
    if (cart.length === 0) {
      toast.error(t('cartIsEmpty'));
      return;
    }
    openModal({ type: 'CREATE_INVOICE' });
  };

  const handleConfirmInvoice = async (customerId: number) => {
    const invoiceId = await checkout('unpaid', customerId);
    if (invoiceId) {
      const alertMessage = t('invoiceCreatedSuccess').replace('{invoiceId}', invoiceId);
      toast.success(alertMessage, 5000);
      closeModal();
    }
  };

  // FAB Routing
  const fabAction =
    currentView === 'inventory' ? handleOpenAddProductModal :
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

  const fabLabel =
    currentView === 'inventory' ? t('fabAddProduct') :
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

  if (isSettingsLoading || isInventoryLoading) {
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
                <ProductList products={filteredProducts} onAddToCart={addToCart} formatCurrency={formatCurrency} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <Cart
                cartItems={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
                onCreateInvoice={handleCreateInvoice}
                formatCurrency={formatCurrency}
                taxRate={settings.taxRate}
              />
            </div>
          </div>
        )}
        {currentView === 'commerce' && (
          <CommerceView />
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
            materials={rawMaterialsWithDetails.map(m => ({
              ...m,
              supplierName: suppliers.find(s => s.id === m.supplierId)?.name || '-',
            }))}
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
            onViewDetails={(tx) => openModal({ type: 'TRANSACTION_DETAIL', data: tx })} 
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

      {/* Centralized Modal Renderers */}
      <Modal isOpen={activeModal?.type === 'PRODUCT_FORM'} onClose={closeModal}>
        {activeModal?.type === 'PRODUCT_FORM' && (
          <ProductForm 
            onSaveProduct={handleSaveProduct} 
            onClose={closeModal}
            categories={categories}
            editingProduct={activeModal.data || null}
            rawMaterials={rawMaterials}
            products={products}
            formatCurrency={formatCurrency}
          />
        )}
      </Modal>
      
      <Modal isOpen={activeModal?.type === 'RAW_MATERIAL_FORM'} onClose={closeModal}>
        {activeModal?.type === 'RAW_MATERIAL_FORM' && (
          <RawMaterialForm
            onSave={handleSaveRawMaterial}
            onClose={closeModal}
            editingMaterial={activeModal.data || null}
            units={UNITS}
            categories={rawMaterialCategories}
            suppliers={suppliers}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'CATEGORY_FORM'} onClose={closeModal}>
        {activeModal?.type === 'CATEGORY_FORM' && (
          <CategoryForm
            onSave={handleSaveCategory}
            onClose={closeModal}
            editingCategory={activeModal.data || null}
          />
        )}
      </Modal>
      
      <Modal isOpen={activeModal?.type === 'RAW_MATERIAL_CATEGORY_FORM'} onClose={closeModal}>
        {activeModal?.type === 'RAW_MATERIAL_CATEGORY_FORM' && (
          <RawMaterialCategoryForm
            onSave={handleSaveRawMaterialCategory}
            onClose={closeModal}
            editingCategory={activeModal.data || null}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'SUPPLIER_FORM'} onClose={closeModal}>
        {activeModal?.type === 'SUPPLIER_FORM' && (
          <SupplierForm
            onSave={handleSaveSupplier}
            onClose={closeModal}
            editingSupplier={activeModal.data || null}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'CUSTOMER_FORM'} onClose={closeModal}>
        {activeModal?.type === 'CUSTOMER_FORM' && (
          <CustomerForm
            onSave={handleSaveCustomer}
            onClose={closeModal}
            editingCustomer={activeModal.data || null}
          />
        )}
      </Modal>
      
      <Modal isOpen={activeModal?.type === 'PURCHASE_ORDER_FORM'} onClose={closeModal}>
        {activeModal?.type === 'PURCHASE_ORDER_FORM' && (
          <PurchaseOrderForm
            onSave={handleSavePO}
            onClose={closeModal}
            editingPO={activeModal.data || null}
            suppliers={suppliers}
            rawMaterials={rawMaterials}
            formatCurrency={formatCurrency}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'RECEIVE_PO'} onClose={closeModal}>
        {activeModal?.type === 'RECEIVE_PO' && activeModal.data && (
          <ReceivePOModal
            purchaseOrder={activeModal.data}
            onReceive={handleReceivePOItems}
            onClose={closeModal}
            rawMaterials={rawMaterials}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'STOCK_ADJUSTMENT_FORM'} onClose={closeModal}>
        {activeModal?.type === 'STOCK_ADJUSTMENT_FORM' && (
          <StockAdjustmentForm
            onSave={handleSaveStockAdjustment}
            onClose={closeModal}
            rawMaterials={rawMaterials}
            adjustmentTypes={ADJUSTMENT_TYPES}
          />
        )}
      </Modal>
      
      <Modal isOpen={activeModal?.type === 'STORE_ASSET_FORM'} onClose={closeModal}>
        {activeModal?.type === 'STORE_ASSET_FORM' && (
          <StoreAssetForm
            onSave={handleSaveStoreAsset}
            onClose={closeModal}
            editingAsset={activeModal.data || null}
            formatCurrency={formatCurrency}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'CREATE_INVOICE'} onClose={closeModal}>
        {activeModal?.type === 'CREATE_INVOICE' && (
          <CreateInvoiceModal
            customers={customers}
            onConfirm={handleConfirmInvoice}
            onClose={closeModal}
            cartTotal={cartTotal}
            formatCurrency={formatCurrency}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'PRODUCTION_ORDER_FORM'} onClose={closeModal}>
        {activeModal?.type === 'PRODUCTION_ORDER_FORM' && (
          <ProductionOrderForm
            onSave={handleSaveProductionBatch}
            onClose={closeModal}
            editingBatch={activeModal.data || null}
            products={products}
            rawMaterials={rawMaterials}
            formatCurrency={formatCurrency}
          />
        )}
      </Modal>

      <Modal isOpen={activeModal?.type === 'TRANSACTION_DETAIL'} onClose={closeModal}>
        {activeModal?.type === 'TRANSACTION_DETAIL' && activeModal.data && (
          <TransactionDetailModal 
            transaction={activeModal.data}
            onClose={closeModal}
            formatCurrency={formatCurrency}
            settings={settings}
            customers={customers}
          />
        )}
      </Modal>

      {/* Centralized Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
        isDestructive={confirmState.isDestructive}
        onConfirm={confirmState.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
};

export default App;