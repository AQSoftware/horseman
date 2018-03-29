import circle from './images/circle.png';
import button from './textures/button.json';
import horseman_minigame from './textures/horseman_minigame.json'

/* Define common assets here */
const Assets = {
  images: {
    circle: circle
  },
  textures: {
    button: button,
    horseman_minigame: horseman_minigame
  },
  sounds: {
  },
  fonts:{
  }
}

/* Define assets which are loaded depending on parameters passed to
View.js
*/


/* Array of common assets to be used by Hexi Loader */
export const ASSETS = [
  Assets.images.circle,
  Assets.textures.button,
  Assets.textures.horseman_minigame
];

/* Array of dynamic assets to be used by View.js. The index specified
by dynamicAssetIndex props will be the one that will be loaded along with
the common assets. See constructor of View.js for more details */

export default Assets;
