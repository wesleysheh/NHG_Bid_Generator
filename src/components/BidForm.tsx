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
  FormControlLabel,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PreviewIcon from '@mui/icons-material/Preview';
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
import { parseCustomRequest, formatCustomRequestExample } from '../utils/customRequestParser';

interface BidFormProps {
  onBidCreated: (bid: Bid) => void;
}

interface ProjectSection {
  id: string;
  name: string;
  items: ScopeItem[];
  notes?: string;
}

const BidForm: React.FC<BidFormProps> = ({ onBidCreated }) => {
  const { control, handleSubmit, watch, setValue, getValues } = useForm<any>({
    defaultValues: {
      markupPercentage: 20,
      companyName: 'NORTH HOUSE GROUP',
      companyTagline: 'Premium Remodeling & Construction Services',
      companyLocation: 'Aspen, Colorado',
      companyEmail: 'william@northhousegroup.com',
      companyWebsite: '',
      showCostPlusLanguage: true
    }
  });
  const [projectSections, setProjectSections] = useState<ProjectSection[]>([]);
  
  // Watch the markup percentage for reactive updates
  const watchedMarkup = watch('markupPercentage');
  const [showSuccess, setShowSuccess] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [customSectionName, setCustomSectionName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customSize, setCustomSize] = useState<number | ''>('');
  const [pdfFileNameManuallyEdited, setPdfFileNameManuallyEdited] = useState(false);
  const [hasGeneratedFileName, setHasGeneratedFileName] = useState(false);
  const [customRequestDialogOpen, setCustomRequestDialogOpen] = useState(false);
  const [customRequestText, setCustomRequestText] = useState('');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);

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

  const handleParseCustomRequest = () => {
    const parsed = parseCustomRequest(customRequestText);
    
    if (parsed.sections && parsed.sections.length > 0) {
      // Add each section separately
      const newSections = parsed.sections.map(section => ({
        id: uuidv4(),
        name: section.name,
        items: section.items,
        notes: section.notes || '',
      }));
      
      setProjectSections(prev => [...prev, ...newSections]);
      setCustomRequestDialogOpen(false);
      setCustomRequestText('');
    } else if (parsed.items.length > 0) {
      // Single section fallback
      const newSection: ProjectSection = {
        id: uuidv4(),
        name: parsed.projectName,
        items: parsed.items.map(item => ({
          ...item,
          projectSection: parsed.projectName,
        })),
      };
      
      setProjectSections(prev => [...prev, newSection]);
      setCustomRequestDialogOpen(false);
      setCustomRequestText('');
    }
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
    const markupPercentage = getValues('markupPercentage') || 20;
    const markup = calculateMarkup(baseCost, markupPercentage);
    const totalBid = calculateTotalBid(baseCost, markup);

    return { laborCosts, materialCosts, baseCost, markup, totalBid };
  };

  const onSubmit = (data: any) => {
    const totals = calculateTotals();
    const allItems = projectSections.flatMap(section => section.items);
    
    // Create section notes mapping
    const sectionNotesMap: Record<string, string> = {};
    projectSections.forEach(section => {
      if (section.notes) {
        sectionNotesMap[section.name] = section.notes;
      }
    });
    
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
      markupPercentage: data.markupPercentage || 20,
      changeOrderMarkup: 0.35,
      createdAt: new Date(),
      clientName: data.clientName,
      clientEmail: data.clientEmail || '',
      clientPhone: data.clientPhone || '',
      projectTimeline: data.projectTimeline || '',
      notes: data.notes || '',
      pdfFileName: data.pdfFileName || '',
      sectionNotes: Object.keys(sectionNotesMap).length > 0 ? sectionNotesMap : undefined,
      companyName: data.companyName || 'NORTH HOUSE GROUP',
      companyTagline: data.companyTagline || 'Premium Remodeling & Construction Services',
      companyLocation: data.companyLocation || 'Aspen, Colorado',
      companyEmail: data.companyEmail || 'william@northhousegroup.com',
      companyWebsite: data.companyWebsite || '',
      showCostPlusLanguage: data.showCostPlusLanguage !== undefined ? data.showCostPlusLanguage : true,
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

  // Import JSON function
  const handleImportJson = () => {
    try {
      const data = JSON.parse(importJsonText);
      
      // Import client info - handle both 'address' and 'propertyAddress' fields
      if (data.clientInfo) {
        setValue('clientName', data.clientInfo.name || '');
        // Set propertyAddress field (not 'address')
        setValue('propertyAddress', data.clientInfo.propertyAddress || data.clientInfo.address || '');
        setValue('date', data.clientInfo.date || new Date().toISOString().split('T')[0]);
        setValue('clientEmail', data.clientInfo.email || '');
        setValue('clientPhone', data.clientInfo.phone || '');
        setValue('propertyType', data.clientInfo.propertyType || 'residential');
        setValue('squareFootage', data.clientInfo.squareFootage || '');
      }
      
      // Import project scope
      if (data.projectScope) {
        setValue('markupPercentage', data.projectScope.markupPercent || 20);
      }
      
      // Import sections
      if (data.sections && Array.isArray(data.sections)) {
        const importedSections: ProjectSection[] = data.sections.map((section: any) => ({
          id: uuidv4(),
          name: section.name || 'Imported Section',
          items: section.items?.map((item: any) => ({
            id: uuidv4(),
            category: item.category || 'General',
            description: item.description || item.item || '',
            quantity: item.quantity || 1,
            unit: item.unit || 'EA',
            materialCost: item.materialCost || item.unitPrice || item.totalPrice || 0,
            materialCostPerUnit: item.unitPrice || item.materialCost || 0,
            laborHours: item.hours || item.laborHours || 0,
            laborHoursPerUnit: item.laborHoursPerUnit || 0,
            projectSection: section.name
          })) || [],
          notes: section.notes || ''
        }));
        setProjectSections(importedSections);
      }
      
      // Import materials and labor as single section if no sections
      if (!data.sections && (data.materials || data.labor)) {
        const items: ScopeItem[] = [];
        
        if (data.materials) {
          data.materials.forEach((mat: any) => {
            items.push({
              id: uuidv4(),
              category: mat.category || 'Materials',
              description: mat.description || mat.item || '',
              quantity: mat.quantity || 1,
              unit: mat.unit || 'EA',
              materialCost: mat.materialCost || mat.unitPrice || mat.totalPrice || 0,
              materialCostPerUnit: mat.unitPrice || 0,
              laborHours: 0,
              laborHoursPerUnit: 0,
              projectSection: 'Imported Items'
            });
          });
        }
        
        setProjectSections([{
          id: uuidv4(),
          name: 'Imported Items',
          items: items
        }]);
      }
      
      setImportDialogOpen(false);
      setImportJsonText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      alert('Invalid JSON format. Please check your data and try again.');
    }
  };

  // Export current bid as JSON
  const handleExportJson = () => {
    const formData = getValues();
    const exportData = {
      clientInfo: {
        name: formData.clientName || '',
        propertyAddress: formData.propertyAddress || '',
        address: formData.propertyAddress || '', // Include both for compatibility
        date: formData.date || new Date().toISOString().split('T')[0],
        email: formData.clientEmail || '',
        phone: formData.clientPhone || '',
        propertyType: formData.propertyType || 'residential',
        squareFootage: formData.squareFootage || ''
      },
      projectScope: {
        markupPercent: formData.markupPercentage || 20,
        baseProject: true
      },
      sections: projectSections.map(section => ({
        name: section.name,
        items: section.items.map(item => ({
          category: item.category,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          materialCost: item.materialCost,
          unitPrice: item.materialCostPerUnit || item.materialCost,
          laborHours: item.laborHours,
          laborHoursPerUnit: item.laborHoursPerUnit
        })),
        notes: section.notes || ''
      })),
      timestamp: new Date().toISOString()
    };
    
    const jsonStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bid_${formData.clientName?.replace(/\s+/g, '_') || 'export'}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            Create New Bid
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setImportDialogOpen(true)}
              size="small"
            >
              Import JSON
            </Button>
            <Button
              variant="outlined"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportJson}
              size="small"
              disabled={!projectSections.length}
            >
              Export JSON
            </Button>
          </Stack>
        </Box>
        
        {showSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Bid created successfully! You can now generate the PDF.
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Company Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Name"
                    fullWidth
                    helperText="Your company/LLC name for the PDF"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="companyTagline"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Tagline"
                    fullWidth
                    helperText="e.g., Premium Remodeling Services"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="companyLocation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Location"
                    fullWidth
                    helperText="City, State"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="companyEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Email"
                    type="email"
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="companyWebsite"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Company Website"
                    fullWidth
                    helperText="Optional"
                  />
                )}
              />
            </Grid>
            
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
                    startIcon={<ContentPasteIcon />}
                    onClick={() => setCustomRequestDialogOpen(true)}
                  >
                    Paste Custom Request
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
                          <TextField
                            label="Section Notes"
                            value={section.notes || ''}
                            onChange={(e) => {
                              setProjectSections(prev => prev.map(s => 
                                s.id === section.id 
                                  ? { ...s, notes: e.target.value }
                                  : s
                              ));
                            }}
                            fullWidth
                            multiline
                            rows={2}
                            variant="outlined"
                            size="small"
                            sx={{ mb: 2 }}
                            placeholder="Add notes about this section..."
                          />
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

            <Grid item xs={12} md={4}>
              <Controller
                name="markupPercentage"
                control={control}
                defaultValue={20}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Markup Percentage (%)"
                    type="number"
                    fullWidth
                    InputProps={{
                      endAdornment: <Typography>%</Typography>,
                    }}
                    helperText="Percentage markup to add to base costs"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Controller
                name="showCostPlusLanguage"
                control={control}
                defaultValue={true}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        color="primary"
                      />
                    }
                    label="Show Cost-Plus Language"
                    sx={{ mt: 2 }}
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
                      Markup ({watchedMarkup || 20}%): {formatCurrency(calculateTotals().markup)}
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
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="outlined" 
                  size="large" 
                  fullWidth
                  startIcon={<PreviewIcon />}
                  onClick={() => setPreviewDialogOpen(true)}
                  disabled={!projectSections.length}
                >
                  Preview Bid
                </Button>
                <Button type="submit" variant="contained" size="large" fullWidth>
                  Create Bid
                </Button>
              </Stack>
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

      <Dialog
        open={customRequestDialogOpen}
        onClose={() => setCustomRequestDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Paste Custom Request</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              Paste a work request or scope description below. The system will automatically parse it into scope items.
            </Alert>
            <Typography variant="body2" color="text.secondary">
              {formatCustomRequestExample()}
            </Typography>
            <TextField
              label="Paste your custom request here"
              multiline
              rows={10}
              value={customRequestText}
              onChange={(e) => setCustomRequestText(e.target.value)}
              fullWidth
              placeholder="Example:\nKitchen Renovation:\n- Remove existing cabinets - 8 hours\n- Install new cabinets - $8000, 24 hours\n- Update plumbing - $1500, 12 hours"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomRequestDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleParseCustomRequest}
            variant="contained"
            disabled={!customRequestText.trim()}
          >
            Parse & Add to Bid
          </Button>
        </DialogActions>
      </Dialog>

      {/* Import JSON Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Bid from JSON</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Paste your JSON data below to import a bid. This will populate all fields with the imported data.
            </Typography>
            <TextField
              label="Paste JSON here"
              multiline
              rows={15}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              fullWidth
              placeholder={`{
  "clientInfo": {
    "name": "Client Name",
    "address": "123 Main St",
    "email": "client@email.com",
    "phone": "555-1234"
  },
  "sections": [
    {
      "name": "Section Name",
      "items": [...]
    }
  ]
}`}
              sx={{ fontFamily: 'monospace' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImportJson}
            variant="contained"
            disabled={!importJsonText.trim()}
          >
            Import Bid
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog 
        open={previewDialogOpen} 
        onClose={() => setPreviewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Bid Preview</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {/* Client Information */}
            <Box>
              <Typography variant="h6" gutterBottom>Client Information</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography variant="body1">{getValues('clientName') || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography variant="body1">{getValues('email') || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Phone:</Typography>
                  <Typography variant="body1">{getValues('phone') || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Square Footage:</Typography>
                  <Typography variant="body1">{getValues('squareFootage') || 'Not specified'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Address:</Typography>
                  <Typography variant="body1">{getValues('address') || 'Not provided'}</Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* Project Sections */}
            <Box>
              <Typography variant="h6" gutterBottom>Project Scope</Typography>
              {projectSections.map((section, index) => (
                <Accordion key={section.id} defaultExpanded={index === 0}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">{section.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Stack spacing={1}>
                      {section.items.map(item => (
                        <Box key={item.id} sx={{ pl: 2 }}>
                          <Typography variant="body2">
                            • {item.description} - {item.quantity} {item.unit}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                            Material: {formatCurrency(item.materialCost * (item.quantity || 1))} | 
                            Labor: {item.laborHours} hrs
                          </Typography>
                        </Box>
                      ))}
                      {section.notes && (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', pt: 1 }}>
                          Notes: {section.notes}
                        </Typography>
                      )}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>

            <Divider />

            {/* Cost Summary */}
            <Box>
              <Typography variant="h6" gutterBottom>Cost Summary</Typography>
              {(() => {
                const totals = calculateTotals();
                const allItems = projectSections.flatMap(section => section.items);
                const totalLaborHours = allItems.reduce((total, item) => total + item.laborHours, 0);
                return (
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Materials:</Typography>
                      <Typography variant="body2">{formatCurrency(totals.materialCosts)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Labor ({totalLaborHours} hrs):</Typography>
                      <Typography variant="body2">{formatCurrency(totals.laborCosts)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Base Cost:</Typography>
                      <Typography variant="body2">{formatCurrency(totals.baseCost)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Markup ({watchedMarkup}%):</Typography>
                      <Typography variant="body2">{formatCurrency(totals.markup)}</Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6">Total Estimate:</Typography>
                      <Typography variant="h6" color="primary">{formatCurrency(totals.totalBid)}</Typography>
                    </Box>
                  </Stack>
                );
              })()}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)}>Close</Button>
          <Button 
            onClick={() => {
              setPreviewDialogOpen(false);
              handleSubmit(onSubmit)();
            }}
            variant="contained"
          >
            Generate PDF
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BidForm;