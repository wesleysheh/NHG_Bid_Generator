import React from 'react';
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
import { Bid } from '../types';
import { formatCurrency } from '../utils/calculations';
import { legalLanguage } from '../data/legalLanguage';
import { laborRates } from '../data/laborRates';

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

  return (
    <Document>
      {/* PAGE 1 - Client Info, Property Details, Pricing Summary, and Disclosure */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
          <Text style={styles.companyInfo}>Premium Remodeling & Construction Services</Text>
          <Text style={styles.companyInfo}>Aspen, Colorado | (970) 555-0100</Text>
          <Text style={styles.companyInfo}>info@northhousegroup.com | www.northhousegroup.com</Text>
          <Text style={styles.title}>PROJECT ESTIMATE</Text>
          <Text style={{ fontSize: 12, color: '#666', marginTop: 5, fontStyle: 'italic' }}>
            Cost-Plus Pricing: Actual Cost + 20% Markup
          </Text>
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
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Labor Costs:</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.laborCosts)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Material Costs:</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.materialCosts)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Base Cost:</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.baseCost)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Markup (20%):</Text>
            <Text style={styles.totalValue}>{formatCurrency(bid.markup)}</Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>ESTIMATED PROJECT TOTAL:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(bid.totalBid)}</Text>
          </View>
          <Text style={{ fontSize: 9, marginTop: 10, fontStyle: 'italic', textAlign: 'center' }}>
            *Final invoice will reflect actual costs + 20% markup
          </Text>
        </View>


        {bid.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADDITIONAL NOTES</Text>
            <Text style={{ fontSize: 10 }}>{bid.notes}</Text>
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
          const estimatedLines = 6 + items.length * 3;
          const linesPerPage = 40;
          
          if (currentPageItems.length > 0 && 
              currentPageItems.reduce((sum, s) => sum + s.lines, 0) + estimatedLines > linesPerPage) {
            // Create a page with current items
            allSectionElements.push(
              <Page key={`scope-${currentPageNumber}`} size="A4" style={styles.page}>
                <View style={styles.header}>
                  <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
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
            </View>
          );

          currentPageItems.push({ element: sectionElement, lines: estimatedLines });
        });

        // Add remaining sections
        if (currentPageItems.length > 0) {
          allSectionElements.push(
            <Page key={`scope-${currentPageNumber}`} size="A4" style={styles.page}>
              <View style={styles.header}>
                <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
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
          <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
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
            consistent quality and direct accountability to North House Group standards.
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
            for licensed professionals in the Aspen area. All external contractors are fully{'\n'}
            vetted, licensed, and insured.
          </Text>
          <Text style={{ fontSize: 9, marginTop: 10, color: '#666' }}>
            * Emergency/after-hours work: 1.5x multiplier{'\n'}
            * Weekend work: 1.25x multiplier{'\n'}
            * Holiday work: 2x multiplier
          </Text>
        </View>

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
              Base Project: Cost + 20% | Change Orders: Cost + 35%
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>North House Group • Premium Remodeling & Construction</Text>
        </View>
      </Page>

      {/* TERMS & CONDITIONS - CONTINUOUS FLOW */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
          <Text style={styles.title}>TERMS & CONDITIONS</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>ESTIMATE DISCLOSURE</Text>
          <Text style={styles.legalText}>{legalLanguage.estimateDisclaimer}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>PAYMENT TERMS</Text>
          <Text style={styles.legalText}>{legalLanguage.paymentTerms}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>CHANGE ORDER PROCEDURES</Text>
          <Text style={styles.legalText}>{legalLanguage.changeOrders}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>WARRANTY COVERAGE</Text>
          <Text style={styles.legalText}>{legalLanguage.warranty}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>INSURANCE & LIABILITY</Text>
          <Text style={styles.legalText}>{legalLanguage.liability}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>PERMITS & INSPECTIONS</Text>
          <Text style={styles.legalText}>{legalLanguage.permits}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>DISPUTE RESOLUTION</Text>
          <Text style={styles.legalText}>{legalLanguage.disputeResolution}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>SAFETY & COMPLIANCE</Text>
          <Text style={styles.legalText}>{legalLanguage.safetyCompliance}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>FORCE MAJEURE</Text>
          <Text style={styles.legalText}>{legalLanguage.forceMajeure}</Text>
        </View>

        <View style={styles.legalSection}>
          <Text style={styles.legalTitle}>GENERAL TERMS</Text>
          <Text style={styles.legalText}>{legalLanguage.generalTerms}</Text>
        </View>

        <View style={styles.footer}>
          <Text>North House Group • Terms & Conditions</Text>
        </View>
      </Page>

      {/* SIGNATURE PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>NORTH HOUSE GROUP</Text>
          <Text style={styles.title}>AGREEMENT EXECUTION</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ fontSize: 12, marginBottom: 20, lineHeight: 1.6 }}>
            By signing below, both parties acknowledge that they have read, understood, and agree to be bound by all terms 
            and conditions set forth in this estimate and accompanying documents.
          </Text>
          <Text style={{ fontSize: 12, marginBottom: 30, lineHeight: 1.6 }}>
            The undersigned acknowledges that this is an ESTIMATE based on a Cost-Plus pricing model and that actual costs 
            may vary. Final invoicing will be based on actual costs plus the agreed-upon markup.
          </Text>
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
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 30 }}>NORTH HOUSE GROUP:</Text>
            
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
          <Text>Thank you for choosing North House Group</Text>
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
  const fileName = bid.pdfFileName || `NHG_Bid_${bid.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  return (
    <PDFDownloadLink document={<PDFDocument bid={bid} />} fileName={fileName}>
      {({ blob, url, loading, error }) => (
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={loading}
        >
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFGenerator;