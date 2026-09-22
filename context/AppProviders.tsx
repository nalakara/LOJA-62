import React, { ReactNode } from 'react';
import { LanguageProvider } from './LanguageContext';
import { ToastProvider } from './ToastContext';
import { ModalProvider } from './ModalContext';
import { SettingsProvider } from './SettingsContext';
import { InventoryProvider } from './InventoryContext';
import { ContactsProvider } from './ContactsContext';
import { SalesProvider } from './SalesContext';
import { ProcurementProvider } from './ProcurementContext';
import { ProductionProvider } from './ProductionContext';
import { StockAdjustmentsProvider } from './StockAdjustmentsContext';
import { StoreAssetsProvider } from './StoreAssetsContext';
import { POSProvider } from './POSContext';

export const AppProviders: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LanguageProvider>
      <ToastProvider>
        <ModalProvider>
          <SettingsProvider>
            <InventoryProvider>
              <ContactsProvider>
                <SalesProvider>
                  <ProcurementProvider>
                    <ProductionProvider>
                      <StockAdjustmentsProvider>
                        <StoreAssetsProvider>
                          <POSProvider>
                            {children}
                          </POSProvider>
                        </StoreAssetsProvider>
                      </StockAdjustmentsProvider>
                    </ProductionProvider>
                  </ProcurementProvider>
                </SalesProvider>
              </ContactsProvider>
            </InventoryProvider>
          </SettingsProvider>
        </ModalProvider>
      </ToastProvider>
    </LanguageProvider>
  );
};
