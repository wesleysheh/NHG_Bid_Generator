import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { laborRates } from '../data/laborRates';
import { formatCurrency } from '../utils/calculations';

const LaborRatesTable: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Labor Rate Schedule
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Transparent pricing for all trades. Rates are subject to overtime and emergency multipliers.
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trade</TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                Hourly Rate
              </TableCell>
              <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>
                Minimum Charge
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laborRates.map((rate, index) => (
              <TableRow key={index} sx={{ '&:nth-of-type(odd)': { bgcolor: 'grey.50' } }}>
                <TableCell>{rate.trade}</TableCell>
                <TableCell align="right">{formatCurrency(rate.hourlyRate)}/hr</TableCell>
                <TableCell align="right">{formatCurrency(rate.minimumCharge)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        * Emergency/after-hours work: 1.5x multiplier
        <br />
        * Weekend work: 1.25x multiplier
        <br />
        * Holiday work: 2x multiplier
      </Typography>
    </Paper>
  );
};

export default LaborRatesTable;