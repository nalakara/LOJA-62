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
        paid: { label: t('paid'), color: 'bg-olive-subtle text-olive border border-olive/30' },
        unpaid: { label: t('unpaid'), color: 'bg-oxide-subtle text-oxide border border-oxide/30' },
    }[status];

    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusInfo.color}`}>
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
      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
        filterType === type ? 'bg-coffee text-bone shadow-sm' : 'bg-bone border border-mineral text-ink-muted hover:bg-mineral-light'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-ink mb-6">{t('salesHistory')}</h2>
      
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-mineral-light/40 border border-mineral rounded-xl">
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
                className="px-3 py-1.5 bg-bone border border-mineral rounded-lg text-xs text-ink focus:outline-none focus:border-coffee"
            />
            <span className="text-xs text-ink-muted">{t('to')}</span>
            <input 
                type="date"
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setFilterType('custom'); }}
                className="px-3 py-1.5 bg-bone border border-mineral rounded-lg text-xs text-ink focus:outline-none focus:border-coffee"
            />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-ink-muted">
          <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
              <tr key={transaction.id} className="border-b border-mineral/60 hover:bg-bone">
                <td className="px-6 py-4 font-semibold text-ink">{transaction.id}</td>
                <td className="px-6 py-4 text-ink-muted text-xs">{new Date(transaction.timestamp).toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-ink">{getCustomerName(transaction.customerId)}</td>
                <td className="px-6 py-4 text-ink">{transaction.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td className="px-6 py-4 text-right font-semibold text-ink">{formatCurrency(transaction.total)}</td>
                <td className="px-6 py-4 text-right font-semibold text-olive">{formatCurrency(transaction.profit)}</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={transaction.paymentStatus} /></td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => onViewDetails(transaction)} className="font-semibold text-xs text-coffee hover:text-coffee-hover transition-colors">
                    {t('details')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredTransactions.length === 0 && (
        <div className="text-center py-10 text-ink-muted">
          <p className="font-semibold">{t('noTransactionsForPeriod')}</p>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;