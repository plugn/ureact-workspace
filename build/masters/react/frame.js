var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var Frame = function (_React$Component) {
  _inherits(Frame, _React$Component);

  function Frame() {
    _classCallCheck(this, Frame);

    return _possibleConstructorReturn(this, (Frame.__proto__ || Object.getPrototypeOf(Frame)).apply(this, arguments));
  }

  _createClass(Frame, [{
    key: 'onLoad',
    value: function onLoad() {
      this.props.onLoad && this.props.onLoad(this.frame);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement('iframe', {
        ref: function ref(frame) {
          return _this2.frame = frame;
        },
        style: this.props.style,
        src: this.props.url,
        className: this.props.className,
        onLoad: function onLoad() {
          return _this2.onLoad();
        }
      });
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return {
        className: React.PropTypes.string,
        style: React.PropTypes.object,
        url: React.PropTypes.string.isRequired,
        onLoad: React.PropTypes.func
      };
    }
  }]);

  return Frame;
}(React.Component);

export { Frame as default };


export var ControlledFrame = function (_React$Component2) {
  _inherits(ControlledFrame, _React$Component2);

  function ControlledFrame() {
    _classCallCheck(this, ControlledFrame);

    return _possibleConstructorReturn(this, (ControlledFrame.__proto__ || Object.getPrototypeOf(ControlledFrame)).apply(this, arguments));
  }

  _createClass(ControlledFrame, [{
    key: 'render',
    value: function render() {
      var url = this.props.url + '?v=' + this.props.renderControl;
      return React.createElement(Frame, _extends({ key: this.props.renderControl }, this.props, { url: url }));
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return _extends({
        renderControl: React.PropTypes.number
      }, Frame.propTypes);
    }
  }]);

  return ControlledFrame;
}(React.Component);