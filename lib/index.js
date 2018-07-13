"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _debounce = require("debounce");

var _debounce2 = _interopRequireDefault(_debounce);

var _supportsPassive = require("supports-passive");

var _supportsPassive2 = _interopRequireDefault(_supportsPassive);

var _three = require("three");

var _webglEnabled = require("webgl-enabled");

var _webglEnabled2 = _interopRequireDefault(_webglEnabled);

var _jwAnimator = require("jw-animator");

var _jwAnimator2 = _interopRequireDefault(_jwAnimator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /*eslint no-unused-vars: ["warn", { "ignoreRestSiblings": true }]*/

var eventOptions = _supportsPassive2.default ? { passive: true } : false;

var ThreeCanvas = function (_Component) {
  _inherits(ThreeCanvas, _Component);

  function ThreeCanvas(props) {
    _classCallCheck(this, ThreeCanvas);

    var _this = _possibleConstructorReturn(this, (ThreeCanvas.__proto__ || Object.getPrototypeOf(ThreeCanvas)).call(this, props));

    _this.removeAnimation = function () {};

    _this._resizeHandler = (0, _debounce2.default)(function () {
      return _this._updateDimensions();
    }, true);
    return _this;
  }

  _createClass(ThreeCanvas, [{
    key: "_updateDimensions",
    value: function _updateDimensions() {
      var props = this.props,
          wrapper = this.wrapper,
          renderer = this.renderer;
      var maintainAspectRatio = props.maintainAspectRatio,
          scene = props.scene,
          camera = props.camera;
      var offsetWidth = wrapper.offsetWidth,
          offsetHeight = wrapper.offsetHeight;


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
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var props = this.props,
          wrapper = this.wrapper,
          canvas = this.canvas;
      var animator = props.animator,
          camera = props.camera;
      var offsetWidth = wrapper.offsetWidth,
          offsetHeight = wrapper.offsetHeight;


      if ((0, _webglEnabled2.default)()) {
        this.renderer = new _three.WebGLRenderer({ canvas: canvas, antialias: true });
      } else {
        this.renderer = new _three.CanvasRenderer({ canvas: canvas });
      }

      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(offsetWidth, offsetHeight);

      camera.aspect = offsetWidth / offsetHeight;
      camera.updateProjectionMatrix();

      window.addEventListener("resize", this._resizeHandler, eventOptions);
      canvas.addEventListener("resize", this._resizeHandler, eventOptions);

      this.animator = animator || new _jwAnimator2.default();

      if (props.animate) {
        this.removeAnimation = this.animator.add(function (timeDiff) {
          var props = _this2.props,
              wrapper = _this2.wrapper,
              renderer = _this2.renderer;
          var scene = props.scene,
              camera = props.camera;
          var offsetWidth = wrapper.offsetWidth,
              offsetHeight = wrapper.offsetHeight;


          props.animate(offsetWidth, offsetHeight, timeDiff);

          renderer.render(scene, camera);
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var canvas = this.canvas;


      window.removeEventListener("resize", this._resizeHandler);
      canvas.removeEventListener("resize", this._resizeHandler);

      this.removeAnimation();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          maintainAspectRatio = _props.maintainAspectRatio,
          onResize = _props.onResize,
          animator = _props.animator,
          animate = _props.animate,
          scene = _props.scene,
          camera = _props.camera,
          rest = _objectWithoutProperties(_props, ["maintainAspectRatio", "onResize", "animator", "animate", "scene", "camera"]);

      return _react2.default.createElement(
        "div",
        _extends({ ref: function ref(w) {
            return _this3.wrapper = w;
          } }, rest),
        _react2.default.createElement("canvas", { ref: function ref(c) {
            return _this3.canvas = c;
          } })
      );
    }
  }]);

  return ThreeCanvas;
}(_react.Component);

ThreeCanvas.propTypes = {
  maintainAspectRatio: _propTypes2.default.bool,
  onResize: _propTypes2.default.func,
  animator: _propTypes2.default.instanceOf(_jwAnimator2.default),
  animate: _propTypes2.default.func,
  scene: _propTypes2.default.instanceOf(_three.Scene).isRequired,
  camera: _propTypes2.default.oneOfType([_propTypes2.default.instanceOf(_three.PerspectiveCamera), _propTypes2.default.instanceOf(_three.OrthographicCamera)]).isRequired
};

ThreeCanvas.defaultProps = {
  maintainAspectRatio: true
};

exports.default = ThreeCanvas;