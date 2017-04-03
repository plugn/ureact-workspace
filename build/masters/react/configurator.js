var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';

var ReactMasterConfigurator = function (_React$Component) {
  _inherits(ReactMasterConfigurator, _React$Component);

  function ReactMasterConfigurator() {
    _classCallCheck(this, ReactMasterConfigurator);

    return _possibleConstructorReturn(this, (ReactMasterConfigurator.__proto__ || Object.getPrototypeOf(ReactMasterConfigurator)).apply(this, arguments));
  }

  _createClass(ReactMasterConfigurator, [{
    key: 'onChangePreviewFile',
    value: function onChangePreviewFile(preview) {
      this.props.onChangeConf && this.props.onChangeConf(_extends({}, this.props.conf, {
        previewFile: preview
      }));
    }
  }, {
    key: 'onChangeOpenFiles',
    value: function onChangeOpenFiles(openFiles) {
      openFiles = JSON.parse(openFiles);

      this.props.onChangeConf && this.props.onChangeConf(_extends({}, this.props.conf, {
        openFiles: openFiles
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          null,
          'Configurator'
        ),
        React.createElement(
          'label',
          { htmlFor: 'react-master-config-previewFile' },
          'Preview File'
        ),
        React.createElement('input', {
          type: 'text',
          id: 'react-master-config-previewFile',
          value: this.props.conf.previewFile,
          onChange: function onChange(e) {
            return _this2.onChangePreviewFile(e.target.value);
          }
        }),
        React.createElement('br', null),
        React.createElement(
          'label',
          { htmlFor: 'react-master-config-previewFile' },
          'Open Files'
        ),
        React.createElement('textarea', {
          style: { width: '500px' },
          id: 'react-master-config-previewFile',
          value: JSON.stringify(this.props.conf.openFiles, null, 2),
          onChange: function onChange(e) {
            return _this2.onChangeOpenFiles(e.target.value);
          }
        })
      );
    }
  }]);

  return ReactMasterConfigurator;
}(React.Component);

export { ReactMasterConfigurator as default };