import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, RawMaterial, RecipeItem } from '../types';
import { AddIcon, TrashIcon, ImageIcon } from './icons';
import { useTranslation } from '../context/LanguageContext';

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
    // Note: This is a simplified HPP calculation for display within the form.
    // The authoritative calculation is in App.tsx
    const calculateItemCost = (item: RecipeItem): number => {
        if(item.itemType === 'raw-material') {
            const material = rawMaterials.find(rm => rm.id === item.itemId);
            return material ? material.costPerUnit * item.quantity : 0;
        }
        // Simplified: does not recursively calculate HPP for sub-products in the form
        // to avoid complexity and performance issues here. It's just an estimate.
        return 0; 
    };
    return recipe.reduce((total, item) => total + calculateItemCost(item), 0);
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

  const formInputClass = "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500";

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-slate-100 mb-6">{isEditing ? t('editProduct') : t('addNewProduct')}</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">{t('productImage')}</label>
            <div className="mt-1">
                <label htmlFor="image-upload" className="cursor-pointer group block w-full h-48 border-2 border-slate-600 border-dashed rounded-md flex justify-center items-center text-slate-500 hover:border-purple-500 hover:text-purple-400 transition overflow-hidden">
                    {imageDataUrl ? (
                        <img src={imageDataUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <ImageIcon className="mx-auto h-12 w-12" />
                            <span className="mt-2 block text-sm font-medium">{t('clickToUpload')}</span>
                        </div>
                    )}
                </label>
                <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} />
            </div>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">{t('productName')}</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className={formInputClass} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300">{t('category')}</label>
            <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={formInputClass}>
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="sellPrice" className="block text-sm font-medium text-slate-300">{t('sellPriceRp')}</label>
            <input type="number" id="sellPrice" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className={formInputClass} required min="0" placeholder={t('placeholderHalfProduct')} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="directLaborCost" className="block text-sm font-medium text-slate-300">{t('directLaborCost')}</label>
                <input type="number" id="directLaborCost" value={directLaborCost} onChange={(e) => setDirectLaborCost(e.target.value)} placeholder={t('optional')} className={formInputClass} min="0" />
            </div>
            <div>
                <label htmlFor="productionOverheadCost" className="block text-sm font-medium text-slate-300">{t('productionOverheadCost')}</label>
                <input type="number" id="productionOverheadCost" value={productionOverheadCost} onChange={(e) => setProductionOverheadCost(e.target.value)} placeholder={t('optional')} className={formInputClass} min="0" />
            </div>
        </div>

        {/* Recipe Section */}
        <div className="pt-4 border-t border-slate-700">
            <h3 className="text-lg font-semibold text-slate-100 mb-2">{t('recipeAndHpp')}</h3>
            <div className="space-y-2">
                {recipe.map(item => (
                    <div key={`${item.itemType}-${item.itemId}`} className="flex items-center justify-between bg-slate-800/70 p-2 rounded-md">
                        <div>
                            <span className={`font-medium text-slate-200 ${item.itemType === 'product' && 'text-purple-400'}`}>{getRecipeItemName(item)}</span>
                            <span className="text-sm text-slate-400 ml-2">{item.quantity} {getRecipeItemUnit(item)}</span>
                        </div>
                        <button type="button" onClick={() => handleRemoveRecipeItem(item.itemId, item.itemType)} className="text-red-500 hover:text-red-400">
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="flex items-end gap-2 mt-4">
                <div className="flex-grow">
                    <label htmlFor="recipe-item" className="block text-sm font-medium text-slate-300">{t('recipeItem')}</label>
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
                    <label htmlFor="quantity" className="block text-sm font-medium text-slate-300">{t('quantity')}</label>
                    <input type="number" id="quantity" value={itemQuantity} onChange={e => setItemQuantity(e.target.value)} className={formInputClass} min="0" step="any" />
                </div>
                <button type="button" onClick={handleAddRecipeItem} className="p-2 bg-purple-500/20 text-purple-300 rounded-md hover:bg-purple-500/30 transition h-10">
                    <AddIcon className="h-5 w-5" />
                </button>
            </div>
            <div className="mt-4 text-right bg-slate-800/80 p-3 rounded-md space-y-1">
                <p className="text-xs text-slate-400 flex justify-between">
                    <span>{t('estimatedMaterialCost')}</span> 
                    <span>{formatCurrency(materialCost)}</span>
                </p>
                 <p className="text-xs text-slate-400 flex justify-between">
                    <span>{t('directLaborCost')}:</span> 
                    <span>{formatCurrency(parseFloat(directLaborCost) || 0)}</span>
                </p>
                 <p className="text-xs text-slate-400 flex justify-between">
                    <span>{t('productionOverheadCost')}:</span> 
                    <span>{formatCurrency(parseFloat(productionOverheadCost) || 0)}</span>
                </p>
                <div className="pt-2 border-t border-slate-600">
                    <p className="text-sm font-medium text-slate-300 flex justify-between">
                        <span>{t('estimatedTotalHpp')}</span> 
                        <span className="text-base font-bold text-purple-400">{formatCurrency(hpp)}</span>
                    </p>
                    <p className="text-xs italic text-slate-500 mt-1">{t('hppNote')}</p>
                </div>
            </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end space-x-3">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 transition font-semibold">
          {t('cancel')}
        </button>
        <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition font-semibold">
          {isEditing ? t('updateProduct') : t('saveProduct')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;