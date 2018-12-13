import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets, { ASSETS } from '../../assets';
import PIXIsound from 'pixi-sound';
import { normalizeRadians } from '../../libs/Utils';

const VERTICAL_OFFSET = 20;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;

var ANGLE_FROM = -3.2;
var ANGLE_TO = -2.7;

const MIN_TAP_DELAY = 300;

var timer = 0;
var start = false;
var _killCount = 0;

const BUILDUP_TIME = 7;// 7 sec speed buildup
const SKLT_SPEED_START = 0.01;
const SKLT_SPEED_MAX = 0.1;
// const SKLT_SPEED_MAX = 0.05;
const HRS_SPEED_START = 0.01;
const HRS_SPEED_MAX = 0.2;
var xSpeed;

export default class View2 extends PixiContainer {
  setup() {
    _killCount = 0;

    ANGLE_FROM = this.props.allowHitFrom;
    ANGLE_TO = this.props.allowHitTo;

    setTimeout(this.resize.bind(this), 200, this.width, this.height);

    var g = new this.pixi.Graphics();
    g.beginFill(0xffffff);
    g.drawRect(0, 0, this.width, this.height);
    g.endFill();
    g.alpha = 0;
    this.scene.addChild(g);

    this.scene.interactive = true;

    var style = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 30,
      fill: '#ffffff',
    });

    var style2 = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 30,
      fill: '#e90804',
    });

    this.message = new this.pixi.Text("Game Over", {
      fontFamily: 'Arial',
      fontSize: 38,
      fill: '#ffffff',
    });
    this.message.anchor.x = 0.5;
    this.message.anchor.y = 0;
    this.message.x = this.width / 2;
    this.message.y = this.height * .1;
    this.message.alpha = 0;

    this.gameContainer = new this.pixi.Container();

    this.killsText = new PIXI.Container();

    var kills = new PIXI.Text('Kills:'.toUpperCase(), new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: "22px",
      fill: ['#ffffff'],
      align: 'left',
      dropShadow: true, dropShadowDistance: 2, dropShadowColor: 'grey'
    }));
    this.killsText.addChild(kills);

    this.killCountText = new PIXI.Text('0', new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: "48px",
      fill: ['#ffffff'],
      align: 'center',
      dropShadow: true, dropShadowDistance: 2, dropShadowColor: 'grey'
    }));
    this.killCountText.x = 50;
    this.killCountText.y = 20;
    this.killsText.addChild(this.killCountText);

    this.killsText.x = 50;
    this.killsText.y = 10;
    this.gameContainer.addChild(this.killsText);

    this.horseman = new Horseman(this.pixi);
    this.horseman.setup(this.width, this.height);

    this.skeleton = new Skeleton(this.pixi);
    this.skeleton.setup(this.width, this.height, this.horseman.getHorseDimensions());
    this.skeleton.heads[0].dead = true;
    this.skeleton.heads[0].deadCounted = true;
    this.gameContainer.addChild(this.horseman.container);
    this.gameContainer.addChild(this.skeleton.container);

    this.scene.on('pointerdown', function () {
      this.didTap = true;

      var tapTime = new Date().getTime();
      if ((tapTime - this.lastTapTime) < MIN_TAP_DELAY) {
        return;
      } else {
        this.lastTapTime = tapTime;
      }

      var r = normalizeRadians(this.horseman.getRotation());
      if (r < ANGLE_FROM && r > ANGLE_TO) {
        console.log('DOWN @ ' + this.horseman.getRotation());
        this.hitAccepted = true;
        this.didTap = false;
        // if (this.skeleton.getSkeletonKill(this.horseman.getFlailPosition())) {
        //   killCount++;
        //   this.killCountText.text = killCount;
        //   PIXI.sound.play(Assets.sounds.sndHit);
        // }
      }
    }.bind(this))

    this.gameContainer.addChild(this.message);

    this.scene.addChild(this.gameContainer);
  }

  onLifeLost() {
    this.scene.parent.emit('livesNumChanged', -1);
    TweenMax.to(this.horseman.container, .05, { alpha: .2, yoyo: true, repeat: 5 });
    PIXI.sound.play(Assets.sounds.sndClick);
  }

  showGameOver() {
    this.isGameOn = false;
    this.killsText.visible = false;

    TweenMax.to([this.skeleton.container, this.horseman.flail].concat(this.horseman.flameTrail), 1, { alpha: 0 });
    this.message.y += 20;
    TweenMax.to(this.message, 1, { alpha: 1, y: "-=20", ease: Sine.easeInOut });

    var obj = { gain: 1 };
    TweenMax.to(obj, 3, {
      gain: 0,
      ease: Linear.easeNone,
      onUpdate: function () {
        // xSpeed = obj.gain * SKLT_SPEED_MAX;
        this.horseman.setHorseSpeed(obj.gain * HRS_SPEED_MAX);
      }.bind(this),
      onComplete: function () {
        setTimeout(this.onGameClose.bind(this), 2000);
      }.bind(this)
    });

    PIXI.sound.stopAll();
    PIXI.sound.play(Assets.sounds.sndFinal);
  }

  onGameClose() {
    console.log('Game Closed!');
    /**
     *
     *    close game window or whatever ....
     *
     */

  }

  startGame() {
    var obj = { gain: 0 };
    TweenMax.to(obj, BUILDUP_TIME, {
      gain: 1,
      ease: Linear.easeNone,
      onUpdate: function () {
        xSpeed = SKLT_SPEED_START + obj.gain * (SKLT_SPEED_MAX - SKLT_SPEED_START);
        this.horseman.setHorseSpeed(HRS_SPEED_START + obj.gain * (HRS_SPEED_MAX - HRS_SPEED_START));
      }.bind(this)
    });
    this.horseman.play();
    this.isGameOn = true;
    this.lastTapTime = new Date().getTime();
  }

  resize(w, h) {
    this.width = w;
    this.height = h;
    this.scene.children.sort(function (a, b) {
      return (a.y > b.y)
    })
  }

  set enabled(value) {
    super.enabled = value;
  }

  update() {
    xSpeed += 0.00005;
    var speed = xSpeed;
    this.horseman.animateFlail(speed);
    var numAlive = this.skeleton.animateSkeletons(speed);

    if (this.isGameOn && numAlive > 0) {

      if (this.didTap) {
        this.onLifeLost();
        this.didTap = false;
      }
    }

    if (this.hitAccepted) {
      var index = this.skeleton.getKillRangeIndex(this.horseman.getFlailPosition());
      console.log('!!! ' + index);
      if (index >= 0) {
        this.hitAccepted = false;
        this.skeleton.performKill(index);
        _killCount++;
        this.killCountText.text = _killCount;
        PIXI.sound.play(Assets.sounds.sndHit);
      }
    }

    // var r = normalizeRadians(this.horseman.getRotation());
    // if (r < ANGLE_FROM && r > ANGLE_TO) {
    //   this.horseman.flail.alpha = .1;
    // } else {
    //   this.horseman.flail.alpha = 1;
    // }
  }

  get killCount() {
    return _killCount;
  }
}
