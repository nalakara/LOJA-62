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
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-lg flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            {React.cloneElement(icon as React.ReactElement, { className: `h-6 w-6 ${iconColor}` })}
        </div>
        <div>
            <p className="text-sm text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-100">{value}</p>
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
        // Simple logic: less than 50 units is "low"
        // A more advanced system might use a percentage or a reorder point per item
        return rawMaterials.filter(m => m.stock < 50).sort((a, b) => a.stock - b.stock).slice(0, 5);
    }, [rawMaterials]);
    
    if (salesToday.length === 0) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6 text-center">
              <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                  <DashboardIcon className="h-24 w-24 text-slate-600 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200">{t('welcomeToDashboard')}</h2>
                  <p className="mt-2 text-lg">{t('noSalesToday')}</p>
                  <p className="mt-1 text-sm">{t('makeFirstTransaction')}</p>
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
                color="bg-green-500/10"
                iconColor="text-green-400"
            />
            <StatCard 
                icon={<TrendingUpIcon />}
                title={t('todaysProfit')}
                value={formatCurrency(stats.totalProfit)}
                color="bg-purple-500/10"
                iconColor="text-purple-400"
            />
            <StatCard 
                icon={<ReceiptIcon />}
                title={t('transactions')}
                value={stats.transactionCount.toString()}
                color="bg-amber-500/10"
                iconColor="text-amber-400"
            />
            <StatCard 
                icon={<CurrencyDollarIcon />}
                title={t('averageSale')}
                value={formatCurrency(stats.averageSale)}
                color="bg-sky-500/10"
                iconColor="text-sky-400"
            />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Products */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-slate-100 mb-4">{t('topSellingProductsToday')}</h3>
                {topProducts.length > 0 ? (
                    <ul className="space-y-3">
                        {topProducts.map(([name, quantity]) => (
                            <li key={name} className="flex justify-between items-center text-sm">
                                <span className="font-medium text-slate-200">{name}</span>
                                <span className="font-bold text-slate-300 bg-slate-700 px-2 py-1 rounded-md">{quantity} {t('sold')}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-400 text-sm">{t('noProductsSold')}</p>
                )}
            </div>

            {/* Low Stock Alerts */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold text-slate-100 mb-4">{t('lowStockMaterials')}</h3>
                {lowStockMaterials.length > 0 ? (
                    <ul className="space-y-4">
                        {lowStockMaterials.map(material => (
                             <li key={material.id} className="text-sm">
                                <div className="flex justify-between mb-1">
                                    <span className="font-medium text-slate-200">{material.name}</span>
                                    <span className={`font-bold ${material.stock < 20 ? 'text-red-400' : 'text-amber-400'}`}>{material.stock} {material.unit}</span>
                                </div>
                                <div className="w-full bg-slate-700 rounded-full h-2.5">
                                    <div 
                                        className={`${material.stock < 20 ? 'bg-red-500' : 'bg-amber-500'} h-2.5 rounded-full`}
                                        style={{width: `${(material.stock / 50) * 100}%`}}
                                    ></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-400 text-sm">{t('allMaterialsWellStocked')}</p>
                )}
            </div>
        </div>
    </div>
  );
};

export default Dashboard;