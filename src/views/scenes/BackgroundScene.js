import { HexiGroup } from '../../components';
import Assets from '../../assets';

export default class BackgroundScene extends HexiGroup {

  setup(){
    this.background = this.hexi.sprite(Assets.images.background);
    this.background.width = this.width;
    this.background.height = this.height;
    this.background.setPosition(0,0);
    this.scene.addChild(this.background);
  }
}
