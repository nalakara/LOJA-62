import React, { useState, useMemo } from 'react';
import { SaleTransaction, Customer } from '../types';
import { useTranslation } from '../context/LanguageContext';

interface SalesHistoryProps {
  transactions: SaleTransaction[];
  onViewDetails: (transaction: SaleTransaction) => void;
  formatCurrency: (amount: number) => string;
  customers: Customer[];
}

const StatusBadge: React.FC<{ status: 'paid' | 'unpaid' }> = ({ status }) => {
    const { t } = useTranslation();
    const statusInfo = {
        paid: { label: t('paid'), color: 'bg-green-600 text-green-100' },
        unpaid: { label: t('unpaid'), color: 'bg-amber-600 text-amber-100' },
    }[status];

    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
        </span>
    );
};

const SalesHistory: React.FC<SalesHistoryProps> = ({ transactions, onViewDetails, formatCurrency, customers }) => {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState('all'); // all, today, 7days, 30days, custom
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const getCustomerName = (customerId?: number) => {
    if (!customerId) return '-';
    return customers.find(c => c.id === customerId)?.name || 'Unknown';
  };

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return transactions.filter(t => {
      const transactionDate = new Date(t.timestamp);
      switch (filterType) {
        case 'today':
          return transactionDate >= today;
        case '7days':
          const sevenDaysAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
          return transactionDate >= sevenDaysAgo;
        case '30days':
          const thirtyDaysAgo = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
          return transactionDate >= thirtyDaysAgo;
        case 'custom':
          if (!startDate || !endDate) return true;
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return transactionDate >= start && transactionDate <= end;
        case 'all':
        default:
          return true;
      }
    });
  }, [transactions, filterType, startDate, endDate]);

  const FilterButton: React.FC<{ type: string; label: string }> = ({ type, label }) => (
    <button
      onClick={() => setFilterType(type)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        filterType === type ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{t('salesHistory')}</h2>
      
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-slate-800/60 rounded-lg">
        <div className="flex items-center gap-2">
          <FilterButton type="all" label={t('allTime')} />
          <FilterButton type="today" label={t('today')} />
          <FilterButton type="7days" label={t('last7Days')} />
          <FilterButton type="30days" label={t('last30Days')} />
        </div>
        <div className="flex items-center gap-2">
            <input 
                type="date"
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setFilterType('custom'); }}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-200"
            />
            <span className="text-slate-400">{t('to')}</span>
            <input 
                type="date"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setFilterType('custom'); }}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-200"
            />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-400">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
            <tr>
              <th scope="col" className="px-6 py-3">{t('invoiceId')}</th>
              <th scope="col" className="px-6 py-3">{t('date')}</th>
              <th scope="col" className="px-6 py-3">{t('customer')}</th>
              <th scope="col" className="px-6 py-3">{t('itemCount')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('totalSales')}</th>
              <th scope="col" className="px-6 py-3 text-right">{t('totalProfit')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('paymentStatus')}</th>
              <th scope="col" className="px-6 py-3 text-center">{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b border-slate-700 hover:bg-slate-800/60">
                <td className="px-6 py-4 font-medium text-slate-100">{transaction.id}</td>
                <td className="px-6 py-4">{new Date(transaction.timestamp).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4">{getCustomerName(transaction.customerId)}</td>
                <td className="px-6 py-4">{transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-6 py-4 text-right font-semibold">{formatCurrency(transaction.total)}</td>
                <td className="px-6 py-4 text-right font-semibold text-green-400">{formatCurrency(transaction.profit)}</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={transaction.paymentStatus} /></td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onViewDetails(transaction)} className="font-medium text-purple-400 hover:text-purple-300">
                    {t('details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredTransactions.length === 0 && (
        <div className="text-center py-10 text-slate-400">
          <p>{t('noTransactionsForPeriod')}</p>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;