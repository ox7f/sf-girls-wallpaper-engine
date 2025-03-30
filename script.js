const fs = require("fs");
const path = require("path");

const CONFIG_PATH = "project.json";
const AGENTS_DIR = "assets/agents";

function formatAgentName(filename) {
  let name = filename.replace("_Spine", "").replace(".json", "");
  name = name.replace(/_/g, " ");
  name = name.replace(/(\w+) Skin(\d+)/, "$1 Skin $2");
  return name;
}

function updateConfig() {
  // Read project.json
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (err) {
    console.error("Error reading project.json:", err);
    return;
  }

  // Read agent files
  let agentFiles;
  try {
    agentFiles = fs
      .readdirSync(AGENTS_DIR)
      .filter((file) => file.endsWith(".json"));
  } catch (err) {
    console.error("Error reading agents directory:", err);
    return;
  }

  // Generate new agent options
  const newAgents = agentFiles.map((file) => ({
    label: formatAgentName(file),
    value: file.replace(".json", ""),
  }));

  // Update config object
  if (
    config.general &&
    config.general.properties &&
    config.general.properties.agent
  ) {
    config.general.properties.agent.options = newAgents;
  } else {
    console.error("Invalid project.json structure");
    return;
  }

  // Write updated config back
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    console.log("project.json successfully updated!");
  } catch (err) {
    console.error("Error writing project.json:", err);
  }
}

updateConfig();
