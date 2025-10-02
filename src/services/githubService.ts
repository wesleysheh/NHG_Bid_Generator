interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

interface BidData {
  clientName: string;
  address: string;
  date: string;
  totalCost: number;
  items: any[];
  laborItems: any[];
  pdfBlob?: Blob;
  pdfFileName?: string;
}

class GitHubService {
  private config: GitHubConfig | null = null;

  constructor() {
    // Auto-load configuration from environment variables
    this.loadConfig();
  }

  initialize(config: GitHubConfig) {
    this.config = {
      ...config,
      branch: config.branch || 'main'
    };
    localStorage.setItem('githubConfig', JSON.stringify(this.config));
  }

  loadConfig(): GitHubConfig | null {
    // First try environment variables
    if (process.env.REACT_APP_GITHUB_TOKEN) {
      this.config = {
        token: process.env.REACT_APP_GITHUB_TOKEN,
        owner: process.env.REACT_APP_GITHUB_OWNER || 'wesleysheh',
        repo: process.env.REACT_APP_GITHUB_REPO || 'bid-storage',
        branch: process.env.REACT_APP_GITHUB_BRANCH || 'main'
      };
      return this.config;
    }
    
    // Fall back to localStorage if no env vars
    const stored = localStorage.getItem('githubConfig');
    if (stored) {
      this.config = JSON.parse(stored);
    }
    return this.config;
  }

  clearConfig() {
    this.config = null;
    localStorage.removeItem('githubConfig');
  }

  async checkIfBidExists(bidData: BidData): Promise<boolean> {
    if (!this.config) return false;
    
    try {
      const folderPath = this.generateFolderPath(bidData);
      const baseFileName = this.generateFileName(bidData);
      const checkPath = `${folderPath}/${baseFileName}.md`;
      
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${checkPath}?ref=${this.config.branch}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      
      return response.ok;
    } catch (error) {
      console.error('Error checking if bid exists:', error);
      return false;
    }
  }

