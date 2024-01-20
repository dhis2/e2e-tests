const axios = require("axios");
const struts_apps = ["dhis-web-dataentry/index.action"];
const queryParams = "?fields=displayName,id&paging=false";

async function install() {
  try {
    console.log("Initializing data");

    const baseUrl = process.env.CYPRESS_BASE_URL;
    const loginUsername = "admin";
    const loginPassword = "district";

    console.log("Attempting to connect to: ", baseUrl + "/api");
    const login = await axios.get("/api", {
      baseURL: baseUrl,
      auth: {
        username: loginUsername,
        password: loginPassword,
      },
    });

    const client = axios.create({
      withCredentials: false,
      timeout: 20000,
      baseURL: baseUrl,
      headers: {
        Cookie: login.headers["set-cookie"][0],
      },
    });

    const fetchData = async (url, callback) => {
      try {
        const { data } = await client.get(url, {
          auth: {
            username: loginUsername,
            password: loginPassword,
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
        console.log("APPS: ");
        console.table(appList);
      }
    });

    // Fetch dashboards
    await fetchData("/api/dashboards" + queryParams, (data) => {
      if (data) {
        console.log("DASHBOARDS:");
        console.table(data.dashboards);
      }
    });

    // Fetch visualizations
    await fetchData("/api/visualizations" + queryParams, (data) => {
      if (data) {
        console.log("VISUALIZATIONS:");
        console.table(data.visualizations);
      }
    });

    // Fetch event reports
    await fetchData("/api/eventReports.json" + queryParams, (data) => {
      if (data) {
        console.log("EVENT REPORTS:");
        console.table(data.eventReports);
      }
    });

    // Fetch event charts
    await fetchData("/api/eventCharts.json" + queryParams, (data) => {
      if (data) {
        console.log("EVENT CHARTS:");
        console.table(data.eventCharts);
      }
    });

    // Fetch maps
    await fetchData("/api/maps.json" + queryParams, (data) => {
      if (data) {
        console.log("MAPS:");
        console.table(data.maps);
      }
    });

    // Fetch event visualizations
    await fetchData(
      `/api/eventVisualizations.json${queryParams}&filter=type:eq:LINE_LIST`,
      (data) => {
        if (data) {
          console.log("EVENT VISUALIZATIONS:");
          console.table(data.eventVisualizations);
        }
      }
    );
  } catch (error) {
    console.error("Error in install function:", error);
    process.exit(1); // Exit with an error code on failure
  }
}

// Execute the install function when this script is run
install().then(() => console.log("Initialization complete."));
