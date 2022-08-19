#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

url=$url
crendentials=$credentials

APP_KEYS=('capture' 'line-listing')

getLatestAvailableAppVersion() {
  app_hub_id=$1
  core_version=$(curl -u $credentials $url/api/system/info | jq -r '.version' | grep -o -E '2.[0-9]+')
  latest_compatible_version_response=$(curl -u $credentials $url/api/appHub/v2/apps/$app_hub_id/versions?minDhisVersion=lte:$core_version | jq -r '.result[0]')
  echo "$latest_compatible_version_response"
}

installOrUpdate() {
  app=$1
  app_response=$(curl -u $credentials $url/api/apps?key=$app)
  app_version=$(echo "$app_response" | jq -r .[0].version)
  app_hub_id=$(echo "$app_response" | jq -r .[0].app_hub_id)

  latest_compatible_version_response="$(getLatestAvailableAppVersion $app_hub_id)"
  latest_compatible_version=$(echo $latest_compatible_version_response | jq -r .version)
  

  if [ -z "$app_version" ] || [ -z "$app_hub_id" ] || [[ $app_version != $latest_compatible_version  ]];then 
    echo "Installing $app app version $latest_compatible_version"
    download_url=$(echo $latest_compatible_version_response | jq -r .downloadUrl )
    download_name=$app.$latest_compatible_version.zip
    downloadApp $download_url $download_name
    importApp $download_name

  else
    echo "$app app is up-to-date"
  fi  
}

downloadApp () {
    download_name=$2
    download_url=$1

    curl -s -L $download_url --output $download_name

}
importApp() {
  download_name=$1
  status=$(curl -o /dev/null -u $credentials -F file=@$download_name $url/api/apps -w "%{http_code}")

  if [ $status != 204 ];then
    echo 'App install failed!'
  fi
}


for i in "${APP_KEYS[@]}";
do
  installOrUpdate $i
done
