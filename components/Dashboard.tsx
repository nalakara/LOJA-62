import React, { useMemo } from 'react';
import { SaleTransaction, RawMaterial } from '../types';
import { CurrencyDollarIcon, ReceiptIcon, TrendingUpIcon, DashboardIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

interface DashboardProps {
  salesToday: SaleTransaction[];
  rawMaterials: RawMaterial[];
  formatCurrency: (amount: number) => string;
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
    iconColor: string;
}> = ({ icon, title, value, color, iconColor }) => (
    <div className="bg-bone-light border border-mineral p-6 rounded-2xl shadow-sm flex items-center space-x-4">
        <div className={`p-3 rounded-xl ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${iconColor}` })}
        </div>
        <div>
            <p className="text-xs text-ink-muted font-semibold">{title}</p>
            <p className="text-2xl font-bold text-ink">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ salesToday, rawMaterials, formatCurrency }) => {
    const { t } = useTranslation();
    
    const stats = useMemo(() => {
        const totalRevenue = salesToday.reduce((sum, sale) => sum + sale.subtotal, 0);
        const totalProfit = salesToday.reduce((sum, sale) => sum + sale.profit, 0);
        const transactionCount = salesToday.length;
        const averageSale = transactionCount > 0 ? totalRevenue / transactionCount : 0;
        return { totalRevenue, totalProfit, transactionCount, averageSale };
    }, [salesToday]);

    const topProducts = useMemo(() => {
        const productSales = new Map<string, number>();
        salesToday.forEach(sale => {
            sale.items.forEach(item => {
                const currentQty = productSales.get(item.name) || 0;
                productSales.set(item.name, currentQty + item.quantity);
            });
        });
        return Array.from(productSales.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }, [salesToday]);
    
    const lowStockMaterials = useMemo(() => {
        return rawMaterials.filter(m => m.stock < 50).sort((a, b) => a.stock - b.stock).slice(0, 5);
    }, [rawMaterials]);
    
    if (salesToday.length === 0) {
        return (
            <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6 text-center">
              <div className="flex flex-col items-center justify-center h-96 text-ink-muted">
                  <DashboardIcon className="h-20 w-20 text-ink-faint mb-4" />
                  <h2 className="text-2xl font-bold text-ink">{t('welcomeToDashboard')}</h2>
                  <p className="mt-2 text-base text-ink-muted">{t('noSalesToday')}</p>
                  <p className="mt-1 text-xs text-ink-faint">{t('makeFirstTransaction')}</p>
              </div>
            </div>
        );
    }

  return (
    <div className="space-y-8">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
                icon={<CurrencyDollarIcon />}
                title={t('todaysRevenue')}
                value={formatCurrency(stats.totalRevenue)}
                color="bg-olive-subtle"
                iconColor="text-olive"
            />
            <StatCard 
                icon={<TrendingUpIcon />}
                title={t('todaysProfit')}
                value={formatCurrency(stats.totalProfit)}
                color="bg-coffee/10"
                iconColor="text-coffee"
            />
            <StatCard 
                icon={<ReceiptIcon />}
                title={t('transactions')}
                value={stats.transactionCount.toString()}
                color="bg-oxide-subtle"
                iconColor="text-oxide"
            />
            <StatCard 
                icon={<CurrencyDollarIcon />}
                title={t('averageSale')}
                value={formatCurrency(stats.averageSale)}
                color="bg-mineral-light"
                iconColor="text-ink"
            />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Products */}
            <div className="bg-bone-light border border-mineral p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-ink mb-4">{t('topSellingProductsToday')}</h3>
                {topProducts.length > 0 ? (
                    <ul className="space-y-3">
                        {topProducts.map(([name, quantity]) => (
                            <li key={name} className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-ink">{name}</span>
                                <span className="font-bold text-ink bg-mineral-light border border-mineral px-2.5 py-1 rounded-md">{quantity} {t('sold')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-ink-muted text-xs">{t('noProductsSold')}</p>
                )}
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-bone-light border border-mineral p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-ink mb-4">{t('lowStockMaterials')}</h3>
                {lowStockMaterials.length > 0 ? (
                    <ul className="space-y-4">
                        {lowStockMaterials.map(material => (
                             <li key={material.id} className="text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="font-semibold text-ink">{material.name}</span>
                                    <span className={`font-bold ${material.stock < 20 ? 'text-danger' : 'text-oxide'}`}>{material.stock} {material.unit}</span>
                                </div>
                                <div className="w-full bg-mineral rounded-full h-2">
                                    <div 
                                        className={`${material.stock < 20 ? 'bg-danger' : 'bg-oxide'} h-2 rounded-full`}
                                        style={{width: `${Math.min(100, (material.stock / 50) * 100)}%`}}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-ink-muted text-xs">{t('allMaterialsWellStocked')}</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;