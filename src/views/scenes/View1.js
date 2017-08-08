// @flow
import { HexiGroup, HexiButton } from '../../components';
import Assets from '../../assets';

type Props = {
  onPress: (void) => void
}

const VERTICAL_OFFSET = 400;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;


export default class View1 extends HexiGroup {

  setup(){
    this.button = new HexiButton(this.hexi, 227, 69, {
      title: 'Start',
      textureAtlas: Assets.textures.button,
      onPress: this.props.onPress
    });
    this.button.setup();
    this.button.scene.setPosition(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) / 2.0 + VERTICAL_OFFSET
    )
    this.scene.addChild(this.button.scene);
  }

  set enabled(value: boolean){
    super.enabled = value;
    this.button.enabled = value;
  }
}
