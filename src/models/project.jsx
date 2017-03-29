import assert from './assert';
import makeIdClass from './id';

import masters from '../masters/index';

export const ProjectId = makeIdClass('ProjectId');
export const WorkspaceId = makeIdClass('WorkspaceId');

export default class Project {
  constructor(raw) {
    Project.validate(raw);
    raw = _.cloneDeep(raw);

    this.id = new ProjectId(raw.id);
    this.workspaceId = new WorkspaceId(raw.workspaceId);

    this.master = {
      Master: masters[raw.master.kind],
      conf: raw.master.conf
    };
  }

  static validate(raw) {
    assert('id' in raw);
    ProjectId.validate(raw.id);

    assert('workspaceId' in raw);
    WorkspaceId.validate(raw.workspaceId);

    assert('master' in raw && 'kind' in raw.master);
  }

  clone() {
    return new Project(this.serialize());
  }

  serialize() {
    const raw = {
      id: this.id.serialize(),
      workspaceId: this.workspaceId.serialize(),
      master: {
        kind: this.master.Master.kind(),
        conf: _.cloneDeep(this.master.conf)
      }
    };

    return raw;
  }
}
