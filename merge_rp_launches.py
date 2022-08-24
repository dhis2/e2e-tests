import requests, os, time
from datetime import datetime
URL = "https://test.tools.dhis2.org/reportportal/api/v1/dhis2_auto"
REPORT_PORTAL_TOKEN = os.getenv('RP_TOKEN')
CI_BUILD_ID = os.getenv('CI_BUILD_ID')

if not CI_BUILD_ID or not REPORT_PORTAL_TOKEN:
  print('Missing CI_BUILD_ID or RP_TOKEN environment variables. Skipping merge.')
  exit(0)

headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {}'.format(REPORT_PORTAL_TOKEN)
}
launches = requests.get(url="{}/launch".format(URL), headers=headers, params={'filter.has.attributeValue': CI_BUILD_ID} )

def close(items):
  body = {
    "entities": {}
  }
  for item in items:
      body['entities'][str(item)] = {
        "status": "STOPPED",
        "endTime": str(datetime.now().isoformat())
      }

  r = requests.put(url="{}/launch/stop".format(URL), headers=headers, json=body)
  if r.ok == False: 
    print('Failed to close items!')
    print(r.json())

def merge(launches, startime, name): 
    body = {
      "mergeType": "BASIC",
      'launches': launches,
      'name': name,
      "endTime": str(datetime.now().isoformat()),
      'extendSuitesDescription': 'true',
      'startTime': startime
    }
 
    r = requests.post(url="{}/launch/merge".format(URL), headers=headers, json=body)

    if r.ok == False:
      print('Failed to merge items')
      print(r.json())
   
content = launches.json()['content']
if len(content) < 2: 
  print('There were {} launches found. No need for merging.'.format(len(content)))
  exit(0)
  
in_progress = [x for x in content if x['status'] == 'IN_PROGRESS']

if len(in_progress) > 0:
  print('Closing in progress items')
  close( [x['id'] for x in in_progress])

startime = min([launch['startTime'] for launch in content])
name = content[0]['name']
merge([x['id'] for x in content], startime, name)