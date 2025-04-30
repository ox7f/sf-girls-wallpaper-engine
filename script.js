const fs = require("fs");
const path = require("path");

const CONFIG_PATH = "project.json";
const AGENTS_DIR = "public/sf-girls-assets/Agents";
const OUTPUT_PATHS_FILE = "agent-paths.json";

const UNRELEASED_AGENT_LIST = [
  "Miva_Takahashi",
  "Uthas",
  "Tomoe_Yamazaki",
  "Ysabella",
  "Admiral_Thoka",
  "Lily",
  "Woodbloom",
  "Sichigen",
  "Minami_Aizawa",
  "Choco",
  "Blancmange",
];

function formatAgentName(filename) {
  let name = filename.replace("_Spine", "").replace(".json", "");
  name = name.replace(/_/g, " ");
  name = name.replace(/(\w+) Skin(\d+)/, "$1 Skin $2");
  return name;
}

function isValidSpineJson(filename) {
  // Must end with .json but not .model3.json or .physics3.json
  if (
    !filename.endsWith(".json") ||
    filename.endsWith(".model3.json") ||
    filename.endsWith(".physics3.json")
  )
    return false;

  const base = filename.replace(".json", "");

  // Exclude files with _A, _B, _C before .json (e.g., Denka_Spine_A_Skin1.json)
  if (/_([A-C])($|_)/.test(base)) return false;

  // Exclude files with _Addition before .json (e.g., O_Spine_Addition.json)
  if (/(_Addition)$/.test(base)) return false;

  return true;
}

function updateConfig() {
  let config;
  try {
    config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  } catch (err) {
    console.error("Error reading project.json:", err);
    return;
  }

  const newAgents = [];
  const agentPaths = {};

  const agents = fs.readdirSync(AGENTS_DIR);
  for (const agent of agents) {
    // Skip unreleased agents
    if (!UNRELEASED_AGENT_LIST.includes(agent)) {
      const spineDir = path.join(AGENTS_DIR, agent, "Spine");
      if (!fs.existsSync(spineDir)) continue;

      const files = fs.readdirSync(spineDir).filter(isValidSpineJson);

      for (const file of files) {
        const baseName = file.replace(".json", "");
        const label = formatAgentName(baseName);
        const relativePath = path
          .join("sf-girls-assets", "Agents", agent, "Spine", file)
          .replace(/\\/g, "/");

        newAgents.push({
          label: label,
          value: baseName,
        });

        agentPaths[baseName] = {
          Spine: {
            name: label,
            fileName: relativePath,
          },
        };
      }
    }
  }

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

  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf8");
    console.log("project.json successfully updated!");
  } catch (err) {
    console.error("Error writing project.json:", err);
  }

  try {
    fs.writeFileSync(
      OUTPUT_PATHS_FILE,
      JSON.stringify(agentPaths, null, 2),
      "utf8"
    );
    console.log("agent-paths.json successfully created!");
  } catch (err) {
    console.error("Error writing agent-paths.json:", err);
  }
}

updateConfig();
