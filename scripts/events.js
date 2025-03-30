let dragTarget;
let newX;
let newY;

function setupDragEvents(container) {
  container
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", onDragMove);

  function onDragStart(event) {
    if (!config.allowDrag) return;
    dragTarget = container;
    const position = event.data.getLocalPosition(container);
    dragTarget.pivot.set(position.x, position.y);
    dragTarget.position.set(event.data.global.x, event.data.global.y);
  }

  function onDragMove(event) {
    if (dragTarget) {
      newX = event.data.global.x;
      newY = event.data.global.y;

      dragTarget.x = newX;
      dragTarget.y = newY;
    }
  }

  function onDragEnd() {
    dragTarget = null;
    localStorage.setItem("offsetX", newX);
    localStorage.setItem("offsetY", newY);
  }
}

function setupClickEvents(container) {
  container.on("pointerdown", () => {
    const { allowClick, lewdness } = config;
    if (!allowClick) return;
    animation.state.setAnimation(0, `Touch ${lewdness}`, false);
    animation.state.addAnimation(0, `Idle ${lewdness}`, true, 0);
  });
}
