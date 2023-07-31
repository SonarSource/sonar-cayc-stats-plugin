#!/bin/bash

set -euo pipefail

[[ $CIRRUS_BRANCH == "master" ]] || [[ $CIRRUS_BRANCH =~ ^branch-.+ ]] || exit

curl -X POST "$SLACK_WEBHOOK_SQ" \
  -H 'Content-type: application/json' \
  --data-binary @- <<EOF
{
	"blocks": [
		{
			"type": "header",
			"text": {
				"type": "plain_text",
				"text": "Mend Scan",
				"emoji": true
			}
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Cirrus CI task <https://cirrus-ci.com/task/$CIRRUS_TASK_ID|$CIRRUS_TASK_ID> failed on *<$CIRRUS_REPO_CLONE_URL|$CIRRUS_REPO_FULL_NAME>* ($CIRRUS_BRANCH)"
			}
		}
	]
}
EOF
