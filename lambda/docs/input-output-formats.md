# France Company Watch Lambda: Input and Output Formats

This document describes the expected input formats and output structures for the France Company Watch Lambda function.

## Input Format

The Lambda function accepts a JSON payload with the following structure:

### Common Parameters (Required)

```json
{
  "submissionId": "string",  // Unique identifier for the submission
}
```

### Search by Company Registration Number

```json
{
  "submissionId": "string",
  "companyRegistrationNumber": "string",  // French SIREN/SIRET number
}
```

### Search by Company Name

```json
{
  "submissionId": "string",
  "companyName": "string"  // Company name for fuzzy search
}
```

### Complete Example (All Parameters)

```json
{
  "submissionId": "SUB-12345",
  "companyName": "Société Générale",
  "companyRegistrationNumber": "552120222",
  "brokerCountryCode": "fr"  // Optional, defaults to "fr" for this lambda
}
```

## Output Format

The Lambda function returns a JSON response with the following structure:

### Successful Response

```json
{
  "statusCode": 200,
  "body": "{\"companies\":[...]}"  // Stringified JSON
}
```

### Error Response

```json
{
  "statusCode": 500,
  "body": "France Company Watch Initialization failed"
}
```

### Response Body Structure (Parsed)

```json
{
  "companies": [
    {
      "id": "string",
      "name": "string",
      "registrationNumber": "string",
      "address": {
        "street": "string",
        "city": "string",
        "postalCode": "string",
        "country": "string"
      },
      "incorporationDate": "string",
      "status": "string",
      "financials": [
        {
          "year": 2023,
          "revenue": 1000000,
          "profit": 100000,
          "assets": 2000000,
          "liabilities": 1000000
        }
      ],
      "incomeStatements": [
        {
          "year": 2023,
          "revenue": 1000000,
          "costOfSales": 600000,
          "grossProfit": 400000,
          "operatingExpenses": 250000,
          "operatingIncome": 150000,
          "netIncome": 100000
        }
      ],
      "scores": {
        "creditScore": 85,
        "financialStrength": 75,
        "riskLevel": "LOW",
        "scoreDate": "2023-09-30"
      },
      "confidenceScore": 0.95  // Only present for fuzzy name search results
    }
  ]
}
```

## Example Scenarios

### Scenario 1: Search by Registration Number

#### Input
```json
{
  "submissionId": "SUB-12345",
  "companyRegistrationNumber": "552120222"
}
```

#### Output
```json
{
  "statusCode": 200,
  "body": "{\"companies\":[{\"id\":\"552120222\",\"name\":\"Société Générale\",\"registrationNumber\":\"552120222\",\"address\":{\"street\":\"29 Boulevard Haussmann\",\"city\":\"Paris\",\"postalCode\":\"75009\",\"country\":\"France\"},\"incorporationDate\":\"1864-05-04\",\"status\":\"Active\",\"financials\":[{\"year\":2022,\"revenue\":28127000000,\"profit\":2061000000,\"assets\":1485000000000,\"liabilities\":1410000000000}],\"incomeStatements\":[{\"year\":2022,\"revenue\":28127000000,\"costOfSales\":16876000000,\"grossProfit\":11251000000,\"operatingExpenses\":8500000000,\"operatingIncome\":2751000000,\"netIncome\":2061000000}],\"scores\":{\"creditScore\":88,\"financialStrength\":82,\"riskLevel\":\"LOW\",\"scoreDate\":\"2023-08-15\"}}]}"
}
```

### Scenario 2: Search by Company Name

#### Input
```json
{
  "submissionId": "SUB-67890",
  "companyName": "Total Energies"
}
```

#### Output
```json
{
  "statusCode": 200,
  "body": "{\"companies\":[{\"id\":\"542051180\",\"name\":\"TotalEnergies SE\",\"registrationNumber\":\"542051180\",\"address\":{\"street\":\"2 Place Jean Millier\",\"city\":\"Courbevoie\",\"postalCode\":\"92400\",\"country\":\"France\"},\"incorporationDate\":\"1924-03-28\",\"status\":\"Active\",\"financials\":[{\"year\":2022,\"revenue\":281000000000,\"profit\":20500000000,\"assets\":350000000000,\"liabilities\":200000000000}],\"incomeStatements\":[{\"year\":2022,\"revenue\":281000000000,\"costOfSales\":220000000000,\"grossProfit\":61000000000,\"operatingExpenses\":30000000000,\"operatingIncome\":31000000000,\"netIncome\":20500000000}],\"scores\":{\"creditScore\":92,\"financialStrength\":90,\"riskLevel\":\"LOW\",\"scoreDate\":\"2023-09-01\"},\"confidenceScore\":0.92}]}"
}
```

### Scenario 3: No Results Found

#### Input
```json
{
  "submissionId": "SUB-13579",
  "companyName": "NonExistentCompany XYZ"
}
```

#### Output
```json
{
  "statusCode": 200,
  "body": "{\"companies\":[]}"
}
```

## Notes

1. When searching by company name, multiple results may be returned, ordered by relevance (confidenceScore).
2. When searching by registration number, typically only one result will be returned.
3. If no matches are found, an empty companies array is returned with a 200 status code.
4. Financial data may not be available for all companies, in which case those fields will be omitted.
5. All dates are in ISO 8601 format (YYYY-MM-DD).
6. All monetary values are in EUR (euros).