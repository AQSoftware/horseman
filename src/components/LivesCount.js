import Assets from '../assets';

export default class LivesCount extends PIXI.Container {
    constructor(livesNum) {
        super();
        this.MAX_LIVES = livesNum || 3;// 3 by default

        this._label = new PIXI.Text('Lives'.toUpperCase(), new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: "22px",
            fill: ['#ffffff'],
            align: 'left',
            dropShadow: true, dropShadowDistance: 2, dropShadowColor: 'grey'
        }));
        this.addChild(this._label);
        this._label.x = -this._label.width;

        this._livesHolder = new PIXI.Container();
        this._livesHolder.y = this._label.height + 5;
        this.addChild(this._livesHolder);

        this._reset();
    }

    _reset() {
        this._currentLives = this.MAX_LIVES;
        this._drawLives();
    }

    _drawLives() {
        this._livesHolder.removeChildren();
        for (var i = 0; i < this.MAX_LIVES; i++) {
            var icon = PIXI.Sprite.fromImage(Assets.images.heart);
            icon.scale.x = icon.scale.y = .5;
            icon.x = i * (icon.width * 1.1);
            icon.y = 0;
            icon.alpha = (i < this._currentLives) ? 1 : .35;
            this._livesHolder.addChild(icon);
        }
        this._livesHolder.x = -(icon.x + icon.width);
    }

    get currentLives() {
        return this._currentLives;
    }

    set currentLives(value) {
        this._currentLives = value;
        this._drawLives();
    }
}    