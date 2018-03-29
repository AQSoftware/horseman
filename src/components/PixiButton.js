// @flow
import PixiContainer from './PixiContainer';

type Props = {
  title: string,
  textureAtlas: string,
  onPress: (void) => void,
  onOver?: (void) => void,
  onOut?: (void) => void,
  onTap?: (void) => void,
}

export default class PixiButton extends PixiContainer {
  setup(){
    let textures = this.pixi.loader.resources[this.props.textureAtlas].textures;
    this.button = new this.pixi.Container();
    this.button.addChild(new this.pixi.Sprite(textures[0]));
    this.button.width = this.width;
    this.button.height = this.height;
    this.button.pointerover = function(){
      this.button.removeChildren();
      this.button.addChild(new this.pixi.Sprite(textures[1]));
    }.bind(this);
    this.button.pointerout = function(){
      this.button.removeChildren();
      this.button.addChild(new this.pixi.Sprite(textures[0]));
    }.bind(this);
    this.button.pointerdown = function(){
      this.button.removeChildren();
      this.button.addChild(new this.pixi.Sprite(textures[2]));
    }.bind(this);
    this.button.pointerup = function(){
      this.button.removeChildren();
      this.button.addChild(new this.pixi.Sprite(textures[1]));
    }.bind(this);
    this.button.interactive = true;
    // this.button.press = this.props.onPress;
    this.button.release = this.props.onPress;
    if (this.props.onOver) this.button.over = this.props.onOver;
    if (this.props.onOut) this.button.out = this.props.onOut;
    if (this.props.onTap) this.button.tap = this.props.onTap;
    this.scene.addChild(this.button);

    this.title = new this.pixi.Text(this.props.title.toUpperCase(), {fontFamily: "Oswald", fontSize: 40, align: 'center'});
    this.title.position = new this.pixi.Point((this.width - this.title.width) / 2, (this.height - this.title.height) / 2);
    this.scene.addChild(this.title);

    this.scene.interactive = true;
    this.scene.pointerup = function(){
      if(this.props.onPress){
        this.props.onPress();
      }
    }.bind(this);
  }

  get enabled(): boolean {
    return this.scene.interactive;
  }

  set enabled(value: boolean){
    this.scene.interactive = value;
  }
}
