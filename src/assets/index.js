import circle from './images/circle.png';
import button from './textures/button.json';
import horseman_minigame from './textures/horseman_minigame.json'
import heart from './images/heart.png';

import sndClick from './sound-fx/click1.mp3';
import sndHit from './sound-fx/Hit sound.mp3';
import sndBackground from './sound-fx/horseman - background music.mp3';
import sndRunningHorse from './sound-fx/running horse.mp3';
import sndFinal from './sound-fx/Final score sound.mp3';

/* Define common assets here */
const Assets = {
  images: {
    circle: circle,
    heart: heart
  },
  textures: {
    button: button,
    horseman_minigame: horseman_minigame
  },
  sounds: {
    sndClick,
    sndHit,
    sndBackground,
    sndRunningHorse,
    sndFinal,
  },
  fonts: {
  }
}

/* Define assets which are loaded depending on parameters passed to
View.js
*/


/* Array of common assets to be used by Hexi Loader */
export const ASSETS = [
  Assets.images.circle,
  Assets.images.heart,
  Assets.textures.button,
  Assets.textures.horseman_minigame,

  Assets.sounds.sndClick,
  Assets.sounds.sndHit,
  Assets.sounds.sndBackground,
  Assets.sounds.sndRunningHorse,
  Assets.sounds.sndFinal
];

/* Array of dynamic assets to be used by View.js. The index specified
by dynamicAssetIndex props will be the one that will be loaded along with
the common assets. See constructor of View.js for more details */

export default Assets;
