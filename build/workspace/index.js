var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import styles from './workspace.scss';

var Workspace = (_dec = cssModule(styles), _dec(_class = function (_React$Component) {
  _inherits(Workspace, _React$Component);

  function Workspace() {
    _classCallCheck(this, Workspace);

    return _possibleConstructorReturn(this, (Workspace.__proto__ || Object.getPrototypeOf(Workspace)).apply(this, arguments));
  }

  _createClass(Workspace, [{
    key: 'render',
    value: function render() {
      if (!this.props.project) {
        return React.createElement(
          'h2',
          null,
          'No Project Specified!'
        );
      }

      return React.createElement(
        'div',
        { style: { position: 'relative', height: '500px', width: '600px' } },
        React.createElement(this.props.project.master.Master, {
          conf: this.props.project.master.conf,
          project: this.props.project,
          target: this.props.target,
          supply: this.props.supply,
          server: this.props.server,
          state: this.props.masterState
        })
      );
    }
  }]);

  return Workspace;
}(React.Component)) || _class);
export { Workspace as default };