/**
 * France Company Watch Lambda Function
 * 
 * This Lambda function interfaces with the France D&B API via Apigee to enrich company 
 * submissions using both registration number and fuzzy name search.
 * 
 * The function handles two search paths:
 * 1. Company Registration Number: Direct lookup using SIREN/SIRET
 * 2. Company Name: Fuzzy search to find potential matches
 * 
 * For each company found, it retrieves multiple data points:
 * - Company information
 * - Company scores
 * - Company accounts
 * - Income statements
 * 
 * The enriched data is then persisted to a database and returned in a structured format.
 */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { APIGatewayProxyResult } from 'aws-lambda';
import { logging } from '@lmig/nl-logging-utils';
import { FranceCompanyLookup } from '../services/france-company-lookup';
import { CompanyWatchMapper } from '../mappers/company-watch-mapper';
import { EnrichmentRepository } from '../repository/enrichment.repository';

// Initialize logger
const logger = logging.child({ __filename });

/**
 * Main Lambda handler function
 * 
 * @param payload - The event payload containing search parameters
 * @returns Promise<APIGatewayProxyResult> - API Gateway response
 */
export const handler = async (payload: Record<string, unknown>): Promise<APIGatewayProxyResult> => {
  // Log Lambda start and payload for debugging
  logger.info('France Company Watch Lambda STARTED');
  logger.info(`Event Payload: ${JSON.stringify(payload)}`);

  // Initialize services
  const companyLookup = new FranceCompanyLookup();
  const companyWatchMapper = new CompanyWatchMapper();
  const enrichmentRepository = new EnrichmentRepository();

  try {
    // Initialize the company lookup service
    await companyLookup.initialize();
  } catch (error) {
    // Handle initialization errors
    logger.error('France Company Watch initialization failed', { error });
    return {
      statusCode: 500,
      body: 'France Company Watch Initialization failed'
    };
  }

  // Extract search parameters from payload
  // Country code should always be 'fr' for this lambda
  const countryCode = 'fr';
  
  // Extract company registration number (SIREN/SIRET) if provided
  const companyRegistrationNumber = payload.companyRegistrationNumber as string | undefined;
  
  // Initialize variables for search results
  let companyIds: string[];
  let confidenceScoreMap: Record<string, number> = {};

  // Determine search path based on available parameters
  if (!companyRegistrationNumber) {
    // Path 1: Search by company name (fuzzy search)
    const companyName = payload.companyName as string;
    
    // Log the search approach
    logger.info(`Searching by company name: ${companyName}`);
    
    // Find companies by name using fuzzy search
    const foundCompanies = await companyLookup.findCompanyIdByName(countryCode, companyName);
    
    // Extract company IDs from search results
    companyIds = foundCompanies.map(company => company.id);
    
    // Create confidence score map for ranking results
    confidenceScoreMap = Object.fromEntries(foundCompanies.map(company => [company.id, company.relevanceScore]));
  } else {
    // Path 2: Search directly by registration number
    logger.info(`Searching by registration number: ${companyRegistrationNumber}`);
    
    // Use registration number as the company ID
    companyIds = [companyRegistrationNumber];
  }

  // If no companies found, return empty response
  if (companyIds.length === 0) {
    logger.info('No companies found');
    return {
      statusCode: 200,
      body: JSON.stringify({ companies: [] })
    };
  }

  // For each company ID, fetch detailed information in parallel
  const companyWatchResponses = await Promise.all(companyIds.map(async (companyId) => {
    // Fetch multiple data points in parallel for efficiency
    const [info, scores, accounts, incomeStatements] = await Promise.all([
      companyLookup.getCompanyInfo(countryCode, companyId),
      companyLookup.getCompanyScores(countryCode, companyId),
      companyLookup.getCompanyAccounts(countryCode, companyId),
      companyLookup.getCompanyIncomeStatements(countryCode, companyId),
    ]);

    // Map the raw data to our internal format
    return companyWatchMapper.mapToCompanyWatchResponse(
      info,
      scores,
      accounts,
      incomeStatements,
      // Include confidence score if available (from fuzzy name search)
      !companyRegistrationNumber ? confidenceScoreMap[companyId] : undefined
    );
  }));

  // Create the final response object
  const responses = { companies: companyWatchResponses };

  // Persist the enriched data to the database
  await enrichmentRepository.save(
    payload.submissionId as string, 
    countryCode, 
    responses, 
    payload.companyName as string | undefined, 
    companyRegistrationNumber
  );

  // Log completion and response data
  logger.info(`France Company Watch Responses: ${JSON.stringify(responses)}`);
  logger.info('France Company Watch Lambda COMPLETED');

  // Return successful response
  return {
    statusCode: 200,
    body: JSON.stringify(responses),
  };
};