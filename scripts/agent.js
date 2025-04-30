async function loadAgent() {
  resetContainer(agentContainer);

  // Load agent-paths.json
  let agentPaths;
  try {
    const res = await fetch("agent-paths.json");
    agentPaths = await res.json();
  } catch (err) {
    console.error("Failed to load agent-paths.json:", err);
    return;
  }

  console.log("Agent paths:", config.agent);

  const selectedAgent = config.agent;
  const agentEntry = agentPaths[selectedAgent];

  if (!agentEntry || !agentEntry.Spine || !agentEntry.Spine.fileName) {
    console.error(`Agent "${selectedAgent}" not found in agent-paths.json`);
    return;
  }

  const spinePath = `public/${agentEntry.Spine.fileName}`; // Ensure it's a valid relative URL

  // Load the spine animation using the resolved path
  animation = await loadSpine(spinePath);

  if (!animation) return;

  animation.state.timeScale = config.timeScale;
  animation.state.setAnimation(0, `Idle ${config.lewdness}`, true);

  agentContainer = createPixiContainer();
  agentContainer.addChild(animation);
  app.stage.addChild(agentContainer);

  applyAgentScale(animation);
  applyAgentContainerStyle(agentContainer);
  setupClickEvents(agentContainer);
  setupDragEvents(agentContainer);

  agentContainer.zIndex = 2;
}

function applyAgentContainerStyle(container) {
  const bounds = container.getLocalBounds();
  container.alpha = config.alpha;
  container.angle = config.angle;
  container.pivot.x = bounds.x + bounds.width / 2;
  container.pivot.y = bounds.y + bounds.height / 2;
  container.position.x = Number(config.offsetX);
  container.position.y = Number(config.offsetY);
}

function getBufferFactor(width) {
  if (width > 3500) return 0.9;
  if (width > 2000) return 0.85;
  if (width > 1500) return 0.75;
  if (width > 1000) return 0.65;
  return 0.95;
}

function calculateScaleFactor(bounds, viewportWidth, viewportHeight) {
  let skeletonWidth = bounds.width;
  let skeletonHeight = bounds.height;

  console.log(`width: ${skeletonWidth} height: ${skeletonHeight}`);

  if (skeletonWidth <= 0 || skeletonHeight <= 0) {
    console.warn("Invalid skeleton bounds, using fallback dimensions.");
    skeletonWidth = 100;
    skeletonHeight = 100;
  }

  let scaleFactor = Math.min(
    viewportWidth / skeletonWidth,
    viewportHeight / skeletonHeight
  );

  scaleFactor *= getBufferFactor(skeletonWidth);
  return Math.abs(scaleFactor);
}

function applyAgentScale(container) {
  const bounds = container.getLocalBounds();
  const viewportWidth = app.renderer.width;
  const viewportHeight = app.renderer.height;

  // Calculate scale
  const scaleFactor = calculateScaleFactor(
    bounds,
    viewportWidth,
    viewportHeight
  );

  // Set the scale
  container.scale.set(scaleFactor);
}
