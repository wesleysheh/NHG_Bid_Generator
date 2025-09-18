import { LaborRate } from '../types';

export const laborRates: LaborRate[] = [
  // Our Crew Rates
  { trade: 'General Laborer (Our Crew)', hourlyRate: 45, minimumCharge: 180, isInternal: true },
  { trade: 'General Carpenter (Our Crew)', hourlyRate: 65, minimumCharge: 260, isInternal: true },
  { trade: 'Master Carpenter (Our Crew)', hourlyRate: 85, minimumCharge: 340, isInternal: true },
  { trade: 'Construction Manager', hourlyRate: 150, minimumCharge: 600, isInternal: true },
  
  // External Contractor Rates
  { trade: 'General Laborer (External)', hourlyRate: 45, minimumCharge: 180, isInternal: false },
  { trade: 'General Carpenter (External)', hourlyRate: 65, minimumCharge: 260, isInternal: false },
  { trade: 'Master Carpenter (External)', hourlyRate: 85, minimumCharge: 340, isInternal: false },
  { trade: 'Electrician', hourlyRate: 95, minimumCharge: 380, isInternal: false },
  { trade: 'Master Electrician', hourlyRate: 125, minimumCharge: 500, isInternal: false },
  { trade: 'Plumber', hourlyRate: 95, minimumCharge: 380, isInternal: false },
  { trade: 'Master Plumber', hourlyRate: 125, minimumCharge: 500, isInternal: false },
  { trade: 'HVAC Technician', hourlyRate: 105, minimumCharge: 420, isInternal: false },
  { trade: 'Painter', hourlyRate: 55, minimumCharge: 220, isInternal: false },
  { trade: 'Drywall Installer', hourlyRate: 60, minimumCharge: 240, isInternal: false },
  { trade: 'Tile Installer', hourlyRate: 75, minimumCharge: 300, isInternal: false },
  { trade: 'Flooring Installer', hourlyRate: 65, minimumCharge: 260, isInternal: false },
  { trade: 'Roofer', hourlyRate: 70, minimumCharge: 280, isInternal: false },
  { trade: 'Designer/Architect', hourlyRate: 150, minimumCharge: 600, isInternal: false },
];