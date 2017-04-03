var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import assert from './assert';

export default function makeIdClass(type) {
  return function () {
    function Id(raw) {
      _classCallCheck(this, Id);

      Id.validate(raw);
      this.id = raw;
      this.type = type;
    }

    _createClass(Id, [{
      key: 'serialize',
      value: function serialize() {
        return this.id;
      }
    }, {
      key: 'clone',
      value: function clone() {
        return new Id(this.serialize());
      }
    }], [{
      key: 'validate',
      value: function validate(raw) {
        assert(typeof raw === 'string');
      }
    }]);

    return Id;
  }();
}