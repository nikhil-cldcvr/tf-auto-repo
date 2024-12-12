#!/bin/bash

# Regex pattern for the commit message
PATTERN="^\[JIRA-[0-9]+\] \| (dev|staging|prod) \| .+$"

# Read the commit message
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Check if the commit message matches the pattern
if [[ ! "$COMMIT_MSG" =~ $PATTERN ]]; then
    echo "Error: Commit message does not follow the required format:"
    echo "[JIRA-ID] | env | commit message"
    echo "Example: [JIRA-123] | dev | Add login functionality"
    exit 1
fi

exit 0