  async saveBid(bidData: BidData, forceOverride: boolean = false): Promise<{ success: boolean; url?: string; error?: string; exists?: boolean }> {
    if (!this.config) {
      return { success: false, error: 'GitHub not configured. Please add your token in settings.' };
    }

    try {
      // Check if bid already exists (same date, client, and address)
      if (!forceOverride) {
        const exists = await this.checkIfBidExists(bidData);
        if (exists) {
          return { 
            success: false, 
            error: 'A bid already exists for this client and date. Click Save again to override.',
            exists: true
          };
        }
      }
      // Helper function to save or update file
      const saveFile = async (path: string, content: string, message: string, isBase64: boolean = false) => {
        if (!this.config) return Promise.reject(new Error('GitHub not configured'));
        
        try {
          // First check if file exists
          const checkResponse = await fetch(
            `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${this.config.branch}`,
            {
              headers: {
                'Authorization': `Bearer ${this.config.token}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );
          
          let sha = undefined;
          if (checkResponse.ok) {
            const existingFile = await checkResponse.json();
            sha = existingFile.sha;
            console.log(`File exists at ${path}, will update with SHA: ${sha}`);
          } else if (checkResponse.status === 404) {
            console.log(`File does not exist at ${path}, will create new`);
          } else {
            console.error(`Unexpected response checking file: ${checkResponse.status}`);
          }
          
          const body: any = {
            message: sha ? `Update ${message}` : `Add ${message}`,
            content: isBase64 ? content : btoa(unescape(encodeURIComponent(content))),
            branch: this.config.branch
          };
          
          if (sha) {
            body.sha = sha;
          }
          
          const saveResponse = await fetch(
            `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${path}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${this.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
              },
              body: JSON.stringify(body)
            }
          );

          if (!saveResponse.ok) {
            const errorData = await saveResponse.json();
            console.error(`Failed to save ${path}:`, errorData);
            throw new Error(errorData.message || `Failed to save ${path}`);
          }

          return await saveResponse.json();
        } catch (error) {
          console.error(`Error saving file ${path}:`, error);
          throw error;
        }
      };

      const results = [];
      const errors = [];
      
      // Generate folder path for this bid
      const folderPath = this.generateFolderPath(bidData);
      const baseFileName = this.generateFileName(bidData);
      
      // Save markdown format
      const mdContent = this.formatBidContent(bidData);
      const mdPath = `${folderPath}/${baseFileName}.md`;
      
      try {
        const mdResult = await saveFile(mdPath, mdContent, `bid for ${bidData.clientName} - ${bidData.address}`);
        results.push(mdResult);
        console.log(`Successfully saved markdown to ${mdPath}`);
      } catch (error) {
        errors.push(`Markdown: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Save JSON format for bid machine
      const jsonContent = this.formatBidJSON(bidData);
      const jsonPath = `${folderPath}/${baseFileName}.json`;
      
      try {
        const jsonResult = await saveFile(jsonPath, jsonContent, `bid JSON for ${bidData.clientName} - ${bidData.address}`);
        results.push(jsonResult);
        console.log(`Successfully saved JSON to ${jsonPath}`);
      } catch (error) {
        errors.push(`JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Save PDF if provided
      if (bidData.pdfBlob && bidData.pdfFileName) {
        const pdfPath = `${folderPath}/${baseFileName}.pdf`;
        try {
          const pdfBase64 = await this.blobToBase64(bidData.pdfBlob);
          const pdfResult = await saveFile(pdfPath, pdfBase64, `PDF for ${bidData.clientName} - ${bidData.address}`, true);
          results.push(pdfResult);
          console.log(`Successfully saved PDF to ${pdfPath}`);
        } catch (error) {
          errors.push(`PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
      
      // Return status based on what was saved
      if (results.length > 0) {
        if (errors.length > 0) {
          console.warn('Some files saved with errors:', errors);
          return { 
            success: true, 
            url: results[0].content?.html_url,
            error: `Partial save - some files failed: ${errors.join('; ')}`
          };
        } else {
          return { 
            success: true, 
            url: results[0].content?.html_url
          };
        }
      } else {
        return { 
          success: false, 
          error: `All saves failed: ${errors.join('; ')}` 
        };
      }
    } catch (error) {
      console.error('Unexpected error in saveBid:', error);
      return { 
        success: false, 
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          // Remove the data URL prefix to get just the base64
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private generateFolderPath(bidData: BidData): string {
    const date = new Date(bidData.date);
    const dateStr = date.toISOString().split('T')[0];
    const clientName = bidData.clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const addressParts = bidData.address.split(',')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().substring(0, 30);
    // Format: bids/2025/2025-01-15_stuart_wilson_735_green_meadow_dr/
    return `bids/${date.getFullYear()}/${dateStr}_${clientName}_${addressParts}`;
  }

  private generateFileName(bidData: BidData): string {
    const clientName = bidData.clientName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    return `${clientName}_estimate`;
  }

  private formatBidContent(bidData: BidData): string {
    const date = new Date(bidData.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let content = `# Bid Estimate - ${bidData.clientName}\n\n`;
    content += `**Date:** ${date}\n`;
    content += `**Address:** ${bidData.address}\n`;
    content += `**Total Cost:** $${bidData.totalCost?.toLocaleString() || '0'}\n\n`;

    if (bidData.items && bidData.items.length > 0) {
      content += `## Materials & Services\n\n`;
      content += `| Item | Description | Quantity | Unit | Price | Total |\n`;
      content += `|------|-------------|----------|------|-------|-------|\n`;
      
      bidData.items.forEach(item => {
        const description = item.description || '';
        const quantity = item.quantity || 1;
        const unit = item.unit || 'EA';
        const unitPrice = item.materialCostPerUnit || item.materialCost || 0;
        const totalPrice = item.materialCost || 0;
        content += `| ${description} | ${description} | ${quantity} | ${unit} | $${unitPrice} | $${totalPrice.toLocaleString ? totalPrice.toLocaleString() : totalPrice} |\n`;
      });
      content += '\n';
    }

    if (bidData.laborItems && bidData.laborItems.length > 0) {
      content += `## Labor\n\n`;
      content += `| Trade | Hours | Rate/Hour | Total |\n`;
      content += `|-------|-------|-----------|-------|\n`;
      
      bidData.laborItems.forEach(item => {
        const trade = item.trade || '';
        const hours = item.hours || 0;
        const rate = item.rate || 0;
        const total = item.total || 0;
        content += `| ${trade} | ${hours} | $${rate} | $${total.toLocaleString ? total.toLocaleString() : total} |\n`;
      });
      content += '\n';
    }

    content += `---\n`;
    content += `*Generated by North House Bid App on ${new Date().toLocaleString()}*\n`;

    return content;
  }

  private formatBidJSON(bidData: BidData): string {
    // Format as JSON that can be copy-pasted into the bid machine
    const bidMachineData = {
      clientInfo: {
        name: bidData.clientName,
        address: bidData.address,
        date: bidData.date,
        email: '',
        phone: '',
        propertyType: 'residential',
        squareFootage: (bidData as any).squareFootage || ''
      },
      projectScope: {
        totalCost: bidData.totalCost || 0,
        laborCost: bidData.laborItems?.reduce((sum, item) => sum + (item.total || 0), 0) || 0,
        materialCost: bidData.items?.reduce((sum, item) => sum + (item.materialCost || 0), 0) || 0,
        markupPercent: 20,
        baseProject: true
      },
      materials: bidData.items?.map(item => ({
        category: item.category || 'General',
        description: item.description || '',
        quantity: item.quantity || 1,
        unit: item.unit || 'EA',
        unitPrice: item.materialCostPerUnit || item.materialCost || 0,
        totalPrice: item.materialCost || 0
      })) || [],
      labor: bidData.laborItems?.map(item => ({
        trade: item.trade || '',
        hours: item.hours || 0,
        hourlyRate: item.rate || 0,
        total: item.total || 0,
        description: item.description || ''
      })) || [],
      notes: 'Imported from saved bid',
      timestamp: new Date().toISOString()
    };

    return JSON.stringify(bidMachineData, null, 2);
  }

  async initializeRepository(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'GitHub not configured' };
    }

    try {
      // First, check if the repo exists
      const repoResponse = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
          // Try to create the repository
          console.log('Repository not found, attempting to create it...');
          const createRepoResponse = await fetch(
            'https://api.github.com/user/repos',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${this.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
              },
              body: JSON.stringify({
                name: this.config.repo,
                description: 'Storage for North House bid estimates',
                private: false,
                auto_init: true
              })
            }
          );

          if (!createRepoResponse.ok) {
            const error = await createRepoResponse.json();
            return { success: false, message: `Failed to create repository: ${error.message}` };
          }

          console.log('Repository created successfully');
        } else {
          return { success: false, message: `Repository check failed with status ${repoResponse.status}` };
        }
      }

      // Now create a README to establish the directory structure
      const readmePath = 'bids/README.md';
      const readmeContent = `# Bid Storage

This repository stores bid estimates generated by the North House Bid App.

## Directory Structure

- \`bids/\` - All bid files
  - \`2025/\` - Bids from 2025
  - \`2024/\` - Bids from 2024
  - etc.

Each bid is saved in three formats:
- \`.md\` - Markdown format for easy reading
- \`.json\` - JSON format for data import/export
- \`.pdf\` - PDF document for client delivery
`;

      try {
        // Check if README already exists
        const checkReadme = await fetch(
          `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${readmePath}`,
          {
            headers: {
              'Authorization': `Bearer ${this.config.token}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (checkReadme.status === 404) {
          // Create the README
          const createResponse = await fetch(
            `https://api.github.com/repos/${this.config.owner}/${this.config.repo}/contents/${readmePath}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${this.config.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
              },
              body: JSON.stringify({
                message: 'Initialize bids directory structure',
                content: btoa(readmeContent),
                branch: this.config.branch || 'main'
              })
            }
          );

          if (!createResponse.ok) {
            const error = await createResponse.json();
            console.error('Failed to create README:', error);
          } else {
            console.log('README created successfully');
          }
        }
      } catch (error) {
        console.error('Error creating README:', error);
      }

      return { success: true, message: 'Repository initialized successfully' };
    } catch (error) {
      return { success: false, message: `Initialization failed: ${error}` };
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    if (!this.config) {
      return { success: false, message: 'GitHub not configured' };
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.config.owner}/${this.config.repo}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (response.ok) {
        const repo = await response.json();
        return { success: true, message: `Connected to ${repo.full_name}` };
      } else if (response.status === 404) {
        // Repository doesn't exist, try to initialize it
        console.log('Repository not found, initializing...');
        return await this.initializeRepository();
      } else {
        return { success: false, message: 'Invalid token or repository' };
      }
    } catch (error) {
      return { success: false, message: 'Connection failed' };
    }
  }
}

export const githubService = new GitHubService();