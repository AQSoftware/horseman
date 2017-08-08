// @flow
import Assets, { ASSETS, DYNAMIC_ASSETS } from '../assets';
import HexiGroup from '../components/HexiGroup';
import {
  BackgroundScene,
  View1, View2, View3
} from './scenes';

const BACKGROUND_COLOR = 0x0;

type Props = {
  width: number,
  height: number,
  fps: number,
  dynamicAssetIndex: number
}

export default class View {

  hexi: any;
  scenes: Array<HexiGroup>;
  pageNumber: number;
  backgroundScene: HexiGroup;
  currentScene: ?HexiGroup;

  constructor(props: Props){
    // Build array of assets to be used. Merge common assets with
    // one of the dynamic assets, specified by props.dynamicAssetIndex
    const thingsToLoad = ASSETS.concat([DYNAMIC_ASSETS[props.dynamicAssetIndex]]);

    this.hexi = window.hexi(props.width, props.height, this.setup.bind(this), thingsToLoad, this.load.bind(this));
    this.hexi.fps = props.fps;
    this.hexi.backgroundColor = BACKGROUND_COLOR;
    this.hexi.scaleToWindow();

    this.scenes = [];
    // Instantiate background scene
    this.backgroundScene = new BackgroundScene(this.hexi, props.width, props.height);

    // Instantiate view scenes
    this.scenes.push({name: 'view1', scene: new View1(this.hexi, props.width, props.height, {
      onPress: this._onView1Click.bind(this)
    })});
    this.scenes.push({name: 'view2', scene: new View2(this.hexi, props.width, props.height, {
      onPress: this._onView2Click.bind(this),
      dynamicAssetIndex: props.dynamicAssetIndex
    })});
    this.scenes.push({name: 'view3', scene: new View3(this.hexi, props.width, props.height, {
      onPress: this._onView3Click.bind(this)
    })});
  }

  start() {
    this.hexi.start();
  }

  /**
  Loading function to load assets
  */
  load(){
    this.hexi.loadingBar();
  }

  /**
  Setup function to setup scenes
  */
  setup(){
    this.backgroundScene.setup();
    for(let i = 0; i < this.scenes.length; i++){
      this.scenes[i]['scene'].setup();
    }
    this._setPage(0);
  }

  _setPage(page: number){
    this.pageNumber = page;
    this._updateScene();
  }

  _updateScene(){
    for(let i = 0; i < this.scenes.length; i++){
      this.scenes[i]['scene'].scene.visible = i === this.pageNumber;
      this.scenes[i]['scene'].enabled = i === this.pageNumber;
    }
  }

  _onView1Click(){
    this._setPage(1);
  }

  _onView2Click(){
    this._setPage(2);
  }

  _onView3Click(){
    this._setPage(0);
  }
}
