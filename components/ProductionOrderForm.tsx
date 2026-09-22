import React, { useState, useEffect, useMemo } from 'react';
import { ProductionBatch, ProductionInputItem, ProductionStatus, Product, RawMaterial } from '../types';
import { useTranslation } from '../context/LanguageContext';
import { AddIcon, TrashIcon, FlameIcon } from './icons';

interface ProductionOrderFormProps {
  onSave: (batchData: Omit<ProductionBatch, 'id'>, id?: string) => Promise<void> | void;
  onClose: () => void;
  editingBatch: ProductionBatch | null;
  products: Product[];
  rawMaterials: RawMaterial[];
  formatCurrency: (val: number) => string;
}

export const ProductionOrderForm: React.FC<ProductionOrderFormProps> = ({
  onSave,
  onClose,
  editingBatch,
  products,
  rawMaterials,
  formatCurrency,
}) => {
  const { t } = useTranslation();

  const isEditing = !!editingBatch;

  // Form State
  const [batchNumber, setBatchNumber] = useState('');
  const [targetProductId, setTargetProductId] = useState<number>(0);
  const [targetQuantity, setTargetQuantity] = useState<string>('100');
  const [actualQuantity, setActualQuantity] = useState<string>('');
  const [productionDate, setProductionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [roastDate, setRoastDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [restingDays, setRestingDays] = useState<string>('7');
  const [operatorName, setOperatorName] = useState<string>('');
  const [status, setStatus] = useState<ProductionStatus>('completed');
  const [directLaborCost, setDirectLaborCost] = useState<string>('');
  const [overheadCost, setOverheadCost] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Inputs
  const [inputs, setInputs] = useState<ProductionInputItem[]>([]);
  const [selectedRawMaterialId, setSelectedRawMaterialId] = useState<number>(0);

  // Initialize or fill editing batch
  useEffect(() => {
    if (isEditing && editingBatch) {
      setBatchNumber(editingBatch.batchNumber);
      setTargetProductId(editingBatch.targetProductId);
      setTargetQuantity(String(editingBatch.targetQuantity));
      setActualQuantity(editingBatch.actualQuantity ? String(editingBatch.actualQuantity) : '');
      setProductionDate(new Date(editingBatch.productionDate).toISOString().split('T')[0]);
      setRoastDate(editingBatch.roastDate ? new Date(editingBatch.roastDate).toISOString().split('T')[0] : '');
      setRestingDays(String(editingBatch.restingDays ?? 7));
      setOperatorName(editingBatch.operatorName || '');
      setStatus(editingBatch.status);
      setDirectLaborCost(editingBatch.directLaborCost ? String(editingBatch.directLaborCost) : '');
      setOverheadCost(editingBatch.overheadCost ? String(editingBatch.overheadCost) : '');
      setNotes(editingBatch.notes || '');
      setInputs(editingBatch.inputs || []);
    } else {
      // Default auto batch number based on current date
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      setBatchNumber(`LOT-${todayStr}-01`);
      if (products.length > 0) {
        const firstProd = products[0];
        setTargetProductId(firstProd.id);
        setDirectLaborCost(firstProd.directLaborCost ? String(firstProd.directLaborCost) : '');
        setOverheadCost(firstProd.productionOverheadCost ? String(firstProd.productionOverheadCost) : '');
        // Auto-load recipe for first product
        loadRecipeForProduct(firstProd, 100);
      }
      setTargetQuantity('100');
      setActualQuantity('95');
      setProductionDate(new Date().toISOString().split('T')[0]);
      setRoastDate(new Date().toISOString().split('T')[0]);
      setRestingDays('7');
      setOperatorName('');
      setStatus('completed');
      setNotes('');
    }
  }, [editingBatch, isEditing]);

  // Set default raw material selector
  useEffect(() => {
    if (rawMaterials.length > 0 && selectedRawMaterialId === 0) {
      setSelectedRawMaterialId(rawMaterials[0].id);
    }
  }, [rawMaterials, selectedRawMaterialId]);

  // Helper to load recipe into inputs
  const loadRecipeForProduct = (prod: Product, targetQty: number) => {
    if (!prod.recipe || prod.recipe.length === 0) return;

    const generatedInputs: ProductionInputItem[] = [];

    const recurseRecipe = (itemRecipe: Product['recipe'], multiplier: number) => {
      itemRecipe.forEach(item => {
        if (item.itemType === 'raw-material') {
          const mat = rawMaterials.find(m => m.id === item.itemId);
          const planned = item.quantity * multiplier;
          generatedInputs.push({
            itemId: item.itemId,
            itemType: 'raw-material',
            plannedQuantity: planned,
            actualQuantity: planned, // default actual to planned
            unit: mat?.unit || 'gram',
            costPerUnit: mat?.costPerUnit || 0,
          });
        } else {
          // sub-product
          const subProd = products.find(p => p.id === item.itemId);
          if (subProd) {
            recurseRecipe(subProd.recipe, item.quantity * multiplier);
          }
        }
      });
    };

    recurseRecipe(prod.recipe, targetQty);
    setInputs(generatedInputs);
  };

  const handleTargetProductChange = (newProductId: number) => {
    setTargetProductId(newProductId);
    const prod = products.find(p => p.id === newProductId);
    if (prod) {
      if (prod.directLaborCost) setDirectLaborCost(String(prod.directLaborCost));
      if (prod.productionOverheadCost) setOverheadCost(String(prod.productionOverheadCost));
      const parsedQty = parseFloat(targetQuantity) || 1;
      loadRecipeForProduct(prod, parsedQty);
    }
  };

  const handleApplyRecipe = () => {
    const prod = products.find(p => p.id === targetProductId);
    const parsedQty = parseFloat(targetQuantity) || 1;
    if (prod) {
      loadRecipeForProduct(prod, parsedQty);
    }
  };

  // Input modifications
  const handleAddInput = () => {
    if (selectedRawMaterialId === 0) return;
    const mat = rawMaterials.find(m => m.id === selectedRawMaterialId);
    if (!mat) return;

    // Check if already in inputs
    const existingIndex = inputs.findIndex(i => i.itemId === mat.id && i.itemType === 'raw-material');
    if (existingIndex > -1) {
      alert('Bahan ini sudah ada dalam daftar input.');
      return;
    }

    setInputs([
      ...inputs,
      {
        itemId: mat.id,
        itemType: 'raw-material',
        plannedQuantity: 100,
        actualQuantity: 100,
        unit: mat.unit,
        costPerUnit: mat.costPerUnit,
      },
    ]);
  };

  const handleRemoveInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleUpdateInputActualQty = (index: number, val: number) => {
    const updated = [...inputs];
    updated[index].actualQuantity = val;
    setInputs(updated);
  };

  const handleUpdateInputPlannedQty = (index: number, val: number) => {
    const updated = [...inputs];
    updated[index].plannedQuantity = val;
    setInputs(updated);
  };

  // Calculations
  const totalInputCost = useMemo(() => {
    return inputs.reduce((acc, input) => {
      const qty = input.actualQuantity || input.plannedQuantity || 0;
      const cost = input.costPerUnit || 0;
      return acc + qty * cost;
    }, 0);
  }, [inputs]);

  const parsedLabor = parseFloat(directLaborCost) || 0;
  const parsedOverhead = parseFloat(overheadCost) || 0;
  const totalBatchCost = totalInputCost + parsedLabor + parsedOverhead;

  const parsedActualQty = parseFloat(actualQuantity) || 0;
  const parsedTargetQty = parseFloat(targetQuantity) || 0;

  // Real Unit Cost (HPP Riil)
  const unitCost = parsedActualQty > 0 ? totalBatchCost / parsedActualQty : parsedTargetQty > 0 ? totalBatchCost / parsedTargetQty : 0;

  // Total weight of inputs (for gram units)
  const totalInputWeightGram = useMemo(() => {
    return inputs
      .filter(i => i.unit === 'gram')
      .reduce((acc, i) => acc + (i.actualQuantity || i.plannedQuantity || 0), 0);
  }, [inputs]);

  // Weight loss % calculation (Roasting Shrinkage)
  // If target product or inputs are weighed in grams
  const weightLossPercentage = useMemo(() => {
    if (totalInputWeightGram > 0 && parsedActualQty > 0) {
      // If output is recorded in grams, or if target output matches
      const loss = ((totalInputWeightGram - parsedActualQty) / totalInputWeightGram) * 100;
      return Math.max(0, parseFloat(loss.toFixed(1)));
    }
    return undefined;
  }, [totalInputWeightGram, parsedActualQty]);

  // Yield %
  const yieldPercentage = useMemo(() => {
    if (parsedTargetQty > 0 && parsedActualQty > 0) {
      return parseFloat(((parsedActualQty / parsedTargetQty) * 100).toFixed(1));
    }
    return undefined;
  }, [parsedTargetQty, parsedActualQty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!batchNumber.trim()) {
      alert(t('batchNumberRequired'));
      return;
    }
    if (!targetProductId) {
      alert(t('targetProductRequired'));
      return;
    }

    const batchData: Omit<ProductionBatch, 'id'> = {
      batchNumber: batchNumber.trim(),
      targetProductId,
      targetQuantity: parsedTargetQty,
      actualQuantity: parsedActualQty || parsedTargetQty,
      productionDate: new Date(productionDate),
      roastDate: roastDate ? new Date(roastDate) : undefined,
      restingDays: parseInt(restingDays, 10) || 0,
      operatorName: operatorName.trim() || undefined,
      status,
      inputs,
      directLaborCost: parsedLabor,
      overheadCost: parsedOverhead,
      totalCost: totalBatchCost,
      unitCost: Math.round(unitCost),
      yieldPercentage,
      weightLossPercentage,
      notes: notes.trim() || undefined,
    };

    onSave(batchData, editingBatch?.id);
    onClose();
  };

  return (
    <div className="text-ink max-h-[85vh] overflow-y-auto px-1">
      <div className="flex items-center space-x-3 mb-6 border-b border-mineral pb-4">
        <div className="p-2.5 bg-coffee/10 text-coffee rounded-xl">
          <FlameIcon className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            {isEditing ? 'Edit Batch Produksi' : 'Mulai Batch Roasting / Produksi'}
          </h2>
          <p className="text-xs text-ink-muted">
            Catat pemakaian bahan mentah (Green Beans), susut bobot sangrai, dan HPP aktual per satuan.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Identification & Target */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">{t('batchNumber')} *</label>
            <input
              type="text"
              value={batchNumber}
              onChange={(e) => setBatchNumber(e.target.value)}
              required
              placeholder="LOT-20260920-01"
              className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-coffee font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">{t('targetProduct')} *</label>
            <select
              value={targetProductId}
              onChange={(e) => handleTargetProductChange(parseInt(e.target.value, 10))}
              className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-coffee text-xs"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} {p.sellPrice === 0 ? '(Bahan Setengah Jadi)' : `(${formatCurrency(p.sellPrice)})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-muted mb-1">{t('operator')}</label>
            <input
              type="text"
              value={operatorName}
              onChange={(e) => setOperatorName(e.target.value)}
              placeholder="Nama Roaster / Operator"
              className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink focus:outline-none focus:border-coffee text-xs"
            />
          </div>
        </div>

        {/* Section 2: Quantities, Dates & Resting */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-mineral-light/40 p-4 rounded-xl border border-mineral">
          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">{t('plannedQuantity')}</label>
            <input
              type="number"
              min="0"
              step="any"
              value={targetQuantity}
              onChange={(e) => setTargetQuantity(e.target.value)}
              required
              className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-coffee"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-coffee mb-1 uppercase tracking-wider">{t('actualQuantity')} (Riil)</label>
            <input
              type="number"
              min="0"
              step="any"
              value={actualQuantity}
              onChange={(e) => setActualQuantity(e.target.value)}
              placeholder="Hasil Timbangan Akhir"
              className="w-full bg-bone border border-coffee/50 rounded-lg px-3 py-2 text-coffee text-xs font-bold focus:outline-none focus:border-coffee"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">{t('roastDate')}</label>
            <input
              type="date"
              value={roastDate}
              onChange={(e) => setRoastDate(e.target.value)}
              className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-coffee"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink-muted mb-1 uppercase tracking-wider">{t('restingDays')}</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                value={restingDays}
                onChange={(e) => setRestingDays(e.target.value)}
                className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-coffee"
              />
              <span className="text-xs text-ink-muted whitespace-nowrap">Hari</span>
            </div>
          </div>
        </div>

        {/* Section 3: Input Raw Materials */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-ink flex items-center space-x-2">
              <span>{t('inputMaterials')} (BOM)</span>
              <span className="text-xs font-normal text-ink-muted">
                - Akan otomatis dipotong dari stok saat status "Selesai"
              </span>
            </h3>
            <button
              type="button"
              onClick={handleApplyRecipe}
              className="px-3 py-1 bg-mineral-light hover:bg-mineral text-ink text-xs font-semibold rounded-lg transition-colors border border-mineral"
            >
              {t('loadRecipe')}
            </button>
          </div>

          {/* Table of inputs */}
          <div className="overflow-x-auto border border-mineral rounded-xl bg-bone-light shadow-sm">
            <table className="w-full text-sm text-left text-ink-muted">
              <thead className="text-xs text-ink uppercase bg-mineral-light/60 border-b border-mineral">
                <tr>
                  <th scope="col" className="px-4 py-2.5">Bahan Mentah</th>
                  <th scope="col" className="px-4 py-2.5">{t('plannedInput')}</th>
                  <th scope="col" className="px-4 py-2.5">{t('actualInput')}</th>
                  <th scope="col" className="px-4 py-2.5">Biaya / Satuan</th>
                  <th scope="col" className="px-4 py-2.5">Subtotal</th>
                  <th scope="col" className="px-2 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mineral/60">
                {inputs.map((input, idx) => {
                  const mat = rawMaterials.find(m => m.id === input.itemId);
                  const subtotal = (input.actualQuantity || input.plannedQuantity || 0) * (input.costPerUnit || 0);
                  return (
                    <tr key={idx} className="hover:bg-bone">
                      <td className="px-4 py-2 font-semibold text-xs text-ink">
                        {mat?.name || `Item #${input.itemId}`}
                        <span className="ml-2 text-xs text-ink-muted font-mono">({input.unit})</span>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="any"
                          value={input.plannedQuantity}
                          onChange={(e) => handleUpdateInputPlannedQty(idx, parseFloat(e.target.value) || 0)}
                          className="w-24 bg-bone border border-mineral rounded px-2 py-1 text-xs text-ink"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          step="any"
                          value={input.actualQuantity}
                          onChange={(e) => handleUpdateInputActualQty(idx, parseFloat(e.target.value) || 0)}
                          className="w-24 bg-bone border border-coffee/50 rounded px-2 py-1 text-xs text-coffee font-bold"
                        />
                      </td>
                      <td className="px-4 py-2 text-xs text-ink-muted">
                        {formatCurrency(input.costPerUnit || 0)} / {input.unit}
                      </td>
                      <td className="px-4 py-2 font-semibold text-ink text-xs">
                        {formatCurrency(subtotal)}
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveInput(idx)}
                          className="text-danger hover:text-danger-hover p-1 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add extra input selector */}
          <div className="flex items-center space-x-2 pt-1">
            <select
              value={selectedRawMaterialId}
              onChange={(e) => setSelectedRawMaterialId(parseInt(e.target.value, 10))}
              className="bg-bone border border-mineral rounded-lg px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-coffee"
            >
              {rawMaterials.map(m => (
                <option key={m.id} value={m.id}>
                  + {m.name} ({m.stock} {m.unit} tersedia)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddInput}
              className="flex items-center space-x-1 px-3 py-1.5 bg-mineral-light hover:bg-mineral text-ink text-xs font-semibold rounded-lg transition-colors border border-mineral"
            >
              <AddIcon className="h-3.5 w-3.5" />
              <span>Tambah Bahan</span>
            </button>
          </div>
        </div>

        {/* Section 4: Costs & Roasting Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-mineral-light/40 p-4 rounded-xl border border-mineral space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Biaya Konversi (Labor & Overhead)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-ink-muted mb-1">{t('directLaborCost')}</label>
                <input
                  type="number"
                  min="0"
                  value={directLaborCost}
                  onChange={(e) => setDirectLaborCost(e.target.value)}
                  placeholder="Rp 0"
                  className="w-full bg-bone border border-mineral rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-coffee"
                />
              </div>
              <div>
                <label className="block text-xs text-ink-muted mb-1">{t('overheadCost')}</label>
                <input
                  type="number"
                  min="0"
                  value={overheadCost}
                  onChange={(e) => setOverheadCost(e.target.value)}
                  placeholder="Rp 0"
                  className="w-full bg-bone border border-mineral rounded-lg px-3 py-1.5 text-ink text-xs focus:outline-none focus:border-coffee"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-mineral space-y-1 text-xs">
              <div className="flex justify-between text-ink-muted">
                <span>Total Biaya Bahan Input:</span>
                <span className="font-semibold text-ink">{formatCurrency(totalInputCost)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Total Biaya Batch:</span>
                <span className="font-semibold text-ink">{formatCurrency(totalBatchCost)}</span>
              </div>
              <div className="flex justify-between text-coffee font-bold text-sm pt-1">
                <span>HPP Aktual / Satuan:</span>
                <span>{formatCurrency(Math.round(unitCost))}</span>
              </div>
            </div>
          </div>

          <div className="bg-mineral-light/40 p-4 rounded-xl border border-mineral space-y-3">
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Kalkulasi Rendemen & Roasting</h4>
            
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-bone p-3 rounded-lg border border-mineral">
                <span className="block text-xs text-ink-muted">Susut Roasting (Loss)</span>
                <span className="text-xl font-bold text-oxide">
                  {weightLossPercentage !== undefined ? `${weightLossPercentage}%` : '-'}
                </span>
                <span className="text-[11px] text-ink-faint block mt-0.5">
                  {totalInputWeightGram > 0 ? `Input: ${totalInputWeightGram}g` : 'Standar: 14 - 18%'}
                </span>
              </div>

              <div className="bg-bone p-3 rounded-lg border border-mineral">
                <span className="block text-xs text-ink-muted">Rendemen (Yield Rate)</span>
                <span className="text-xl font-bold text-olive">
                  {yieldPercentage !== undefined ? `${yieldPercentage}%` : '-'}
                </span>
                <span className="text-[11px] text-ink-faint block mt-0.5">
                  Output vs Target
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs text-ink-muted mb-1">{t('productionStatus')}</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductionStatus)}
                className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink text-xs font-medium focus:outline-none focus:border-coffee"
              >
                <option value="draft">Draf Rencana</option>
                <option value="in-progress">Sedang Roasting / Proses</option>
                <option value="completed">Selesai (Potong Stok Bahan Otomatis)</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Roast Profile & Notes */}
        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-1">{t('roastNotes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Contoh: First crack di 09:12 (temp 196°C), drop di 11:30 (temp 208°C). Karakter floral citrus, sweetness tinggi."
            className="w-full bg-bone border border-mineral rounded-lg px-3 py-2 text-ink text-xs focus:outline-none focus:border-coffee"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-mineral">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg font-semibold text-xs transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-coffee hover:bg-coffee-hover text-bone font-semibold rounded-lg text-xs shadow-sm transition-transform transform active:scale-95"
          >
            {isEditing ? 'Simpan Perubahan Batch' : 'Terbitkan Batch Produksi'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductionOrderForm;
