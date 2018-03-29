// @flow
import { PixiContainer, PixiButton, Horseman, Skeleton } from '../../components';
import Assets, { DYNAMIC_ASSETS } from '../../assets';

type Props = {
  onPress: (void) => void,
  dynamicAssetIndex: number
}

const VERTICAL_OFFSET = 20;
const BUTTON_WIDTH = 227;
const BUTTON_HEIGHT = 69;
var start = false;
var neededKills = (Math.floor(Math.random()*3)+1) * 10 + (Math.floor(Math.random()*2)*5);
if(neededKills>30)neededKills = 30;

var timer = 0;
var start = false;
var killCount = 0;

export default class View2 extends PixiContainer {
  setup(){

    setTimeout(this.resize.bind(this), 200, this.width, this.height);

    var g = new this.pixi.Graphics();
    g.beginFill(0xffffff);
    g.drawRect(0,0,this.width,this.height);
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

    this.gameContainer = new this.pixi.Container();
    this.fakeText = new this.pixi.Text('0/ '+neededKills, style);
    this.killCountText = new this.pixi.Text('0', style2);
    this.killCountText.anchor.x = 0.5;
    this.killCountText.anchor.y = 0.5;
    this.killCountText.x = this.width/2 - (this.fakeText.width/2 - this.killCountText.width/2);
    this.killCountText.y = this.height-this.killCountText.height - 13;

    this.neededKillsText = new this.pixi.Text("/" + neededKills, style);
    this.neededKillsText.anchor.x = 0.5;
    this.neededKillsText.anchor.y = 0.5;
    this.neededKillsText.x = this.width/2 + (this.fakeText.width/2 - this.neededKillsText.width/2)
    this.neededKillsText.y = this.height-this.killCountText.height - 13;

    this.timerText = new this.pixi.Text("Time left:   " + timer + " sec",{fill:0xffffff});
    this.timerText.anchor.x = 0.5;
    this.timerText.anchor.y = 0.5;
    this.timerText.x = this.width/2;
    this.timerText.y = this.height-15;

    this.horseman = new Horseman(this.pixi);
    this.horseman.setup(this.width,this.height);

    this.skeleton = new Skeleton(this.pixi);
    this.skeleton.setup(this.width,this.height,this.horseman.getHorseDimensions());
    this.gameContainer.addChild(this.horseman.container);
    this.gameContainer.addChild(this.skeleton.container);

    this.scene.on('pointerdown',function(){
      if(this.horseman.getRotation()<-2.7 && this.horseman.getRotation()>-3.3){
        if(this.skeleton.getSkeletonKill(this.horseman.getFlailPosition())){
          killCount++;
          this.killCountText.text = killCount;
          if(killCount == neededKills){
            neededKills = (Math.floor(Math.random()*3)+1) * 10 + (Math.floor(Math.random()*2)*5);
            killCount = 0;
            start = false;
            this.neededKillsText.text = "/" + neededKills;
            this.killCountText.text = killCount;
            this.props.onPress(true);
          }
        }
      }
    }.bind(this))

    this.txtBackground = new this.pixi.Graphics();
    this.txtBackground.beginFill(0x404040);
    this.txtBackground.lineStyle(2, 0xbbb9bc);
    this.txtBackground.drawRect(0,0,this.fakeText.width + 50, this.fakeText.height);
    this.txtBackground.endFill();
    this.alpha = 0.8;
    this.txtBackground.x = this.width / 2 - this.txtBackground.width/2;
    this.txtBackground.y = this.killCountText.y - this.killCountText.height / 2;

    this.gameContainer.addChild(this.txtBackground)
    this.gameContainer.addChild(this.neededKillsText);
    this.gameContainer.addChild(this.killCountText);
    this.gameContainer.addChild(this.timerText);

    this.scene.addChild(this.gameContainer);
  }

  startCounter(){
    timer = neededKills * 3 * 1000 + Date.now();
    start = true;
    if(this.horseman.getRotation() == Math.PI){
      this.horseman.setRotation(this.skeleton.getDistance());
      this.skeleton.setSpeed();
    }
  }

  countdown(){
    if(start){
      var t = timer - Date.now();
      t = Math.floor(t/1000)
      this.timerText.text = "Time left:  " + t + " sec";
      if(t <= 0){
        neededKills = (Math.floor(Math.random()*3)+1) * 10 + (Math.floor(Math.random()*2)*5);
        killCount = 0;
        start = false;
        this.neededKillsText.text = "/" + neededKills;
        this.killCountText.text = killCount;
        this.props.onPress(false);
      }
    }
  }

  resize(w, h){
    this.width = w;
    this.height = h;
    this.scene.children.sort(function(a, b){
      return (a.y>b.y)
    })
  }

  set enabled(value: boolean){
    super.enabled = value;
  }

  update(){
    this.horseman.animateFlail();
    this.skeleton.animateSkeletons(this.horseman.getRotation());
    this.countdown();
    this.updated=true;
  }
}
