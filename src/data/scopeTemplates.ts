export interface ScopeTemplate {
  id: string;
  name: string;
  category: string;
  items: {
    description: string;
    unitMaterialCost: number;
    laborHoursPerUnit: number;
    unit: string;
  }[];
}

export const scopeTemplates: ScopeTemplate[] = [
  {
    id: 'bathroom-full',
    name: 'Full Bathroom Remodel',
    category: 'Bathroom',
    items: [
      { description: 'Demo existing bathroom', unitMaterialCost: 200, laborHoursPerUnit: 8, unit: 'room' },
      { description: 'Plumbing rough-in', unitMaterialCost: 1500, laborHoursPerUnit: 12, unit: 'room' },
      { description: 'Electrical updates', unitMaterialCost: 800, laborHoursPerUnit: 8, unit: 'room' },
      { description: 'Drywall and painting', unitMaterialCost: 600, laborHoursPerUnit: 10, unit: 'room' },
      { description: 'Tile flooring', unitMaterialCost: 1200, laborHoursPerUnit: 12, unit: 'room' },
      { description: 'Tile shower/tub surround', unitMaterialCost: 1800, laborHoursPerUnit: 16, unit: 'room' },
      { description: 'Vanity installation', unitMaterialCost: 1500, laborHoursPerUnit: 4, unit: 'piece' },
      { description: 'Toilet installation', unitMaterialCost: 400, laborHoursPerUnit: 2, unit: 'piece' },
      { description: 'Shower door/enclosure', unitMaterialCost: 800, laborHoursPerUnit: 4, unit: 'piece' },
      { description: 'Fixtures and accessories', unitMaterialCost: 500, laborHoursPerUnit: 3, unit: 'set' },
    ]
  },
  {
    id: 'bathroom-powder',
    name: 'Powder Room Remodel',
    category: 'Bathroom',
    items: [
      { description: 'Demo existing powder room', unitMaterialCost: 150, laborHoursPerUnit: 4, unit: 'room' },
      { description: 'Plumbing updates', unitMaterialCost: 800, laborHoursPerUnit: 6, unit: 'room' },
      { description: 'Electrical updates', unitMaterialCost: 400, laborHoursPerUnit: 4, unit: 'room' },
      { description: 'Drywall and painting', unitMaterialCost: 400, laborHoursPerUnit: 6, unit: 'room' },
      { description: 'Flooring', unitMaterialCost: 600, laborHoursPerUnit: 6, unit: 'room' },
      { description: 'Pedestal sink or vanity', unitMaterialCost: 800, laborHoursPerUnit: 3, unit: 'piece' },
      { description: 'Toilet installation', unitMaterialCost: 400, laborHoursPerUnit: 2, unit: 'piece' },
      { description: 'Mirror and accessories', unitMaterialCost: 300, laborHoursPerUnit: 2, unit: 'set' },
    ]
  },
  {
    id: 'kitchen-full',
    name: 'Full Kitchen Remodel',
    category: 'Kitchen',
    items: [
      { description: 'Demo existing kitchen', unitMaterialCost: 500, laborHoursPerUnit: 16, unit: 'room' },
      { description: 'Plumbing rough-in', unitMaterialCost: 2000, laborHoursPerUnit: 16, unit: 'room' },
      { description: 'Electrical updates (220V, outlets)', unitMaterialCost: 1500, laborHoursPerUnit: 12, unit: 'room' },
      { description: 'Drywall and painting', unitMaterialCost: 800, laborHoursPerUnit: 12, unit: 'room' },
      { description: 'Flooring installation', unitMaterialCost: 2500, laborHoursPerUnit: 16, unit: 'room' },
      { description: 'Cabinet installation - lower', unitMaterialCost: 4000, laborHoursPerUnit: 12, unit: 'set' },
      { description: 'Cabinet installation - upper', unitMaterialCost: 3000, laborHoursPerUnit: 10, unit: 'set' },
      { description: 'Countertop - quartz/granite', unitMaterialCost: 3500, laborHoursPerUnit: 8, unit: 'room' },
      { description: 'Backsplash tile', unitMaterialCost: 1200, laborHoursPerUnit: 10, unit: 'room' },
      { description: 'Sink and faucet', unitMaterialCost: 800, laborHoursPerUnit: 3, unit: 'set' },
      { description: 'Appliance installation', unitMaterialCost: 200, laborHoursPerUnit: 6, unit: 'set' },
      { description: 'Island installation', unitMaterialCost: 3000, laborHoursPerUnit: 8, unit: 'piece' },
      { description: 'Lighting fixtures', unitMaterialCost: 800, laborHoursPerUnit: 6, unit: 'set' },
    ]
  },
  {
    id: 'kitchen-refresh',
    name: 'Kitchen Refresh',
    category: 'Kitchen',
    items: [
      { description: 'Cabinet refacing', unitMaterialCost: 2500, laborHoursPerUnit: 16, unit: 'set' },
      { description: 'Cabinet hardware update', unitMaterialCost: 200, laborHoursPerUnit: 4, unit: 'set' },
      { description: 'Countertop replacement', unitMaterialCost: 2500, laborHoursPerUnit: 8, unit: 'room' },
      { description: 'Backsplash tile', unitMaterialCost: 1200, laborHoursPerUnit: 10, unit: 'room' },
      { description: 'Sink and faucet upgrade', unitMaterialCost: 800, laborHoursPerUnit: 3, unit: 'set' },
      { description: 'Paint walls and ceiling', unitMaterialCost: 300, laborHoursPerUnit: 8, unit: 'room' },
      { description: 'New lighting fixtures', unitMaterialCost: 600, laborHoursPerUnit: 4, unit: 'set' },
    ]
  },
  {
    id: 'roof-asphalt',
    name: 'Asphalt Shingle Roof',
    category: 'Roofing',
    items: [
      { description: 'Tear-off existing roof', unitMaterialCost: 1.50, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Install ice and water shield', unitMaterialCost: 2.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install underlayment', unitMaterialCost: 0.50, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Install asphalt shingles', unitMaterialCost: 3.50, laborHoursPerUnit: 0.04, unit: 'sq ft' },
      { description: 'Ridge vent installation', unitMaterialCost: 75, laborHoursPerUnit: 0.5, unit: 'linear ft' },
      { description: 'Flashing and boots', unitMaterialCost: 200, laborHoursPerUnit: 2, unit: 'piece' },
      { description: 'Gutter replacement', unitMaterialCost: 12, laborHoursPerUnit: 0.15, unit: 'linear ft' },
    ]
  },
  {
    id: 'roof-metal',
    name: 'Metal Roof',
    category: 'Roofing',
    items: [
      { description: 'Tear-off existing roof', unitMaterialCost: 1.50, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Install underlayment', unitMaterialCost: 0.75, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Install metal roofing', unitMaterialCost: 12.00, laborHoursPerUnit: 0.06, unit: 'sq ft' },
      { description: 'Ridge cap installation', unitMaterialCost: 125, laborHoursPerUnit: 0.75, unit: 'linear ft' },
      { description: 'Flashing and trim', unitMaterialCost: 300, laborHoursPerUnit: 3, unit: 'piece' },
      { description: 'Snow guards', unitMaterialCost: 15, laborHoursPerUnit: 0.1, unit: 'piece' },
    ]
  },
  {
    id: 'siding-vinyl',
    name: 'Vinyl Siding',
    category: 'Siding',
    items: [
      { description: 'Remove existing siding', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install house wrap', unitMaterialCost: 0.50, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Install vinyl siding', unitMaterialCost: 4.00, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Install trim and J-channel', unitMaterialCost: 8.00, laborHoursPerUnit: 0.2, unit: 'linear ft' },
      { description: 'Install soffit and fascia', unitMaterialCost: 10.00, laborHoursPerUnit: 0.25, unit: 'linear ft' },
      { description: 'Caulking and sealing', unitMaterialCost: 200, laborHoursPerUnit: 4, unit: 'house' },
    ]
  },
  {
    id: 'siding-fiber',
    name: 'Fiber Cement Siding',
    category: 'Siding',
    items: [
      { description: 'Remove existing siding', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install weather barrier', unitMaterialCost: 0.75, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Install fiber cement siding', unitMaterialCost: 8.00, laborHoursPerUnit: 0.05, unit: 'sq ft' },
      { description: 'Install trim boards', unitMaterialCost: 12.00, laborHoursPerUnit: 0.3, unit: 'linear ft' },
      { description: 'Prime and paint siding', unitMaterialCost: 2.50, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Caulking and sealing', unitMaterialCost: 300, laborHoursPerUnit: 6, unit: 'house' },
    ]
  },
  {
    id: 'flooring-hardwood',
    name: 'Hardwood Flooring',
    category: 'Flooring',
    items: [
      { description: 'Remove existing flooring', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Floor prep and leveling', unitMaterialCost: 2.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install hardwood flooring', unitMaterialCost: 8.00, laborHoursPerUnit: 0.04, unit: 'sq ft' },
      { description: 'Sand and finish', unitMaterialCost: 2.00, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Install baseboards', unitMaterialCost: 5.00, laborHoursPerUnit: 0.1, unit: 'linear ft' },
      { description: 'Transitions and thresholds', unitMaterialCost: 25, laborHoursPerUnit: 0.5, unit: 'piece' },
    ]
  },
  {
    id: 'flooring-tile',
    name: 'Tile Flooring',
    category: 'Flooring',
    items: [
      { description: 'Remove existing flooring', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Floor prep and leveling', unitMaterialCost: 2.50, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Waterproofing membrane', unitMaterialCost: 3.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install tile', unitMaterialCost: 6.00, laborHoursPerUnit: 0.06, unit: 'sq ft' },
      { description: 'Grouting and sealing', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install baseboards', unitMaterialCost: 5.00, laborHoursPerUnit: 0.1, unit: 'linear ft' },
    ]
  },
  {
    id: 'flooring-lvp',
    name: 'Luxury Vinyl Plank',
    category: 'Flooring',
    items: [
      { description: 'Remove existing flooring', unitMaterialCost: 1.00, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Floor prep and leveling', unitMaterialCost: 1.50, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Install vapor barrier', unitMaterialCost: 0.50, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Install LVP flooring', unitMaterialCost: 4.00, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Install baseboards', unitMaterialCost: 5.00, laborHoursPerUnit: 0.1, unit: 'linear ft' },
      { description: 'Transitions and thresholds', unitMaterialCost: 20, laborHoursPerUnit: 0.4, unit: 'piece' },
    ]
  },
  {
    id: 'deck-composite',
    name: 'Composite Deck',
    category: 'Exterior',
    items: [
      { description: 'Demo existing deck', unitMaterialCost: 2.00, laborHoursPerUnit: 0.04, unit: 'sq ft' },
      { description: 'Foundation and footings', unitMaterialCost: 500, laborHoursPerUnit: 8, unit: 'post' },
      { description: 'Framing and joists', unitMaterialCost: 8.00, laborHoursPerUnit: 0.05, unit: 'sq ft' },
      { description: 'Composite decking', unitMaterialCost: 12.00, laborHoursPerUnit: 0.04, unit: 'sq ft' },
      { description: 'Railing system', unitMaterialCost: 75, laborHoursPerUnit: 0.5, unit: 'linear ft' },
      { description: 'Stairs', unitMaterialCost: 300, laborHoursPerUnit: 4, unit: 'step' },
      { description: 'Lighting', unitMaterialCost: 50, laborHoursPerUnit: 0.5, unit: 'fixture' },
    ]
  },
  {
    id: 'painting-interior',
    name: 'Interior Painting',
    category: 'Painting',
    items: [
      { description: 'Wall prep and patching', unitMaterialCost: 0.50, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Prime walls', unitMaterialCost: 0.50, laborHoursPerUnit: 0.008, unit: 'sq ft' },
      { description: 'Paint walls (2 coats)', unitMaterialCost: 0.75, laborHoursPerUnit: 0.012, unit: 'sq ft' },
      { description: 'Paint ceiling', unitMaterialCost: 0.50, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Paint trim and doors', unitMaterialCost: 25, laborHoursPerUnit: 1.5, unit: 'door' },
      { description: 'Paint baseboards', unitMaterialCost: 2.00, laborHoursPerUnit: 0.05, unit: 'linear ft' },
    ]
  },
  {
    id: 'painting-exterior',
    name: 'Exterior Painting',
    category: 'Painting',
    items: [
      { description: 'Pressure washing', unitMaterialCost: 0.10, laborHoursPerUnit: 0.005, unit: 'sq ft' },
      { description: 'Scraping and sanding', unitMaterialCost: 0.25, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Prime bare wood', unitMaterialCost: 0.75, laborHoursPerUnit: 0.01, unit: 'sq ft' },
      { description: 'Paint siding (2 coats)', unitMaterialCost: 1.00, laborHoursPerUnit: 0.015, unit: 'sq ft' },
      { description: 'Paint trim', unitMaterialCost: 3.00, laborHoursPerUnit: 0.08, unit: 'linear ft' },
      { description: 'Paint shutters', unitMaterialCost: 50, laborHoursPerUnit: 1, unit: 'pair' },
    ]
  },
  {
    id: 'windows',
    name: 'Window Replacement',
    category: 'Windows & Doors',
    items: [
      { description: 'Remove existing window', unitMaterialCost: 50, laborHoursPerUnit: 1, unit: 'window' },
      { description: 'Install standard window', unitMaterialCost: 450, laborHoursPerUnit: 2, unit: 'window' },
      { description: 'Install premium window', unitMaterialCost: 750, laborHoursPerUnit: 2.5, unit: 'window' },
      { description: 'Install bay window', unitMaterialCost: 1500, laborHoursPerUnit: 4, unit: 'window' },
      { description: 'Trim and casing', unitMaterialCost: 75, laborHoursPerUnit: 1, unit: 'window' },
      { description: 'Insulation and sealing', unitMaterialCost: 25, laborHoursPerUnit: 0.5, unit: 'window' },
    ]
  },
  {
    id: 'doors',
    name: 'Door Installation',
    category: 'Windows & Doors',
    items: [
      { description: 'Remove existing door', unitMaterialCost: 50, laborHoursPerUnit: 0.5, unit: 'door' },
      { description: 'Install interior door', unitMaterialCost: 250, laborHoursPerUnit: 2, unit: 'door' },
      { description: 'Install exterior door', unitMaterialCost: 600, laborHoursPerUnit: 3, unit: 'door' },
      { description: 'Install French doors', unitMaterialCost: 1200, laborHoursPerUnit: 4, unit: 'set' },
      { description: 'Install sliding door', unitMaterialCost: 1500, laborHoursPerUnit: 4, unit: 'door' },
      { description: 'Trim and hardware', unitMaterialCost: 100, laborHoursPerUnit: 1, unit: 'door' },
    ]
  },
  {
    id: 'basement-finish',
    name: 'Basement Finishing',
    category: 'Basement',
    items: [
      { description: 'Framing walls', unitMaterialCost: 4.00, laborHoursPerUnit: 0.05, unit: 'sq ft' },
      { description: 'Electrical rough-in', unitMaterialCost: 3.00, laborHoursPerUnit: 0.04, unit: 'sq ft' },
      { description: 'Plumbing rough-in', unitMaterialCost: 2000, laborHoursPerUnit: 16, unit: 'bathroom' },
      { description: 'Insulation', unitMaterialCost: 1.50, laborHoursPerUnit: 0.02, unit: 'sq ft' },
      { description: 'Drywall installation', unitMaterialCost: 2.00, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Flooring', unitMaterialCost: 4.00, laborHoursPerUnit: 0.03, unit: 'sq ft' },
      { description: 'Ceiling installation', unitMaterialCost: 3.00, laborHoursPerUnit: 0.025, unit: 'sq ft' },
      { description: 'Egress window', unitMaterialCost: 2500, laborHoursPerUnit: 8, unit: 'window' },
    ]
  }
];