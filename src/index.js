import App from './views/App';

// const GAME_WIDTH = 528;
// const GAME_HEIGHT = 939;

const GAME_WIDTH = window.innerWidth;// * RESOLUTION_SCALE;
const GAME_HEIGHT = window.innerHeight;// * RESOLUTION_SCALE;
const DYNAMIC_ASSET_INDEX = 0;

/*
const RESOLUTION_SCALE = 1.5;
const FPS = 30;

const DYNAMIC_ASSET_INDEX = Math.floor(Math.random() * 3);
*/
const props = {
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  dynamicAssetIndex: DYNAMIC_ASSET_INDEX,
  allowHitFrom: 180,
  allowHitTo: 90
  /*fps: FPS*/
};

const app = new App(props);
app.init();
