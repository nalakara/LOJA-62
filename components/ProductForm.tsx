import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, RawMaterial, RecipeItem } from '../types';
import { AddIcon, TrashIcon, ImageIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';
import { calculateHpp } from '../lib/bomEngine';

interface ProductFormProps {
  onSaveProduct: (product: Omit<Product, 'id'>, id?: number) => void;
  onClose: () => void;
  categories: Category[];
  editingProduct: Product | null;
  rawMaterials: RawMaterial[];
  products: Product[];
  formatCurrency: (amount: number) => string;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSaveProduct, onClose, categories, editingProduct, rawMaterials, products, formatCurrency }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [sellPrice, setSellPrice] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState<string>('');
  const [directLaborCost, setDirectLaborCost] = useState('');
  const [productionOverheadCost, setProductionOverheadCost] = useState('');
  const [recipe, setRecipe] = useState<RecipeItem[]>([]);
  
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [itemQuantity, setItemQuantity] = useState('');

  const isEditing = !!editingProduct;

  useEffect(() => {
    if (categories.length > 0 && !isEditing) {
        setCategoryId(String(categories[0].id));
    }
  }, [categories, isEditing]);
  
  const availableProducts = useMemo(() => {
    return products.filter(p => p.id !== editingProduct?.id);
  }, [products, editingProduct]);

  useEffect(() => {
    if (availableProducts.length > 0) {
        setSelectedItemId(`product-${availableProducts[0].id}`);
    } else if (rawMaterials.length > 0) {
        setSelectedItemId(`raw-material-${rawMaterials[0].id}`);
    }
  }, [availableProducts, rawMaterials]);

  useEffect(() => {
    if (isEditing && editingProduct) {
      setName(editingProduct.name);
      setCategoryId(String(editingProduct.categoryId));
      setSellPrice(String(editingProduct.sellPrice));
      setImageDataUrl(editingProduct.imageUrl);
      setDirectLaborCost(String(editingProduct.directLaborCost || ''));
      setProductionOverheadCost(String(editingProduct.productionOverheadCost || ''));
      setRecipe(editingProduct.recipe || []);
    } else {
      setName('');
      if (categories.length > 0) {
        setCategoryId(String(categories[0].id));
      }
      setSellPrice('');
      setImageDataUrl('');
      setDirectLaborCost('');
      setProductionOverheadCost('');
      setRecipe([]);
    }
  }, [editingProduct, categories, isEditing]);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageDataUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleAddRecipeItem = () => {
    if (!selectedItemId || !itemQuantity || parseFloat(itemQuantity) <= 0) {
        alert(t('pleaseEnterValidQuantity'));
        return;
    }

    const [itemType, itemIdStr] = selectedItemId.split('-');
    const itemId = parseInt(itemIdStr, 10);
    const quantity = parseFloat(itemQuantity);

    const existingItemIndex = recipe.findIndex(item => item.itemId === itemId && item.itemType === itemType);

    if(existingItemIndex > -1) {
        const updatedRecipe = [...recipe];
        updatedRecipe[existingItemIndex].quantity += quantity;
        setRecipe(updatedRecipe);
    } else {
        setRecipe([...recipe, { itemId, itemType: itemType as 'product' | 'raw-material', quantity }]);
    }
    setItemQuantity('');
  };
  
  const handleRemoveRecipeItem = (itemId: number, itemType: 'product' | 'raw-material') => {
    setRecipe(recipe.filter(item => !(item.itemId === itemId && item.itemType === itemType)));
  };

  const getRecipeItemName = (item: RecipeItem) => {
    if (item.itemType === 'raw-material') {
        return rawMaterials.find(m => m.id === item.itemId)?.name || 'Unknown Material';
    }
    return products.find(p => p.id === item.itemId)?.name || 'Unknown Product';
  };

  const getRecipeItemUnit = (item: RecipeItem) => {
      if (item.itemType === 'raw-material') {
          return rawMaterials.find(m => m.id === item.itemId)?.unit || 'unit';
      }
      return 'pcs';
  }

  const materialCost = useMemo(() => {
    return recipe.reduce((total, item) => {
      if (item.itemType === 'raw-material') {
        const material = rawMaterials.find(rm => rm.id === item.itemId);
        return total + (material ? material.costPerUnit * item.quantity : 0);
      } else {
        const subProduct = products.find(p => p.id === item.itemId);
        return total + (subProduct ? calculateHpp(subProduct, products, rawMaterials) * item.quantity : 0);
      }
    }, 0);
  }, [recipe, rawMaterials, products]);
  
  const hpp = useMemo(() => {
      const labor = parseFloat(directLaborCost) || 0;
      const overhead = parseFloat(productionOverheadCost) || 0;
      return materialCost + labor + overhead;
  }, [materialCost, directLaborCost, productionOverheadCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellPrice || !categoryId) {
        alert(t('productNameRequired'));
        return;
    }
    
    const finalImageUrl = imageDataUrl || `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/300`;

    onSaveProduct({
      name,
      categoryId: parseInt(categoryId, 10),
      sellPrice: parseFloat(sellPrice),
      imageUrl: finalImageUrl,
      recipe,
      directLaborCost: parseFloat(directLaborCost) || 0,
      productionOverheadCost: parseFloat(productionOverheadCost) || 0,
    }, editingProduct?.id);
  };

  const formInputClass = "w-full px-3 py-2 bg-bone border border-mineral rounded-lg text-xs text-ink placeholder-ink-faint focus:outline-none focus:border-coffee transition-colors";

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-ink mb-6">{isEditing ? t('editProduct') : t('addNewProduct')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-ink-muted mb-1">{t('productImage')}</label>
            <div className="mt-1">
                <label htmlFor="image-upload" className="cursor-pointer group block w-full h-44 border-2 border-mineral border-dashed rounded-xl flex justify-center items-center text-ink-faint hover:border-coffee hover:text-coffee transition overflow-hidden bg-bone">
                    {imageDataUrl ? (
                        <img src={imageDataUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-10 w-10 text-ink-faint group-hover:text-coffee transition-colors" />
                            <span className="mt-2 block text-xs font-medium">{t('clickToUpload')}</span>
                        </div>
                    )}
                </label>
                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
            </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-ink-muted mb-1">{t('productName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-ink-muted mb-1">{t('category')}</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={formInputClass}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sellPrice" className="block text-xs font-semibold text-ink-muted mb-1">{t('sellPriceRp')}</label>
            <input type="number" id="sellPrice" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className={formInputClass} required min="0" placeholder={t('placeholderHalfProduct')} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="directLaborCost" className="block text-xs font-semibold text-ink-muted mb-1">{t('directLaborCost')}</label>
                <input type="number" id="directLaborCost" value={directLaborCost} onChange={(e) => setDirectLaborCost(e.target.value)} placeholder={t('optional')} className={formInputClass} min="0" />
            </div>
            <div>
                <label htmlFor="productionOverheadCost" className="block text-xs font-semibold text-ink-muted mb-1">{t('productionOverheadCost')}</label>
                <input type="number" id="productionOverheadCost" value={productionOverheadCost} onChange={(e) => setProductionOverheadCost(e.target.value)} placeholder={t('optional')} className={formInputClass} min="0" />
            </div>
        </div>

        {/* Recipe Section */}
        <div className="pt-4 border-t border-mineral">
            <h3 className="text-base font-bold text-ink mb-2">{t('recipeAndHpp')}</h3>
            <div className="space-y-2">
                {recipe.map(item => (
                    <div key={`${item.itemType}-${item.itemId}`} className="flex items-center justify-between bg-mineral-light/60 border border-mineral/80 p-2.5 rounded-lg">
                        <div>
                            <span className={`font-semibold text-xs text-ink ${item.itemType === 'product' && 'text-coffee'}`}>{getRecipeItemName(item)}</span>
                            <span className="text-xs text-ink-muted ml-2">{item.quantity} {getRecipeItemUnit(item)}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveRecipeItem(item.itemId, item.itemType)} className="text-danger hover:text-danger-hover transition-colors">
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="flex items-end gap-2 mt-4">
                <div className="flex-grow">
                    <label htmlFor="recipe-item" className="block text-xs font-semibold text-ink-muted mb-1">{t('recipeItem')}</label>
                    <select id="recipe-item" value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)} className={formInputClass}>
                        <optgroup label={t('semiFinishedProducts')}>
                            {availableProducts.map(p => <option key={`product-${p.id}`} value={`product-${p.id}`}>{p.name}</option>)}
                        </optgroup>
                        <optgroup label={t('rawMaterials')}>
                            {rawMaterials.map(m => <option key={`raw-material-${m.id}`} value={`raw-material-${m.id}`}>{m.name} ({m.unit})</option>)}
                        </optgroup>
                    </select>
                </div>
                <div className="w-28">
                    <label htmlFor="quantity" className="block text-xs font-semibold text-ink-muted mb-1">{t('quantity')}</label>
                    <input type="number" id="quantity" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} className={formInputClass} min="0" step="any" />
                </div>
                <button type="button" onClick={handleAddRecipeItem} className="p-2.5 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition-colors h-[38px] flex items-center justify-center">
                    <AddIcon className="h-4 w-4" />
                </button>
            </div>
            <div className="mt-4 text-right bg-mineral-light/40 border border-mineral p-3 rounded-lg space-y-1">
                <p className="text-xs text-ink-muted flex justify-between">
                    <span>{t('estimatedMaterialCost')}</span> 
                    <span className="font-medium text-ink">{formatCurrency(materialCost)}</span>
                </p>
                 <p className="text-xs text-ink-muted flex justify-between">
                    <span>{t('directLaborCost')}:</span> 
                    <span className="font-medium text-ink">{formatCurrency(parseFloat(directLaborCost) || 0)}</span>
                </p>
                 <p className="text-xs text-ink-muted flex justify-between">
                    <span>{t('productionOverheadCost')}:</span> 
                    <span className="font-medium text-ink">{formatCurrency(parseFloat(productionOverheadCost) || 0)}</span>
                </p>
                <div className="pt-2 border-t border-mineral">
                    <p className="text-sm font-semibold text-ink flex justify-between">
                        <span>{t('estimatedTotalHpp')}</span> 
                        <span className="text-base font-bold text-coffee">{formatCurrency(hpp)}</span>
                    </p>
                    <p className="text-[11px] italic text-ink-faint mt-1">{t('hppNote')}</p>
                </div>
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-mineral-light hover:bg-mineral text-ink rounded-lg transition font-semibold text-xs">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-coffee hover:bg-coffee-hover text-bone rounded-lg transition font-semibold text-xs shadow-sm">
          {isEditing ? t('updateProduct') : t('saveProduct')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;