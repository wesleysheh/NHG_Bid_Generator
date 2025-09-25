import { ScopeItem } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ParsedSection {
  name: string;
  items: ScopeItem[];
  notes?: string;
}

interface ParsedRequest {
  projectName: string;
  items: ScopeItem[];
  sections?: ParsedSection[];
  notes?: string;
}

export function parseCustomRequest(requestText: string): ParsedRequest {
  // First, merge lines that appear to be continuations
  // Only merge indented lines that don't start with bullets, NOTES, or aren't section headers
  // Don't merge if the next line could be a section header (contains ":" but not "$")
  const normalizedText = requestText
    .split('\n')
    .reduce((acc, line, i, arr) => {
      // If this is the first line, just add it
      if (i === 0) return line;
      
      const trimmedLine = line.trim();
      const prevLine = arr[i-1];
      
      // Don't merge if current line is a bullet point, NOTES, or section header
      if (trimmedLine.startsWith('-') || 
          trimmedLine.startsWith('•') || 
          trimmedLine.startsWith('*') ||
          trimmedLine.toUpperCase().startsWith('NOTES:') ||
          (trimmedLine.endsWith(':') && !trimmedLine.includes('$'))) {
        return acc + '\n' + line;
      }
      
      // If line is indented and previous line was a bullet item, merge it
      if (line.startsWith('  ') && prevLine && prevLine.trim().startsWith('-')) {
        return acc + ' ' + trimmedLine;
      }
      
      // Otherwise keep the line break
      return acc + '\n' + line;
    }, '');
  
  const lines = normalizedText.split('\n').filter(line => line.trim());
  const sections: ParsedSection[] = [];
  const scopeItems: ScopeItem[] = [];
  let currentSection = 'General Work';
  let currentSectionItems: ScopeItem[] = [];
  let currentSectionNotes = '';
  let projectName = 'Custom Project';
  let notes = '';
  
  // Look for project name/title
  const titleMatch = requestText.match(/(?:project|job|work|scope|renovation)(?:\s+(?:name|title))?[:]\s*(.+)/i);
  if (titleMatch) {
    projectName = titleMatch[1].trim();
    currentSection = projectName;
  }
  
  // Parse each line looking for work items
  let inNotesBlock = false;
  
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip empty lines and headers
    if (!trimmed || trimmed.startsWith('#')) return;
    
    // Check for notes lines
    if (trimmed.toUpperCase().startsWith('NOTES:') || trimmed.toUpperCase().startsWith('NOTE:')) {
      currentSectionNotes = trimmed.replace(/^NOTES?:/i, '').trim();
      inNotesBlock = true;
      return;
    }
    
    // Continue collecting notes if we're in a notes block and this line doesn't start a new item/section
    if (inNotesBlock && 
        !trimmed.startsWith('-') && 
        !trimmed.startsWith('•') && 
        !trimmed.startsWith('*') && 
        !trimmed.endsWith(':')) {
      currentSectionNotes += ' ' + trimmed;
      return;
    } else {
      inNotesBlock = false;
    }
    
    // Check for section headers (lines ending with :)
    if (trimmed.endsWith(':') && !trimmed.includes('$') && trimmed.length < 50) {
      // Save previous section if it has items
      if (currentSectionItems.length > 0) {
        sections.push({
          name: currentSection,
          items: currentSectionItems,
          notes: currentSectionNotes || undefined
        });
        currentSectionItems = [];
        currentSectionNotes = '';
      }
      currentSection = trimmed.slice(0, -1);
      return;
    }
    
    // Parse work items with costs
    // Formats to match:
    // - Item description - $500 materials, 8 hours labor
    // - Item description ($500 materials, 8 hrs)
    // - Item description $500
    // - 10 windows @ $300 each
    
    let description = trimmed;
    let materialCost = 0;
    let laborHours = 0;
    let quantity: number | undefined;
    let unit: string | undefined;
    let materialCostPerUnit: number | undefined;
    let laborHoursPerUnit: number | undefined;
    
    // Check for quantity patterns (e.g., "10 windows @ $300 each")
    const quantityMatch = trimmed.match(/(\d+)\s+(\w+)\s*@\s*\$?([\d,]+(?:\.\d{2})?)\s*(?:each|per|\/)?/i);
    if (quantityMatch) {
      quantity = parseInt(quantityMatch[1]);
      unit = quantityMatch[2];
      materialCostPerUnit = parseFloat(quantityMatch[3].replace(/,/g, ''));
      materialCost = quantity * materialCostPerUnit;
      description = trimmed.replace(quantityMatch[0], `${quantity} ${unit}`).trim();
    }
    
    // Check for material costs - improved regex to handle various formats
    const materialMatch = trimmed.match(/\$?([\d,]+(?:\.\d{2})?)\s*(?:materials?|mat\.?|$)/i);
    if (materialMatch && !quantityMatch) {
      // Check if this is immediately followed by "materials" or if it's in a typical cost position
      const contextMatch = trimmed.match(/\$?([\d,]+(?:\.\d{2})?)\s*materials?/i) || 
                           trimmed.match(/[-–]\s*\$?([\d,]+(?:\.\d{2})?)\s*(?:materials?)?(?:,|$)/i);
      if (contextMatch) {
        materialCost = parseFloat(contextMatch[1].replace(/,/g, ''));
      }
    }
    
    // Check for labor hours - improved to handle various formats
    const laborMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?)\s*(?:labor)?/i);
    if (laborMatch) {
      laborHours = parseFloat(laborMatch[1]);
      if (quantity && !laborHoursPerUnit) {
        laborHoursPerUnit = laborHours / quantity;
      }
    }
    
    // Check for simple price at end of line
    if (!materialCost && !laborHours) {
      const priceMatch = trimmed.match(/\$?([\d,]+(?:\.\d{2})?)\s*$/);
      if (priceMatch) {
        materialCost = parseFloat(priceMatch[1].replace(/,/g, ''));
        description = trimmed.replace(priceMatch[0], '').trim();
      }
    }
    
    // Remove cost information from description
    description = description
      .replace(/[-–]\s*\$?[\d,]+(?:\.\d{2})?(?:\s*materials?)?/gi, '')
      .replace(/[-–]\s*\d+(?:\.\d+)?\s*(?:hours?|hrs?)(?:\s*labor)?/gi, '')
      .replace(/\s*\([^)]*\)/g, '') // Remove parenthetical cost info
      .replace(/\s+/g, ' ')
      .trim();
    
    // Determine category based on keywords
    let category = 'General Construction';
    const categoryKeywords: { [key: string]: string[] } = {
      'Demolition': ['demo', 'remove', 'tear out', 'disposal'],
      'Plumbing': ['plumb', 'pipe', 'drain', 'sink', 'toilet', 'faucet', 'shower', 'tub'],
      'Electrical': ['electric', 'wire', 'outlet', 'switch', 'light', 'panel', 'circuit'],
      'Framing': ['frame', 'stud', 'joist', 'beam', 'wall'],
      'Drywall': ['drywall', 'sheetrock', 'tape', 'mud', 'texture'],
      'Flooring': ['floor', 'tile', 'carpet', 'hardwood', 'vinyl', 'laminate'],
      'Painting': ['paint', 'primer', 'stain'],
      'Cabinetry': ['cabinet', 'vanity', 'shelv'],
      'Roofing': ['roof', 'shingle', 'flashing', 'gutter'],
      'Windows': ['window', 'glass'],
      'Doors': ['door', 'entry', 'interior'],
      'HVAC': ['hvac', 'heating', 'cooling', 'furnace', 'ac', 'duct'],
      'Fixtures': ['fixture', 'hardware'],
      'Materials': ['material', 'supply', 'supplies'],
    };
    
    const lowerDesc = description.toLowerCase();
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        category = cat;
        break;
      }
    }
    
    // Only add items that have a description
    if (description && (materialCost > 0 || laborHours > 0 || description.length > 3)) {
      const newItem: ScopeItem = {
        id: uuidv4(),
        category,
        description,
        materialCost,
        laborHours,
        projectSection: currentSection,
        quantity,
        unit,
        materialCostPerUnit,
        laborHoursPerUnit,
      };
      
      currentSectionItems.push(newItem);
      scopeItems.push(newItem);
    }
  });
  
  // Add the last section if it has items
  if (currentSectionItems.length > 0) {
    sections.push({
      name: currentSection,
      items: currentSectionItems,
      notes: currentSectionNotes || undefined
    });
  }
  
  // If no items were parsed, create a basic structure from the text
  if (scopeItems.length === 0) {
    // Split by common delimiters and create basic items
    const items = requestText
      .split(/[;\n•\-*]/)
      .filter(item => item.trim().length > 10);
    
    items.forEach(item => {
      scopeItems.push({
        id: uuidv4(),
        category: 'General Construction',
        description: item.trim(),
        materialCost: 0,
        laborHours: 0,
        projectSection: 'Custom Work',
      });
    });
  }
  
  return {
    projectName,
    items: scopeItems,
    sections: sections.length > 0 ? sections : undefined,
    notes,
  };
}

