import View from './views/View';

// const GAME_WIDTH = 528;
// const GAME_HEIGHT = 939;

const RESOLUTION_SCALE = 1.5;
const GAME_WIDTH = window.innerWidth * RESOLUTION_SCALE;
const GAME_HEIGHT = window.innerHeight * RESOLUTION_SCALE;
const FPS = 30;

const DYNAMIC_ASSET_INDEX = Math.floor(Math.random() * 3);

const props = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  fps: FPS,
  dynamicAssetIndex: DYNAMIC_ASSET_INDEX
};

const view = new View(props);
view.start();
