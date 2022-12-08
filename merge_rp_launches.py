import requests, os, time
from datetime import datetime
URL = "https://test.tools.dhis2.org/reportportal/api/v1/dhis2_auto"
RP_TOKEN = os.getenv('RP_TOKEN')
CI_BUILD_ID = os.getenv('CI_BUILD_ID')
LAUNCH_BRANCH_VERSION = os.getenv('LAUNCH_BRANCH_VERSION')

if not RP_TOKEN or not CI_BUILD_ID or not LAUNCH_BRANCH_VERSION:
  print('Missing RP_TOKEN, CI_BUILD_ID or LAUNCH_BRANCH_VERSION environment variables. Skipping merge.')
  exit(0)

headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer {}'.format(RP_TOKEN)
}

def get_launches():
  return requests.get(
    url="{}/launch".format(URL),
    headers=headers,
    params={'filter.has.attributeValue': CI_BUILD_ID, 'filter.eq.name': f"e2e_tests_{LAUNCH_BRANCH_VERSION}"}
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

launches_in_progress = get_in_progress(get_launches())
if len(launches_in_progress) != 0:
  print('Closing in progress items')
  close([x['id'] for x in launches_in_progress])

launches = get_launches()
launch_star_time = min([launch['startTime'] for launch in launches])
name = launches[0]['name']
merge([x['id'] for x in launches], launch_star_time, name)
