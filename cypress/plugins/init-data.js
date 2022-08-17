const axios = require('axios');
const _ = require('lodash')
const struts_apps = ['dhis-web-dataentry/index.action']
const queryParams = '?fields=displayName,id&paging=false';

axios.defaults.timeout = 20000

const install = (config) => {
  console.log('Initializing data')

  axios.get('/api', {
    baseURL: config.baseUrl,
    auth: {
      username: config.env.LOGIN_USERNAME,
      password: config.env.LOGIN_PASSWORD,
    }
  }).then(resp => {
    const instance = axios.create({
      withCredentials: false,
      baseURL: config.baseUrl,
      timeout: 15000,
      headers: {
        'Cookie': resp.headers['set-cookie'][0]
      }
    });

    const fetchData = (url) => {
      return instance.request({
        method: 'GET',
        url: url,
        auth: {
          username: config.env.LOGIN_USERNAME,
          password: config.env.LOGIN_PASSWORD,
        }
      }).then(resp => {
        //console.log(resp.data);
        console.log(resp)
        return resp.data;
      }).catch(err => {
        // Handle Error Here
        console.error(err);
      });
    };

    fetchData('/api/dashboards' + queryParams).then(data => {
      config.env.dashboards = data.dashboards;
      console.log('DASHBOARDS:')
      console.table(config.env.dashboards);
    })

    fetchData('/api/visualizations' + queryParams).then(data => {
      config.env.visualizations = data.visualizations;
      console.log('VISUALIZATIONS:')
      console.table(config.env.visualizations);
    })

    fetchData('/api/eventReports.json' + queryParams).then(data => {
      config.env.eventReports = data.eventReports;
      console.log('EVENT REPORTS:')
      console.table(config.env.eventReports);
    })

    fetchData('/api/eventCharts.json' + queryParams).then(data => {
      config.env.eventCharts = data.eventCharts;
      console.log('EVENT CHARTS:')
      console.table(config.env.eventCharts);
    })

    fetchData('/api/maps.json' + queryParams).then(data => {
      config.env.maps = data.maps;
      console.log('MAPS')
      console.table(config.env.maps);
    })

    fetchData(`/api/eventVisualizations.json${queryParams}&filter=type:eq:LINE_LIST`).then(data => {
      config.env.eventVisualizations = data.eventVisualizations;
      console.log('EVENT VISUALIZATIONS: ')
      console.table(config.env.eventVisualizations);
    })

    fetchData('/dhis-web-apps/apps-bundle.json').then(data => {
      const appList = struts_apps;
      appList.push(...data.flatMap(i => i.webName))
      config.env.apps = appList
      console.log('APPS: ')
      console.table(config.env.apps);
    })

  }).catch((err) => {
    console.error(err)
  });



}

module.exports = { install };
