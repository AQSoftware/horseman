import { PixiContainer } from '../../components';
import Assets from '../../assets';

export default class BackgroundScene extends PixiContainer {

  setup(){
    this.background = new this.pixi.Graphics(this.pixi.utils.TextureCache[Assets.images.background]);
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.position = new this.pixi.Point(0,0);
    this.scene.addChild(this.background);
  }
}
