/**
 * Company Watch Mapper
 * 
 * This mapper transforms raw API responses from the D&B API into
 * a standardized internal format for the application.
 */

/**
 * Interface for the standardized company response format
 */
interface CompanyWatchResponse {
  id: string;
  name?: string;
  registrationNumber?: string;
  address?: {
    street?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  incorporationDate?: string;
  status?: string;
  financials?: {
    year: number;
    revenue?: number;
    profit?: number;
    assets?: number;
    liabilities?: number;
  }[];
  incomeStatements?: {
    year: number;
    revenue?: number;
    costOfSales?: number;
    grossProfit?: number;
    operatingExpenses?: number;
    operatingIncome?: number;
    netIncome?: number;
  }[];
  scores?: {
    creditScore?: number;
    financialStrength?: number;
    riskLevel?: string;
    scoreDate?: string;
  };
  confidenceScore?: number;
}

/**
 * Mapper class for transforming D&B API responses to internal format
 */
export class CompanyWatchMapper {
  /**
   * Map raw API responses to the standardized CompanyWatchResponse format
   * 
   * @param info - Company information from the API
   * @param scores - Company scores from the API
   * @param accounts - Company financial accounts from the API
   * @param incomeStatements - Company income statements from the API
   * @param confidenceScore - Optional confidence score from fuzzy name search
   * @returns CompanyWatchResponse - Standardized company response
   */
  public mapToCompanyWatchResponse(
    info: any,
    scores: any,
    accounts: any[],
    incomeStatements: any[],
    confidenceScore?: number
  ): CompanyWatchResponse {
    // Create the base response with company information
    const response: CompanyWatchResponse = {
      id: info.id,
      name: info.name,
      registrationNumber: info.registrationNumber,
      address: info.address,
      incorporationDate: info.incorporationDate,
      status: info.status
    };

    // Add financial accounts if available
    if (accounts && accounts.length > 0) {
      response.financials = accounts.map(account => ({
        year: account.year,
        revenue: account.revenue,
        profit: account.profit,
        assets: account.assets,
        liabilities: account.liabilities
      }));
    }

    // Add income statements if available
    if (incomeStatements && incomeStatements.length > 0) {
      response.incomeStatements = incomeStatements.map(statement => ({
        year: statement.year,
        revenue: statement.revenue,
        costOfSales: statement.costOfSales,
        grossProfit: statement.grossProfit,
        operatingExpenses: statement.operatingExpenses,
        operatingIncome: statement.operatingIncome,
        netIncome: statement.netIncome
      }));
    }

    // Add scores if available
    if (scores) {
      response.scores = {
        creditScore: scores.creditScore,
        financialStrength: scores.financialStrength,
        riskLevel: scores.riskLevel,
        scoreDate: scores.scoreDate
      };
    }

    // Add confidence score if available (from fuzzy name search)
    if (confidenceScore !== undefined) {
      response.confidenceScore = confidenceScore;
    }

    return response;
  }
}