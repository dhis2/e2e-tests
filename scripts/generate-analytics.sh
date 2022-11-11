#!/usr/bin/env bash

set -euo pipefail

dhis2_credentials="$1"
instance_url="$2"

function instance_response() {
  $HTTP --follow --headers get "$instance_url" | head -1 | cut -d ' ' -f 2
}

instance_readiness_start_time=$SECONDS
until [[ "$(instance_response)" == "200" ]]
do
  echo "Instance not ready yet, $(($SECONDS-$instance_readiness_start_time))s elapsed ..."
  sleep 30
done
echo "Instance is ready! Triggering Analytics generation ..."

analytics_status_endpoint=$(
  $HTTP --auth "$dhis2_credentials" post "$instance_url/api/resourceTables/analytics" |
  jq -r '.response .relativeNotifierEndpoint'
)
echo "Analytics notifier: $analytics_status_endpoint"

function analytics_status() {
  $HTTP --auth "$dhis2_credentials" get "${instance_url}${analytics_status_endpoint}" |
  jq -r '.[] .completed'
}

analytics_tasks_readiness_start_time=$SECONDS
until [[ "$(analytics_status)" =~ "true" ]]
do
  echo "Analytics tasks haven't completed yet, $(($SECONDS-$analytics_tasks_readiness_start_time))s elapsed ..."
  sleep 30
done
echo "Analytics tasks have completed!"
