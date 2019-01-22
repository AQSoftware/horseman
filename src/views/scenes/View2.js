import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets, { ASSETS } from '../../assets';
import PIXIsound from 'pixi-sound';
import { normalizeRadians } from '../../libs/Utils';
import {
  LifeCycle
} from 'aq-miniapp-core';


const VERTICAL_OFFSET = 20;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;

var ANGLE_FROM = -3.2;
var ANGLE_TO = -2.7;

const MIN_TAP_DELAY = 300;

var timer = 0;
var start = false;
var _killCount = 0;

const BUILDUP_TIME = 3;// 7 sec speed buildup
const SKLT_SPEED_START_0 = 0.03;
const SKLT_SPEED_START = SKLT_SPEED_START_0 * 3;
// const SKLT_SPEED_MAX = 0.1;
const HRS_SPEED_START_0 = 0.03;
const HRS_SPEED_START = HRS_SPEED_START_0 * 3;
// const HRS_SPEED_MAX = 0.2;
var skeletonSpeed;
var horseSpeed;

const MULT_CHANGE_STEP = 4;
// var SPEED_MULTS = [.2, .1, .1, .05];
var SPEED_MULTS = [.6, .2, .2, .1];
var nextMultChangeAt = MULT_CHANGE_STEP;
var currentSpeedMult = 1;

var _targetScore;

export default class View2 extends PixiContainer {
  setup() {
    if (this.props.targetScore && this.props.targetScore > 0) _targetScore = this.props.targetScore;
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

    var kills = new PIXI.Text('Skulls:'.toUpperCase(), new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: "22px",
      fill: ['#ffffff'],
      dropShadow: true, dropShadowDistance: 2, dropShadowColor: 'grey'
    }));
    this.killsText.addChild(kills);

    this.killCountText = new PIXI.Text('0', new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: "48px",
      fill: ['#ffffff'],
      dropShadow: true, dropShadowDistance: 2, dropShadowColor: 'grey'
    }));
    this.killCountText.x = kills.width + 5;
    this.killCountText.y = -17;
    this.killsText.addChild(this.killCountText);

    this.updateKillsCount(0);

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

    var image = this.skeleton.images[0];
    this.killsText.x = this.width / 2 - this.killsText.width / 2;
    var bottom = (image.y + image.height);
    this.killsText.y = bottom + (this.scene.height - bottom) / 2 - 0;

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

  showGameOver(didWin) {
    this.isGameOn = false;
    // this.killsText.y = this.height / 2 + this.height / 2 * .35;

    this.message.text = didWin ? 'You did it!' : 'Game Over';

    TweenMax.to([this.skeleton.container, this.horseman.flail].concat(this.horseman.flameTrail), 1, { alpha: 0 });
    this.message.y += 20;
    TweenMax.to(this.message, 1, { alpha: 1, y: "-=20", ease: Sine.easeInOut });

    var obj = { gain: 1 };
    TweenMax.to(obj, 3, {
      gain: 0,
      ease: Linear.easeNone,
      onUpdate: function () {
        // xSpeed = obj.gain * SKLT_SPEED_MAX;
        this.horseman.setHorseSpeed(obj.gain * horseSpeed);
      }.bind(this),
      onComplete: function () {
        setTimeout(this.onGameClose.bind(this), 2000);
      }.bind(this)
    });

    PIXI.sound.stopAll();
    PIXI.sound.play(Assets.sounds.sndFinal);

    this.scene.off('pointerdown');

    // report result to host app
    LifeCycle.setResult({
      winCriteria: 'WIN',
      score: {
        value: _killCount,
        target: _targetScore
      }
    });
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
        // xSpeed = SKLT_SPEED_START + obj.gain * (SKLT_SPEED_MAX - SKLT_SPEED_START);
        // this.horseman.setHorseSpeed(HRS_SPEED_START + obj.gain * (HRS_SPEED_MAX - HRS_SPEED_START));
        skeletonSpeed = SKLT_SPEED_START_0 + obj.gain * (SKLT_SPEED_START - SKLT_SPEED_START_0);
        horseSpeed = HRS_SPEED_START_0 + obj.gain * (HRS_SPEED_START - HRS_SPEED_START_0);
        this.horseman.setHorseSpeed(horseSpeed);
      }.bind(this)
    });

    skeletonSpeed = SKLT_SPEED_START_0;
    horseSpeed = SKLT_SPEED_START_0;
    this.horseman.setHorseSpeed(horseSpeed);

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
    var speed = skeletonSpeed;
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
        this.updateKillsCount(_killCount);
        PIXI.sound.play(Assets.sounds.sndHit);
        this.updateSpeed();

        if (_targetScore && _killCount == _targetScore) {
          this.showGameOver(true);
        }
      }
    }

    // var r = normalizeRadians(this.horseman.getRotation());
    // if (r < ANGLE_FROM && r > ANGLE_TO) {
    //   this.horseman.flail.alpha = .1;
    // } else {
    //   this.horseman.flail.alpha = 1;
    // }
  }

  updateKillsCount(count) {
    var killsTarget = _targetScore ? '/' + _targetScore : '';
    this.killCountText.text = count + killsTarget;
  }

  updateSpeed() {
    if (_killCount >= nextMultChangeAt) {
      nextMultChangeAt += MULT_CHANGE_STEP;

      var mult;
      if (SPEED_MULTS.length > 1) {
        mult = SPEED_MULTS.shift();
      } else {
        mult = SPEED_MULTS[0];
      }

      currentSpeedMult = mult;

      // updated objects
      skeletonSpeed *= (1 + currentSpeedMult);
      horseSpeed *= (1 + currentSpeedMult);
      this.horseman.setHorseSpeed(horseSpeed);
    }
  }

  get killCount() {
    return _killCount;
  }
}
