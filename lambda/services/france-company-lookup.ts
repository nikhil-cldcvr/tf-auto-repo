/**
 * France Company Lookup Service
 * 
 * This service handles all interactions with the France D&B API via Apigee.
 * It provides methods for company lookup by name or registration number,
 * and retrieves various company data points.
 */

import axios, { AxiosInstance } from 'axios';
import { logging } from '../utils/logging';

// Initialize logger
const logger = logging.child({ __filename: 'france-company-lookup.ts' });

// Define interfaces for API responses
interface CompanySearchResult {
  id: string;
  name: string;
  registrationNumber?: string;
  relevanceScore: number;
}

interface CompanyInfo {
  id: string;
  name: string;
  registrationNumber?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  incorporationDate?: string;
  status?: string;
}

interface CompanyScore {
  id: string;
  creditScore?: number;
  financialStrength?: number;
  riskLevel?: string;
  scoreDate?: string;
}

interface CompanyAccount {
  id: string;
  year: number;
  revenue?: number;
  profit?: number;
  assets?: number;
  liabilities?: number;
}

interface IncomeStatement {
  id: string;
  year: number;
  revenue?: number;
  costOfSales?: number;
  grossProfit?: number;
  operatingExpenses?: number;
  operatingIncome?: number;
  netIncome?: number;
}

/**
 * Service class for interacting with the France D&B API
 */
export class FranceCompanyLookup {
  private apiClient: AxiosInstance | null = null;
  private apiKey: string | null = null;
  private baseUrl: string | null = null;

  /**
   * Initialize the API client with authentication
   */
  public async initialize(): Promise<void> {
    try {
      // In a real implementation, these would be retrieved from environment variables or AWS Parameter Store
      this.apiKey = process.env.FRANCE_DB_API_KEY || 'mock-api-key';
      this.baseUrl = process.env.FRANCE_DB_API_URL || 'https://api.apigee.france-db.example.com';

      // Create axios instance with default configuration
      this.apiClient = axios.create({
        baseURL: this.baseUrl,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      });

      logger.info('France Company Lookup service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize France Company Lookup service', { error });
      throw new Error('Failed to initialize France Company Lookup service');
    }
  }

  /**
   * Find companies by name using fuzzy search
   * 
   * @param countryCode - The country code (should be 'fr')
   * @param companyName - The company name to search for
   * @returns Promise<CompanySearchResult[]> - List of matching companies
   */
  public async findCompanyIdByName(countryCode: string, companyName: string): Promise<CompanySearchResult[]> {
    try {
      if (!this.apiClient) {
        throw new Error('API client not initialized');
      }

      logger.info(`Searching for company by name: ${companyName} in country: ${countryCode}`);

      const response = await this.apiClient.get('/v1/companies/search', {
        params: {
          country: countryCode,
          name: companyName,
          fuzzy: true,
          limit: 5 // Limit results to top 5 matches
        }
      });

      if (response.data && Array.isArray(response.data.companies)) {
        return response.data.companies.map((company: any) => ({
          id: company.id,
          name: company.name,
          registrationNumber: company.registrationNumber,
          relevanceScore: company.relevanceScore || 0
        }));
      }

      return [];
    } catch (error) {
      logger.error('Error finding company by name', { error, companyName, countryCode });
      return [];
    }
  }

  /**
   * Get detailed company information
   * 
   * @param countryCode - The country code (should be 'fr')
   * @param companyId - The company ID or registration number
   * @returns Promise<CompanyInfo> - Company information
   */
  public async getCompanyInfo(countryCode: string, companyId: string): Promise<CompanyInfo> {
    try {
      if (!this.apiClient) {
        throw new Error('API client not initialized');
      }

      logger.info(`Getting company info for ID: ${companyId} in country: ${countryCode}`);

      const response = await this.apiClient.get(`/v1/companies/${countryCode}/${companyId}`);

      if (response.data) {
        return {
          id: companyId,
          name: response.data.name,
          registrationNumber: response.data.registrationNumber,
          address: response.data.address,
          incorporationDate: response.data.incorporationDate,
          status: response.data.status
        };
      }

      return { id: companyId, name: '' };
    } catch (error) {
      logger.error('Error getting company info', { error, companyId, countryCode });
      return { id: companyId, name: '' };
    }
  }

  /**
   * Get company credit scores and risk assessments
   * 
   * @param countryCode - The country code (should be 'fr')
   * @param companyId - The company ID or registration number
   * @returns Promise<CompanyScore> - Company scores
   */
  public async getCompanyScores(countryCode: string, companyId: string): Promise<CompanyScore> {
    try {
      if (!this.apiClient) {
        throw new Error('API client not initialized');
      }

      logger.info(`Getting company scores for ID: ${companyId} in country: ${countryCode}`);

      const response = await this.apiClient.get(`/v1/companies/${countryCode}/${companyId}/scores`);

      if (response.data) {
        return {
          id: companyId,
          creditScore: response.data.creditScore,
          financialStrength: response.data.financialStrength,
          riskLevel: response.data.riskLevel,
          scoreDate: response.data.scoreDate
        };
      }

      return { id: companyId };
    } catch (error) {
      logger.error('Error getting company scores', { error, companyId, countryCode });
      return { id: companyId };
    }
  }

  /**
   * Get company financial accounts
   * 
   * @param countryCode - The country code (should be 'fr')
   * @param companyId - The company ID or registration number
   * @returns Promise<CompanyAccount[]> - Company accounts
   */
  public async getCompanyAccounts(countryCode: string, companyId: string): Promise<CompanyAccount[]> {
    try {
      if (!this.apiClient) {
        throw new Error('API client not initialized');
      }

      logger.info(`Getting company accounts for ID: ${companyId} in country: ${countryCode}`);

      const response = await this.apiClient.get(`/v1/companies/${countryCode}/${companyId}/accounts`);

      if (response.data && Array.isArray(response.data.accounts)) {
        return response.data.accounts.map((account: any) => ({
          id: companyId,
          year: account.year,
          revenue: account.revenue,
          profit: account.profit,
          assets: account.assets,
          liabilities: account.liabilities
        }));
      }

      return [];
    } catch (error) {
      logger.error('Error getting company accounts', { error, companyId, countryCode });
      return [];
    }
  }

  /**
   * Get company income statements
   *
   * @param countryCode - The country code (should be 'fr')
   * @param companyId - The company ID or registration number
   * @returns Promise<IncomeStatement[]> - Company income statements
   */
  public async getCompanyIncomeStatements(countryCode: string, companyId: string): Promise<IncomeStatement[]> {
    try {
      if (!this.apiClient) {
        throw new Error('API client not initialized');
      }

      logger.info(`Getting company income statements for ID: ${companyId} in country: ${countryCode}`);

      const response = await this.apiClient.get(`/v1/companies/${countryCode}/${companyId}/income-statements`);

      if (response.data && Array.isArray(response.data.incomeStatements)) {
        return response.data.incomeStatements.map((statement: any) => ({
          id: companyId,
          year: statement.year,
          revenue: statement.revenue,
          costOfSales: statement.costOfSales,
          grossProfit: statement.grossProfit,
          operatingExpenses: statement.operatingExpenses,
          operatingIncome: statement.operatingIncome,
          netIncome: statement.netIncome
        }));
      }

      return [];
    } catch (error) {
      logger.error('Error getting company income statements', { error, companyId, countryCode });
      return [];
    }
  }
}