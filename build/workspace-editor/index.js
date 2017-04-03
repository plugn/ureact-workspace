var _dec, _class;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import styles from './workspace-editor.scss';
import Project from '../models/project';
import { components, Socket, PanelManager } from '@udacity/web-terminal-client';
var Terminal = components.Terminal,
    Layout = components.Layout;

var Settings = function (_React$Component) {
  _inherits(Settings, _React$Component);

  function Settings() {
    _classCallCheck(this, Settings);

    return _possibleConstructorReturn(this, (Settings.__proto__ || Object.getPrototypeOf(Settings)).apply(this, arguments));
  }

  _createClass(Settings, [{
    key: 'handleChangeProject',
    value: function handleChangeProject(project) {
      this.props.onChangeProject && this.props.onChangeProject(project);
    }
  }, {
    key: 'onChangeConf',
    value: function onChangeConf(conf) {
      this.handleChangeProject(_extends({}, this.props.project, {
        master: _extends({}, this.props.project.master, {
          conf: conf
        })
      }));
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var Configurator = this.props.project.master.Master.configurator();

      return React.createElement(
        'div',
        null,
        React.createElement(
          'h2',
          null,
          'Settings'
        ),
        React.createElement(Configurator, {
          conf: this.props.project.master.conf,
          onChangeConf: function onChangeConf(conf) {
            return _this2.onChangeConf(conf);
          }
        })
      );
    }
  }]);

  return Settings;
}(React.Component);

var WorkspaceEditor = (_dec = cssModule(styles), _dec(_class = function (_React$Component2) {
  _inherits(WorkspaceEditor, _React$Component2);

  function WorkspaceEditor() {
    _classCallCheck(this, WorkspaceEditor);

    return _possibleConstructorReturn(this, (WorkspaceEditor.__proto__ || Object.getPrototypeOf(WorkspaceEditor)).apply(this, arguments));
  }

  _createClass(WorkspaceEditor, [{
    key: 'handleChangeProject',
    value: function handleChangeProject(project) {
      this.props.onChangeProject && this.props.onChangeProject(project);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var devProject = new Project({
        id: 'p-1234',
        workspaceId: 'w-23428347',
        master: {
          kind: 'react',
          conf: {
            openFiles: ['/home/workspace/index.html'],
            previewFile: '/home/workspace/index.html'
          }
        }
      });

      if (!this.props.project) {
        return React.createElement(
          'h2',
          null,
          'No Project Specified!',
          React.createElement(
            'button',
            { onClick: function onClick() {
                return _this4.handleChangeProject(devProject);
              } },
            'Set default project/create new project'
          )
        );
      }

      return React.createElement(
        'div',
        null,
        React.createElement(Settings, {
          project: this.props.project,
          onChangeProject: function onChangeProject(p) {
            return _this4.handleChangeProject(p);
          }
        }),
        React.createElement(
          'div',
          { style: { position: 'relative', height: '500px', width: '600px', marginTop: 20 } },
          React.createElement(this.props.project.master.Master, {
            conf: this.props.project.master.conf,
            project: this.props.project,
            target: this.props.target,
            supply: this.props.supply,
            server: this.props.server,
            state: this.props.masterState
          })
        ),
        React.createElement(FreeTerminal, { server: this.props.server })
      );
    }
  }]);

  return WorkspaceEditor;
}(React.Component)) || _class);
export { WorkspaceEditor as default };

var FreeTerminal = function (_React$Component3) {
  _inherits(FreeTerminal, _React$Component3);

  function FreeTerminal() {
    _classCallCheck(this, FreeTerminal);

    return _possibleConstructorReturn(this, (FreeTerminal.__proto__ || Object.getPrototypeOf(FreeTerminal)).apply(this, arguments));
  }

  _createClass(FreeTerminal, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this6 = this;

      this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
      this.terminalManager = new PanelManager();

      this.terminalUnmountCallback = null;
      this.terminalUnmounted = new Promise(function (resolve) {
        return _this6.terminalUnmountCallback = resolve;
      });
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this7 = this;

      this.terminalManager.newTerm('free-shell', '/bin/bash');
      this.focusInterval = setInterval(function () {
        return _this7.terminalManager.SelectTab('free-shell');
      }, 200); // eslint-disable-line
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this8 = this;

      this.terminalUnmounted.finally(function () {
        clearInterval(_this8.focusInterval);
        _this8.socket.disconnect();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      var terminalPanel = React.createElement(Terminal, {
        onUnmount: function onUnmount() {
          return _this9.terminalUnmountCallback();
        },
        socket: this.socket,
        manager: this.terminalManager
      });

      return React.createElement(
        'div',
        { className: 'theme_dark', style: { position: 'relative', width: '600px', height: '300px' } },
        React.createElement(Layout, {
          layout: {
            override: true,
            is_hidden: {},
            maximized: '',
            layout: {
              weight: 1,
              key: 'terminal',
              component: terminalPanel
            }
          }
        })
      );
    }
  }]);

  return FreeTerminal;
}(React.Component);