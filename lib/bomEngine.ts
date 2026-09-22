import { Product, RawMaterial, RecipeItem } from '../types';

/**
 * Pure function to calculate recursive HPP (Cost of Goods Sold).
 * Formula: Raw Material Cost + Direct Labor + Production Overhead.
 * Returns Infinity if circular dependency is detected.
 */
export const calculateHpp = (
  product: Product,
  allProducts: Product[],
  allMaterials: RawMaterial[],
  visited: Set<number> = new Set(),
  cache: Map<number, number> = new Map()
): number => {
  if (visited.has(product.id)) {
    console.error(`Circular dependency detected in recipes for product: ${product.name}`);
    return Infinity;
  }

  if (cache.has(product.id)) {
    return cache.get(product.id)!;
  }

  visited.add(product.id);

  const materialCost = (product.recipe || []).reduce((total, item) => {
    let itemCost = 0;
    if (item.itemType === 'raw-material') {
      const material = allMaterials.find(m => m.id === item.itemId);
      itemCost = material ? material.costPerUnit * item.quantity : 0;
    } else {
      const subProduct = allProducts.find(p => p.id === item.itemId);
      itemCost = subProduct ? calculateHpp(subProduct, allProducts, allMaterials, new Set(visited), cache) * item.quantity : 0;
    }
    return total + itemCost;
  }, 0);

  visited.delete(product.id);

  const totalHpp = materialCost + (product.directLaborCost || 0) + (product.productionOverheadCost || 0);
  cache.set(product.id, totalHpp);
  return totalHpp;
};

/**
 * Pure function to calculate virtual stock based on bottleneck resource.
 * Returns 0 if circular dependency is detected or recipe is empty.
 */
export const calculateStock = (
  product: Product,
  allProducts: Product[],
  allMaterials: RawMaterial[],
  visited: Set<number> = new Set(),
  cache: Map<number, number> = new Map()
): number => {
  if (visited.has(product.id)) {
    console.error(`Circular dependency detected in recipes for product: ${product.name}`);
    return 0;
  }

  if (cache.has(product.id)) {
    return cache.get(product.id)!;
  }

  if (!product.recipe || product.recipe.length === 0) {
    return 0;
  }

  visited.add(product.id);

  const stockLevels = product.recipe.map(item => {
    if (item.quantity <= 0) return Infinity;

    if (item.itemType === 'raw-material') {
      const material = allMaterials.find(m => m.id === item.itemId);
      return material ? Math.floor(material.stock / item.quantity) : 0;
    } else {
      const subProduct = allProducts.find(p => p.id === item.itemId);
      if (!subProduct) return 0;
      const subProductStock = calculateStock(subProduct, allProducts, allMaterials, new Set(visited), cache);
      return Math.floor(subProductStock / item.quantity);
    }
  });

  visited.delete(product.id);

  const minStock = stockLevels.length > 0 ? Math.min(...stockLevels) : 0;
  cache.set(product.id, minStock);
  return minStock;
};

/**
 * Pure validator function to detect if a recipe causes a circular dependency loop.
 */
export const detectCircularDependency = (
  targetProductId: number,
  recipe: RecipeItem[],
  allProducts: Product[],
  visited: Set<number> = new Set()
): boolean => {
  if (visited.has(targetProductId)) {
    return true;
  }

  visited.add(targetProductId);

  for (const item of recipe) {
    if (item.itemType === 'product') {
      if (item.itemId === targetProductId || visited.has(item.itemId)) {
        return true;
      }
      const subProduct = allProducts.find(p => p.id === item.itemId);
      if (subProduct && subProduct.recipe) {
        if (detectCircularDependency(targetProductId, subProduct.recipe, allProducts, new Set(visited))) {
          return true;
        }
      }
    }
  }

  visited.delete(targetProductId);
  return false;
};

/**
 * Pure resolver function to extract all raw material deductions recursively.
 * Throws an Error if circular dependency is detected.
 */
export const getFlattenedRawMaterials = (
  product: Product,
  quantity: number,
  allProducts: Product[],
  visited: Set<number> = new Set()
): Map<number, number> => {
  if (visited.has(product.id)) {
    throw new Error(`Circular dependency detected in recipe for product: ${product.name}`);
  }

  visited.add(product.id);
  const deductions = new Map<number, number>();

  if (product.recipe) {
    product.recipe.forEach(item => {
      if (item.itemType === 'raw-material') {
        const current = deductions.get(item.itemId) || 0;
        deductions.set(item.itemId, current + item.quantity * quantity);
      } else {
        const subProduct = allProducts.find(p => p.id === item.itemId);
        if (subProduct) {
          const subDeductions = getFlattenedRawMaterials(subProduct, item.quantity * quantity, allProducts, new Set(visited));
          subDeductions.forEach((qty, matId) => {
            const current = deductions.get(matId) || 0;
            deductions.set(matId, current + qty);
          });
        }
      }
    });
  }

  visited.delete(product.id);
  return deductions;
};
