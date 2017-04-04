var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import reducer, { initialState, makeSaga as makeMasterSaga, testCode } from './updater';
import { components, bootstrap, Socket, PanelManager } from '@udacity/web-terminal-client';
var Files = components.Files,
    Editor = components.Editor,
    Layout = components.Layout;

import { ControlledFrame } from './frame';
import ReactMasterConfigurator from './configurator';
import { connect } from 'react-redux';

var ReactMaster = (_dec = connect(null, function (dispatch, _ref) {
  var target = _ref.target;
  return { onTestCode: function onTestCode() {
      return dispatch(testCode(target));
    } };
}), _dec(_class = function (_React$Component) {
  _inherits(ReactMaster, _React$Component);

  function ReactMaster() {
    _classCallCheck(this, ReactMaster);

    return _possibleConstructorReturn(this, (ReactMaster.__proto__ || Object.getPrototypeOf(ReactMaster)).apply(this, arguments));
  }

  _createClass(ReactMaster, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
      bootstrap();

      // Create our managers before our child components mount
      this.managers = {
        editor: new PanelManager(),
        files: new PanelManager()
      };

      // Horribly annoying hack to deal with the lack of componentDidUnmount
      //
      // We have to disconnect the socket we created, but can only do it *after* unmounting
      // and cleaning up children. componentWillUnmount runs parent first, so we can't use
      // it for this purpose.
      this.childrenUnmountCallbacks = {};
      this.childrenUnmount = [new Promise(function (resolve) {
        return _this2.childrenUnmountCallbacks.editor = resolve;
      }), new Promise(function (resolve) {
        return _this2.childrenUnmountCallbacks.files = resolve;
      }), new Promise(function (resolve) {
        return _this2.childrenUnmountCallbacks.html = resolve;
      })];
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.startProject(this.props.project);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(newProps) {
      this.startProject(newProps.project);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      Promise.all(this.childrenUnmount).finally(function () {
        return _this3.teardown();
      });
    }
  }, {
    key: 'startProject',
    value: function startProject(project) {
      // After our managers are initialized, and we have the project, pass them off.
      var masterSaga = makeMasterSaga(this.socket, this.managers, project);
      this.props.supply({
        saga: masterSaga,
        target: this.props.target,
        initialState: initialState,
        reducer: reducer
      });
    }

    // Final cleanup after all children have unmounted.

  }, {
    key: 'teardown',
    value: function teardown() {
      this.socket.disconnect();
      this.props.teardown && this.props.teardown();
    }
  }, {
    key: 'testCode',
    value: function testCode() {
      this.props.onTestCode && this.props.onTestCode();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var conf = this.props.project.master.conf;

      // On first render we don't have this.props.state yet.
      var state = this.props.state || initialState;

      var editorPanel = React.createElement(Editor, {
        onUnmount: function onUnmount() {
          return _this4.childrenUnmountCallbacks.editor();
        },
        socket: this.socket, manager: this.managers.editor,
        filesManager: this.managers.files
      });

      var filesPanel = React.createElement(Files, {
        onUnmount: function onUnmount() {
          return _this4.childrenUnmountCallbacks.files();
        },
        socket: this.socket,
        manager: this.managers.files,
        editorManager: this.managers.editor
      });

      var reactPanel = React.createElement(HtmlPanel, {
        onUnmount: function onUnmount() {
          return _this4.childrenUnmountCallbacks.html();
        },
        url: this.socket.serverUrl + '/files' + conf.previewFile,
        iframeControl: state.renderControl,
        onTestCode: function onTestCode() {
          return _this4.testCode();
        }
      });

      return React.createElement(
        'div',
        { className: 'theme_dark' },
        React.createElement(Layout, {
          layout: {
            override: true,
            is_hidden: {},
            maximized: '',
            layout: {
              type: 'horizontal',
              parts: [{ weight: 3.0, type: 'vertical', parts: [{ weight: 5, type: 'horizontal', parts: [{ weight: 1, key: 'files', component: filesPanel }, { weight: 5, key: 'editor', component: editorPanel }] }, { weight: 4, key: 'react', component: reactPanel }] }]
            }
          }
        })
      );
    }
  }], [{
    key: 'kind',
    value: function kind() {
      return 'react';
    }
  }, {
    key: 'configurator',
    value: function configurator() {
      return ReactMasterConfigurator;
    }
  }]);

  return ReactMaster;
}(React.Component)) || _class);
export { ReactMaster as default };

var HtmlPanel = function (_React$Component2) {
  _inherits(HtmlPanel, _React$Component2);

  function HtmlPanel() {
    _classCallCheck(this, HtmlPanel);

    return _possibleConstructorReturn(this, (HtmlPanel.__proto__ || Object.getPrototypeOf(HtmlPanel)).apply(this, arguments));
  }

  _createClass(HtmlPanel, [{
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.props.onUnmount && this.props.onUnmount();
    }
  }, {
    key: 'testCode',
    value: function testCode() {
      this.props.onTestCode && this.props.onTestCode();
    }
  }, {
    key: 'frameLoad',
    value: function frameLoad(frame) {
      this.props.onFrameLoad && this.props.onFrameLoad(frame);
    }
  }, {
    key: 'toggleMaximize',
    value: function toggleMaximize() {
      this.props.onToggleMaximize && this.props.onToggleMaximize();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this6 = this;

      var frameHeight = this.props.maximized ? '100%' : 'calc(100% - 52px)';

      return React.createElement(
        'div',
        { id: this.props.id, className: 'full-height' },
        React.createElement(
          'div',
          {
            className: 'btn-transparent',
            style: { top: 10, right: 10, position: 'absolute' },
            onClick: function onClick() {
              return _this6.toggleMaximize();
            } },
          React.createElement('div', { className: 'icon-expand' })
        ),
        function () {
          if (_this6.props.url) {
            return React.createElement(ControlledFrame, {
              renderControl: _this6.props.iframeControl,
              url: _this6.props.url, className: 'previewer-iframe',
              style: { height: frameHeight },
              onLoad: function onLoad(frame) {
                return _this6.frameLoad(frame);
              }
            });
          } else {
            var testCodeText = _this6.props.testCodeText || 'Test Code';
            return React.createElement(
              'div',
              {
                style: { padding: 1 },
                className: 'meta' },
              'Click \'',
              testCodeText,
              '\' to preview your code here.'
            );
          }
        }(),
        !this.props.maximized ? React.createElement(
          'div',
          { className: 'test-code-panel' },
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this6.testCode();
              } },
            'Test Code'
          )
        ) : null
      );
    }
  }], [{
    key: 'propTypes',
    get: function get() {
      return {
        id: React.PropTypes.string,
        url: React.PropTypes.string,
        iframeControl: React.PropTypes.number,
        onTestCode: React.PropTypes.func,
        onFrameLoad: React.PropTypes.func,
        onToggleMaximize: React.PropTypes.func,
        onUnmount: React.PropTypes.func,
        testCodeActive: React.PropTypes.bool,
        testCodeText: React.PropTypes.string,
        maximized: React.PropTypes.bool
      };
    }
  }]);

  return HtmlPanel;
}(React.Component);