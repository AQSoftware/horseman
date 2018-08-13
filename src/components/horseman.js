import PixiContainer from './PixiContainer';

export default class Horseman extends PixiContainer {
  setup(width, height) {

    this.width = width;
    this.height = height;
    this.scaleWidth = this.width;
    this.scaleHeight = this.height;

    this.rotation = 0.1;

    if (this.width > this.height) {
      this.scaleWidth = this.height;
    }

    this.rIndex = 0;

    this.container = new this.pixi.Container();

    var frames = [];
    for (var f = 1; f < 16; f++) {
      frames.push(this.pixi.utils.TextureCache["horseman_walk" + f + ".png"]);
    }
    this.horseman = new this.pixi.extras.AnimatedSprite(frames);
    this.horseman.animationSpeed = 0.2;
    var horseHeight = this.horseman.height;
    var hScale = this.horseman.height / this.horseman.width;
    this.horseman.width = this.scaleWidth / 1.15;
    this.horseman.height = this.horseman.width * hScale
    this.horseman.x = this.width / 2 - this.horseman.width / 2;
    this.horseman.y = this.height / 2 - this.horseman.height / 1.3;

    this.flail = new this.pixi.Sprite(this.pixi.utils.TextureCache["horseman_flail.png"]);
    var heightScale = this.flail.height / horseHeight;
    var fScale = this.flail.width / this.flail.height;
    this.flail.height = this.horseman.height * heightScale;
    this.flail.width = this.flail.height * fScale;

    this.flail.anchor.y = 1;
    this.flail.anchor.x = 0.5;
    this.flail.rotation = Math.PI;
    this.flail.y = this.horseman.y + this.horseman.height / 2;
    this.flail.x = this.horseman.x + this.horseman.width / 2;

    this.flameTrail = [];

    this.container.addChild(this.horseman);
    this.container.addChild(this.flail);

    var flailWidth = this.flail.width / 3;
    for (var i = 0; i < 8; i += 2) {
      var red = new this.pixi.Graphics();
      red.beginFill(0xf70400);
      red.drawCircle(0, 0, flailWidth - (i / 2));
      red.endFill();
      this.container.addChild(red);
      this.flameTrail[i] = red;
    }

    for (var i = 0; i < 8; i += 2) {
      var yellow = new this.pixi.Graphics();
      yellow.beginFill(0xf2f700);
      yellow.drawCircle(0, 0, flailWidth / 2 - (i / 1.5));
      yellow.endFill();
      this.container.addChild(yellow);
      this.flameTrail[i + 1] = yellow;
    }
    for (var f = 0; f < this.flameTrail.length; f += 2) {
      var x = this.flail.x + Math.cos(this.flail.rotation - Math.PI / (2.2 + f / 20)) * (this.flail.height - 20);
      var y = this.flail.y + Math.sin(this.flail.rotation - Math.PI / (2.2 + f / 20)) * (this.flail.height - 20);
      this.flameTrail[f].x = x;
      this.flameTrail[f].y = y;
      this.flameTrail[f + 1].x = x;
      this.flameTrail[f + 1].y = y;
    }
    this.stepCounter = 0;
  }

  getFlailPosition() {
    var x = this.flail.x + Math.cos(this.flail.rotation - Math.PI / 2) * (this.flail.height - 20);
    var y = this.flail.y + Math.sin(this.flail.rotation - Math.PI / 2) * (this.flail.height - 20);
    var p = { x: x, y: y };
    return p;
  }

  getHorseDimensions() { return { x: this.flail.x, y: this.flail.y, height: this.flail.height } }

  getRotation() {
    var r = this.flail.rotation;
    return r;
  }

  setIndex() {
    this.rIndex = this.rotation;
  }

  setRotation(distance) {
    this.setIndex();
    this.play();
  }

  play() {
    this.horseman.play();
  }

  setHorseSpeed(speed) {
    this.horseman.animationSpeed = speed;
  }

  animateFlail(speed) {
    if (typeof(speed) === 'undefined') {
      console.log('undefined');
      return;
    }
    // this.flail.rotation -= this.rIndex;
    this.flail.rotation -= speed;
    this.stepCounter++;
    if (this.flail.rotation <= -Math.PI * 2) {
      this.flail.rotation = 0 + Math.PI * 2 + this.flail.rotation;
      this.stepCounter = 0;
    }
    for (var f = 0; f < this.flameTrail.length; f += 2) {
      var x = this.flail.x + Math.cos(this.flail.rotation - Math.PI / (2.2 + f / 20)) * (this.flail.height - 20);
      var y = this.flail.y + Math.sin(this.flail.rotation - Math.PI / (2.2 + f / 20)) * (this.flail.height - 20);
      this.flameTrail[f].x = x;
      this.flameTrail[f].y = y;
      this.flameTrail[f + 1].x = x;
      this.flameTrail[f + 1].y = y;
    }
  }
}
