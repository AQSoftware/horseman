
/**
PixiContainer - Base class for creating Pixi containers
*/
export default class PixiContainer {


  /**
  Constructor

  pixi     - Pixi instance
  width    - Group width
  height   - Group height
  props    - Additional props
  */
  constructor(pixi, width, height, props) {
    this.pixi = pixi;
    this.width = width;
    this.height = height;
    this.props = props;
    this.scene = new pixi.Container();
  }

  /**
  Determines whether the sceen will receive touches. Used primarily
  for enabling/disabling Hexi buttons. See HexiButton.enabled
  */
  get enabled() {
    return this.scene.interactive;
  }

  set enabled(value) {
    this.scene.interactive = value;
  }

  destroy() {
    console.log('PixiContainer.destroy', this.scene.parent);
    if (this.scene.parent) {
      this.scene.parent.removeChild(this.scene);
    }
  }

  /**
  Handles tap gestures on the Pixi canvas.

  The owner of the HexiGroup calls this and allows this HexiGroup
  instance to do some hit testing to see whether the tap gesture is
  relevant.

  Return value - True if gesture is handled, false if not
  */
  onTap() {
    return false;
  }
}
