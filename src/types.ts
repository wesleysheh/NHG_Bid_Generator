export interface Bid {
  id: string;
  propertyAddress: string;
  propertyType: 'residential' | 'commercial';
  squareFootage: number;
  scope: ScopeItem[];
  laborCosts: number;
  materialCosts: number;
  baseCost: number;
  markup: number;
  totalBid: number;
  changeOrderMarkup: number;
  createdAt: Date;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  projectTimeline: string;
  notes: string;
  pdfFileName?: string;
}

export interface ScopeItem {
  id: string;
  category: string;
  description: string;
  materialCost: number;
  laborHours: number;
  projectSection?: string;
  quantity?: number;
  unit?: string;
  materialCostPerUnit?: number;
  laborHoursPerUnit?: number;
}

export interface LaborRate {
  trade: string;
  hourlyRate: number;
  minimumCharge: number;
  isInternal?: boolean;
}

export interface HistoricalProject {
  id: string;
  address: string;
  squareFootage: number;
  totalCost: number;
  completionDate: Date;
  scope: string;
}