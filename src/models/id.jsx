import assert from './assert';

export default function makeIdClass(type) {
  return class Id {
    constructor(raw) {
      Id.validate(raw);
      this.id = raw;
      this.type = type;
    }

    static validate(raw) {
      assert(typeof raw === 'string');
    }

    serialize() {
      return this.id;
    }

    clone() {
      return new Id(this.serialize());
    }
  };
}
