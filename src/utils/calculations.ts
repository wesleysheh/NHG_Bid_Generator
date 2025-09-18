import { ScopeItem, HistoricalProject } from '../types';

export const calculateBaseCost = (laborCosts: number, materialCosts: number): number => {
  return laborCosts + materialCosts;
};

export const calculateMarkup = (baseCost: number, markupPercentage: number = 20): number => {
  return baseCost * (markupPercentage / 100);
};

export const calculateTotalBid = (baseCost: number, markup: number): number => {
  return baseCost + markup;
};

export const calculateChangeOrderCost = (amount: number): number => {
  return amount * 1.35; // 35% markup
};

export const estimateFromHistorical = (
  squareFootage: number,
  historicalProjects: HistoricalProject[]
): { min: number; max: number; average: number } => {
  const pricesPerSqFt = historicalProjects.map(p => p.totalCost / p.squareFootage);
  const minPrice = Math.min(...pricesPerSqFt) * squareFootage;
  const maxPrice = Math.max(...pricesPerSqFt) * squareFootage;
  const avgPrice = (pricesPerSqFt.reduce((a, b) => a + b, 0) / pricesPerSqFt.length) * squareFootage;

  return {
    min: Math.round(minPrice),
    max: Math.round(maxPrice),
    average: Math.round(avgPrice)
  };
};

export const calculateLaborCost = (hours: number, hourlyRate: number): number => {
  return hours * hourlyRate;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};