const axios = require("axios");
const struts_apps = ["dhis-web-dataentry/index.action"];
const queryParams = "?fields=displayName,id&paging=false";

async function install(config) {
  try {
    console.log("Initializing data");

    const login = await axios.get("/api", {
      baseURL: config.baseUrl,
      auth: {
        username: config.env.LOGIN_USERNAME,
        password: config.env.LOGIN_PASSWORD,
      },
    });

    const client = axios.create({
      withCredentials: false,
      timeout: 20000,
      baseURL: config.baseUrl,
      headers: {
        Cookie: login.headers["set-cookie"][0],
      },
    });

    const fetchData = async (url, callback) => {
      try {
        const { data } = await client.get(url, {
          baseURL: config.baseUrl,
          auth: {
            username: config.env.LOGIN_USERNAME,
            password: config.env.LOGIN_PASSWORD,
          },
        });
        return callback(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    // Fetch apps
    await fetchData("/dhis-web-apps/apps-bundle.json", (data) => {
      if (data) {
        const appList = struts_apps;
        appList.push(...data.flatMap((i) => i.webName));
        config.env.apps = appList;
        console.log("APPS: ");
        console.table(config.env.apps);
      }
    });

    // Fetch dashboards
    await fetchData("/api/dashboards" + queryParams, (data) => {
      if (data) {
        config.env.dashboards = data.dashboards;
        console.log("DASHBOARDS:");
        console.table(config.env.dashboards);
      }
    });

    // Fetch visualizations
    await fetchData("/api/visualizations" + queryParams, (data) => {
      if (data) {
        config.env.visualizations = data.visualizations;
        console.log("VISUALIZATIONS:");
        console.table(config.env.visualizations);
      }
    });

    // Fetch event reports
    await fetchData("/api/eventReports.json" + queryParams, (data) => {
      if (data) {
        config.env.eventReports = data.eventReports;
        console.log("EVENT REPORTS:");
        console.table(config.env.eventReports);
      }
    });

    // Fetch event charts
    await fetchData("/api/eventCharts.json" + queryParams, (data) => {
      if (data) {
        config.env.eventCharts = data.eventCharts;
        console.log("EVENT CHARTS:");
        console.table(config.env.eventCharts);
      }
    });

    // Fetch maps
    await fetchData("/api/maps.json" + queryParams, (data) => {
      if (data) {
        config.env.maps = data.maps;
        console.log("MAPS:");
        console.table(config.env.maps);
      }
    });

    // Fetch event visualizations
    await fetchData(
      `/api/eventVisualizations.json${queryParams}&filter=type:eq:LINE_LIST`,
      (data) => {
        if (data) {
          config.env.eventVisualizations = data.eventVisualizations;
          console.log("EVENT VISUALIZATIONS:");
          console.table(config.env.eventVisualizations);
        }
      }
    );
  } catch (error) {
    console.error("Error in install function:", error);
  }
}

module.exports = { install };
