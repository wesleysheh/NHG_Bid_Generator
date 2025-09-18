import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Box,
  IconButton,
  Alert,
  Divider,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { useForm, Controller } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { Bid, ScopeItem } from '../types';
import { laborRates } from '../data/laborRates';
import { projectTemplates, generateScopeItemsFromTemplate } from '../data/projectTemplates';
import {
  calculateBaseCost,
  calculateMarkup,
  calculateTotalBid,
  formatCurrency,
} from '../utils/calculations';
import { saveBid } from '../utils/storage';

interface BidFormProps {
  onBidCreated: (bid: Bid) => void;
}

interface ProjectSection {
  id: string;
  name: string;
  items: ScopeItem[];
}

const BidForm: React.FC<BidFormProps> = ({ onBidCreated }) => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm();
  const [projectSections, setProjectSections] = useState<ProjectSection[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customSectionName, setCustomSectionName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customSize, setCustomSize] = useState<number | ''>('');
  const [pdfFileNameManuallyEdited, setPdfFileNameManuallyEdited] = useState(false);
  const [hasGeneratedFileName, setHasGeneratedFileName] = useState(false);

  // Function to generate PDF filename when client name field loses focus
  const generatePdfFileName = () => {
    const clientName = getValues('clientName');
    
    // Only generate if:
    // 1. Client name exists
    // 2. Either we haven't generated yet OR user hasn't manually edited the PDF filename
    if (clientName && (!hasGeneratedFileName || !pdfFileNameManuallyEdited)) {
      const date = new Date().toISOString().split('T')[0];
      const sanitizedName = clientName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      setValue('pdfFileName', `NHG_Bid_${sanitizedName}_${date}.pdf`);
      setHasGeneratedFileName(true);
    }
  };

  const addProjectFromTemplate = () => {
    const template = projectTemplates.find(t => t.id === selectedTemplateId);
    if (!template) return;

    // Use custom size if provided, otherwise use template default
    const sizeToUse = customSize || template.defaultQuantity;

    for (let i = 0; i < quantity; i++) {
      const sectionName = quantity > 1 
        ? `${customSectionName || template.name} #${i + 1}`
        : customSectionName || template.name;
      
      const newSection: ProjectSection = {
        id: uuidv4(),
        name: sectionName,
        items: generateScopeItemsFromTemplate(template, sectionName, sizeToUse),
      };
      
      setProjectSections(prev => [...prev, newSection]);
    }
    
    setTemplateDialogOpen(false);
    setSelectedTemplateCategory('');
    setSelectedTemplateId('');
    setCustomSectionName('');
    setQuantity(1);
    setCustomSize('');
  };

  const addCustomSection = () => {
    const newSection: ProjectSection = {
      id: uuidv4(),
      name: 'Custom Work',
      items: [{
        id: uuidv4(),
        category: 'General Construction',
        description: '',
        materialCost: 0,
        laborHours: 0,
        projectSection: 'Custom Work',
      }],
    };
    setProjectSections(prev => [...prev, newSection]);
  };

  const addItemToSection = (sectionId: string) => {
    setProjectSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: [...section.items, {
            id: uuidv4(),
            category: 'General Construction',
            description: '',
            materialCost: 0,
            laborHours: 0,
            projectSection: section.name,
          }],
        };
      }
      return section;
    }));
  };

  const updateSectionName = (sectionId: string, newName: string) => {
    setProjectSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          name: newName,
          items: section.items.map(item => ({
            ...item,
            projectSection: newName,
          })),
        };
      }
      return section;
    }));
  };

  const updateScopeItem = (sectionId: string, itemId: string, field: string, value: any) => {
    setProjectSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item => {
            if (item.id === itemId) {
              const updated = { ...item, [field]: value };
              
              // If quantity changes and we have unit pricing, recalculate
              if (field === 'quantity' && item.materialCostPerUnit !== undefined) {
                updated.materialCost = value * item.materialCostPerUnit;
                if (item.laborHoursPerUnit !== undefined) {
                  updated.laborHours = value * item.laborHoursPerUnit;
                }
              }
              
              // If materialCostPerUnit changes, recalculate total material cost
              if (field === 'materialCostPerUnit' && item.quantity) {
                updated.materialCost = item.quantity * value;
              }
              
              return updated;
            }
            return item;
          }),
        };
      }
      return section;
    }));
  };

  const removeScopeItem = (sectionId: string, itemId: string) => {
    setProjectSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId),
        };
      }
      return section;
    }));
  };

  const removeSection = (sectionId: string) => {
    setProjectSections(prev => prev.filter(section => section.id !== sectionId));
  };

  const calculateTotals = () => {
    const allItems = projectSections.flatMap(section => section.items);
    const laborCosts = allItems.reduce((total, item) => {
      const rate = laborRates.find(r => r.trade === 'General Carpenter (Our Crew)')?.hourlyRate || 65;
      return total + (item.laborHours * rate);
    }, 0);
    
    const materialCosts = allItems.reduce((total, item) => total + (item.materialCost || 0), 0);
    const baseCost = calculateBaseCost(laborCosts, materialCosts);
    const markup = calculateMarkup(baseCost);
    const totalBid = calculateTotalBid(baseCost, markup);

    return { laborCosts, materialCosts, baseCost, markup, totalBid };
  };

  const onSubmit = (data: any) => {
    const totals = calculateTotals();
    const allItems = projectSections.flatMap(section => section.items);
    
    const bid: Bid = {
      id: uuidv4(),
      propertyAddress: data.propertyAddress,
      propertyType: data.propertyType,
      squareFootage: Number(data.squareFootage) || 0,
      scope: allItems,
      laborCosts: totals.laborCosts,
      materialCosts: totals.materialCosts,
      baseCost: totals.baseCost,
      markup: totals.markup,
      totalBid: totals.totalBid,
      changeOrderMarkup: 0.35,
      createdAt: new Date(),
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone || '',
      projectTimeline: data.projectTimeline || '',
      notes: data.notes || '',
      pdfFileName: data.pdfFileName || '',
    };

    saveBid(bid);
    onBidCreated(bid);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const categories = [
    'General Construction',
    'Demolition',
    'Framing',
    'Drywall',
    'Flooring',
    'Tiling',
    'Cabinetry',
    'Countertops',
    'Painting',
    'Electrical',
    'Plumbing',
    'HVAC',
    'Roofing',
    'Siding',
    'Windows',
    'Doors',
    'Insulation',
    'Fixtures',
    'Appliances',
    'Materials',
    'Equipment',
    'Permits',
    'Other',
  ];

  const templateCategories = [
    { value: 'bathroom', label: 'Bathrooms' },
    { value: 'kitchen', label: 'Kitchens' },
    { value: 'fixture', label: 'Fixtures' },
    { value: 'room', label: 'Rooms' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'systems', label: 'Systems' },
    { value: 'flooring', label: 'Flooring' },
    { value: 'windows-doors', label: 'Windows & Doors' },
  ];

  return (
    <>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Bid
        </Typography>
        
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bid created successfully! You can now generate the PDF.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="clientName"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField 
                    {...field} 
                    label="Client Name" 
                    fullWidth 
                    required 
                    onBlur={(e) => {
                      field.onBlur(); // Call react-hook-form's onBlur
                      generatePdfFileName(); // Generate PDF filename
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="clientEmail"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Client Email" type="email" fullWidth />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="clientPhone"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Client Phone" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Property Information
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="propertyAddress"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} label="Property Address" fullWidth required />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="propertyType"
                control={control}
                defaultValue="residential"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Property Type</InputLabel>
                    <Select {...field} label="Property Type">
                      <MenuItem value="residential">Residential</MenuItem>
                      <MenuItem value="commercial">Commercial</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                name="squareFootage"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField {...field} label="Square Footage" type="number" fullWidth />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 2 }}>
                <Typography variant="h6">
                  Scope of Work
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setTemplateDialogOpen(true)}
                  >
                    Add From Template
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addCustomSection}
                  >
                    Add Custom Section
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              {projectSections.length === 0 ? (
                <Alert severity="info">
                  No scope items added yet. Click "Add From Template" to quickly add pre-defined projects or "Add Custom Section" to create your own.
                </Alert>
              ) : (
                projectSections.map((section) => {
                  const sectionMaterials = section.items.reduce((sum, item) => sum + (item.materialCost || 0), 0);
                  const sectionLabor = section.items.reduce((sum, item) => sum + (item.laborHours || 0), 0);
                  const laborRate = laborRates.find(r => r.trade === 'General Carpenter (Our Crew)')?.hourlyRate || 65;
                  const sectionTotal = sectionMaterials + (sectionLabor * laborRate);

                  return (
                    <Accordion key={section.id} defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', pr: 2 }}>
                          <TextField
                            value={section.name}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateSectionName(section.id, e.target.value);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            variant="standard"
                            sx={{ mr: 2 }}
                            InputProps={{
                              startAdornment: <EditIcon sx={{ mr: 1, fontSize: 16 }} />,
                            }}
                          />
                          <Box sx={{ ml: 'auto', display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Chip 
                              label={`${section.items.length} items`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <Chip 
                              label={formatCurrency(sectionTotal)} 
                              size="small" 
                              color="success"
                            />
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSection(section.id);
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box sx={{ width: '100%' }}>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => addItemToSection(section.id)}
                            sx={{ mb: 2 }}
                          >
                            Add Item
                          </Button>
                          
                          {section.items.map((item) => (
                            <Box key={item.id} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} md={2}>
                                  <FormControl fullWidth size="small">
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                      value={item.category}
                                      onChange={(e) => updateScopeItem(section.id, item.id, 'category', e.target.value)}
                                      label="Category"
                                    >
                                      {categories.map((cat) => (
                                        <MenuItem key={cat} value={cat}>
                                          {cat}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} md={item.unit && item.materialCostPerUnit !== undefined ? 4 : 5}>
                                  <TextField
                                    label="Description"
                                    value={item.description}
                                    onChange={(e) => updateScopeItem(section.id, item.id, 'description', e.target.value)}
                                    fullWidth
                                    size="small"
                                  />
                                </Grid>
                                {item.unit && (
                                  <>
                                    <Grid item xs={6} md={2}>
                                      <TextField
                                        label={`Quantity (${item.unit})`}
                                        type="number"
                                        value={item.quantity || 0}
                                        onChange={(e) => {
                                          const newQuantity = Number(e.target.value);
                                          updateScopeItem(section.id, item.id, 'quantity', newQuantity);
                                          if (item.materialCostPerUnit !== undefined) {
                                            updateScopeItem(section.id, item.id, 'materialCost', newQuantity * item.materialCostPerUnit);
                                          }
                                          if (item.laborHoursPerUnit !== undefined) {
                                            updateScopeItem(section.id, item.id, 'laborHours', newQuantity * item.laborHoursPerUnit);
                                          }
                                        }}
                                        fullWidth
                                        size="small"
                                      />
                                    </Grid>
                                    {item.materialCostPerUnit !== undefined && (
                                      <Grid item xs={6} md={1.5}>
                                        <TextField
                                          label={`$/${item.unit}`}
                                          type="number"
                                          value={item.materialCostPerUnit}
                                          onChange={(e) => {
                                            const newPerUnit = Number(e.target.value);
                                            updateScopeItem(section.id, item.id, 'materialCostPerUnit', newPerUnit);
                                            updateScopeItem(section.id, item.id, 'materialCost', (item.quantity || 0) * newPerUnit);
                                          }}
                                          fullWidth
                                          size="small"
                                          InputProps={{ 
                                            startAdornment: '$',
                                            inputProps: { step: 0.1, min: 0 }
                                          }}
                                        />
                                      </Grid>
                                    )}
                                  </>
                                )}
                                <Grid item xs={6} md={item.unit ? 1 : 2}>
                                  <TextField
                                    label="Mat. Cost"
                                    type="number"
                                    value={item.materialCost || 0}
                                    onChange={(e) => updateScopeItem(section.id, item.id, 'materialCost', Number(e.target.value))}
                                    fullWidth
                                    size="small"
                                    InputProps={{ startAdornment: '$' }}
                                  />
                                </Grid>
                                <Grid item xs={6} md={item.unit ? 1 : 2}>
                                  <TextField
                                    label="Labor Hrs"
                                    type="number"
                                    value={item.laborHours}
                                    onChange={(e) => updateScopeItem(section.id, item.id, 'laborHours', Number(e.target.value))}
                                    fullWidth
                                    size="small"
                                  />
                                </Grid>
                                <Grid item xs={6} md={1}>
                                  <Box sx={{ pt: 1 }}>
                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                      {formatCurrency(item.materialCost + (item.laborHours * 65))}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {item.materialCostPerUnit !== undefined && (
                                      <Typography variant="caption" color="text.secondary">
                                        Base pricing: ${item.materialCostPerUnit?.toFixed(2)}/{item.unit} materials, {item.laborHoursPerUnit?.toFixed(3)} hrs/{item.unit} labor
                                        {item.quantity && ` = ${formatCurrency((item.quantity * (item.materialCostPerUnit || 0)) + (item.quantity * (item.laborHoursPerUnit || 0) * 65))} total`}
                                      </Typography>
                                    )}
                                    <IconButton 
                                      onClick={() => removeScopeItem(section.id, item.id)} 
                                      color="error"
                                      size="small"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}
                          
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                            <Typography variant="body2">
                              Materials: <strong>{formatCurrency(sectionMaterials)}</strong>
                            </Typography>
                            <Typography variant="body2">
                              Labor: <strong>{sectionLabor} hrs ({formatCurrency(sectionLabor * laborRate)})</strong>
                            </Typography>
                            <Typography variant="body2">
                              Section Total: <strong>{formatCurrency(sectionTotal)}</strong>
                            </Typography>
                          </Box>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="projectTimeline"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Timeline"
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="e.g., 2-3 weeks starting mid-January"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="pdfFileName"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="PDF Filename"
                    fullWidth
                    placeholder="Auto-generated based on client name"
                    helperText="This will be the filename when downloading the PDF"
                    onChange={(e) => {
                      field.onChange(e);
                      // Mark as manually edited if user types in this field
                      setPdfFileNameManuallyEdited(true);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Additional Notes"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Any special considerations or notes for the client"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="h6">Pricing Summary</Typography>
                {projectSections.length > 0 && (
                  <>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Material Costs: {formatCurrency(calculateTotals().materialCosts)}
                    </Typography>
                    <Typography variant="body2">
                      Labor Costs: {formatCurrency(calculateTotals().laborCosts)}
                    </Typography>
                    <Typography variant="body2">
                      Base Cost: {formatCurrency(calculateTotals().baseCost)}
                    </Typography>
                    <Typography variant="body2">
                      Markup (20%): {formatCurrency(calculateTotals().markup)}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h6">
                      Total Bid: {formatCurrency(calculateTotals().totalBid)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Change orders will be billed at cost + 35%
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth>
                Create Bid
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Dialog 
        open={templateDialogOpen} 
        onClose={() => setTemplateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Project From Template</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Select Template Category</InputLabel>
              <Select
                value={selectedTemplateCategory}
                onChange={(e) => {
                  setSelectedTemplateCategory(e.target.value);
                  setSelectedTemplateId('');
                  const categoryTemplates = projectTemplates.filter(t => t.category === e.target.value);
                  if (categoryTemplates.length > 0) {
                    setSelectedTemplateId(categoryTemplates[0].id);
                  }
                }}
                label="Select Template Category"
              >
                {templateCategories.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedTemplateCategory && (
              <FormControl fullWidth>
                <InputLabel>Select Template</InputLabel>
                <Select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  label="Select Template"
                >
                  {projectTemplates
                    .filter(t => t.category === selectedTemplateCategory)
                    .map(template => {
                      const pricePerUnit = template.defaultUnit && template.defaultQuantity
                        ? `${formatCurrency(template.averageCost.mid / template.defaultQuantity)}/${template.defaultUnit}`
                        : '';
                      
                      return (
                        <MenuItem key={template.id} value={template.id}>
                          <Box sx={{ width: '100%' }}>
                            <Typography variant="body2">
                              {template.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Total: {formatCurrency(template.averageCost.mid)}
                              {pricePerUnit && ` (${pricePerUnit})`}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            )}

            {selectedTemplateId && (
              <>
                <TextField
                  label="Custom Section Name (Optional)"
                  value={customSectionName}
                  onChange={(e) => setCustomSectionName(e.target.value)}
                  fullWidth
                  placeholder={`e.g., "Master Bathroom" or "Guest Bathroom #1"`}
                  helperText="Leave blank to use template name"
                />

                {projectTemplates.find(t => t.id === selectedTemplateId)?.defaultUnit && (
                  <TextField
                    label={`Size/Quantity (${projectTemplates.find(t => t.id === selectedTemplateId)?.defaultUnit})`}
                    type="number"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value ? Number(e.target.value) : '')}
                    fullWidth
                    placeholder={`Default: ${projectTemplates.find(t => t.id === selectedTemplateId)?.defaultQuantity} ${projectTemplates.find(t => t.id === selectedTemplateId)?.defaultUnit}`}
                    helperText={`Enter the size/amount for this project (e.g., square footage, number of windows)`}
                  />
                )}

                <TextField
                  label="Number of Sections"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  fullWidth
                  helperText="Add multiple instances (e.g., 2 for two bathrooms)"
                  InputProps={{ inputProps: { min: 1, max: 10 } }}
                />

                {projectTemplates.find(t => t.id === selectedTemplateId) && (
                  <Alert severity="info">
                    This will add {quantity} {quantity > 1 ? 'sections' : 'section'} of "
                    {projectTemplates.find(t => t.id === selectedTemplateId)?.name}"
                    {quantity > 1 && ' (numbered automatically)'}
                    {customSize && projectTemplates.find(t => t.id === selectedTemplateId)?.defaultUnit && (
                      <><br />Each section will be calculated for {customSize} {projectTemplates.find(t => t.id === selectedTemplateId)?.defaultUnit}</>
                    )}
                  </Alert>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={addProjectFromTemplate} 
            variant="contained"
            disabled={!selectedTemplateId}
          >
            Add to Bid
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidForm;