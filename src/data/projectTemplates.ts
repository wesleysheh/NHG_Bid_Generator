import { ScopeItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

export interface ProjectTemplate {
  id: string;
  name: string;
  category: 'bathroom' | 'kitchen' | 'fixture' | 'room' | 'exterior' | 'systems' | 'flooring' | 'windows-doors';
  description: string;
  defaultUnit?: string;
  defaultQuantity?: number;
  averageCost: {
    low: number;
    mid: number;
    high: number;
  };
  scopeItems: Omit<ScopeItem, 'id'>[];
}

export const projectTemplates: ProjectTemplate[] = [
  {
    id: 'full-bathroom',
    name: 'Full Bathroom Remodel',
    category: 'bathroom',
    description: 'Complete bathroom renovation including all fixtures',
    averageCost: {
      low: 12000,
      mid: 20000,
      high: 35000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing bathroom fixtures, flooring, and wall coverings',
        materialCost: 300,
        laborHours: 16,
      },
      {
        category: 'Plumbing',
        description: 'Rough-in plumbing for toilet, sink, shower/tub',
        materialCost: 1500,
        laborHours: 24,
      },
      {
        category: 'Electrical',
        description: 'GFCI outlets, vanity lighting, exhaust fan wiring',
        materialCost: 600,
        laborHours: 12,
      },
      {
        category: 'Flooring',
        description: 'Waterproof vinyl plank or tile flooring (50 sq ft)',
        materialCost: 750,
        laborHours: 8,
      },
      {
        category: 'Drywall',
        description: 'Moisture-resistant drywall and finishing',
        materialCost: 400,
        laborHours: 12,
      },
      {
        category: 'Tiling',
        description: 'Shower surround tile (80 sq ft) with waterproofing',
        materialCost: 1200,
        laborHours: 20,
      },
      {
        category: 'Fixtures',
        description: 'Toilet - Kohler Cimarron or similar',
        materialCost: 400,
        laborHours: 3,
      },
      {
        category: 'Fixtures',
        description: 'Vanity - 36" single sink with quartz top',
        materialCost: 1200,
        laborHours: 4,
      },
      {
        category: 'Fixtures',
        description: 'Shower system - Delta or Moen with glass door',
        materialCost: 1500,
        laborHours: 8,
      },
      {
        category: 'Fixtures',
        description: 'Medicine cabinet and accessories',
        materialCost: 300,
        laborHours: 2,
      },
      {
        category: 'Painting',
        description: 'Prime and paint walls and ceiling',
        materialCost: 150,
        laborHours: 6,
      },
      {
        category: 'Finishing',
        description: 'Trim, caulking, and final touches',
        materialCost: 200,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'half-bathroom',
    name: 'Half Bathroom Remodel',
    category: 'bathroom',
    description: 'Powder room renovation (toilet and sink only)',
    averageCost: {
      low: 5000,
      mid: 8000,
      high: 12000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing fixtures and finishes',
        materialCost: 150,
        laborHours: 8,
      },
      {
        category: 'Plumbing',
        description: 'Rough-in plumbing for toilet and sink',
        materialCost: 800,
        laborHours: 12,
      },
      {
        category: 'Electrical',
        description: 'GFCI outlet and vanity lighting',
        materialCost: 300,
        laborHours: 6,
      },
      {
        category: 'Flooring',
        description: 'Luxury vinyl or tile flooring (25 sq ft)',
        materialCost: 375,
        laborHours: 4,
      },
      {
        category: 'Drywall',
        description: 'Patch and repair drywall as needed',
        materialCost: 200,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'Toilet - American Standard or similar',
        materialCost: 300,
        laborHours: 3,
      },
      {
        category: 'Fixtures',
        description: 'Pedestal sink or 24" vanity',
        materialCost: 500,
        laborHours: 3,
      },
      {
        category: 'Fixtures',
        description: 'Mirror and accessories',
        materialCost: 150,
        laborHours: 1,
      },
      {
        category: 'Painting',
        description: 'Prime and paint walls and ceiling',
        materialCost: 100,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'shower-only',
    name: 'Shower Replacement',
    category: 'fixture',
    description: 'Replace existing shower with new tile and fixtures',
    averageCost: {
      low: 4000,
      mid: 7000,
      high: 12000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing shower surround and pan',
        materialCost: 100,
        laborHours: 6,
      },
      {
        category: 'Plumbing',
        description: 'Update shower valve and drain',
        materialCost: 400,
        laborHours: 6,
      },
      {
        category: 'Waterproofing',
        description: 'Install shower pan and waterproof membrane',
        materialCost: 350,
        laborHours: 6,
      },
      {
        category: 'Tiling',
        description: 'Tile shower walls (80 sq ft) and floor',
        materialCost: 1000,
        laborHours: 16,
      },
      {
        category: 'Fixtures',
        description: 'Shower valve, head, and trim - Delta/Moen',
        materialCost: 400,
        laborHours: 3,
      },
      {
        category: 'Fixtures',
        description: 'Glass shower door - frameless or semi-frameless',
        materialCost: 800,
        laborHours: 4,
      },
      {
        category: 'Finishing',
        description: 'Grout sealing and caulking',
        materialCost: 50,
        laborHours: 2,
      },
    ],
  },
  {
    id: 'tub-to-shower',
    name: 'Tub to Shower Conversion',
    category: 'fixture',
    description: 'Convert bathtub to walk-in shower',
    averageCost: {
      low: 5000,
      mid: 8000,
      high: 15000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove bathtub and surrounding materials',
        materialCost: 150,
        laborHours: 8,
      },
      {
        category: 'Plumbing',
        description: 'Relocate drain and update plumbing for shower',
        materialCost: 600,
        laborHours: 10,
      },
      {
        category: 'Framing',
        description: 'Frame shower curb and any wall modifications',
        materialCost: 200,
        laborHours: 6,
      },
      {
        category: 'Waterproofing',
        description: 'Install shower pan liner and waterproof system',
        materialCost: 400,
        laborHours: 8,
      },
      {
        category: 'Tiling',
        description: 'Tile shower walls and floor (100 sq ft)',
        materialCost: 1250,
        laborHours: 20,
      },
      {
        category: 'Fixtures',
        description: 'Shower system with handheld option',
        materialCost: 500,
        laborHours: 4,
      },
      {
        category: 'Fixtures',
        description: 'Glass shower enclosure',
        materialCost: 1000,
        laborHours: 4,
      },
      {
        category: 'Finishing',
        description: 'Patch drywall, paint, and finish work',
        materialCost: 200,
        laborHours: 6,
      },
    ],
  },
  {
    id: 'vanity-sink',
    name: 'Vanity and Sink Replacement',
    category: 'fixture',
    description: 'Replace vanity, sink, and faucet',
    averageCost: {
      low: 1500,
      mid: 2500,
      high: 4000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing vanity and sink',
        materialCost: 0,
        laborHours: 2,
      },
      {
        category: 'Plumbing',
        description: 'Update shut-off valves and supply lines',
        materialCost: 100,
        laborHours: 2,
      },
      {
        category: 'Fixtures',
        description: 'Vanity cabinet - 36" with soft-close drawers',
        materialCost: 600,
        laborHours: 2,
      },
      {
        category: 'Fixtures',
        description: 'Vanity top - quartz or granite with undermount sink',
        materialCost: 500,
        laborHours: 2,
      },
      {
        category: 'Fixtures',
        description: 'Faucet - Moen or Delta single handle',
        materialCost: 200,
        laborHours: 1,
      },
      {
        category: 'Finishing',
        description: 'Caulk and seal connections',
        materialCost: 25,
        laborHours: 1,
      },
    ],
  },
  {
    id: 'toilet-only',
    name: 'Toilet Replacement',
    category: 'fixture',
    description: 'Replace toilet with new model',
    averageCost: {
      low: 400,
      mid: 600,
      high: 1000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing toilet',
        materialCost: 0,
        laborHours: 1,
      },
      {
        category: 'Plumbing',
        description: 'Install new wax ring and bolts',
        materialCost: 25,
        laborHours: 0.5,
      },
      {
        category: 'Fixtures',
        description: 'Toilet - Kohler Cimarron comfort height',
        materialCost: 350,
        laborHours: 1.5,
      },
      {
        category: 'Finishing',
        description: 'Caulk base and test operation',
        materialCost: 10,
        laborHours: 0.5,
      },
    ],
  },
  {
    id: 'master-bathroom',
    name: 'Master Bathroom Luxury Remodel',
    category: 'bathroom',
    description: 'High-end master bathroom with separate tub and shower',
    averageCost: {
      low: 25000,
      mid: 40000,
      high: 60000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Complete demolition of existing bathroom',
        materialCost: 500,
        laborHours: 24,
      },
      {
        category: 'Plumbing',
        description: 'Complete plumbing for dual sinks, tub, shower, toilet',
        materialCost: 3000,
        laborHours: 40,
      },
      {
        category: 'Electrical',
        description: 'Recessed lighting, heated floor wiring, outlets',
        materialCost: 1200,
        laborHours: 20,
      },
      {
        category: 'HVAC',
        description: 'Exhaust fan and potential HVAC modifications',
        materialCost: 500,
        laborHours: 6,
      },
      {
        category: 'Flooring',
        description: 'Heated tile flooring (100 sq ft)',
        materialCost: 2000,
        laborHours: 16,
      },
      {
        category: 'Tiling',
        description: 'Custom tile shower with bench and niche (120 sq ft)',
        materialCost: 2500,
        laborHours: 32,
      },
      {
        category: 'Fixtures',
        description: 'Freestanding soaking tub',
        materialCost: 2500,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'Double vanity - 72" with quartz top',
        materialCost: 3000,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'High-end shower system with multiple heads',
        materialCost: 1500,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'Frameless glass shower enclosure',
        materialCost: 2000,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'Comfort height toilet with bidet features',
        materialCost: 800,
        laborHours: 4,
      },
      {
        category: 'Cabinetry',
        description: 'Linen closet or built-in storage',
        materialCost: 1500,
        laborHours: 8,
      },
      {
        category: 'Painting',
        description: 'Premium paint and primer',
        materialCost: 250,
        laborHours: 8,
      },
      {
        category: 'Finishing',
        description: 'Crown molding, baseboards, and accessories',
        materialCost: 500,
        laborHours: 8,
      },
    ],
  },
  {
    id: 'kitchen-full',
    name: 'Full Kitchen Remodel',
    category: 'kitchen',
    description: 'Complete kitchen renovation with new cabinets and appliances',
    averageCost: {
      low: 20000,
      mid: 35000,
      high: 60000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing kitchen cabinets, appliances, and finishes',
        materialCost: 500,
        laborHours: 24,
      },
      {
        category: 'Plumbing',
        description: 'Update plumbing for sink, dishwasher, and refrigerator',
        materialCost: 1500,
        laborHours: 16,
      },
      {
        category: 'Electrical',
        description: 'Add circuits for appliances, under-cabinet lighting',
        materialCost: 2000,
        laborHours: 24,
      },
      {
        category: 'Cabinetry',
        description: 'Semi-custom cabinets - uppers and lowers',
        materialCost: 8000,
        laborHours: 24,
      },
      {
        category: 'Countertops',
        description: 'Quartz countertops with undermount sink cutout',
        materialCost: 3500,
        laborHours: 8,
      },
      {
        category: 'Backsplash',
        description: 'Subway tile backsplash (30 sq ft)',
        materialCost: 500,
        laborHours: 8,
      },
      {
        category: 'Flooring',
        description: 'Luxury vinyl plank flooring (200 sq ft)',
        materialCost: 1500,
        laborHours: 12,
      },
      {
        category: 'Appliances',
        description: 'Stainless steel appliance package',
        materialCost: 5000,
        laborHours: 6,
      },
      {
        category: 'Fixtures',
        description: 'Sink and pull-down faucet',
        materialCost: 600,
        laborHours: 2,
      },
      {
        category: 'Lighting',
        description: 'Pendant lights and under-cabinet LED strips',
        materialCost: 800,
        laborHours: 6,
      },
      {
        category: 'Painting',
        description: 'Paint walls and ceiling',
        materialCost: 200,
        laborHours: 8,
      },
      {
        category: 'Finishing',
        description: 'Install hardware, caulk, and final touches',
        materialCost: 300,
        laborHours: 6,
      },
    ],
  },
  {
    id: 'bedroom-basic',
    name: 'Bedroom Refresh',
    category: 'room',
    description: 'Basic bedroom update with paint and flooring',
    averageCost: {
      low: 2000,
      mid: 3500,
      high: 5000,
    },
    scopeItems: [
      {
        category: 'Flooring',
        description: 'Install luxury vinyl plank (150 sq ft)',
        materialCost: 1125,
        laborHours: 8,
      },
      {
        category: 'Painting',
        description: 'Paint walls, ceiling, and trim',
        materialCost: 200,
        laborHours: 10,
      },
      {
        category: 'Electrical',
        description: 'Add ceiling fan with light',
        materialCost: 250,
        laborHours: 3,
      },
      {
        category: 'Finishing',
        description: 'Install new baseboards and door trim',
        materialCost: 200,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'roof-asphalt',
    name: 'Asphalt Shingle Roof (1500 sq ft)',
    category: 'exterior',
    description: 'Complete tear-off and replacement with architectural shingles',
    defaultUnit: 'sq ft',
    defaultQuantity: 1500,
    averageCost: {
      low: 6000,
      mid: 9000,
      high: 13500,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing shingles and underlayment',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 0.25,
        laborHoursPerUnit: 0.012,
        materialCost: 375,
        laborHours: 18,
      },
      {
        category: 'Materials',
        description: 'Architectural shingles - 30 year warranty',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 1.50,
        laborHoursPerUnit: 0,
        materialCost: 2250,
        laborHours: 0,
      },
      {
        category: 'Materials',
        description: 'Ice and water shield, synthetic underlayment',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 0.60,
        laborHoursPerUnit: 0,
        materialCost: 900,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install shingles, ridge vents, and flashing',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 0.25,
        laborHoursPerUnit: 0.02,
        materialCost: 375,
        laborHours: 30,
      },
      {
        category: 'Materials',
        description: 'New gutters and downspouts',
        materialCost: 1200,
        laborHours: 8,
      },
      {
        category: 'Finishing',
        description: 'Cleanup and disposal',
        materialCost: 300,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'roof-metal',
    name: 'Standing Seam Metal Roof (1500 sq ft)',
    category: 'exterior',
    description: 'Premium metal roof installation',
    defaultUnit: 'sq ft',
    defaultQuantity: 1500,
    averageCost: {
      low: 12000,
      mid: 16500,
      high: 22000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing roofing materials',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 0.30,
        laborHoursPerUnit: 0.012,
        materialCost: 450,
        laborHours: 18,
      },
      {
        category: 'Materials',
        description: 'Standing seam metal panels - 50 year warranty',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 4.50,
        laborHoursPerUnit: 0,
        materialCost: 6750,
        laborHours: 0,
      },
      {
        category: 'Materials',
        description: 'Ice and water shield, synthetic underlayment',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 0.60,
        laborHoursPerUnit: 0,
        materialCost: 900,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install metal roofing system with clips',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 1.50,
        laborHoursPerUnit: 0.045,
        materialCost: 2250,
        laborHours: 67.5,
      },
      {
        category: 'Flashing',
        description: 'Custom metal flashing and trim',
        quantity: 1500,
        unit: 'sq ft',
        materialCostPerUnit: 1.20,
        laborHoursPerUnit: 0.008,
        materialCost: 1800,
        laborHours: 12,
      },
      {
        category: 'Ventilation',
        description: 'Ridge vents and soffit ventilation',
        materialCost: 800,
        laborHours: 8,
      },
    ],
  },
  {
    id: 'siding-vinyl',
    name: 'Vinyl Siding (1500 sq ft)',
    category: 'exterior',
    description: 'Complete vinyl siding replacement',
    averageCost: {
      low: 8000,
      mid: 12000,
      high: 16000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing siding',
        materialCost: 300,
        laborHours: 16,
      },
      {
        category: 'Materials',
        description: 'Premium vinyl siding with insulation backing',
        materialCost: 4500,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install siding, J-channel, and corners',
        materialCost: 800,
        laborHours: 40,
      },
      {
        category: 'Trim',
        description: 'Window and door trim, fascia wrap',
        materialCost: 1200,
        laborHours: 16,
      },
      {
        category: 'Materials',
        description: 'House wrap and moisture barrier',
        materialCost: 400,
        laborHours: 8,
      },
    ],
  },
  {
    id: 'windows-full-house',
    name: 'Window Replacement (10 windows)',
    category: 'windows-doors',
    description: 'Replace all windows',
    defaultUnit: 'windows',
    defaultQuantity: 10,
    averageCost: {
      low: 8000,
      mid: 15000,
      high: 25000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing windows',
        materialCost: 0,
        laborHours: 10,
      },
      {
        category: 'Windows',
        description: 'Double-hung vinyl windows - Energy Star rated',
        quantity: 10,
        unit: 'windows',
        materialCostPerUnit: 500,
        laborHoursPerUnit: 0,
        materialCost: 5000,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install windows with proper flashing',
        quantity: 10,
        unit: 'windows',
        materialCostPerUnit: 50,
        laborHoursPerUnit: 2,
        materialCost: 500,
        laborHours: 20,
      },
      {
        category: 'Trim',
        description: 'Interior and exterior trim',
        materialCost: 800,
        laborHours: 16,
      },
      {
        category: 'Finishing',
        description: 'Caulking, insulation, and touch-up paint',
        materialCost: 200,
        laborHours: 8,
      },
    ],
  },
  {
    id: 'entry-door',
    name: 'Entry Door Replacement',
    category: 'windows-doors',
    description: 'New fiberglass or steel entry door with sidelights',
    averageCost: {
      low: 2500,
      mid: 4000,
      high: 6000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing door and frame',
        materialCost: 0,
        laborHours: 2,
      },
      {
        category: 'Materials',
        description: 'Fiberglass entry door with sidelights',
        materialCost: 2000,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install door, adjust, and weatherproof',
        materialCost: 100,
        laborHours: 6,
      },
      {
        category: 'Hardware',
        description: 'Smart lock and door hardware',
        materialCost: 400,
        laborHours: 1,
      },
      {
        category: 'Finishing',
        description: 'Trim work and threshold adjustment',
        materialCost: 150,
        laborHours: 3,
      },
    ],
  },
  {
    id: 'hvac-replacement',
    name: 'HVAC System Replacement',
    category: 'systems',
    description: 'New furnace and AC unit installation',
    averageCost: {
      low: 6000,
      mid: 9000,
      high: 14000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove old HVAC equipment',
        materialCost: 0,
        laborHours: 4,
      },
      {
        category: 'Equipment',
        description: '3-ton AC unit and 80k BTU furnace',
        materialCost: 5000,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install new units and connect',
        materialCost: 500,
        laborHours: 16,
      },
      {
        category: 'Ductwork',
        description: 'Modify and seal existing ductwork',
        materialCost: 300,
        laborHours: 8,
      },
      {
        category: 'Electrical',
        description: 'Electrical connections and thermostat',
        materialCost: 400,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'water-heater',
    name: 'Water Heater Replacement',
    category: 'systems',
    description: 'New 50-gallon water heater installation',
    averageCost: {
      low: 1500,
      mid: 2200,
      high: 3500,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove and dispose old water heater',
        materialCost: 0,
        laborHours: 2,
      },
      {
        category: 'Equipment',
        description: '50-gallon gas water heater - Energy Star',
        materialCost: 1200,
        laborHours: 0,
      },
      {
        category: 'Plumbing',
        description: 'Connect water lines and gas',
        materialCost: 150,
        laborHours: 4,
      },
      {
        category: 'Venting',
        description: 'Install or modify venting',
        materialCost: 200,
        laborHours: 2,
      },
      {
        category: 'Safety',
        description: 'Expansion tank and pressure relief',
        materialCost: 150,
        laborHours: 1,
      },
    ],
  },
  {
    id: 'electrical-panel',
    name: 'Electrical Panel Upgrade',
    category: 'systems',
    description: '200-amp panel upgrade',
    averageCost: {
      low: 2500,
      mid: 3500,
      high: 5000,
    },
    scopeItems: [
      {
        category: 'Permits',
        description: 'Electrical permit and inspections',
        materialCost: 300,
        laborHours: 0,
      },
      {
        category: 'Equipment',
        description: '200-amp panel and breakers',
        materialCost: 800,
        laborHours: 0,
      },
      {
        category: 'Installation',
        description: 'Install panel and transfer circuits',
        materialCost: 200,
        laborHours: 12,
      },
      {
        category: 'Service',
        description: 'Coordinate utility disconnect/reconnect',
        materialCost: 0,
        laborHours: 4,
      },
      {
        category: 'Grounding',
        description: 'Update grounding system',
        materialCost: 200,
        laborHours: 3,
      },
    ],
  },
  {
    id: 'hardwood-floors',
    name: 'Hardwood Flooring (500 sq ft)',
    category: 'flooring',
    description: 'Install hardwood flooring',
    defaultUnit: 'sq ft',
    defaultQuantity: 500,
    averageCost: {
      low: 4000,
      mid: 6000,
      high: 9000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing flooring',
        materialCost: 0,
        laborHours: 8,
      },
      {
        category: 'Materials',
        description: 'Oak hardwood flooring - 3/4" solid',
        quantity: 500,
        unit: 'sq ft',
        materialCostPerUnit: 5.00,
        laborHoursPerUnit: 0,
        materialCost: 2500,
        laborHours: 0,
      },
      {
        category: 'Subfloor',
        description: 'Subfloor prep and leveling',
        materialCost: 300,
        laborHours: 6,
      },
      {
        category: 'Installation',
        description: 'Install hardwood flooring',
        quantity: 500,
        unit: 'sq ft',
        materialCostPerUnit: 0.40,
        laborHoursPerUnit: 0.048,
        materialCost: 200,
        laborHours: 24,
      },
      {
        category: 'Finishing',
        description: 'Sand, stain, and apply finish',
        materialCost: 500,
        laborHours: 16,
      },
      {
        category: 'Trim',
        description: 'Baseboards and transitions',
        materialCost: 300,
        laborHours: 6,
      },
    ],
  },
  {
    id: 'tile-floors',
    name: 'Tile Flooring (200 sq ft)',
    category: 'flooring',
    description: 'Ceramic or porcelain tile',
    defaultUnit: 'sq ft',
    defaultQuantity: 200,
    averageCost: {
      low: 2000,
      mid: 3500,
      high: 5000,
    },
    scopeItems: [
      {
        category: 'Demolition',
        description: 'Remove existing flooring',
        materialCost: 0,
        laborHours: 6,
      },
      {
        category: 'Materials',
        description: 'Porcelain tile - 12x24 format',
        quantity: 200,
        unit: 'sq ft',
        materialCostPerUnit: 4.00,
        laborHoursPerUnit: 0,
        materialCost: 800,
        laborHours: 0,
      },
      {
        category: 'Subfloor',
        description: 'Install cement board underlayment',
        materialCost: 300,
        laborHours: 6,
      },
      {
        category: 'Installation',
        description: 'Set tile with thinset mortar',
        quantity: 200,
        unit: 'sq ft',
        materialCostPerUnit: 1.00,
        laborHoursPerUnit: 0.08,
        materialCost: 200,
        laborHours: 16,
      },
      {
        category: 'Grouting',
        description: 'Grout and seal',
        materialCost: 150,
        laborHours: 6,
      },
      {
        category: 'Trim',
        description: 'Transitions and baseboards',
        materialCost: 150,
        laborHours: 4,
      },
    ],
  },
  {
    id: 'deck-composite',
    name: 'Composite Deck (200 sq ft)',
    category: 'exterior',
    description: 'New 200 sq ft composite deck',
    averageCost: {
      low: 6000,
      mid: 9000,
      high: 14000,
    },
    scopeItems: [
      {
        category: 'Permits',
        description: 'Building permit and inspections',
        materialCost: 300,
        laborHours: 0,
      },
      {
        category: 'Foundation',
        description: 'Footings and posts',
        materialCost: 800,
        laborHours: 16,
      },
      {
        category: 'Framing',
        description: 'Pressure treated framing lumber',
        materialCost: 1200,
        laborHours: 20,
      },
      {
        category: 'Decking',
        description: 'Composite decking boards',
        materialCost: 2400,
        laborHours: 16,
      },
      {
        category: 'Railings',
        description: 'Composite railing system',
        materialCost: 1500,
        laborHours: 12,
      },
      {
        category: 'Stairs',
        description: 'Steps to grade',
        materialCost: 500,
        laborHours: 8,
      },
    ],
  },
];

export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return projectTemplates.filter(t => t.category === category);
}

export function generateScopeItemsFromTemplate(
  template: ProjectTemplate, 
  projectName?: string,
  customQuantity?: number
): ScopeItem[] {
  const quantity = customQuantity || template.defaultQuantity;
  
  return template.scopeItems.map(item => {
    // If the item has per-unit pricing and we have a custom quantity, recalculate
    let materialCost = item.materialCost;
    let laborHours = item.laborHours;
    let itemQuantity = item.quantity;
    
    if (quantity && item.materialCostPerUnit !== undefined && item.quantity) {
      // Calculate the ratio of custom quantity to default quantity
      const ratio = quantity / item.quantity;
      itemQuantity = quantity;
      materialCost = item.materialCostPerUnit * quantity;
      laborHours = (item.laborHoursPerUnit || 0) * quantity;
    }
    
    return {
      ...item,
      id: uuidv4(),
      projectSection: projectName || template.name,
      quantity: itemQuantity,
      materialCost,
      laborHours,
    };
  });
}