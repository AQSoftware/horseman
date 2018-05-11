// @flow
import {
  defaultLifeCycle
} from 'aq-miniapp-core';
import Game from './Game';

const PIXI = window.PIXI;

type Props = {
  width: number,
  height: number,
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

    defaultLifeCycle.setOnResetCallback(this.onReset.bind(this));

    if (props.devt) {
      this.onData(props.data);
    }
    else {
      defaultLifeCycle.setOnDataCallback(this.onData.bind(this));
    }
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
      width: this.props.width,
      height: this.props.height,
      antialias: true,
      transparent: false,
      resolution: 1
    });

    this.game = new this.props.game(this.app, data);

    if (document.body != null) {
      document.body.appendChild(this.app.view);
    }

    this.game.gameDidMount();

  }

}