#!/usr/bin/env bash

set -euo pipefail

dhis2_credentials="$1"
instance_url="$2"

analytics_success_message='Analytics tables updated'
readiness_threshold_seconds=$((${INSTANCE_READINESS_THRESHOLD_ENV:-10} * 60))

function instance_response() {
  $HTTP --follow --headers get "$instance_url" | head -1 | cut -d ' ' -f 2
}

function analytics_completed_status() {
  $HTTP --auth "$dhis2_credentials" get "${instance_url}${analytics_status_endpoint}" |
  jq -r ".[] | select(.message | contains(\"$analytics_success_message\")) .completed"
}

function readiness_threshold() {
  elapsed_seconds=$(($SECONDS - $1))

  if [[ $elapsed_seconds -gt $readiness_threshold_seconds ]]; then
    echo "Readiness threshold of ${readiness_threshold_seconds}s reached. Exiting ..."
    exit 1
  fi
}

instance_readiness_start_time=$SECONDS
until [[ "$(instance_response)" == "200" ]]
do
  readiness_threshold $instance_readiness_start_time

  echo "Instance not ready yet, ${elapsed_seconds}s elapsed ..."
  sleep 10
done
echo "Instance is ready! Triggering Analytics generation ..."

analytics_status_endpoint=$(
  $HTTP --auth "$dhis2_credentials" post "$instance_url/api/resourceTables/analytics" |
  jq -r '.response .relativeNotifierEndpoint'
)
echo "Analytics notifier: $analytics_status_endpoint"

analytics_tasks_readiness_start_time=$SECONDS
until [[ "$(analytics_completed_status)" == "true" ]]
do
  readiness_threshold $analytics_tasks_readiness_start_time

  echo "Analytics generation task hasn't completed yet, $(($SECONDS-$analytics_tasks_readiness_start_time))s elapsed ..."
  sleep 10
done
echo "Analytics generation task has completed!"
