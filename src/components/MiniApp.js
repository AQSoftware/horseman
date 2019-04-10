// @flow
import {
  LifeCycle
} from 'aq-miniapp-core';
import Game from './Game';

const PIXI = window.PIXI;
const BACKGROUND_COLOR = 0x86b8a9;

type Props = {
  game: any,
  devt: boolean,
  data: Object
}

export default class MiniApp {

  props: Props;
  app: PIXI.Application;
  game: ?Game<Object>;

  constructor(props: Props) {
    this.props = props;

    LifeCycle.setOnResetCallback(this.onReset.bind(this));

    if (props.devt) {
      this.onData(props.data);
    }
    else {
      LifeCycle.setOnDataCallback(this.onData.bind(this));
    }
    LifeCycle.informLoaded();
  }

  onReset(newData: Object) {
    if (this.game) {
      if (this.props.devt) {
        this.game.onReset(this.props.data);
      }
      else {
        this.game.onReset(newData);
      }
    }
  }

  onData(data: Object) {
    console.log(`onData`);

    if (this.app != null && this.game != null) {
      this.game.gameWillUnmount();
      this.app.stage.destroy(true);
      this.app.stage = null;

      if (document.body != null) {
        document.body.removeChild(this.app.view);
      }
      this.app.destroy(true);
      this.app = null;

      this.game = null;
    }

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      transparent: false,
      resolution: 1,
      backgroundColor: BACKGROUND_COLOR
    });

    // Merge data with game-relevant data
    const updated = Object.assign({}, this.props.data, data);
    this.game = new this.props.game(this.app, updated);

    if (document.body != null) {
      document.body.appendChild(this.app.view);
    }

    this.game.gameDidMount();

  }

}