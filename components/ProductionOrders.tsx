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
    draft: { label: t('statusDraft'), color: 'bg-mineral-light text-ink-muted border-mineral' },
    'in-progress': { label: t('statusInProgress'), color: 'bg-oxide-subtle text-oxide border-oxide/30' },
    completed: { label: t('statusCompleted'), color: 'bg-olive-subtle text-olive border-olive/30' },
    cancelled: { label: t('statusCancelled'), color: 'bg-danger-subtle text-danger border-danger/30' },
  }[status];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full border ${config.color}`}>
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bone-light border border-mineral rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-coffee/10 text-coffee rounded-xl">
            <FlameIcon className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink tracking-tight">
              {t('productionTrackingTitle')}
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Kelola batch sangrai roastery, pantau susut bobot (weight loss), dan masa resting kopi.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="flex items-center space-x-2 px-4 py-2.5 bg-coffee hover:bg-coffee-hover text-bone font-semibold rounded-lg text-xs shadow-sm transition-all active:scale-95"
        >
          <AddIcon className="h-4 w-4" />
          <span>{t('fabAddProductionBatch')}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bone-light border border-mineral rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block mb-1">
            {t('totalBatches')}
          </span>
          <div className="text-2xl font-bold text-ink">{totalBatchesCount}</div>
          <span className="text-[11px] text-ink-faint mt-1 block">Semua status batch</span>
        </div>

        <div className="bg-bone-light border border-mineral rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-oxide uppercase tracking-wider font-semibold block mb-1">
            {t('activeResting')}
          </span>
          <div className="text-2xl font-bold text-oxide">{activeRestingCount}</div>
          <span className="text-[11px] text-ink-faint mt-1 block">Menunggu kematangan seduh</span>
        </div>

        <div className="bg-bone-light border border-mineral rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-coffee uppercase tracking-wider font-semibold block mb-1">
            {t('avgWeightLoss')}
          </span>
          <div className="text-2xl font-bold text-coffee">
            {avgWeightLoss > 0 ? `${avgWeightLoss}%` : '15.5%'}
          </div>
          <span className="text-[11px] text-ink-faint mt-1 block">Efisiensi susut sangrai</span>
        </div>

        <div className="bg-bone-light border border-mineral rounded-xl p-4 shadow-sm">
          <span className="text-[11px] text-olive uppercase tracking-wider font-semibold block mb-1">
            {t('totalOutputVolume')}
          </span>
          <div className="text-2xl font-bold text-olive">
            {totalOutputVolume.toLocaleString('id-ID')}
          </div>
          <span className="text-[11px] text-ink-faint mt-1 block">Total unit/gram selesai</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-mineral pb-2">
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
                ? 'bg-coffee text-bone shadow-sm'
                : 'text-ink-muted hover:text-ink hover:bg-mineral-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-bone-light border border-mineral rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-ink-muted">
            <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
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
            <tbody className="divide-y divide-mineral/60">
              {filteredBatches.map((batch) => {
                const product = getProduct(batch.targetProductId);
                const restingInfo = getRestingInfo(batch);

                return (
                  <tr key={batch.id} className="hover:bg-bone transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono text-coffee font-bold">{batch.batchNumber}</div>
                      <div className="text-[11px] text-ink-faint">{batch.id}</div>
                      {batch.operatorName && (
                        <div className="text-[11px] text-ink-muted mt-0.5">By: {batch.operatorName}</div>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        {product?.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-10 w-10 rounded-lg object-cover border border-mineral"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-mineral-light flex items-center justify-center text-ink-muted">
                            ☕
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-ink">{product?.name || `Produk #${batch.targetProductId}`}</div>
                          <div className="text-xs text-ink-muted">
                            {product?.sellPrice === 0 ? 'Bahan Setengah Jadi' : formatCurrency(product?.sellPrice || 0)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-ink">
                        {batch.actualQuantity || batch.targetQuantity}
                      </div>
                      <div className="text-xs text-ink-muted">
                        Rencana: {batch.targetQuantity}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-2">
                        {batch.weightLossPercentage !== undefined && (
                          <span className="px-2 py-0.5 bg-oxide-subtle text-oxide border border-oxide/30 rounded text-xs font-mono font-medium">
                            Loss: {batch.weightLossPercentage}%
                          </span>
                        )}
                        {batch.yieldPercentage !== undefined && (
                          <span className="px-2 py-0.5 bg-olive-subtle text-olive border border-olive/30 rounded text-xs font-mono font-medium">
                            Yield: {batch.yieldPercentage}%
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        {restingInfo.status === 'resting' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-oxide-subtle text-oxide border border-oxide/30">
                            ⏳ {restingInfo.label}
                          </span>
                        ) : restingInfo.status === 'ready' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-olive-subtle text-olive border border-olive/30">
                            ✅ {restingInfo.label}
                          </span>
                        ) : (
                          <span className="text-xs text-ink-faint">-</span>
                        )}
                        {batch.roastDate && (
                          <div className="text-[11px] text-ink-muted mt-1">
                            Roast: {new Date(batch.roastDate).toLocaleDateString('id-ID')}
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink">
                        {batch.unitCost ? formatCurrency(batch.unitCost) : '-'}
                      </div>
                      <div className="text-xs text-ink-muted">
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
                          className="px-2.5 py-1 bg-mineral-light hover:bg-mineral text-ink text-xs font-medium rounded-lg transition-colors border border-mineral"
                          title="Lihat Kartu Sangrai"
                        >
                          Kartu Sangrai
                        </button>
                        <button
                          onClick={() => onEditBatch(batch)}
                          className="p-1.5 text-coffee hover:text-coffee-hover rounded hover:bg-mineral-light transition-colors"
                          title={t('edit')}
                        >
                          <EditIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteBatch(batch.id)}
                          className="p-1.5 text-danger hover:text-danger-hover rounded hover:bg-mineral-light transition-colors"
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
          <div className="text-center py-12 text-ink-muted">
            <p className="font-semibold">{t('noProductionBatches')}</p>
            <p className="text-xs text-ink-faint mt-1">{t('pleaseAddBatch')}</p>
          </div>
        )}
      </div>

      {/* Batch Roast Card Modal */}
      {selectedBatchForDetail && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-bone-light border border-mineral rounded-2xl max-w-2xl w-full p-6 text-ink shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-mineral pb-4 mb-4">
              <div>
                <span className="text-xs font-semibold uppercase text-coffee tracking-wider">Kartu Sangrai & Batch Produksi</span>
                <h3 className="text-2xl font-bold font-mono mt-0.5 text-ink">{selectedBatchForDetail.batchNumber}</h3>
                <span className="text-xs text-ink-muted">ID: {selectedBatchForDetail.id}</span>
              </div>
              <button
                onClick={() => setSelectedBatchForDetail(null)}
                className="text-ink-muted hover:text-ink p-1"
              >
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-mineral-light/60 p-3.5 rounded-xl border border-mineral">
                <div>
                  <span className="text-ink-muted block">Produk Hasil</span>
                  <span className="font-semibold text-ink text-sm">
                    {getProduct(selectedBatchForDetail.targetProductId)?.name}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block">Output Riil</span>
                  <span className="font-semibold text-ink text-sm">
                    {selectedBatchForDetail.actualQuantity || selectedBatchForDetail.targetQuantity}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block">Roast Date</span>
                  <span className="font-semibold text-ink">
                    {selectedBatchForDetail.roastDate ? new Date(selectedBatchForDetail.roastDate).toLocaleDateString('id-ID') : '-'}
                  </span>
                </div>
                <div>
                  <span className="text-ink-muted block">Roaster</span>
                  <span className="font-semibold text-ink">
                    {selectedBatchForDetail.operatorName || '-'}
                  </span>
                </div>
              </div>

              {/* Input Breakdown */}
              <div>
                <h4 className="font-semibold text-ink mb-2">Konsumsi Bahan Baku (Inputs)</h4>
                <div className="border border-mineral rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left text-ink-muted">
                    <thead className="bg-mineral-light/60 text-ink uppercase border-b border-mineral">
                      <tr>
                        <th className="px-3 py-2">Bahan</th>
                        <th className="px-3 py-2">Rencana</th>
                        <th className="px-3 py-2">Terpakai (Riil)</th>
                        <th className="px-3 py-2">Biaya Satuan</th>
                        <th className="px-3 py-2 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mineral/60">
                      {selectedBatchForDetail.inputs.map((inp, idx) => {
                        const mat = rawMaterials.find(m => m.id === inp.itemId);
                        const qty = inp.actualQuantity || inp.plannedQuantity;
                        const sub = qty * (inp.costPerUnit || 0);
                        return (
                          <tr key={idx} className="hover:bg-bone">
                            <td className="px-3 py-2 font-semibold text-ink">
                              {mat?.name || `Bahan #${inp.itemId}`}
                            </td>
                            <td className="px-3 py-2">{inp.plannedQuantity} {inp.unit}</td>
                            <td className="px-3 py-2 font-bold text-coffee">{inp.actualQuantity} {inp.unit}</td>
                            <td className="px-3 py-2">{formatCurrency(inp.costPerUnit || 0)}</td>
                            <td className="px-3 py-2 text-right font-semibold text-ink">{formatCurrency(sub)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial & Yield Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-mineral-light/40 p-3 rounded-xl border border-mineral">
                <div>
                  <span className="text-ink-muted block">Biaya Tenaga Kerja:</span>
                  <span className="font-medium text-ink">{formatCurrency(selectedBatchForDetail.directLaborCost || 0)}</span>
                </div>
                <div>
                  <span className="text-ink-muted block">Biaya Overhead:</span>
                  <span className="font-medium text-ink">{formatCurrency(selectedBatchForDetail.overheadCost || 0)}</span>
                </div>
                <div>
                  <span className="text-ink-muted block">Total Biaya Batch:</span>
                  <span className="font-bold text-ink">{formatCurrency(selectedBatchForDetail.totalCost || 0)}</span>
                </div>
                <div>
                  <span className="text-coffee block font-bold">HPP Riil / Satuan:</span>
                  <span className="font-bold text-coffee text-sm">{formatCurrency(selectedBatchForDetail.unitCost || 0)}</span>
                </div>
              </div>

              {/* Roasting Profile Notes */}
              {selectedBatchForDetail.notes && (
                <div className="bg-mineral-light/60 p-3 rounded-lg border border-mineral text-xs">
                  <span className="text-ink font-semibold block mb-1">Catatan Roasting Profile:</span>
                  <p className="text-ink-muted whitespace-pre-wrap">{selectedBatchForDetail.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-mineral">
              <button
                onClick={() => setSelectedBatchForDetail(null)}
                className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink text-xs font-semibold rounded-lg transition-colors"
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
