import React, { useState, useEffect } from 'react';
import {
  Container,
  Tabs,
  Tab,
  Box,
  AppBar,
  Toolbar,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Paper,
} from '@mui/material';
import BidForm from './components/BidForm';
import BidList from './components/BidList';
import LaborRatesTable from './components/LaborRatesTable';
import PDFGenerator from './components/PDFGenerator';
import { HistoricalEstimates } from './components/HistoricalEstimates';
import { Bid } from './types';
import { getAllBids } from './utils/storage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function TabPanel(props: {
  children?: React.ReactNode;
  index: number;
  value: number;
}) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [bids, setBids] = useState<Bid[]>([]);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  useEffect(() => {
    loadBids();
  }, []);

  const loadBids = () => {
    const allBids = getAllBids();
    setBids(allBids);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleBidCreated = (bid: Bid) => {
    loadBids();
    setSelectedBid(bid);
    setTabValue(1); // Switch to bids list tab
  };

  const handleGeneratePDF = (bid: Bid) => {
    setSelectedBid(bid);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              North House Group - Bid Generator
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Cost + 20% | Change Orders + 35%
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper elevation={0}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="bid generator tabs">
              <Tab label="Create Bid" />
              <Tab label="View Bids" />
              <Tab label="Historical Estimates" />
              <Tab label="Labor Rates" />
            </Tabs>
          </Paper>

          <TabPanel value={tabValue} index={0}>
            <BidForm onBidCreated={handleBidCreated} />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <BidList bids={bids} onGeneratePDF={handleGeneratePDF} />
            {selectedBid && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Generate PDF for {selectedBid.clientName}
                </Typography>
                <PDFGenerator bid={selectedBid} />
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <HistoricalEstimates />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <LaborRatesTable />
          </TabPanel>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
