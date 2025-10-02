import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
} from '@react-pdf/renderer';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Bid } from '../types';
import { formatCurrency } from '../utils/calculations';
import { legalLanguage } from '../data/legalLanguage';
import { laborRates } from '../data/laborRates';
import { githubService } from '../services/githubService';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #1976d2',
    paddingBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 5,
  },
  companyInfo: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1976d2',
    borderBottom: '1 solid #e0e0e0',
    paddingBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  column: {
    flex: 1,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    color: '#333',
    marginBottom: 8,
  },
  table: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #1976d2',
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    borderBottom: '1 solid #f0f0f0',
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  totalSection: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: '#333',
  },
  totalValue: {
    fontSize: 12,
    color: '#333',
  },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '2 solid #1976d2',
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  legalSection: {
    marginBottom: 25,
  },
  legalTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textTransform: 'uppercase',
    fontFamily: 'Times-Bold',
  },
  legalText: {
    fontSize: 10,
    lineHeight: 1.6,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: '1 solid #e0e0e0',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 15,
    right: 40,
    fontSize: 9,
    color: '#999',
  },
  signatureLine: {
    borderBottom: '1 solid #333',
    marginTop: 40,
    marginBottom: 5,
  },
});

interface PDFDocumentProps {
  bid: Bid;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ bid }) => {
  // Group items by section
  const sections = bid.scope.reduce((acc, item) => {
    const section = item.projectSection || 'General Work';
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, typeof bid.scope>);

  // Helper function to replace company name in legal text
  const replaceLegalCompanyName = (text: string): string => {
    const companyName = bid.companyName || 'North House Group';
    let updatedText = text
      .replace(/North House Group, LLC/g, `${companyName}, LLC`)
      .replace(/North House Group/g, companyName);
    
    // If not showing cost-plus language, remove markup references
    if (!bid.showCostPlusLanguage) {
      // For direct cost billing, replace the cost-plus language
      updatedText = updatedText
        .replace(/This estimate is provided by .+ based on a Cost-Plus pricing model, whereby the Client agrees to pay the actual cost of materials and labor plus a twenty percent \(20%\) markup\./g, 
          `This estimate is provided by ${companyName}, LLC ("Contractor") for the services and materials described herein.`)
        .replace(/Under this transparent pricing structure, Client will receive complete documentation including all receipts and time logs\. There are no hidden markups on materials beyond the stated twenty percent\./g, 
          'All work will be performed according to industry standards and best practices.')
        .replace(/Should the project costs come in under the estimated amount, Client will pay only the actual costs plus markup\./g, 
          'Should the project costs come in under the estimated amount, Client will pay only the actual costs.')
        .replace(/actual cost plus a twenty percent \(20%\) markup/g, 'agreed contract price')
        .replace(/actual costs plus markup/g, 'contract price')
        .replace(/plus a twenty percent \(20%\) markup/g, '')
        .replace(/plus the agreed-upon markup/g, '')
        .replace(/that change orders carry a higher markup rate of thirty-five percent \(35%\) versus the base markup of twenty percent \(20%\)/g, 
          'that change orders are subject to additional charges')
        .replace(/All Change Orders are billed at actual cost plus a thirty-five percent \(35%\) markup, compared to the twenty percent \(20%\) markup on base contract work\./g, 
          'All Change Orders are subject to additional charges.')
        .replace(/at an additional fifteen percent \(15%\) premium above standard Change Order rates/g, 
          'at additional premium rates')
        .replace(/Contractor shall not apply markup to actual cost increases/g, 
          'Contractor shall pass through cost increases')
        .replace(/standard markup applies to all work performed/g, 'standard pricing applies to all work performed')
        .replace(/plus a thirty-five percent \(35%\) markup/g, 'at agreed change order rates')
        .replace(/thirty-five percent \(35%\) markup/g, 'change order pricing')
        .replace(/plus a twenty percent \(20%\) termination fee/g, 'plus applicable termination fees');
    }
    
    return updatedText;
  };

  return (
    <Document>
      {/* PAGE 1 - Client Info, Property Details, Pricing Summary, and Disclosure */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
          <Text style={styles.companyInfo}>{bid.companyTagline || 'Premium Remodeling & Construction Services'}</Text>
          <Text style={styles.companyInfo}>{bid.companyLocation || 'Aspen, Colorado'}</Text>
          <Text style={styles.companyInfo}>
            {bid.companyEmail || 'william@northhousegroup.com'}
            {bid.companyWebsite && ` | ${bid.companyWebsite}`}
          </Text>
          <Text style={styles.title}>PROJECT ESTIMATE</Text>
          {bid.showCostPlusLanguage && bid.markupPercentage && bid.markupPercentage > 0 && (
            <Text style={{ fontSize: 12, color: '#666', marginTop: 5, fontStyle: 'italic' }}>
              Cost-Plus Pricing: Actual Cost + {bid.markupPercentage}% Markup
            </Text>
          )}
        </View>

        {/* Client and Property Info in Two Columns */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PROJECT INFORMATION</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Client Name</Text>
              <Text style={styles.value}>{bid.clientName}</Text>
              
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{bid.clientEmail || 'Not provided'}</Text>
              
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{bid.clientPhone || 'Not provided'}</Text>
            </View>
            
            <View style={styles.column}>
              <Text style={styles.label}>Property Address</Text>
              <Text style={styles.value}>{bid.propertyAddress}</Text>
              
              <Text style={styles.label}>Property Type</Text>
              <Text style={styles.value}>{bid.propertyType}</Text>
              
              <Text style={styles.label}>Square Footage</Text>
              <Text style={styles.value}>{bid.squareFootage ? `${bid.squareFootage.toLocaleString()} sq ft` : 'Not specified'}</Text>
              
              <Text style={styles.label}>Project Timeline</Text>
              <Text style={styles.value}>{bid.projectTimeline || 'To be determined'}</Text>
            </View>
          </View>
        </View>

        {/* Pricing Summary */}
        <View style={styles.totalSection}>
          {bid.showCostPlusLanguage && (
            <Text style={styles.sectionTitle}>PRICING BREAKDOWN SUMMARY</Text>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Labor Costs:</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.laborCosts)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Material Costs:</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.materialCosts)}</Text>
          </View>
          {bid.showCostPlusLanguage && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Base Cost:</Text>
              <Text style={styles.totalValue}>{formatCurrency(bid.baseCost)}</Text>
            </View>
          )}
          {bid.showCostPlusLanguage && bid.markupPercentage && bid.markupPercentage > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Markup ({bid.markupPercentage}%):</Text>
              <Text style={styles.totalValue}>{formatCurrency(bid.markup)}</Text>
            </View>
          )}
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>ESTIMATED PROJECT TOTAL:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(bid.totalBid)}</Text>
          </View>
          {bid.showCostPlusLanguage && bid.markupPercentage && bid.markupPercentage > 0 && (
            <Text style={{ fontSize: 9, marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>
              *Final invoice will reflect actual costs + {bid.markupPercentage}% markup
            </Text>
          )}
        </View>


        {bid.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADDITIONAL NOTES</Text>
            <Text style={{ fontSize: 10 }}>
              {bid.notes}
            </Text>
          </View>
        )}

        <Text style={styles.pageNumber}>Page 1</Text>
      </Page>

      {/* SCOPE OF WORK PAGES - All sections on continuous pages */}
      {(() => {
        const allSectionElements: any[] = [];
        let currentPageItems: { element: any; lines: number }[] = [];
        let currentPageNumber = 2;

        Object.entries(sections).forEach(([sectionName, items], sectionIndex) => {
          const sectionMaterials = items.reduce((sum, item) => sum + (item.materialCost || 0), 0);
          const sectionLabor = items.reduce((sum, item) => sum + (item.laborHours || 0), 0);
          const laborRate = laborRates.find(r => r.trade === 'General Carpenter (Our Crew)')?.hourlyRate || 65;
          const sectionTotal = sectionMaterials + (sectionLabor * laborRate);

          // Estimate if this section will fit on current page
          const notesLines = bid.sectionNotes && bid.sectionNotes[sectionName] ? 4 : 0;
          const estimatedLines = 6 + items.length * 3 + notesLines;
          const linesPerPage = 40;
          
          if (currentPageItems.length > 0 && 
              currentPageItems.reduce((sum, s) => sum + s.lines, 0) + estimatedLines > linesPerPage) {
            // Create a page with current items
            allSectionElements.push(
              <Page key={`scope-${currentPageNumber}`} size="A4" style={styles.page}>
                <View style={styles.header}>
                  <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
                  <Text style={styles.title}>SCOPE OF WORK</Text>
                </View>
                {currentPageItems.map(section => section.element)}
                <Text style={styles.pageNumber}>Page {currentPageNumber}</Text>
              </Page>
            );
            currentPageNumber++;
            currentPageItems = [];
          }

          const sectionElement = (
            <View key={sectionName} style={{ marginBottom: 20 }}>
              <View style={{ backgroundColor: '#f5f5f5', padding: 8, marginBottom: 5 }}>
                <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{sectionName}</Text>
                <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                  Total: {formatCurrency(sectionTotal)} | Materials: {formatCurrency(sectionMaterials)} | Labor: {sectionLabor} hrs
                </Text>
              </View>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCellHeader, { flex: 1.5 }]}>Category</Text>
                  <Text style={[styles.tableCellHeader, { flex: 3 }]}>Description</Text>
                  <Text style={[styles.tableCellHeader, { flex: 1 }]}>Qty</Text>
                  <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Labor Hrs</Text>
                  <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Mat. Cost</Text>
                </View>
                {items.map((item, index) => (
                  <View style={styles.tableRow} key={index}>
                    <Text style={[styles.tableCell, { flex: 1.5, fontSize: 9 }]}>{item.category}</Text>
                    <Text style={[styles.tableCell, { flex: 3, fontSize: 9 }]}>
                      {item.description}
                      {item.unit && item.materialCostPerUnit !== undefined && (
                        `\n@ $${item.materialCostPerUnit}/${item.unit}`
                      )}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, fontSize: 9 }]}>
                      {item.quantity && item.unit ? `${item.quantity} ${item.unit}` : '-'}
                    </Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontSize: 9 }]}>{item.laborHours}</Text>
                    <Text style={[styles.tableCell, { flex: 1, textAlign: 'right', fontSize: 9 }]}>
                      {formatCurrency(item.materialCost)}
                    </Text>
                  </View>
                ))}
              </View>
              {bid.sectionNotes && bid.sectionNotes[sectionName] && (
                <View style={{ 
                  backgroundColor: '#fff8dc', 
                  padding: 8, 
                  marginTop: 5, 
                  borderLeft: '3 solid #ffa500',
                  borderRadius: 2
                }}>
                  <Text style={{ fontSize: 9, fontWeight: 'bold', marginBottom: 2 }}>NOTES:</Text>
                  <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#333' }}>
                    {bid.sectionNotes[sectionName]}
                  </Text>
                </View>
              )}
            </View>
          );

          currentPageItems.push({ element: sectionElement, lines: estimatedLines });
        });

        // Add remaining sections
        if (currentPageItems.length > 0) {
          allSectionElements.push(
            <Page key={`scope-${currentPageNumber}`} size="A4" style={styles.page}>
              <View style={styles.header}>
                <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
                <Text style={styles.title}>SCOPE OF WORK</Text>
              </View>
              {currentPageItems.map(section => section.element)}
              <Text style={styles.pageNumber}>Page {currentPageNumber}</Text>
            </Page>
          );
          currentPageNumber++;
        }

        return allSectionElements;
      })()}

      {/* PRICING STRUCTURE & LABOR RATES PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
          <Text style={styles.title}>PRICING STRUCTURE & LABOR RATES</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OUR CREW LABOR RATES</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Trade</Text>
              <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Hourly Rate</Text>
              <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Minimum Charge</Text>
            </View>
            {laborRates.filter(rate => rate.isInternal).map((rate, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{rate.trade}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                  {formatCurrency(rate.hourlyRate)}/hr
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                  {formatCurrency(rate.minimumCharge)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 10, marginTop: 10, fontStyle: 'italic', color: '#1976d2' }}>
            These rates reflect our in-house crew members. Work performed by our own team ensures{'\n'}
            consistent quality and direct accountability to {bid.companyName || 'North House Group'} standards.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXTERNAL CONTRACTOR RATES (WHEN REQUIRED)</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { flex: 2 }]}>Trade</Text>
              <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Hourly Rate</Text>
              <Text style={[styles.tableCellHeader, { flex: 1, textAlign: 'right' }]}>Minimum Charge</Text>
            </View>
            {laborRates.filter(rate => !rate.isInternal).map((rate, index) => (
              <View style={styles.tableRow} key={index}>
                <Text style={[styles.tableCell, { flex: 2 }]}>{rate.trade}</Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                  {formatCurrency(rate.hourlyRate)}/hr
                </Text>
                <Text style={[styles.tableCell, { flex: 1, textAlign: 'right' }]}>
                  {formatCurrency(rate.minimumCharge)}
                </Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 10, marginTop: 10, fontStyle: 'italic' }}>
            External contractors are used for specialized trades. These are typical market rates{'\n'}
            for licensed professionals in the Western Slope. All external contractors are fully{'\n'}
            vetted, licensed, and insured.
          </Text>
          <Text style={{ fontSize: 9, marginTop: 10, color: '#666' }}>
            * Emergency/after-hours work: 1.5x multiplier{'\n'}
            * Weekend work: 1.25x multiplier{'\n'}
            * Holiday work: 2x multiplier
          </Text>
        </View>

        {bid.showCostPlusLanguage && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PRICING BREAKDOWN SUMMARY</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Material Costs</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  All materials billed at actual cost with receipts provided. No hidden markups.
                </Text>
              </View>
              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 5 }}>Labor Costs</Text>
                <Text style={{ fontSize: 10, color: '#666' }}>
                  Billed at published hourly rates shown above. Time tracked and documented.
                </Text>
              </View>
            </View>
            <View style={{ marginTop: 15, padding: 10, backgroundColor: '#e8f4fd', borderRadius: 5 }}>
              <Text style={{ fontSize: 11, textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
                Base Project: Cost + {bid.markupPercentage || 20}% | Change Orders: Cost + 35%
              </Text>
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text>{bid.companyName || 'North House Group'} • {bid.companyTagline || 'Premium Remodeling & Construction'}</Text>
        </View>
      </Page>

      {/* TERMS & CONDITIONS - CONTINUOUS FLOW */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
          <Text style={styles.title}>TERMS & CONDITIONS</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>ESTIMATE DISCLOSURE</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.estimateDisclaimer)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>PAYMENT TERMS</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.paymentTerms)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>CHANGE ORDER PROCEDURES</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.changeOrders)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>WARRANTY COVERAGE</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.warranty)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>INSURANCE & LIABILITY</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.liability)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>PERMITS & INSPECTIONS</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.permits)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>DISPUTE RESOLUTION</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.disputeResolution)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>SAFETY & COMPLIANCE</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.safetyCompliance)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>FORCE MAJEURE</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.forceMajeure)}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>GENERAL TERMS</Text>
          <Text style={styles.legalText}>{replaceLegalCompanyName(legalLanguage.generalTerms)}</Text>
        </View>

        <View style={styles.footer}>
          <Text>{bid.companyName || 'North House Group'} • Terms & Conditions</Text>
        </View>
      </Page>

      {/* SIGNATURE PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>{bid.companyName || 'NORTH HOUSE GROUP'}</Text>
          <Text style={styles.title}>AGREEMENT EXECUTION</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
            By signing below, both parties acknowledge that they have read, understood, and agree to be bound by all terms 
            and conditions set forth in this estimate and accompanying documents.
          </Text>
          {bid.showCostPlusLanguage ? (
            <Text style={{ fontSize: 12, marginBottom: 30, lineHeight: 1.6 }}>
              The undersigned acknowledges that this is an ESTIMATE based on a Cost-Plus pricing model and that actual costs 
              may vary. Final invoicing will be based on actual costs plus the agreed-upon markup.
            </Text>
          ) : (
            <Text style={{ fontSize: 12, marginBottom: 30, lineHeight: 1.6 }}>
              The undersigned acknowledges that this is an ESTIMATE for the work described herein. 
              The final invoice will reflect the agreed contract price as detailed in this document.
            </Text>
          )}
        </View>

        <View style={{ flexDirection: 'row', marginTop: 40 }}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 30 }}>CLIENT ACCEPTANCE:</Text>
            
            <View style={{ marginBottom: 40 }}>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 10 }}>Client Signature</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>Date: _______________________</Text>
            </View>

            <View>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 10 }}>Print Name: {bid.clientName}</Text>
            </View>
          </View>

          <View style={{ flex: 1, paddingLeft: 20 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 30 }}>{bid.companyName || 'NORTH HOUSE GROUP'}:</Text>
            
            <View style={{ marginBottom: 40 }}>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 10 }}>Authorized Representative</Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>Date: _______________________</Text>
            </View>

            <View>
              <View style={styles.signatureLine} />
              <Text style={{ fontSize: 10 }}>Print Name and Title</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Thank you for choosing {bid.companyName || 'North House Group'}</Text>
          <Text>Colorado Contractor License #123456 | Fully Insured & Bonded</Text>
        </View>
      </Page>
    </Document>
  );
};

interface PDFGeneratorProps {
  bid: Bid;
}

const PDFGenerator: React.FC<PDFGeneratorProps> = ({ bid }) => {
  const [saveStatus, setSaveStatus] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [autoSaved, setAutoSaved] = useState(false);
  const [pendingOverride, setPendingOverride] = useState(false);
  const fileName = bid.pdfFileName || `NHG_Bid_${bid.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;


  const handleSaveToGitHub = async (forceOverride: boolean = false) => {
    setIsSaving(true);
    
    if (!forceOverride && !pendingOverride) {
      setSaveStatus('Checking for existing files...');
    } else if (forceOverride) {
      setSaveStatus('Overriding existing files...');
    } else {
      setSaveStatus('Saving all files to GitHub...');
    }
    
    const bidData = {
      clientName: bid.clientName,
      address: bid.propertyAddress,
      date: bid.createdAt instanceof Date ? bid.createdAt.toISOString() : bid.createdAt,
      totalCost: bid.totalBid,
      items: bid.scope,
      laborItems: [],
      squareFootage: bid.squareFootage,
      pdfBlob: pdfBlob || undefined,
      pdfFileName: pdfBlob ? fileName : undefined
    };

    const result = await githubService.saveBid(bidData, forceOverride || pendingOverride);
    
    if (result.success) {
      if (result.error) {
        // Partial success
        setSaveStatus(`⚠️ Partially saved: ${result.error}`);
      } else {
        setSaveStatus(`✓ All files saved to GitHub!`);
      }
      setAutoSaved(true);
      setPendingOverride(false);
    } else if (result.exists) {
      // File exists, ask for confirmation
      setSaveStatus(`⚠️ Bid already exists for this date. Click "Override" to replace.`);
      setPendingOverride(true);
    } else {
      // Don't show error if not configured
      if (!result.error?.includes('not configured')) {
        setSaveStatus(`✗ Error: ${result.error}`);
      }
      setPendingOverride(false);
    }
    
    setIsSaving(false);
    if (!result.exists) {
      setTimeout(() => setSaveStatus(''), 5000);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
      <PDFDownloadLink document={<PDFDocument bid={bid} />} fileName={fileName}>
        {({ blob, url, loading, error }) => {
          // Capture the blob when it's available
          if (blob && !loading && !error && blob !== pdfBlob) {
            setPdfBlob(blob);
            
            // Auto-save to GitHub when PDF is ready (only if not already saved)
            if (!autoSaved) {
              const bidData = {
                clientName: bid.clientName,
                address: bid.propertyAddress,
                date: bid.createdAt instanceof Date ? bid.createdAt.toISOString() : bid.createdAt,
                totalCost: bid.totalBid,
                items: bid.scope,
                laborItems: [],
                squareFootage: bid.squareFootage,
                pdfBlob: blob,
                pdfFileName: fileName
              };
              
              // Save silently in background (don't override existing)
              githubService.saveBid(bidData, false).then(result => {
                if (result.success) {
                  setAutoSaved(true);
                  console.log('Auto-saved to GitHub successfully');
                } else if (result.exists) {
                  console.log('Bid already exists, skipping auto-save');
                  setAutoSaved(true); // Mark as saved to prevent repeated attempts
                } else if (!result.error?.includes('not configured')) {
                  console.error('Auto-save failed:', result.error);
                }
              });
            }
          }
          
          return (
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              disabled={loading}
            >
              {loading ? 'Generating PDF...' : 'Download PDF'}
            </Button>
          );
        }}
      </PDFDownloadLink>
      
      <Button
        variant={pendingOverride ? "contained" : "outlined"}
        color={pendingOverride ? "warning" : "primary"}
        startIcon={<CloudUploadIcon />}
        onClick={() => handleSaveToGitHub(pendingOverride)}
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : pendingOverride ? 'Override Existing' : 'Save to GitHub'}
      </Button>
      
      {pendingOverride && (
        <Button
          variant="text"
          onClick={() => {
            setPendingOverride(false);
            setSaveStatus('');
          }}
          disabled={isSaving}
        >
          Cancel
        </Button>
      )}
      
      {saveStatus && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: saveStatus.includes('✓') ? '#d4edda' : '#f8d7da',
          color: saveStatus.includes('✓') ? '#155724' : '#721c24',
          borderRadius: '4px',
          fontSize: '14px',
          maxWidth: '100%',
          wordBreak: 'break-all'
        }}>
          {saveStatus}
        </div>
      )}
    </div>
  );
};

export default PDFGenerator;