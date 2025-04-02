#!/bin/bash

# -----------------------------
# Configuration Variables
# -----------------------------
JIRA_SERVER="your-jira-server.com"
JIRA_TOKEN="your-jira-api-token"
JIRA_HEADER="Content-Type: application/json"
VALID_STATUSES=("In Progress" "Development")

# Regex pattern for the commit message
PATTERN="^\[[a-zA-Z]+-[0-9]+\] \| (dev|staging|prod|test) \| .+$"

# -----------------------------
# Read commit information
# -----------------------------
set -e
zero_commit='0000000000000000000000000000000000000000'

while read -r oldrev newrev refname; do

    # Branch or tag got deleted, ignore the push
    [ "$newrev" = "$zero_commit" ] && continue

    # Calculate range for new branch/updated branch
    [ "$oldrev" = "$zero_commit" ] && range="$newrev" || range="$oldrev..$newrev"

    for commit in $(git rev-list "$range" --not --all); do
        # Get the commit message
        COMMIT_MSG=$(git log --max-count=1 --format=%B "$commit")

        # -----------------------------
        # Step 1: Validate the commit message format
        # -----------------------------
        if [[ ! "$COMMIT_MSG" =~ $PATTERN ]]; then
            echo "ERROR:"
            echo "ERROR: Commit message does not follow the required format:"
            echo "ERROR: '[PROJECT-ID] | env | commit message'."
            echo "ERROR: Example: '[ABC-123] | dev | Add login functionality'."
            exit 1
        fi

        # -----------------------------
        # Step 2: Extract JIRA ID and validate it via API
        # -----------------------------
        JIRA_ID=$(echo "$COMMIT_MSG" | grep -oE "[a-zA-Z]+-[0-9]+")

        # Query the JIRA API
        jiraStatus=$(curl -s -k -H "Authorization: Bearer ${JIRA_TOKEN}" -H "${JIRA_HEADER}" \
            -X GET "https://${JIRA_SERVER}/rest/api/2/issue/${JIRA_ID}")

        # Check if the JIRA ID is valid
        validity=$(echo "$jiraStatus" | jq -r '.key')

        if [[ "$validity" == "null" || "$validity" == "" ]]; then
            echo "ERROR:"
            echo "ERROR: JIRA ID $JIRA_ID is not valid or does not exist."
            exit 1
        fi

        # -----------------------------
        # Step 3: Check the issue's status
        # -----------------------------
        status=$(echo "$jiraStatus" | jq -r '.fields.status.name')

        if [[ ! " ${VALID_STATUSES[@]} " =~ " ${status} " ]]; then
            echo "ERROR:"
            echo "ERROR: JIRA ID $JIRA_ID is in '$status' status. Commit not accepted."
            exit 1
        fi

        echo "SUCCESS: JIRA ID $JIRA_ID is valid and in an acceptable state ($status)."
    done

done

# If everything is valid, allow the push
echo "All commits are valid. Push accepted."
exit 0
