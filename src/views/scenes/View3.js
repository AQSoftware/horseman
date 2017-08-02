import HexiGroup from '../HexiGroup';
import Button from '../components/Button';

const BUTTON_Y_POS_AS_PERCENTAGE_OF_HEIGHT = 0.8;

export default class View3 extends HexiGroup {

  setup(){
    const button = new Button(this.g, 300, 100, {
      title: 'Done'
    });
    button.setup();
    this.button = button.scene;

    this.button.setPosition((this.width - this.button.width) / 2, this.height * BUTTON_Y_POS_AS_PERCENTAGE_OF_HEIGHT);
    this.scene.addChild(this.button);
  }

  onTap(){
    let retVal = false;
    if (this.g.pointer.hitTestSprite(this.button) && this.props.onClick) {
      this.props.onClick();
      retVal = true;
    }
    return retVal;
  }
}
