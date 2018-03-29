import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets from '../../assets';

import TweenMax from '../../libs/gsap/TweenMax.min';
import PixiPlugin from '../../libs/gsap/plugins/PixiPlugin.min';

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
    this.button.scene.position = new PIXI.Point(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - VERTICAL_OFFSET
    )
    this.gameContainer = new PIXI.Container();

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

    this.message = new PIXI.Text("Try to hit as many", style);
    this.message.anchor.x = 0.5;
    this.message.anchor.y = 0.5;
    this.message.x = this.width / 2;
    this.message.y = this.height / 2 - this.message.height;

    this.gameContainer.addChild(this.message);

    this.scene.addChild(this.gameContainer);
    this.scene.addChild(this.button.scene);

    var circle = PIXI.Sprite.fromImage(Assets.images.circle);
    this.scene.addChild(circle);
    this.circle = circle;

    this.doAnimate = false;
  }

  startAnimation() {
    this.horseman.setIndex();
    this.didHit = false;
    this.doAnimate = true;

    var circle = this.circle;
    circle.scale.x = circle.scale.y = .7;
    circle.anchor.set(.5, .5);
    circle.x = this.skeleton.heads[0].x + 50;
    circle.y = this.skeleton.heads[0].y + 30;
    circle.alpha = .5;
    TweenMax.to(circle, 1, { alpha: 1, pixi: { scaleX: 1.3, scaleY: 1.3 }, ease: Sine.easeInOut, yoyo: true, repeat: 10 });
  }

  update() {
    if (this.doAnimate) {
      var edgeNum = Math.PI + .25;
      this.horseman.animateFlail();
      var r = Math.abs(this.horseman.getRotation() % (2 * Math.PI));
      if (Math.abs(r - edgeNum) < .1 && !this.didHit) {
        this.didHit = true;
        this.skeleton.killAt(0);

        setTimeout(function () {
          // this.skeleton.resetAt(0);
          this.didHit = false;
        }.bind(this), 600);
      }
    }
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.button.scene.position = new PIXI.Point(
      (this.width - BUTTON_WIDTH) / 2.0,
      (this.height - BUTTON_HEIGHT) - VERTICAL_OFFSET
    )
  }

  set enabled(value) {
    super.enabled = value;
    this.button.enabled = value;
  }

  activate() {
    this.startAnimation();
  }

  deactivate() {
    this.doAnimate = false;
  }

}
