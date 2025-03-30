function createPixiContainer() {
  const container = new PIXI.Container();
  container.interactive = true;
  container.sortableChildren = true;
  return container;
}

function centerContainer(container) {
  const bounds = container.getLocalBounds();
  container.pivot.set(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2
  );
  container.position.set(app.screen.width / 2, app.screen.height / 2);
}

function scaleContainer(container) {
  const scale = Math.max(
    app.screen.width / container.width,
    app.screen.height / container.height
  );
  container.scale.set(Math.ceil(scale * 100) / 100);
}

function resetContainer(container) {
  if (container) {
    app.stage.removeChild(container);
    container.destroy();
  }
}

async function loadSpine(path) {
  try {
    const { spineData } = await PIXI.Assets.load(path);

    if (!spineData) throw new Error("Could not load SpineData");

    return new PIXI.spine.Spine(spineData);
  } catch (error) {
    console.error(error);
  }
}

function centerSpine(sprite, container) {
  sprite.position.set(
    Math.round(container.width / 2),
    Math.round(container.height / 2)
  );
}

// for background with animations
function playRandomAnimation(spine) {
  const animationNames = spine.spineData.animations.map((anim) => anim.name);

  function playNextRandomAnimation() {
    if (animationNames.length === 0) return;

    const randomIndex = Math.floor(Math.random() * animationNames.length);
    const nextAnimation = animationNames[randomIndex];

    spine.state.setAnimation(0, nextAnimation, false);
  }

  spine.state.addListener({
    complete: playNextRandomAnimation,
  });

  playNextRandomAnimation();
}
