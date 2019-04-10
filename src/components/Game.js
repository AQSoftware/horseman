// @flow

const PIXI = window.PIXI;

export default class Game<T> {
  props: T;
  app: PIXI.Application;
  
  width: number;
  height: number;

  constructor(app: PIXI.Application, props: T) {
    this.app = app;
    this.width = app.renderer.width;
    this.height = app.renderer.height;
    this.props = props;
  }

  onLoadProgress(loader: any, resource: any) {
    //Display the file `url` currently being loaded
    console.log("loading: " + resource.url);

    //Display the percentage of files currently loaded
    console.log("progress: " + loader.progress + "%");
  }

  onReset(data: T) {
    console.log(`onReset: ${JSON.stringify(data)}`);
  }

  loadAssets(assets: Array<any>) {
    // load the texture we need
    PIXI.loader
      .add(assets, {crossOrigin: true})
      .on("progress", this.onLoadProgress.bind(this))
      .load(this.gameDidLoad.bind(this));
  }

  gameDidMount() {
    
  }

  gameWillUnmount() {

  }

  gameDidLoad(loader: any, resources: any) {
    
  }
  
}