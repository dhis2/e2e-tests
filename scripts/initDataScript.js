const axios = require("axios");
const fs = require("fs");
const path = require("path");
const struts_apps = ["dhis-web-dataentry/index.action"];
const queryParams = "?fields=displayName,id&paging=false";

async function install() {
  try {
    const baseUrl = process.env.CYPRESS_BASE_URL;
    const loginUsername = process.env.CYPRESS_LOGIN_USERNAME;
    const loginPassword = process.env.CYPRESS_LOGIN_PASSWORD;
    const cypressEnvFilePath = "./cypress.env.json";

    const login = await axios.get("/api", {
      baseURL: baseUrl,
      auth: { username: loginUsername, password: loginPassword },
    });

    const client = axios.create({
      withCredentials: false,
      timeout: 20000,
      baseURL: baseUrl,
      headers: { Cookie: login.headers["set-cookie"][0] },
    });

    let envData = {};

    const formatDataForTable = (data, envKey) => {
      // Special handling for "apps" as it's a direct array
      if (envKey === "apps") {
        return data.map((item) => ({
          Name: item.name,
          WebName: item.webName,
          Version: item.version,
        }));
      }

      // For other data, expecting an object containing an array
      const items = data[envKey] || [];
      return items.map((item) => ({
        DisplayName: item.displayName,
        ID: item.id,
      }));
    };

    const fetchData = async (url, envKey) => {
      try {
        const { data } = await client.get(url, {
          auth: {
            username: loginUsername,
            password: loginPassword,
          },
        });

        envData[envKey] = envKey === "apps" ? data : data[envKey] || [];
        console.log(`${envKey.toUpperCase()}:`);
        console.table(formatDataForTable(data, envKey));
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
    // Write envData to Cypress environment file
    fs.writeFileSync(cypressEnvFilePath, JSON.stringify(envData, null, 2));
    console.log(`Environment variables written to ${cypressEnvFilePath}`);
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
}

install();
