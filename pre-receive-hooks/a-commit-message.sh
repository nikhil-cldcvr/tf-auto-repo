#!/bin/bash
#
# Reject pushes that contain commits with messages that do not adhere
# to the defined regex.

# This can be a useful pre-receive hook [1] if you want to ensure every
# commit is associated with a ticket ID.
#
# As an example this hook ensures that the commit message contains a
# JIRA issue formatted as [JIRA-<issue number>] followed by a stage (dev, uat, prod, test)
# and a description.
#
# [1] https://help.github.com/en/enterprise/user/articles/working-with-pre-receive-hooks
#

set -e
error_msg="Your push was rejected because the commit 
            $commit in ${refname#refs/heads/}
            is missing a valid commit message
            The commit message must match the format
            '[JIRA-<issue number>] | <dev|uat|prod|test> | <message>
            Please fix the commit message and push again.
            https://help.github.com/en/articles/changing-a-commit-message"
            
zero_commit='0000000000000000000000000000000000000000'
msg_regex='^\[JIRA-[0-9]+\] \| (dev|uat|prod|test) \| .+'

while read -r oldrev newrev refname; do

    # Branch or tag got deleted, ignore the push
    [ "$newrev" = "$zero_commit" ] && continue

    # Calculate range for new branch/updated branch
    [ "$oldrev" = "$zero_commit" ] && range="$newrev" || range="$oldrev..$newrev"

    for commit in $(git rev-list "$range" --not --all); do
        if ! git log --max-count=1 --format=%B $commit | grep -iqE "$msg_regex"; then
            echo "$error_msg"
            exit 1
        fi
    done

done
