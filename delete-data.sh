#!/bin/bash

url=$url
crendentials=$credentials
declare -a visualizations=('CurZOghc7Mh' 'jhr1eSnZeMr' 'jQPC2FMKqij')
declare -a maps=("AHWtSmx21sx" "gJ1BHisY9Wm", "bX1XOjbCzWP")
declare -a charts=("ME1zXcf4zvu" "bDhkM10HzKO" "jQPC2FMKqij")

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

send_delete_request "visualizations" "${visualizations[@]}"
send_delete_request "maps" "${maps[@]}"
send_delete_request "charts" "${charts[@]}"


