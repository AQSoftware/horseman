
/**
HexiView - Base class for creating Hexi/Pixi groups
*/
export default class HexiGroup {

  /**
  Constructor

  g        - Hexi instance
  width    - Group width
  height   - Group height
  props    - Additional props
  */
  constructor(g, width, height, props){
    this.g = g;
    this.props = props;
    this.width = width;
    this.height = height;
    this.scene = g.group();
  }

  /**
  Handles tap gestures on the Pixi canvas.

  The owner of the HexiGroup calls this and allows this HexiGroup
  instance to do some hit testing to see whether the tap gesture is
  relevant.

  Return value - True if gesture is handled, false if not
  */
  onTap(){
    return false;
  }
}
