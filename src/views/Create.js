// @flow
import React, { Component } from 'react';
import {
  defaultLifeCycle,
  defaultUIBridge,
  StaticCanvas,
  Button,
  Panel
} from 'aq-miniapp';
import './css/Create.css';

const TITLE = "MiniApp";

export default class Create extends Component {

  state: {
    coverImg: string
  }

  componentWillMount(){
    // Set callback function to be called when AQ app requests to preview the
    // current content of our create screen
    defaultLifeCycle.setRequestPreviewCallback(this._showPreview.bind(this));
    defaultLifeCycle.setPublishCallback(this._publish.bind(this));
  }

  _publish(id: string) {
    defaultLifeCycle.publishSucceded();
  }

  _showPreview() {
    // At the very least, AQ app requires a title and a cover image,
    // before the preview screen can be shown.
    defaultLifeCycle.showPreviewWithData(TITLE, this.state.coverImg, null);
  }

  _onButtonClick() {
    defaultUIBridge.showGalleryImageSelector('cover', 'Select a cover photo', this._onRequestCoverImage.bind(this));
    // defaultLifeCycle.showPreviewWithData(TITLE, COVER_IMAGE, null);
  }

  _onRequestCoverImage(key: string, coverImg: string) {
    this.setState({coverImg: coverImg}, () => {
      this._showPreview();
    });
  }

  render(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    return(
      <div className='container'>
        <StaticCanvas id="static" width={width} height={height}/>
        <Panel
          id="content"
          title="Content"
          backgroundColor="rgba(38, 38, 38, 0.8)"
          width="200px"
          titleColor="White"
          className="uppercase lighter"
        >
          <Button title="Done" onClick={() => { this._onButtonClick(); }}/>
        </Panel>
      </div>
    );
  }
}
