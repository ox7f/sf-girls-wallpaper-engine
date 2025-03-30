async function loadAgent() {
  resetContainer(agentContainer);

  animation = await loadSpine(`assets/agents/${config.agent}.json`);

  if (!animation) return;

  animation.state.timeScale = config.timeScale;
  animation.state.setAnimation(0, `Idle ${config.lewdness}`, true);

  agentContainer = createPixiContainer();
  agentContainer.addChild(animation);
  app.stage.addChild(agentContainer);

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
  container.scale.set(config.scale);
}
