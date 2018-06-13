// @flow
import Game from './components/Game';
import Assets, { ASSETS } from './assets';
import {
  defaultLifeCycle
} from 'aq-miniapp-core';


import * as PixiContainer from './components/PixiContainer';
import { PixiButton } from './components';
import {
  BackgroundScene,
  View1, View2, View3
} from './views/scenes';
import LivesCount from './components/LivesCount';
import { normalizeRadians } from './libs/Utils';

const BACKGROUND_COLOR = 0x83b8a8;
const DEFAULT_LIVES_COUNT = 3;

const PIXI = window.PIXI;

type Props = {
  additionalInfo: {
    background: string
  },
  width: number,
  height: number,
  allowHitFrom: number,
  allowHitTo: number
}

export default class HorsemanGame extends Game<Props> {

  scenes: any;
  livesCount: LivesCount;
  pageNumber: number;
  currentScene: any;

  width: number;
  height: number;

  gameDidMount() {
    // Add additional assets to load which are passed through this.props.additionalInfo
    const thingsToLoad = ASSETS.concat([
      this.props.additionalInfo.background
    ]);
    this.loadAssets(thingsToLoad);
  }

  gameDidLoad(loader: any, resources: any) {

    const bg = new PIXI.Sprite(resources[this.props.additionalInfo.background].texture)
    bg.width = this.app.renderer.width;
    bg.height = this.app.renderer.height;
    this.app.stage.addChild(bg);

    this._initEvents();
    this.reset();
  
    // Inform the host app that we are ready to be displayed
    defaultLifeCycle.informReady();
  }

  _initEvents() {
    this.app.ticker.add(this._updateScene.bind(this));
    this.app.stage.on('livesNumChanged', this._onLivesNumChanged.bind(this));
    window.onresize = this.resize.bind(this);    
  }

  init() {
    this.app.speed = 0.5;
    
    var hitAngleFrom = this.props.allowHitFrom / 180 * Math.PI;
    var hitAngleTo = this.props.allowHitTo / 180 * Math.PI;

    // normalize with horseman.getRotation() return value (zero is at 90° not at 0°)
    hitAngleFrom += Math.PI / 2;
    hitAngleTo += Math.PI / 2;

    hitAngleFrom = normalizeRadians(hitAngleFrom);
    hitAngleTo = normalizeRadians(hitAngleTo);

    this.scenes = [];
    this.scenes.push({
      name: 'view1', scene: new View1(PIXI, this.props.width, this.props.height, {
        ticker: this.tickCallback,
        onPress: this._onView1Click.bind(this),
        allowHitFrom: hitAngleFrom,
        allowHitTo: hitAngleTo
      })
    });
    this.scenes.push({
      name: 'view2', scene: new View2(PIXI, this.props.width, this.props.height, {
        ticker: this.tickCallback.bind(this),
        // onPress: this._onView2Click.bind(this),
        allowHitFrom: hitAngleFrom,
        allowHitTo: hitAngleTo
      })
    });
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

    const livesCount = new LivesCount(DEFAULT_LIVES_COUNT);
    livesCount.x = (this.props.width - 10);
    livesCount.y = 10;
    livesCount.alpha = 0;
    this.app.stage.addChild(livesCount);
    this.livesCount = livesCount;
  }

  onReset(data: Props) {
    console.log(`onReset: ${JSON.stringify(data)}`);
    this.reset();
  }

  reset() {
    console.log('-- RESET --');
    PIXI.sound.stopAll();

    if (this.livesCount) {
      this.app.stage.removeChild(this.livesCount);
    }

    this.init();
  }

  _onLivesNumChanged(diff: number) {
    this.livesCount.currentLives += diff;

    if (this.livesCount.currentLives <= 0) {
      this.showGameOver();
    }
  }

  _setPage(page: number) {
    this.pageNumber = page;
    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
    }
    var view = this.scenes[page].scene;
    this.currentScene = view.scene;
    this.app.stage.addChild(this.currentScene);
    if (view.activate) view.activate();
  }

  _updateScene(delta: number) {
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

  tickCallback(tickObject: any) {
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
    this.livesCount.alpha = 1;
    this._setPage(1);
  }

  _onView2Click(state: any) {
    this.scenes[2].scene.setMessage("Game Over");
    this._setPage(2);
  }

  showGameOver() {
    this.livesCount.visible = false;
    this.scenes[1].scene.showGameOver();

    var score = this.scenes[1].scene.killCount;
    // pass score
    if(defaultLifeCycle.setResult) defaultLifeCycle.setResult(score);
    // Inform the host app that our mini app has ended
    defaultLifeCycle.end();
  }
}