#!/bin/bash

# -----------------------------
# Configuration Variables
# -----------------------------
JIRA_SERVER="your-jira-server.com"
JIRA_TOKEN="your-jira-api-token"
JIRA_HEADER="Content-Type: application/json"
VALID_STATUSES=("In Progress" "Development")

# Regex pattern for the commit message
PATTERN="^\[[A-Z]+-[0-9]+\] \| (dev|staging|prod) \| .+$"

# -----------------------------
# Read the commit message
# -----------------------------
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check if the commit message matches the pattern
if [[ ! "$COMMIT_MSG" =~ $PATTERN ]]; then
    echo "Error: Commit message does not follow the required format:"
    echo "[PROJECT-ID] | env | commit message"
    echo "Example: [ABC-123] | dev | Add login functionality"
    exit 1
fi

# Extract the JIRA ID from the commit message
JIRA_ID=$(echo "$COMMIT_MSG" | grep -oE "[A-Z]+-[0-9]+")

# -----------------------------
# Validate the JIRA ID by querying the JIRA API
# -----------------------------
jiraStatus=$(curl -s -k -H "Authorization: Bearer ${JIRA_TOKEN}" -H "${JIRA_HEADER}" \
    -X GET "https://${JIRA_SERVER}/rest/api/2/issue/${JIRA_ID}")

# Check if the JIRA ID is valid
validity=$(echo "$jiraStatus" | jq -r '.key')

if [[ "$validity" == "null" || "$validity" == "" ]]; then
    echo "Error: JIRA ID $JIRA_ID is not valid or does not exist."
    exit 1
fi

# Extract the issue's status
status=$(echo "$jiraStatus" | jq -r '.fields.status.name')

# Check if the issue is in an acceptable state
if [[ ! " ${VALID_STATUSES[@]} " =~ " ${status} " ]]; then
    echo "Error: JIRA ID $JIRA_ID is in '$status' status. Commit not accepted."
    exit 1
fi

# -----------------------------
# If everything is valid
# -----------------------------
echo "JIRA ID $JIRA_ID is valid and in an acceptable state ($status)."
echo "Commit accepted."
exit 0
