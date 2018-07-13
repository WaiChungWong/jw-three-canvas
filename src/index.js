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

import ThreeCanvas from "./module";

import "./style.css";

class ExampleThreeCanvas extends Component {
  constructor(props) {
    super(props);

    this.secondInterval = 0;

    this.state = {
      FPS: 0,
      actualFPS: 0,
      pauseOnHidden: false,
      resumeOnShown: false
    };

    this.animate = this.animate.bind(this);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(50, 1, 1, 1000);
    this.camera.position.z = 60;
    this.scene.add(this.camera);

    let light = new PointLight(0xffff00);
    light.position.set(10, 0, 25);
    this.scene.add(light);

    let geometry = new BoxGeometry(20, 20, 20);
    let material = new MeshLambertMaterial({ color: 0x55ff55 });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  componentDidMount() {
    const { animator, renderer } = this.canvas;
    const { FPS, actualFPS, pauseOnHidden, resumeOnShown } = animator;

    this.setState({
      FPS,
      actualFPS,
      pauseOnHidden,
      resumeOnShown
    });

    renderer.setClearColor(0xffffff);
  }

  animate(width, height, timeDiff) {
    const { cube } = this;

    cube.rotation.x += timeDiff;
    cube.rotation.y += timeDiff;

    this.secondInterval += timeDiff;

    if (this.secondInterval > 0.5) {
      this.setState({ actualFPS: 1 / timeDiff });
      this.secondInterval = 0;
    }
  }

  setFPS(FPS) {
    this.canvas.animator.setFPS(FPS);
    this.setState({ FPS });
  }

  setResumeOnShown(resumeOnShown) {
    this.canvas.animator.setResumeOnShown(resumeOnShown);
    this.setState({ resumeOnShown });
  }

  setPauseOnHidden(pauseOnHidden) {
    this.canvas.animator.setPauseOnHidden(pauseOnHidden);
    this.setState({ pauseOnHidden });
  }

  start() {
    this.canvas.animator.start();
  }

  pause() {
    this.canvas.animator.pause();
  }

  resume() {
    this.canvas.animator.resume();
  }

  stop() {
    const { canvas, cube } = this;
    const { animator, renderer } = canvas;
    let context = renderer.context;

    animator.stop();
    context.clear(context.COLOR_BUFFER_BIT);
    cube.rotation.x = 0;
    cube.rotation.y = 0;
  }

  render() {
    const { scene, camera, state } = this;
    const { FPS, actualFPS, pauseOnHidden, resumeOnShown } = state;
    return (
      <div {...this.props}>
        <ThreeCanvas
          className="animation"
          ref={c => (this.canvas = c)}
          animate={this.animate}
          scene={scene}
          camera={camera}
        />
        <div className="settings">
          <div className="field">
            <label>Actual FPS: </label>
            <input
              type="number"
              value={actualFPS.toFixed(2)}
              disabled={true}
              onChange={() => {}}
            />
          </div>
          <div className="field">
            <label>FPS: </label>
            <input
              type="number"
              value={FPS}
              onChange={e => this.setFPS(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Pause on hidden: </label>
            <input
              type="checkbox"
              checked={pauseOnHidden}
              onChange={e => this.setPauseOnHidden(e.target.checked)}
            />
          </div>
          <div className="field">
            <label>Resume on shown: </label>
            <input
              type="checkbox"
              checked={resumeOnShown}
              onChange={e => this.setResumeOnShown(e.target.checked)}
            />
          </div>
        </div>
      </div>
    );
  }
}

class Demo extends Component {
  startHandler() {
    this.a1.start();
    this.a2.start();
  }

  pauseHandler() {
    this.a1.pause();
    this.a2.pause();
  }

  resumeHandler() {
    this.a1.resume();
    this.a2.resume();
  }

  stopHandler() {
    this.a1.stop();
    this.a2.stop();
  }

  render() {
    return (
      <div>
        <ExampleThreeCanvas ref={a1 => (this.a1 = a1)} id="animator1" />
        <ExampleThreeCanvas ref={a2 => (this.a2 = a2)} id="animator2" />
        <div id="controller">
          <button id="start" onClick={() => this.startHandler()}>
            start
          </button>
          <button id="pause" onClick={() => this.pauseHandler()}>
            pause
          </button>
          <button id="resume" onClick={() => this.resumeHandler()}>
            resume
          </button>
          <button id="stop" onClick={() => this.stopHandler()}>
            stop
          </button>
        </div>
      </div>
    );
  }
}

render(<Demo />, document.getElementById("root"));
