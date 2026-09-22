/**
 * Pure math module for Coffee Roastery metrics and resting status.
 */

export interface RestingInfo {
  status: 'none' | 'resting' | 'ready';
  labelKey: string;
  daysRemaining?: number;
}

/**
 * Calculates roasting shrinkage / weight loss percentage.
 * Formula: ((Green Input - Roasted Output) / Green Input) * 100
 */
export const calculateWeightLoss = (greenWeight: number, roastedWeight: number): number => {
  if (greenWeight <= 0) return 0;
  const loss = ((greenWeight - roastedWeight) / greenWeight) * 100;
  return parseFloat(loss.toFixed(1));
};

/**
 * Calculates batch yield percentage.
 * Formula: (Actual Output / Target Output) * 100
 */
export const calculateYieldPercentage = (actualQuantity: number, targetQuantity: number): number => {
  if (targetQuantity <= 0) return 0;
  const yieldPct = (actualQuantity / targetQuantity) * 100;
  return parseFloat(yieldPct.toFixed(1));
};

/**
 * Calculates resting countdown and ready status for roasted coffee.
 */
export const calculateRestingStatus = (
  roastDate?: Date | string,
  restingDays?: number,
  currentDate: Date = new Date()
): RestingInfo => {
  if (!roastDate || !restingDays || restingDays <= 0) {
    return { status: 'none', labelKey: '-' };
  }

  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  const roast = new Date(roastDate);
  roast.setHours(0, 0, 0, 0);

  const readyDate = new Date(roast.getTime() + restingDays * 24 * 60 * 60 * 1000);
  const diffTime = readyDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return {
      status: 'resting',
      labelKey: 'restingDaysLeft',
      daysRemaining: diffDays,
    };
  }

  return {
    status: 'ready',
    labelKey: 'readyToBrew',
  };
};
