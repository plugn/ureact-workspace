var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { makeSaga as makeMasterSaga } from './updater';
import { components, bootstrap, Socket, PanelManager } from '@udacity/web-terminal-client';
var Terminal = components.Terminal,
    Files = components.Files,
    Editor = components.Editor,
    Layout = components.Layout;

var PythonMaster = function (_React$Component) {
  _inherits(PythonMaster, _React$Component);

  function PythonMaster() {
    _classCallCheck(this, PythonMaster);

    return _possibleConstructorReturn(this, (PythonMaster.__proto__ || Object.getPrototypeOf(PythonMaster)).apply(this, arguments));
  }

  _createClass(PythonMaster, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
      bootstrap();

      // Create our managers before our child components mount
      this.managers = {
        editor: new PanelManager(),
        files: new PanelManager(),
        terminal: new PanelManager()
      };
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // After our managers are initialized, and we have the project, pass them off.
      var masterSaga = makeMasterSaga(this.socket, this.managers, this.props.project);
      this.props.supply({
        saga: masterSaga,
        target: this.props.target
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var terminalPanel = React.createElement(Terminal, { socket: this.socket, manager: this.managers.terminal });
      var editorPanel = React.createElement(Editor, {
        socket: this.socket, manager: this.managers.editor,
        filesManager: this.managers.files
      });
      var filesPanel = React.createElement(Files, {
        socket: this.socket,
        manager: this.managers.files,
        editorManager: this.managers.editor
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
              parts: [{ weight: 3.0, type: 'vertical', parts: [{ weight: 5, type: 'horizontal', parts: [{ weight: 1, key: 'files', component: filesPanel }, { weight: 5, key: 'editor', component: editorPanel }] }, { weight: 4, key: 'terminal', component: terminalPanel }] }]
            }
          }
        })
      );
    }
  }], [{
    key: 'kind',
    value: function kind() {
      return 'python';
    }
  }]);

  return PythonMaster;
}(React.Component);

export { PythonMaster as default };