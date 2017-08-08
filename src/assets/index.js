//@flow
import background from './images/background.jpg';
import button from './textures/button.json';

import dynamic1 from './images/dynamic1.jpg';
import dynamic2 from './images/dynamic2.jpg';
import dynamic3 from './images/dynamic3.jpg';

/* Define common assets here */
const Assets = {
  images: {
    background: background
  },
  textures: {
    button: button
  },
  sounds: {
  },
  fonts:{
  }
}

/* Define assets which are loaded depending on parameters passed to
View.js
*/
export const DynamicAssets = {
  images: {
    dynamic1: dynamic1,
    dynamic2: dynamic2,
    dynamic3: dynamic3
  },
  textures: {
  },
  sounds: {
  },
  fonts:{
  }
}

/* Array of common assets to be used by Hexi Loader */
export const ASSETS = [
  Assets.images.background,
  Assets.textures.button
];

/* Array of dynamic assets to be used by View.js. The index specified
by dynamicAssetIndex props will be the one that will be loaded along with
the common assets. See constructor of View.js for more details */
export const DYNAMIC_ASSETS = [
  DynamicAssets.images.dynamic1,
  DynamicAssets.images.dynamic2,
  DynamicAssets.images.dynamic3
]

export default Assets;
