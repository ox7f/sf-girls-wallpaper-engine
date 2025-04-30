async function loadBackground() {
  console.log(config.background);
  const paths = lobbyBackgrounds[config.background].paths;
  const styles = lobbyBackgrounds[config.background].style ?? [];

  try {
    resetContainer(backgroundContainer);

    await PIXI.Assets.load(paths);
    backgroundContainer = createPixiContainer();
    app.stage.addChild(backgroundContainer);

    const assetPromises = paths.map(async (path, index) => {
      try {
        const style = styles[index];
        if (path.endsWith(".png")) {
          addSpriteToContainer(backgroundContainer, path, style, index);
        } else if (path.endsWith(".json")) {
          await addSpineToContainer(backgroundContainer, path, style, index);
        }
      } catch (assetError) {
        console.error(`Failed to load asset: ${path}`, assetError);
      }
    });

    await Promise.all(assetPromises);

    centerContainer(backgroundContainer);
    scaleContainer(backgroundContainer);

    backgroundContainer.zIndex = 1;
  } catch (error) {
    console.error("Could not load assets", error);
  }
}

function addSpriteToContainer(container, path, style, index) {
  const texture = PIXI.Texture.from(path);
  const sprite = new PIXI.Sprite(texture);
  sprite.zIndex = index;
  applyCustomStyle(sprite, style);
  container.addChild(sprite);
}

async function addSpineToContainer(container, path, style, index) {
  const spine = await loadSpine(path);
  spine.scale.set(0.2);
  spine.zIndex = index;
  applyCustomStyle(spine, style);
  container.addChild(spine);
  centerSpine(spine, container);
  playRandomAnimation(spine);
}

function applyCustomStyle(sprite, style = {}) {
  for (let styleKey of Object.keys(style)) {
    sprite[styleKey] = style[styleKey];
  }
}
