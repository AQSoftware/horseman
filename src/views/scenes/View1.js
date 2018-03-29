import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets from '../../assets';

const VERTICAL_OFFSET = 20;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;


export default class View1 extends PixiContainer {

  setup() {
    this.button = new PixiButton(this.pixi, 227, 69, {
      title: 'Start',
      textureAtlas: Assets.textures.button,
      onPress: this.props.onPress
    });
    this.button.setup();
    this.button.scene.position = new this.pixi.Point(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - VERTICAL_OFFSET
    )
    this.gameContainer = new this.pixi.Container();

    this.horseman = new Horseman(this.pixi);
    this.horseman.setup(this.width, this.height);

    this.skeleton = new Skeleton(this.pixi);
    this.skeleton.setup(this.width, this.height, this.horseman.getHorseDimensions());

    this.gameContainer.addChild(this.horseman.container);
    this.gameContainer.addChild(this.skeleton.container);

    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 40,
      fill: '#ffffff',
    });

    this.message = new this.pixi.Text("Try to hit as many", style);
    this.message.anchor.x = 0.5;
    this.message.anchor.y = 0.5;
    this.message.x = this.width / 2;
    this.message.y = this.height / 2 - this.message.height;

    this.gameContainer.addChild(this.message);

    this.scene.addChild(this.gameContainer);
    this.scene.addChild(this.button.scene);
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.button.scene.position = new this.pixi.Point(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - VERTICAL_OFFSET
    )
  }

  set enabled(value) {
    super.enabled = value;
    this.button.enabled = value;
  }
}
