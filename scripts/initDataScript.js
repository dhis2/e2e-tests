const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { select } = require("./selectMinimalSet");
const excludes = require("./excludes.json");

// RUN_ALL=true opens every object on the instance, otherwise only a minimal set
// that still covers every code path (see "Minimal vs full run" in the README)
const runAll = process.env.RUN_ALL === "true";
const baseFields = "displayName,id";
// Extra fields only used to pick the minimal set
const selectionFields = {
  dashboards:
    "dashboardItems[type,visualization[type],map[mapViews[layer]],eventChart[type],eventReport[dataType],eventVisualization[type]]",
  visualizations:
    "type,legend[set[id]],program[id],programStage[id],dataDimensionItems[dataDimensionItemType]",
  maps: "basemap,mapViews[layer]",
  eventReports: "dataType,program[programType]",
  eventCharts: "type,program[programType]",
  eventVisualizations: "outputType,program[programType]",
};
const queryParams = (envKey) =>
  `?fields=${[baseFields, runAll ? "" : selectionFields[envKey]]
    .filter(Boolean)
    .join(",")}&paging=false`;

async function install() {
  try {
    const baseUrl = process.env.CYPRESS_BASE_URL;
    const loginUsername = process.env.CYPRESS_LOGIN_USERNAME;
    const loginPassword = process.env.CYPRESS_LOGIN_PASSWORD;
    const cypressEnvFilePath = "./cypress.env.json";

    // First try to get a session cookie by accessing a non-public URL
    const initialLogin = await axios.get("/api/dashboards", {
      baseURL: baseUrl,
      auth: { username: loginUsername, password: loginPassword },
    });

    // If we still don't have a cookie, make a regular API request
    let login = initialLogin;
    if (!initialLogin.headers["set-cookie"] || !initialLogin.headers["set-cookie"][0]) {
      login = await axios.get("/api", {
        baseURL: baseUrl,
        auth: { username: loginUsername, password: loginPassword },
      });
    }

    const client = axios.create({
      withCredentials: false,
      timeout: 20000,
      baseURL: baseUrl,
      headers: { Cookie: login.headers["set-cookie"]?.[0] || "" },
    });

    let envData = {};

    const formatDataForTable = (data, envKey) => {
      // Special handling for "apps": /api/apps.json responds with a bare array
      if (envKey === "apps") {
        return data.map((item) => ({
          Name: item.name,
          BasePath: item.basePath,
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

    const selection = {};

    const fetchData = async (url, envKey) => {
      try {
        const { data } = await client.get(url, {
          auth: {
            username: loginUsername,
            password: loginPassword,
          },
        });

        envData[envKey] = (envKey === "apps" ? data : data[envKey]) || [];
        if (!runAll && envKey !== "apps") {
          const all = envData[envKey];
          envData[envKey] = select(envKey, all).map(({ displayName, id }) => ({
            displayName,
            id,
          }));
          selection[envKey] = `${envData[envKey].length} of ${all.length}`;
        }
        console.log(`${envKey.toUpperCase()}:`);
        console.table(formatDataForTable(data, envKey));
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    // Fetch and log data
    await fetchData("/api/apps.json?fields=name,key,basePath&paging=false", "apps");
    await fetchData("/api/dashboards" + queryParams("dashboards"), "dashboards");
    await fetchData("/api/visualizations" + queryParams("visualizations"), "visualizations");
    await fetchData("/api/eventReports.json" + queryParams("eventReports"), "eventReports");
    await fetchData("/api/eventCharts.json" + queryParams("eventCharts"), "eventCharts");
    await fetchData("/api/maps.json" + queryParams("maps"), "maps");
    await fetchData(
      `/api/eventVisualizations.json${queryParams("eventVisualizations")}&filter=type:eq:LINE_LIST`,
      "eventVisualizations"
    );

    if (envData.apps) {
      // Global Shell is the app shell itself, not a visitable app
      // In the minimal run, apps that have their own spec are skipped here too
      envData.apps = envData.apps
        .filter(
          (i) =>
            i.key !== "global-shell" && (runAll || !(i.key in excludes.apps))
        )
        .flatMap((i) => i.basePath);
      selection.apps = `${envData.apps.length}`;
    }
    console.log(
      runAll ? "Full run: all objects" : "Minimal run (RUN_ALL=true for all):",
      runAll ? "" : selection
    );
    // Write envData to Cypress environment file
    fs.writeFileSync(cypressEnvFilePath, JSON.stringify(envData, null, 2));
    console.log(`Environment variables written to ${cypressEnvFilePath}`);
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1);
  }
}

install();
