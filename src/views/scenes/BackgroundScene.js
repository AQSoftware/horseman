import HexiGroup from '../HexiGroup';
import Assets from '../../assets';

export default class BackgroundScene extends HexiGroup {

  setup(){
    this.background = this.g.sprite(Assets.images.background);
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.setPosition(0,0);
    this.scene.addChild(this.background);
  }
}