export function formatCustomRequestExample(): string {
  return `
Example formats for custom requests:

IMPORTANT: The parser can handle multi-line items. If cost information appears on the 
next line, it will be automatically merged with the item description above it.

Basic format:
- Kitchen demolition - $500 materials, 16 hours labor
- Install new cabinets - $8000 materials, 24 hours
- Plumbing rough-in - $1500

Multi-line format (cost on next line):
- Replace bedroom windows (3 bedrooms x 2 windows = 6 estimated) - $4800
  materials, 24 hours
- Frame, insulate, and drywall garage stair room (100 sq ft walls) - $2500
  materials, 30 hours

With quantities:
- 10 windows @ $500 each
- 200 sq ft flooring @ $7.50 per sq ft

Sections with NOTES:
Windows Replacement:
- Replace living room windows (3 windows) - $2400 materials, 12 hours
- Replace kitchen windows (2 windows) - $1600 materials, 8 hours
NOTES: Using Pella 250 Series vinyl double-hung at $500 each

Kitchen:
- Remove existing cabinets - 8 hours
- Install new cabinets - $8000, 24 hours
NOTES: Mid-size kitchen with island configuration

Full example with multiple sections:
Interior Trim & Flooring:
- Install trim throughout house (700 linear feet) - $8400 materials, 56 hours
- LVT flooring throughout house (1800 sq ft) - $14400 materials, 54 hours
- Level floor at base of stairs (50 sq ft) - $800 materials, 12 hours
NOTES: Premium LVT at $8/sq ft installed

Parser automatically:
• Merges multi-line items where cost appears on the next line
• Extracts material costs and labor hours from various formats
• Identifies project sections from headers ending with colon (:)
• Captures NOTES for each section
• Assigns appropriate categories based on keywords (plumbing, electrical, etc.)
`;
}