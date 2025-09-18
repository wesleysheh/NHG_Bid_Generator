import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Collapse,
  IconButton,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { projectTemplates } from '../data/projectTemplates';
import { formatCurrency } from '../utils/calculations';
import { laborRates } from '../data/laborRates';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function TemplateRow({ template }: { template: any }) {
  const [open, setOpen] = useState(false);
  const carpenterRate = laborRates.find(r => r.trade === 'General Carpenter')?.hourlyRate || 65;
  
  const totalMaterials = template.scopeItems.reduce((sum: number, item: any) => sum + item.materialCost, 0);
  const totalLaborHours = template.scopeItems.reduce((sum: number, item: any) => sum + item.laborHours, 0);
  const totalLaborCost = totalLaborHours * carpenterRate;
  const totalCost = totalMaterials + totalLaborCost;

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {template.name}
        </TableCell>
        <TableCell>{template.description}</TableCell>
        <TableCell align="right">{formatCurrency(template.averageCost.low)}</TableCell>
        <TableCell align="right">{formatCurrency(template.averageCost.mid)}</TableCell>
        <TableCell align="right">{formatCurrency(template.averageCost.high)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Detailed Breakdown
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Materials
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(totalMaterials)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Total Labor Hours
                      </Typography>
                      <Typography variant="h6">
                        {totalLaborHours} hrs
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Labor Cost
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(totalLaborCost)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={3}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary" gutterBottom>
                        Calculated Total
                      </Typography>
                      <Typography variant="h6">
                        {formatCurrency(totalCost)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Material Cost</TableCell>
                    <TableCell align="right">Labor Hours</TableCell>
                    <TableCell align="right">Labor Cost</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {template.scopeItems.map((item: any, index: number) => {
                    const laborCost = item.laborHours * carpenterRate;
                    const itemTotal = item.materialCost + laborCost;
                    return (
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {item.category}
                        </TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell align="right">{formatCurrency(item.materialCost)}</TableCell>
                        <TableCell align="right">{item.laborHours}</TableCell>
                        <TableCell align="right">{formatCurrency(laborCost)}</TableCell>
                        <TableCell align="right">{formatCurrency(itemTotal)}</TableCell>
                      </TableRow>
                    );
                  })}
                  <TableRow>
                    <TableCell colSpan={2} align="right">
                      <strong>Subtotal:</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(totalMaterials)}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{totalLaborHours}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(totalLaborCost)}</strong>
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatCurrency(totalCost)}</strong>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export const HistoricalEstimates: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const bathroomTemplates = projectTemplates.filter(t => t.category === 'bathroom');
  const fixtureTemplates = projectTemplates.filter(t => t.category === 'fixture');
  const kitchenTemplates = projectTemplates.filter(t => t.category === 'kitchen');
  const roomTemplates = projectTemplates.filter(t => t.category === 'room');
  const exteriorTemplates = projectTemplates.filter(t => t.category === 'exterior');
  const systemsTemplates = projectTemplates.filter(t => t.category === 'systems');
  const flooringTemplates = projectTemplates.filter(t => t.category === 'flooring');
  const windowsDoorsTemplates = projectTemplates.filter(t => t.category === 'windows-doors');

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Historical Estimates & Templates
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Browse our pre-defined project templates with detailed material and labor breakdowns.
        All prices are estimates and may vary based on specific project requirements.
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab label="Bathrooms" />
          <Tab label="Kitchens" />
          <Tab label="Exterior" />
          <Tab label="Systems" />
          <Tab label="Flooring" />
          <Tab label="Windows & Doors" />
          <Tab label="Fixtures" />
          <Tab label="Rooms" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table aria-label="bathroom templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bathroomTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer>
          <Table aria-label="kitchen templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kitchenTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <TableContainer>
          <Table aria-label="exterior templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exteriorTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <TableContainer>
          <Table aria-label="systems templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {systemsTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <TableContainer>
          <Table aria-label="flooring templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {flooringTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={5}>
        <TableContainer>
          <Table aria-label="windows and doors templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {windowsDoorsTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={6}>
        <TableContainer>
          <Table aria-label="fixture templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixtureTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={7}>
        <TableContainer>
          <Table aria-label="room templates">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Template Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Low Estimate</TableCell>
                <TableCell align="right">Mid Estimate</TableCell>
                <TableCell align="right">High Estimate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomTemplates.map(template => (
                <TemplateRow key={template.id} template={template} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Paper>
  );
};