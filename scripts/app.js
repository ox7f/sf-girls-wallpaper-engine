const app = new PIXI.Application({
  resizeTo: window,
  backgroundAlpha: 0,
  resolution: window.devicePixelRatio ?? 1,
  autoDensity: true,
});

app.stage.sortableChildren = true;
document.body.appendChild(app.view);

let animation;
let agentContainer;
let backgroundContainer;

const lobbyBackgrounds = {
  lobby_1: {
    paths: [
      "assets/background/lobby_1/bg_sky.png",
      "assets/background/lobby_1/bg_sky_cloud.png",
      "assets/background/lobby_1/bg_home.png",
    ],
    style: [{ y: 200 }, { y: 200 }],
  },
  lobby_2: {
    paths: [
      "assets/background/lobby_2/bg_anniversary.png",
      "assets/background/lobby_2/bg_ship_effect.png",
      "assets/background/lobby_2/bg_ship.png",
      "assets/background/lobby_2/bg_home_2.png",
    ],
    style: [{ y: 200 }, { y: 200 }, { y: 200 }],
  },
  lobby_3: {
    paths: [
      "assets/background/lobby_3/bg_anniversary.png",
      "assets/background/lobby_3/bg_ship_effect.png",
      "assets/background/lobby_3/bg_ship.png",
      "assets/background/lobby_3/bg_home_2.png",
    ],
    style: [{ y: 200 }, { y: 200 }, { y: 200 }],
  },
  lobby_4: {
    paths: [
      "assets/background/lobby_4/bg_sky 1.png",
      "assets/background/lobby_4/bg_sky_cloud 1.png",
      "assets/background/lobby_4/bg_home_sea.png",
    ],
    style: [{ y: 200 }, { y: 200 }],
  },
  lobby_5: {
    paths: [
      "assets/background/lobby_5/bg_sky_night.png",
      "assets/background/lobby_5/bg_sky_cloud.png",
      "assets/background/lobby_5/tower20.json",
      "assets/background/lobby_5/bg_home_fireworkLight.png",
      "assets/background/lobby_5/bg_home_firework.png",
    ],
  },
  lobby_6: {
    paths: [
      "assets/background/lobby_6/bg_sky_rider.png",
      "assets/background/lobby_6/bg_home_rider_light.png",
      "assets/background/lobby_6/bg_home_rider_smoke.png",
      "assets/background/lobby_6/skeleton.json",
      "assets/background/lobby_6/bg_home_rider.png",
    ],
  },
};

const getOffset = (key, fallback) => {
  const value = localStorage.getItem(key);
  return value !== "undefined" ? value : fallback;
};

const config = {
  agent: "Midori",
  lewdness: 1,
  allowClick: true,
  allowDrag: true,
  alpha: 1,
  angle: 0,
  scale: 0.5,
  offsetX: getOffset("offsetX", app.screen.width / 2),
  offsetY: getOffset("offsetY", app.screen.height / 2),
  timeScale: 1,
};

window.wallpaperPropertyListener = {
  applyUserProperties: async function (properties) {
    if (properties.agent) {
      const { value } = properties.agent;
      config.agent = value;
      await loadAgent();
    }
    if (properties.background) {
      const { value } = properties.background;
      config.background = value;
      await loadBackground();
    }
    if (properties.lewdness) {
      const value = parseInt(properties.lewdness.value);
      config.lewdness = value;
      animation.state.setAnimation(0, `Idle ${value}`, true);
    }
    if (properties.allowClick) {
      config.allowClick = !!properties.allowClick.value;
    }
    if (properties.allowDrag) {
      config.allowDrag = !!properties.allowDrag.value;
    }
    if (properties.alpha) {
      const value = parseFloat(properties.alpha.value);
      config.alpha = value;
      agentContainer.alpha = value;
    }
    if (properties.angle) {
      const value = parseInt(properties.angle.value);
      config.angle = value;
      agentContainer.angle = value;
    }
    if (properties.scale) {
      const value = parseFloat(properties.scale.value);
      config.scale = value;
      agentContainer.scale.set(value);
    }
    if (properties.timescale) {
      const value = parseFloat(properties.timescale.value);
      config.timeScale = value;
      animation.state.timeScale = value;
    }
  },
};
