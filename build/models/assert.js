function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import ExtensibleError from 'es6-error';

export var AssertionError = function (_ExtensibleError) {
  _inherits(AssertionError, _ExtensibleError);

  function AssertionError() {
    _classCallCheck(this, AssertionError);

    // Generate a better message
    var stack = new Error().stack;
    var line = stack.split('\n').map(function (s) {
      return s.trim();
    })[3];
    var location = line.split(' ')[1];

    // Load it into super.
    var message = 'Assertion Error at ' + location;
    return _possibleConstructorReturn(this, (AssertionError.__proto__ || Object.getPrototypeOf(AssertionError)).call(this, message));
  }

  return AssertionError;
}(ExtensibleError);

export default function assert(condition, message) {
  if (!condition) {
    throw new AssertionError(message);
  }
}