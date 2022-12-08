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

def get_launches():
  return requests.get(
    url="{}/launch".format(URL),
    headers=headers,
    params={'filter.has.attributeValue': CI_BUILD_ID}
  ).json()['content']


def get_in_progress(launches):
  return [x for x in launches if x['status'] == 'IN_PROGRESS']


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


launches = get_launches()
if len(launches) < 2:
  print('There were {} launches found. No need for merging.'.format(len(launches)))
  exit(0)

wait_start_time = time.time()
while len(get_in_progress(get_launches())) != 0 and time.time() - wait_start_time < 60:
  print('Launches still in progress ...')
  time.sleep(5)
else:
  print('Closing in progress items')
  close([x['id'] for x in get_in_progress(get_launches())])

launches = get_launches()
launch_star_time = min([launch['startTime'] for launch in launches])
name = launches[0]['name']
merge([x['id'] for x in launches], launch_star_time, name)
