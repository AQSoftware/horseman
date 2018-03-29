import Assets, { ASSETS, DYNAMIC_ASSETS } from '../assets';
import * as PixiContainer from '../components/PixiContainer';
import {
  BackgroundScene,
  View1, View2, View3
} from './scenes';
import LivesCount from '../components/LivesCount';

const BACKGROUND_COLOR = 0x83b8a8;

export default class App {

  constructor(props) {
    this.props = props;
    this.pixi = window.PIXI;
    //this.renderer = this.pixi.autoDetectRenderer();
    this.app = new this.pixi.Application(props.width, props.height, { backgroundColor: BACKGROUND_COLOR, autoResize: true });
    this.app.speed = 0.5;
    document.body.appendChild(this.app.view);
    window.onresize = this.resize.bind(this);
    //console.log(this.app.renderer);
  }

  init() {
    this.scenes = [];
    this.scenes.push({
      name: 'view1', scene: new View1(this.pixi, this.props.width, this.props.height, {
        ticker: this.tickCallback,
        onPress: this._onView1Click.bind(this)
      })
    });
    this.scenes.push({
      name: 'view2', scene: new View2(this.pixi, this.props.width, this.props.height, {
        ticker: this.tickCallback.bind(this),
        // onPress: this._onView2Click.bind(this),
        dynamicAssetIndex: this.props.dynamicAssetIndex
      })
    });
    // this.scenes.push({
    //   name: 'view3', scene: new View3(this.pixi, this.props.width, this.props.height, {
    //     // ticker: this.tickCallback,
    //     // onPress: this._onView3Click.bind(this)
    //   })
    // });
    this.pixi.loader.add(ASSETS).load(this.load.bind(this));
    this.app.ticker.add(this._updateScene.bind(this));
  }

  /**
  Loading function to load assets
  */
  load() {
    this.setup();
  }

  /**
  Setup function to setup scenes
  */
  setup() {

    for (let i = 0; i < this.scenes.length; i++) {
      this.scenes[i]['scene'].setup();
    }
    this._setPage(0);

    const livesCount = new LivesCount(3);
    livesCount.x = (this.props.width - 10);
    livesCount.y = 10;
    this.app.stage.addChild(livesCount);
    this.livesCount = livesCount;
    this.app.stage.on('livesNumChanged', this._onLivesNumChanged.bind(this));
  }

  _onLivesNumChanged(diff) {
    this.livesCount.currentLives += diff;

    if (this.livesCount.currentLives <= 0) {
      this.showGameOver();
    }
  }

  _setPage(page) {
    this.pageNumber = page;
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
    }
    var view = this.scenes[page].scene;
    this.currentScene = view.scene;
    this.app.stage.addChild(this.currentScene);
    if (view.activate) view.activate();
  }

  _updateScene(delta) {
    /*
      update either current scene from here (tick/gameTick/frameUpdate), or all scenes at once
      example:
        if(this.currentScene){
          this.currentScene.update();
        }
    */
    if (this.scenes[this.pageNumber] && this.scenes[this.pageNumber].scene.update) {
      this.scenes[this.pageNumber].scene.update();
    }
  }

  tickCallback(tickObject) {
    this.app.ticker.add(tickObject);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.app.renderer.resize(this.width, this.height);
    for (let i = 0; i < this.scenes.length; i++) {
      if (this.scenes[i]['scene'].resize)
        this.scenes[i]['scene'].resize(this.width, this.height);
    }
  }

  _onView1Click() {
    this.scenes[0].scene.deactivate();// stop update ticks
    this.scenes[1].scene.startGame();
    this._setPage(1);
  }

  _onView2Click(state) {
    this.scenes[2].scene.setMessage("Game Over");
    this._setPage(2);
  }

  showGameOver() {
    this.livesCount.visible = false;
    this.scenes[1].scene.showGameOver();
  }
}
