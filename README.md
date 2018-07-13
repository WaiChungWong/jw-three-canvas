# jw-three-canvas

A react component for canvas, integrated with [three.js](https://threejs.org) renderer and animation feature by an integrated [animator](https://nodei.co/npm/jw-animator).

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/jw-three-canvas.svg
[npm-url]: http://npmjs.org/package/jw-three-canvas
[travis-image]: https://img.shields.io/travis/WaiChungWong/jw-three-canvas.svg
[travis-url]: https://travis-ci.org/WaiChungWong/jw-three-canvas
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jw-three-canvas.svg
[download-url]: https://npmjs.org/package/jw-three-canvas

[Demo](http://waichungwong.github.io/jw-three-canvas/build)

## Install

[![NPM](https://nodei.co/npm/jw-three-canvas.png)](https://nodei.co/npm/jw-three-canvas)

## Props

| Prop                            | Description                                                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `maintainAspectRatio`(optional) | whether the canvas should keep aspect ratio from the moment it was created. Default: `true`                                                                             |
| `onResize`(optional)            | event handler when the canvas is being resized.                                                                                                                         |
| `animator`(optional)            | the animator object for controlling the animation. If not provided, it will be created from within.                                                                     |
| `animate`(optional)             | animation method. Parameters:<br> - `width`: context width<br> - `height`: context height<br> - `timeDiff`: time difference between the last animate time (in seconds). |
| `scene`                         | A [scene](https://threejs.org/docs/index.html#api/scenes/Scene) from [three.js](https://threejs.org)                                                                    |
| `camera`                        | A [camera](https://threejs.org/docs/index.html#api/cameras/Camera) from [three.js](https://threejs.org)                                                                 |

## Usage

```javascript
import React, { Component } from "react";
import { render } from "react-dom";
import {
  Scene,
  PerspectiveCamera,
  PointLight,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh
} from "three";
import ThreeCanvas from "jw-three-canvas";

class Example extends Component {
  constructor(props) {
    super(props);

    this.resizeHandler = this.resizeHandler.bind(this);
    this.animate = this.animate.bind(this);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, 1, 1, 1000);
    this.camera.position.z = 60;
    this.scene.add(this.camera);

    /** And other things you can add in the scene... */
  }

  componentDidMount() {
    const canvas = this.myCanvas;
    const { animator } = canvas;
    /** Start the animation. */
    animator.start();

    /** Pause the animation. */
    animator.pause();

    /** Resume the animation. */
    animator.resume();
  }

  resizeHandler(width, height) {
    /** ... **/
  }

  animate(width, height, timeDiff) {
    /** ... **/
  }

  render() {
    const { scene, camera } = this;

    return (
      <ThreeCanvas
        ref={myCanvas => (this.myCanvas = myCanvas)}
        onResize={this.resizeHandler}
        animate={this.animate}
        scene={scene}
        camera={camera}
      />
    );
  }
}

ReactDOM.render(<Example />, document.getElementById("root"));
```
