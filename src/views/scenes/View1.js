import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets from '../../assets';
import { normalizeRadians } from '../../libs/Utils';

import TweenMax from '../../libs/gsap/TweenMax.min';
import PixiPlugin from '../../libs/gsap/plugins/PixiPlugin.min';
import PIXIsound from 'pixi-sound';

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
    this.button.scene.scale.set(0.5);    
    this.button.scene.position = new PIXI.Point(
      (this.width - this.button.scene.width) / 2.0,
      (this.height - this.button.scene.height) - VERTICAL_OFFSET
    );
    this.gameContainer = new PIXI.Container();

    this.horseman = new Horseman(this.pixi);
    this.horseman.setup(this.width, this.height);

    this.skeleton = new Skeleton(this.pixi);
    this.skeleton.setup(this.width, this.height, this.horseman.getHorseDimensions());

    this.gameContainer.addChild(this.horseman.container);
    this.gameContainer.addChild(this.skeleton.container);

    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 22,
      fill: '#ffffff',
    });

    this.message = new PIXI.Text("Try to hit as many", style);
    this.message.anchor.x = 0.5;
    this.message.anchor.y = 0.5;
    this.message.x = this.width / 2;
    this.message.y = this.horseman.horseman.y + this.horseman.horseman.height * .05;

    this.gameContainer.addChild(this.message);

    this.tap = new PIXI.Text("Tap", new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 32,
      fill: '#fefe3c',
      lineJoin: "round",
      stroke: "#ff0000",
      strokeThickness: 2
    }));
    this.gameContainer.addChild(this.tap);

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
    this.didShowHit = false;
    this.doAnimate = true;

    var head = this.skeleton.heads[0];

    var circle = this.circle;
    circle.scale.x = circle.scale.y = head.width / circle.width * .6;
    circle.anchor.set(.5, .5);
    circle.x = head.x + head.width / 2;
    circle.y = head.y + head.height / 6;
    circle.alpha = .5;

    this.tap.x = circle.x - 140;
    this.tap.y = circle.y + 40;
    this.tap.rotation = -30 * Math.PI / 180;
  }

  update() {
    if (this.doAnimate) {
      this.horseman.animateFlail(.08);

      var r = normalizeRadians(this.horseman.getRotation());

      var edgeSkull = Math.PI * .95;// 'almost' Math.PI
      if (Math.abs(edgeSkull - r) < .1 && !this.didHit) {
        this.didHit = true;
        this.skeleton.killAt(0);

        setTimeout(function () {
          // this.skeleton.resetAt(0);
          this.didHit = false;
        }.bind(this), 600);
      }

      if (r < this.props.allowHitFrom && !this.didShowHit) {
        this.didShowHit = true;
        this.circle.alpha = 1;
        this.tap.alpha = 1;
      }
      if (r < this.props.allowHitTo && this.didShowHit) {
        this.didShowHit = false;
        this.circle.alpha = 0;
        this.tap.alpha = 0;
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
    PIXI.sound.play(Assets.sounds.sndBackground, { loop: true });
  }

  deactivate() {
    this.doAnimate = false;
  }

}
