import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import {
  Product,
  RawMaterial,
  Category,
  RawMaterialCategory,
  Supplier,
  Customer,
  PurchaseOrder,
  StoreAsset,
  ProductionBatch,
  SaleTransaction,
} from '../types';

export type ActiveModal =
  | { type: 'PRODUCT_FORM'; data?: Product | null }
  | { type: 'RAW_MATERIAL_FORM'; data?: RawMaterial | null }
  | { type: 'CATEGORY_FORM'; data?: Category | null }
  | { type: 'RAW_MATERIAL_CATEGORY_FORM'; data?: RawMaterialCategory | null }
  | { type: 'SUPPLIER_FORM'; data?: Supplier | null }
  | { type: 'CUSTOMER_FORM'; data?: Customer | null }
  | { type: 'PURCHASE_ORDER_FORM'; data?: PurchaseOrder | null }
  | { type: 'RECEIVE_PO'; data: PurchaseOrder }
  | { type: 'STOCK_ADJUSTMENT_FORM' }
  | { type: 'STORE_ASSET_FORM'; data?: StoreAsset | null }
  | { type: 'CREATE_INVOICE' }
  | { type: 'PRODUCTION_ORDER_FORM'; data?: ProductionBatch | null }
  | { type: 'TRANSACTION_DETAIL'; data: SaleTransaction }
  | null;

export interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface ModalContextValue {
  activeModal: ActiveModal;
  openModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  confirmState: ConfirmState;
  showConfirm: (config: Omit<ConfirmState, 'isOpen'>) => void;
  closeConfirm: () => void;
}

const initialConfirmState: ConfirmState = {
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
};

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(initialConfirmState);

  const openModal = useCallback((modal: ActiveModal) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const showConfirm = useCallback((config: Omit<ConfirmState, 'isOpen'>) => {
    setConfirmState({
      ...config,
      isOpen: true,
    });
  }, []);

  const closeConfirm = useCallback(() => {
    setConfirmState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        openModal,
        closeModal,
        confirmState,
        showConfirm,
        closeConfirm,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
