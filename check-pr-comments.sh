#!/bin/bash
# Check all open PRs for new comments
# Usage: ./check-pr-comments.sh

REPO="sahilmgandhi/sahilmgandhi.github.io"

echo "Checking PR comments for $REPO..."
echo ""

gh pr list --repo "$REPO" --state open --json number,title,url --jq '.[] | "PR #\(.number): \(.title)"'

echo ""
echo "=== Comments ==="

gh pr list --repo "$REPO" --state open --json number --jq '.[].number' | while read pr; do
    comments=$(gh pr view "$pr" --repo "$REPO" --json comments --jq '.comments | length')
    if [ "$comments" -gt 0 ]; then
        echo "--- PR #$pr ($comments comments) ---"
        gh pr view "$pr" --repo "$REPO" --json comments --jq '.comments[] | "\(.author.login) (\(.createdAt)): \(.body)"'
    fi
done