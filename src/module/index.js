/*eslint no-unused-vars: ["warn", { "ignoreRestSiblings": true }]*/

import React, { Component } from "react";
import PropTypes from "prop-types";
import debounce from "debounce";
import supportsPassive from "supports-passive";
import {
  WebGLRenderer,
  CanvasRenderer,
  Scene,
  PerspectiveCamera,
  OrthographicCamera
} from "three";
import webGLEnabled from "webgl-enabled";
import Animator from "jw-animator";

const eventOptions = supportsPassive ? { passive: true } : false;

class ThreeCanvas extends Component {
  constructor(props) {
    super(props);

    this.removeAnimation = () => {};

    this._resizeHandler = debounce(() => this._updateDimensions(), true);
  }

  _updateDimensions() {
    const { props, wrapper, renderer } = this;
    const { maintainAspectRatio, scene, camera } = props;
    const { offsetWidth, offsetHeight } = wrapper;

    if (maintainAspectRatio) {
      if (props.onResize) {
        props.onResize(offsetWidth, offsetHeight);
      }

      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();
    }

    renderer.setSize(offsetWidth, offsetHeight);
    renderer.render(scene, camera);
  }

  componentDidMount() {
    const { props, wrapper, canvas } = this;
    const { animator, camera } = props;
    const { offsetWidth, offsetHeight } = wrapper;

    if (webGLEnabled()) {
      this.renderer = new WebGLRenderer({ canvas, antialias: true });
    } else {
      this.renderer = new CanvasRenderer({ canvas });
    }

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(offsetWidth, offsetHeight);

    camera.aspect = offsetWidth / offsetHeight;
    camera.updateProjectionMatrix();

    window.addEventListener("resize", this._resizeHandler, eventOptions);
    canvas.addEventListener("resize", this._resizeHandler, eventOptions);

    this.animator = animator || new Animator();

    if (props.animate) {
      this.removeAnimation = this.animator.add(timeDiff => {
        const { props, wrapper, renderer } = this;
        const { scene, camera } = props;
        const { offsetWidth, offsetHeight } = wrapper;

        props.animate(scene, camera, offsetWidth, offsetHeight, timeDiff);

        renderer.render(scene, camera);
      });
    }
  }

  componentWillUnmount() {
    const { canvas } = this;

    window.removeEventListener("resize", this._resizeHandler);
    canvas.removeEventListener("resize", this._resizeHandler);

    this.removeAnimation();
  }

  render() {
    const {
      maintainAspectRatio,
      onResize,
      animator,
      animate,
      scene,
      camera,
      ...rest
    } = this.props;

    return (
      <div ref={w => (this.wrapper = w)} {...rest}>
        <canvas ref={c => (this.canvas = c)} />
      </div>
    );
  }
}

ThreeCanvas.propTypes = {
  maintainAspectRatio: PropTypes.bool,
  onResize: PropTypes.func,
  animator: PropTypes.instanceOf(Animator),
  animate: PropTypes.func,
  scene: PropTypes.instanceOf(Scene).isRequired,
  camera: PropTypes.oneOfType([
    PropTypes.instanceOf(PerspectiveCamera),
    PropTypes.instanceOf(OrthographicCamera)
  ]).isRequired
};

ThreeCanvas.defaultProps = {
  maintainAspectRatio: true
};

export default ThreeCanvas;
