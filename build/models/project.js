var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import assert from './assert';
import makeIdClass from './id';

import masters from '../masters/index';

export var ProjectId = makeIdClass('ProjectId');
export var WorkspaceId = makeIdClass('WorkspaceId');

var Project = function () {
  function Project(raw) {
    _classCallCheck(this, Project);

    Project.validate(raw);
    raw = _.cloneDeep(raw);

    this.id = new ProjectId(raw.id);
    this.workspaceId = new WorkspaceId(raw.workspaceId);

    this.master = {
      Master: masters[raw.master.kind],
      conf: raw.master.conf
    };
  }

  _createClass(Project, [{
    key: 'clone',
    value: function clone() {
      return new Project(this.serialize());
    }
  }, {
    key: 'serialize',
    value: function serialize() {
      var raw = {
        id: this.id.serialize(),
        workspaceId: this.workspaceId.serialize(),
        master: {
          kind: this.master.Master.kind(),
          conf: _.cloneDeep(this.master.conf)
        }
      };

      return raw;
    }
  }], [{
    key: 'validate',
    value: function validate(raw) {
      assert('id' in raw);
      ProjectId.validate(raw.id);

      assert('workspaceId' in raw);
      WorkspaceId.validate(raw.workspaceId);

      assert('master' in raw && 'kind' in raw.master);
    }
  }]);

  return Project;
}();

export { Project as default };