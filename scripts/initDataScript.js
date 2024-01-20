const axios = require("axios");
const fs = require("fs");
const struts_apps = ["dhis-web-dataentry/index.action"];
const queryParams = "?fields=displayName,id&paging=false";

async function install() {
  try {
    console.log("Initializing data");

    const baseUrl = process.env.CYPRESS_BASE_URL;
    const loginUsername = "admin";
    const loginPassword = "district";
    const cypressEnvFilePath = "../cypress.env.json";

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

    let envData = {};

    const fetchData = async (url, envKey) => {
      try {
        const { data } = await client.get(url, {
          auth: {
            username: loginUsername,
            password: loginPassword,
          },
        });
        envData[envKey] = data;
        console.log(`${envKey.toUpperCase()}:`);
        console.table(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    // Fetch and log data
    await fetchData("/dhis-web-apps/apps-bundle.json", "apps");
    await fetchData("/api/dashboards" + queryParams, "dashboards");
    await fetchData("/api/visualizations" + queryParams, "visualizations");
    await fetchData("/api/eventReports.json" + queryParams, "eventReports");
    await fetchData("/api/eventCharts.json" + queryParams, "eventCharts");
    await fetchData("/api/maps.json" + queryParams, "maps");
    await fetchData(
      `/api/eventVisualizations.json${queryParams}&filter=type:eq:LINE_LIST`,
      "eventVisualizations"
    );

    // Include struts_apps in apps data
    if (envData.apps) {
      envData.apps = [
        ...struts_apps,
        ...envData.apps.flatMap((i) => i.webName),
      ];
    }

    // Write to Cypress environment file
    fs.writeFileSync(cypressEnvFilePath, JSON.stringify(envData, null, 2));
    console.log(`Environment variables written to ${cypressEnvFilePath}`);
  } catch (error) {
    console.error("Error in install function:", error);
    process.exit(1); // Exit with an error code on failure
  }
}

// Execute the install function when this script is run
install().then(() => console.log("Initialization complete."));
