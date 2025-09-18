# North House Group Bid Generator

## Quick Start

1. **Start the application:**
   ```bash
   npm start
   ```
   Opens at http://localhost:3000

2. **Build for production:**
   ```bash
   npm run build
   ```
   Creates optimized build in `/build` folder

## Features

- **Create Professional Bids**: Fill out property details and scope of work
- **Automatic Pricing**: Cost + 20% markup, 35% for change orders
- **Historical Data**: View price estimates based on past projects
- **Transparent Labor Rates**: Full visibility into trade pricing
- **PDF Generation**: Professional 3-page proposals with legal terms
- **Local Storage**: All data saved in browser (no backend needed)

## Deployment Options

### Vercel (Recommended - Easiest)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import this repository
4. Click Deploy (automatic!)

### Netlify
1. Run `npm run build`
2. Drag the `build` folder to https://app.netlify.com/drop

### GitHub Pages
1. Install: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
3. Run: `npm run deploy`

### Static Hosting
After running `npm run build`, upload the `build` folder to any static host (AWS S3, Google Cloud Storage, etc.)

## Usage

1. **Create Bid**: Enter client info, property details, and scope items
2. **View Bids**: See all created bids and generate PDFs
3. **Labor Rates**: Review transparent pricing for all trades

## Data Storage

All data is stored locally in your browser. To backup:
- Open browser console (F12)
- Run: `localStorage.getItem('northHouseBids')`
- Copy the output to save your bids

## Support

For issues or questions, contact North House Group.
