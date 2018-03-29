import PixiContainer from './PixiContainer';

import TweenMax from '../libs/gsap/TweenMax.min';
import PixiPlugin from '../libs/gsap/plugins/PixiPlugin.min';

export default class Skeleton extends PixiContainer {
  setup(width, height, flail) {

    this.width = width;
    this.height = height;
    this.scaleWidth = this.width;
    this.scaleHeight = this.height;
    this.respawnOffset = 0;

    this.numberOfSkeletons = 4;

    if (this.width > this.height) {
      this.scaleWidth = this.height;
      this.respawnOffset = 1;
      this.numberOfSkeletons = 8;
    }

    this.flail = flail;
    this.xs = 0;

    this.container = new this.pixi.Container();

    var frames = [];
    for (var f = 1; f < 4; f++) {
      frames.push(this.pixi.utils.TextureCache["skeleton_hit" + f + ".png"]);
    }

    this.images = [];
    this.idle = [];
    this.heads = [];
    this.scaleFactor = 1;
    this.headScaleFactor = 1;
    this.skeletonWidth = 0;

    for (var i = 0; i < this.numberOfSkeletons; i++) {
      this.idle[i] = new this.pixi.Sprite(this.pixi.utils.TextureCache["skeleton_idle.png"]);
      this.skeletonWidth = this.idle[i].width;
      this.skeletonHeight = this.idle[i].height;
      this.scaleFactor = this.idle[i].height / this.idle[i].width;
      this.idle[i].width = this.scaleWidth / 4;
      this.idle[i].height = this.idle[i].width * this.scaleFactor;
      this.idle[i].x = this.width / 2 - this.idle[i].width / 2 + (i * this.flail.height);
      this.idle[i].killable = true;
      this.container.addChild(this.idle[i]);
    }


    for (var i = 0; i < this.numberOfSkeletons; i++) {
      this.images[i] = new this.pixi.extras.AnimatedSprite(frames);
      this.images[i].width = this.idle[0].width;
      this.images[i].height = this.idle[0].height;
      this.images[i].x = this.idle[i].x;
      this.images[i].visible = false;
      this.images[i].loop = false;
      this.images[i].animationSpeed = 0.5;
      this.container.addChild(this.images[i]);
    }

    for (var i = 0; i < this.numberOfSkeletons; i++) {
      this.heads[i] = new this.pixi.Sprite(this.pixi.utils.TextureCache["skeleton_head.png"]);
      this.headScaleFactor = this.heads[i].height / this.heads[i].width;
      var hScale = this.skeletonWidth / this.heads[i].width;
      this.heads[i].width = this.idle[0].width * hScale;
      this.heads[i].height = this.idle[0].width * this.headScaleFactor;
      this.heads[i].x = this.idle[i].x;
      this.heads[i].dead = false;
      this.container.addChild(this.heads[i]);
    }

    var originalHeadHeight = 65;
    originalHeadHeight = (originalHeadHeight / this.skeletonHeight) * this.idle[0].height;
    for (var i = 0; i < this.numberOfSkeletons; i++) {
      this.idle[i].y = this.flail.y + this.flail.height - originalHeadHeight;
      this.images[i].y = this.idle[i].y;
      this.heads[i].y = this.idle[i].y;
    }

    this.lastX = this.numberOfSkeletons - 1;
    this.distance = Math.abs(this.idle[0].x - this.idle[1].x);
    this.xs = 0;
  }

  animateSkeletons() {
    if (this.xs != 0) {
      for (var i in this.idle) {
        this.idle[i].x -= this.xs;
        if (this.idle[i].x < -this.idle[0].width) {
          this.idle[i].x = this.idle[this.lastX].x + this.flail.height;
          this.heads[i].x = this.idle[i].x;
          this.heads[i].y = this.idle[i].y;
          this.heads[i].dead = false;
          this.images[i].visible = false;
          this.idle[i].killable = true;
          this.idle[i].visible = true;
          this.lastX = i;
        }
        this.images[i].x = this.idle[i].x;
        if (this.heads[i].dead) {
          this.heads[i].x += 10;
          this.heads[i].y -= 3;
        } else {
          this.heads[i].x = this.idle[i].x;
          this.images[i].x = this.idle[i].x;
        }
      }
    }
  }

  setSpeed() {
    this.xs = this.flail.height / 62.5;
  }

  getSkeletonKill(flailPos) {
    var horseman = { x: flailPos.x, y: flailPos.y };
    for (var i in this.idle) {
      var skeletonPos = { x: this.heads[i].x + this.heads[i].width / 2, y: this.heads[i].y + this.heads[i].width / 2 };
      if (this.inRange(horseman, skeletonPos, 65) && this.idle[i].killable) {
        this.idle[i].killable = false;
        this.idle[i].visible = false;
        this.images[i].visible = true;
        this.images[i].play();
        this.heads[i].dead = true;
        return true;
      }
    }
    return false;
  }

  getDistance() {
    return this.distance;
  }

  inHitArea(idle) {
    if (idle.x < this.width / 2 + idle.width / 2 && idle.x > this.width / 2 - idle.width / 2) return true;
    else return false;
  }

  inRange(t1, t2, neededDistance) {
    var d = Math.sqrt(Math.pow(t1.x - t2.x, 2) + Math.pow(t1.y - t2.y, 2));
    if (d < neededDistance) {
      return true;
    }
    return false;
  }
  getPositions() {
    var pos = this.idle[0].x + " - " + this.idle[1].x + " - " + this.idle[2].x + " - " + this.idle[3].x;
    return pos;
  }

  killAt(i) {
    this.idle[i].visible = false;
    this.images[i].visible = true;
    this.images[i].play();

    var coords = {
      x: this.heads[i].x,
      y: this.heads[i].y
    };

    TweenLite.to(this.heads[i], .3, {
      alpha: 0, x: "+=180", y: "-=40", onComplete: function (i) {
        this.heads[i].x = coords.x;
        this.heads[i].y = coords.y;
        TweenLite.to(this.heads[i], .3, { alpha: 1 });
        this.resetAt(i);
      }.bind(this, i)
    });
  }

  resetAt(i) {
    this.idle[i].visible = true;
    this.images[i].visible = false;
    this.images[i].gotoAndStop(0);
  }


}
