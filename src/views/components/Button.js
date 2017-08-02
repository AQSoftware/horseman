import HexiGroup from '../HexiGroup';
import Assets from '../../assets';

export default class Button extends HexiGroup {

  setup(){
    this.background = this.g.sprite(Assets.images.button);
    this.background.width = this.width;
    this.background.height = this.height;
    this.scene.addChild(this.background);

    this.title = this.g.text(this.props.title);
    this.title.style = {font: "40px Oswald", align: 'center'};
    this.title.setPosition((this.width - this.title.width) / 2, (this.height - this.title.height) / 2);
    this.scene.addChild(this.title);
  }
}
