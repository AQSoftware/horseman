// @flow
import React, { Component } from 'react';
import {
  CloudStorage,
  // defaultLifeCycle
} from 'aq-miniapp';

import Assets from '../assets';
import HexiGroup from './HexiGroup';
import BackgroundScene from './scenes/BackgroundScene';
import View1 from './scenes/View1';
import View2 from './scenes/View2';
import View3 from './scenes/View3';

import type { Output } from './Types';

const thingsToLoad = [
  Assets.images.button,
  Assets.sounds.pop
];

// const GAME_WIDTH = 528;
// const GAME_HEIGHT = 939;

const GAME_WIDTH = window.innerWidth * 1.5;
const GAME_HEIGHT = window.innerHeight * 1.5;
const BACKGROUND_COLOR = 0x0;
const FPS = 30;

// const JOIN_IMAGE = "http://lorempixel.com/320/568/";

type Props = {
  cloudStorageClient: CloudStorage,
  id?: string,
  data? : Object,
  mode: 'preview' | 'join'
}

export default class View extends Component {
  state: {
    output: Output,
    data: ?Object,
    mode: 'preview' | 'join',
  }

  g: any;
  backgroundScene: BackgroundScene;
  view1: View1;
  view2: View2;
  view3: View3;
  pageNumber: number;
  scenes: Array<HexiGroup>;

  constructor(props: Props){
    super(props);
    this.g = window.hexi(GAME_WIDTH, GAME_HEIGHT, this.setup.bind(this), thingsToLoad, this.load.bind(this));
    this.g.fps = FPS;
    this.g.backgroundColor = BACKGROUND_COLOR;
    this.g.scaleToWindow();

    // Instantiate necessary scenes
    this.backgroundScene = new BackgroundScene(this.g, GAME_WIDTH, GAME_HEIGHT);
    this.view1 = new View1(this.g, GAME_WIDTH, GAME_HEIGHT, {
      onClick: this._onView1Click.bind(this)
    });
    this.view2 = new View2(this.g, GAME_WIDTH, GAME_HEIGHT, {
      onClick: this._onView2Click.bind(this)
    });
    this.view3 = new View3(this.g, GAME_WIDTH, GAME_HEIGHT, {
      onClick: this._onView3Click.bind(this)
    });

    // Put them in our array for gesture handling
    this.scenes = [
      this.view1,
      this.view2,
      this.view3
    ];
    this.g.pointer.tap = this._onTap.bind(this);
  }

  componentDidMount(){
    // defaultLifeCycle.setAppData({backgroundImage: `${window.location.origin}${bg}`});
    this.g.start();
  }

  load(){
    this.g.loadingBar();
  }

  setup(){
    this.backgroundScene.setup();
    this.view1.setup();
    this.view2.setup();
    this.view3.setup();

    this._setPage(0);
  }

  _setPage(page: number){
    this.pageNumber = page;
    this._updateScene();
  }

  _updateScene(){
    for (let i=0; i< this.scenes.length; i++){
      this.scenes[i].scene.visible = i === this.pageNumber
    }
  }

  _onTap(){
    this.scenes[this.pageNumber].onTap();
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

  render() {
    if (this.g.canvas) {
      return <div ref={item => {
        if (item){
          item.appendChild(this.g.canvas);
        }
      }}/>
    }
    else {
      return null;
    }
  }
}
