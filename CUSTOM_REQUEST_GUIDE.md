# Custom Request Guide

## Overview
The North House Bid App can automatically parse custom work requests and convert them into structured bid items. This feature allows you to quickly create estimates from informal project descriptions, emails, or text messages.

## How to Use

### In the App
1. Click the **"Paste Custom Request"** button in the Scope of Work section
2. Paste your work request text into the dialog
3. Click **"Parse & Add to Bid"**
4. Review and adjust the parsed items as needed

### With Claude (AI Assistant)
You can also paste custom requests directly to Claude, who will format them for you. Simply say:
> "Parse this custom request for the bid app: [paste your request]"

## Supported Formats

### Basic Format
```
Kitchen demolition - $500 materials, 16 hours labor
Install new cabinets - $8000 materials, 24 hours
Plumbing rough-in - $1500
```

### With Quantities
```
10 windows @ $500 each
200 sq ft flooring @ $7.50 per sq ft
5 doors @ $300 each, 3 hours labor each
```

### With Sections
```
Kitchen:
- Remove existing cabinets - 8 hours
- Install new cabinets - $8000, 24 hours
- New countertops - $3500, 8 hours

Bathroom:
- Demo existing fixtures - $200, 8 hours
- Install new vanity - $1200, 4 hours
- Tile shower - $1500, 20 hours
```

### Email Format
```
Hi, I need a quote for:
1. Replace all windows (10 total) - expecting around $5000
2. New front door with sidelights
3. Paint entire house interior (2000 sq ft)
4. Refinish hardwood floors in living areas
```

## Parsing Rules

The parser automatically:
- **Detects costs**: Looks for dollar amounts ($500, $1,500.00)
- **Finds labor hours**: Identifies patterns like "8 hours", "16 hrs"
- **Recognizes quantities**: Parses "10 windows @ $500 each"
- **Categorizes work**: Assigns appropriate categories based on keywords
- **Creates sections**: Groups items under section headers ending with ":"

## Category Keywords

The parser automatically assigns categories based on these keywords:

- **Demolition**: demo, remove, tear out, disposal
- **Plumbing**: plumb, pipe, drain, sink, toilet, faucet, shower, tub
- **Electrical**: electric, wire, outlet, switch, light, panel, circuit
- **Framing**: frame, stud, joist, beam, wall
- **Drywall**: drywall, sheetrock, tape, mud, texture
- **Flooring**: floor, tile, carpet, hardwood, vinyl, laminate
- **Painting**: paint, primer, stain
- **Cabinetry**: cabinet, vanity, shelv
- **Roofing**: roof, shingle, flashing, gutter
- **Windows**: window, glass
- **Doors**: door, entry, interior
- **HVAC**: hvac, heating, cooling, furnace, ac, duct
- **Fixtures**: fixture, hardware
- **Materials**: material, supply, supplies

## Examples

### Example 1: Simple List
```
Need the following work done:
- Kitchen demo and disposal - $500
- New kitchen cabinets - $8000 materials, 24 hours
- Granite countertops - $3500
- Plumbing updates - $1500, 16 hours
- Electrical for under-cabinet lights - $800, 8 hours
```

### Example 2: Contractor Quote
```
Bathroom Remodel Scope:
Remove existing vanity and toilet (4 hours labor)
Install new 36" vanity with quartz top ($1200 materials, 4 hours)
Install Kohler toilet ($400 materials, 2 hours)
Retile shower walls 80 sq ft ($15/sq ft materials, 20 hours)
New shower glass door ($1000, 4 hours install)
```

### Example 3: Text Message Format
```
Can you give me a price for:
10 replacement windows around $500 each
New entry door maybe $3000 total
Paint whole house 2500 sq ft
Need it done by end of month
```

## Tips for Best Results

1. **Include costs when known**: Add material costs and labor hours where available
2. **Use clear descriptions**: Be specific about what work needs to be done
3. **Group related items**: Use section headers for different areas or phases
4. **Specify quantities**: Include counts and measurements (10 windows, 200 sq ft)
5. **Separate items clearly**: Use line breaks, bullets, or numbers

## Manual Adjustments

After parsing, you can:
- Edit descriptions for clarity
- Adjust material costs and labor hours
- Change categories
- Add or remove items
- Reorganize into different sections

## Storage Location

Parsed custom requests are stored as regular project sections in the bid. They appear alongside template-based sections and can be edited, moved, or deleted like any other scope items.

## Integration with Estimates

Custom request items are treated identically to template items:
- Labor calculated at standard crew rates
- 20% markup applied to base costs
- Included in PDF generation
- Can be mixed with template sections

## Troubleshooting

If parsing doesn't work as expected:
1. Check that costs use $ symbol or clear numeric values
2. Ensure labor is specified in hours/hrs
3. Use line breaks between items
4. Add section headers with colons
5. Review and manually adjust after parsing

---

For questions or improvements to the parser, contact william@northhousegroup.com