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
  Button,
  Box,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Bid } from '../types';
import { formatCurrency } from '../utils/calculations';

interface BidListProps {
  bids: Bid[];
  onGeneratePDF: (bid: Bid) => void;
}

const BidList: React.FC<BidListProps> = ({ bids, onGeneratePDF }) => {
  if (bids.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No bids created yet. Create your first bid to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Recent Bids
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Property Address</TableCell>
              <TableCell align="right">Total Bid</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>{bid.clientName}</TableCell>
                <TableCell>{bid.propertyAddress}</TableCell>
                <TableCell align="right">{formatCurrency(bid.totalBid)}</TableCell>
                <TableCell>{new Date(bid.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <Button
                    startIcon={<PictureAsPdfIcon />}
                    onClick={() => onGeneratePDF(bid)}
                    variant="contained"
                    size="small"
                  >
                    Generate PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BidList;