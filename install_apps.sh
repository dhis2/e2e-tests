#!/bin/bash
url=$url
crendentials=$credentials
declare -a APPS=('line-listing-app')
GITHUB_API="https://api.github.com/repos/dhis2"

installApp() {
  app=$1
  assets_url=$(curl $GITHUB_API/$app/releases/latest | jq -r '.assets_url')
  echo $assets_url
  asset=$(curl $assets_url | jq -r '.[].browser_download_url')
  appName=$(curl $assets_url | jq -r '.[].name')
  echo $appName;
  $(curl -L $asset --output $appName)

  app=$1

  response=$(curl -u $credentials -F file=@$appName $url/api/apps)

  echo $response
}

for i in $APPS
do
  echo $i
  installApp $i
done


