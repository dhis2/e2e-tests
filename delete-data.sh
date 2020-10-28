#!/bin/bash

url=$url
crendentials=$credentials
declare -a report_tables=('CurZOghc7Mh' 'jhr1eSnZeMr')
declare -a maps=("AHWtSmx21sx" "gJ1BHisY9Wm", "bX1XOjbCzWP")
declare -a charts=("ME1zXcf4zvu" "bDhkM10HzKO" "jQPC2FMKqij", "E65eFFxBFjk", "ZVElqaI9Kyp")

# $1- resource
# $2 - array of uids
function send_delete_request() {
  resource=$1; shift
  ids=( "$@" )
  echo "Params: $resource, ${ids[@]}"

  echo $arr
  for id in "${ids[@]}"; do
      echo "Deleting from $resource, uid: $id"
      response=$(curl -u $crendentials \
      -X DELETE \
      -s \
      -o /dev/null \
      --write-out "%{http_code}" \
      $url/api/$resource/$id )
      echo "Status code: $response"
    done
}

send_delete_request "reportTables" "${report_tables[@]}"
send_delete_request "maps" "${maps[@]}"
send_delete_request "charts" "${charts[@]}"


