import React, { useState, useMemo } from 'react';
import { ProductionBatch, Product, RawMaterial, ProductionStatus } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { FlameIcon, EditIcon, TrashIcon, AddIcon, CloseIcon } from './icons';
import { calculateRestingStatus } from '../lib/roastingMath';

interface ProductionOrdersProps {
  batches: ProductionBatch[];
  products: Product[];
  rawMaterials: RawMaterial[];
  onOpenCreateModal: () => void;
  onEditBatch: (batch: ProductionBatch) => void;
  onDeleteBatch: (batchId: string) => void;
  formatCurrency: (amount: number) => string;
}

const StatusBadge: React.FC<{ status: ProductionStatus }> = ({ status }) => {
  const { t } = useTranslation();
  const config = {
    draft: { label: t('statusDraft'), color: 'bg-slate-700 text-slate-300 border-slate-600' },
    'in-progress': { label: t('statusInProgress'), color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
    completed: { label: t('statusCompleted'), color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
    cancelled: { label: t('statusCancelled'), color: 'bg-red-500/20 text-red-300 border-red-500/40' },
  }[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border ${config.color}`}>
      {config.label}
    </span>
  );
};

export const ProductionOrders: React.FC<ProductionOrdersProps> = ({
  batches,
  products,
  rawMaterials,
  onOpenCreateModal,
  onEditBatch,
  onDeleteBatch,
  formatCurrency,
}) => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBatchForDetail, setSelectedBatchForDetail] = useState<ProductionBatch | null>(null);

  // Helper to get product info
  const getProduct = (productId: number) => products.find(p => p.id === productId);

  // Metrics
  const totalBatchesCount = batches.length;

  const activeRestingCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return batches.filter(b => {
      if (!b.roastDate || !b.restingDays) return false;
      const roast = new Date(b.roastDate);
      roast.setHours(0, 0, 0, 0);
      const readyDate = new Date(roast.getTime() + b.restingDays * 24 * 60 * 60 * 1000);
      return today < readyDate && b.status === 'completed';
    }).length;
  }, [batches]);

  const avgWeightLoss = useMemo(() => {
    const withLoss = batches.filter(b => b.weightLossPercentage !== undefined && b.weightLossPercentage > 0);
    if (withLoss.length === 0) return 0;
    const sum = withLoss.reduce((acc, b) => acc + (b.weightLossPercentage || 0), 0);
    return parseFloat((sum / withLoss.length).toFixed(1));
  }, [batches]);

  const totalOutputVolume = useMemo(() => {
    return batches
      .filter(b => b.status === 'completed')
      .reduce((acc, b) => acc + (b.actualQuantity || b.targetQuantity || 0), 0);
  }, [batches]);

  // Filtered batches
  const filteredBatches = useMemo(() => {
    if (statusFilter === 'all') return batches;
    return batches.filter(b => b.status === statusFilter);
  }, [batches, statusFilter]);

  // Helper to calculate resting status using pure roastingMath module
  const getRestingInfo = (batch: ProductionBatch) => {
    const res = calculateRestingStatus(batch.roastDate, batch.restingDays);
    if (res.status === 'none') {
      return { status: 'none', label: '-' };
    }
    if (res.status === 'resting') {
      return {
        status: 'resting',
        label: t('restingDaysLeft').replace('{days}', String(res.daysRemaining)),
        daysLeft: res.daysRemaining,
      };
    }
    return {
      status: 'ready',
      label: t('readyToBrew'),
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
            <FlameIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              {t('productionTrackingTitle')}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Kelola batch sangrai roastery, pantau susut bobot (weight loss), dan masa resting kopi.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-lg text-sm shadow-md transition-all active:scale-95"
        >
          <AddIcon className="h-5 w-5" />
          <span>{t('fabAddProductionBatch')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            {t('totalBatches')}
          </span>
          <div className="text-2xl font-bold text-slate-100">{totalBatchesCount}</div>
          <span className="text-xs text-slate-500 mt-1 block">Semua status batch</span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold block mb-1">
            {t('activeResting')}
          </span>
          <div className="text-2xl font-bold text-amber-300">{activeRestingCount}</div>
          <span className="text-xs text-slate-500 mt-1 block">Menunggu kematangan seduh</span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            {t('avgWeightLoss')}
          </span>
          <div className="text-2xl font-bold text-orange-400">
            {avgWeightLoss > 0 ? `${avgWeightLoss}%` : '15.5%'}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Efisiensi susut sangrai</span>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            {t('totalOutputVolume')}
          </span>
          <div className="text-2xl font-bold text-emerald-400">
            {totalOutputVolume.toLocaleString('id-ID')}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Total unit/gram selesai</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-700 pb-2">
        {[
          { key: 'all', label: 'Semua Batch' },
          { key: 'completed', label: 'Selesai' },
          { key: 'in-progress', label: 'Sedang Proses' },
          { key: 'draft', label: 'Rencana' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              statusFilter === tab.key
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-850 border-b border-slate-700">
              <tr>
                <th scope="col" className="px-5 py-3.5">{t('batchNumber')}</th>
                <th scope="col" className="px-5 py-3.5">{t('targetProduct')}</th>
                <th scope="col" className="px-5 py-3.5">Output (Riil / Rencana)</th>
                <th scope="col" className="px-5 py-3.5">Susut & Yield</th>
                <th scope="col" className="px-5 py-3.5">Resting / Roast Date</th>
                <th scope="col" className="px-5 py-3.5">{t('unitCostHpp')}</th>
                <th scope="col" className="px-5 py-3.5">{t('productionStatus')}</th>
                <th scope="col" className="px-5 py-3.5 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {filteredBatches.map((batch) => {
                const product = getProduct(batch.targetProductId);
                const restingInfo = getRestingInfo(batch);

                return (
                  <tr key={batch.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono text-amber-300 font-semibold">{batch.batchNumber}</div>
                      <div className="text-xs text-slate-500">{batch.id}</div>
                      {batch.operatorName && (
                        <div className="text-[11px] text-slate-400 mt-0.5">By: {batch.operatorName}</div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-slate-700"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400">
                            ☕
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-100">{product?.name || `Produk #${batch.targetProductId}`}</div>
                          <div className="text-xs text-slate-400">
                            {product?.sellPrice === 0 ? 'Bahan Setengah Jadi' : formatCurrency(product?.sellPrice || 0)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-100">
                        {batch.actualQuantity || batch.targetQuantity}
                      </div>
                      <div className="text-xs text-slate-400">
                        Rencana: {batch.targetQuantity}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        {batch.weightLossPercentage !== undefined && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs font-mono font-medium">
                            Loss: {batch.weightLossPercentage}%
                          </span>
                        )}
                        {batch.yieldPercentage !== undefined && (
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-mono font-medium">
                            Yield: {batch.yieldPercentage}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        {restingInfo.status === 'resting' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            ⏳ {restingInfo.label}
                          </span>
                        ) : restingInfo.status === 'ready' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ✅ {restingInfo.label}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500">-</span>
                        )}
                        {batch.roastDate && (
                          <div className="text-[11px] text-slate-400 mt-1">
                            Roast: {new Date(batch.roastDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-100">
                        {batch.unitCost ? formatCurrency(batch.unitCost) : '-'}
                      </div>
                      <div className="text-xs text-slate-400">
                        Total: {batch.totalCost ? formatCurrency(batch.totalCost) : '-'}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={batch.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => setSelectedBatchForDetail(batch)}
                          className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium rounded transition-colors"
                          title="Lihat Kartu Sangrai"
                        >
                          Kartu Sangrai
                        </button>
                        <button
                          onClick={() => onEditBatch(batch)}
                          className="p-1.5 text-slate-400 hover:text-purple-400 rounded hover:bg-slate-700"
                          title={t('edit')}
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBatch(batch.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-700"
                          title={t('delete')}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredBatches.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-base">{t('noProductionBatches')}</p>
            <p className="text-sm mt-1">{t('pleaseAddBatch')}</p>
          </div>
        )}
      </div>

      {/* Batch Roast Card Modal */}
      {selectedBatchForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase text-amber-400 tracking-wider">Kartu Sangrai & Batch Produksi</span>
                <h3 className="text-2xl font-bold font-mono mt-0.5">{selectedBatchForDetail.batchNumber}</h3>
                <span className="text-xs text-slate-500">ID: {selectedBatchForDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedBatchForDetail(null)}
                className="text-slate-400 hover:text-slate-200 p-1"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              {/* Target Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
                <div>
                  <span className="text-xs text-slate-400 block">Produk Hasil</span>
                  <span className="font-semibold text-slate-100">
                    {getProduct(selectedBatchForDetail.targetProductId)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Output Riil</span>
                  <span className="font-semibold text-slate-100">
                    {selectedBatchForDetail.actualQuantity || selectedBatchForDetail.targetQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Roast Date</span>
                  <span className="font-semibold text-slate-100">
                    {selectedBatchForDetail.roastDate ? new Date(selectedBatchForDetail.roastDate).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Roaster</span>
                  <span className="font-semibold text-slate-100">
                    {selectedBatchForDetail.operatorName || '-'}
                  </span>
                </div>
              </div>

              {/* Input Breakdown */}
              <div>
                <h4 className="font-semibold text-slate-200 mb-2">Konsumsi Bahan Baku (Inputs)</h4>
                <div className="border border-slate-800 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left text-slate-300">
                    <thead className="bg-slate-800 text-slate-400 uppercase">
                      <tr>
                        <th className="px-3 py-2">Bahan</th>
                        <th className="px-3 py-2">Rencana</th>
                        <th className="px-3 py-2">Terpakai (Riil)</th>
                        <th className="px-3 py-2">Biaya Satuan</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedBatchForDetail.inputs.map((inp, idx) => {
                        const mat = rawMaterials.find(m => m.id === inp.itemId);
                        const qty = inp.actualQuantity || inp.plannedQuantity;
                        const sub = qty * (inp.costPerUnit || 0);
                        return (
                          <tr key={idx}>
                            <td className="px-3 py-2 font-medium text-slate-100">
                              {mat?.name || `Bahan #${inp.itemId}`}
                            </td>
                            <td className="px-3 py-2">{inp.plannedQuantity} {inp.unit}</td>
                            <td className="px-3 py-2 font-semibold text-amber-300">{inp.actualQuantity} {inp.unit}</td>
                            <td className="px-3 py-2">{formatCurrency(inp.costPerUnit || 0)}</td>
                            <td className="px-3 py-2 text-right font-medium">{formatCurrency(sub)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial & Yield Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-400 block">Biaya Tenaga Kerja:</span>
                  <span className="font-medium text-slate-200">{formatCurrency(selectedBatchForDetail.directLaborCost || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Biaya Overhead:</span>
                  <span className="font-medium text-slate-200">{formatCurrency(selectedBatchForDetail.overheadCost || 0)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Total Biaya Batch:</span>
                  <span className="font-semibold text-slate-100">{formatCurrency(selectedBatchForDetail.totalCost || 0)}</span>
                </div>
                <div>
                  <span className="text-amber-400 block font-bold">HPP Riil / Satuan:</span>
                  <span className="font-bold text-amber-300 text-sm">{formatCurrency(selectedBatchForDetail.unitCost || 0)}</span>
                </div>
              </div>

              {/* Roasting Profile Notes */}
              {selectedBatchForDetail.notes && (
                <div className="bg-slate-850 p-3 rounded-lg border border-slate-800 text-xs">
                  <span className="text-slate-400 block font-semibold mb-1">Catatan Roasting Profile:</span>
                  <p className="text-slate-300 whitespace-pre-wrap">{selectedBatchForDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => setSelectedBatchForDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionOrders;
