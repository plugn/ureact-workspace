var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _marked = [saga].map(regeneratorRuntime.mark);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { createReducer } from 'redux-create-reducer';

var SET_PROJECT = 'udacity/workspace-editor/set-project';

export var initialState = {};

export function getProject(state, target) {
  return state[target] && state[target].project;
}

export function setProject(project, target) {
  return {
    type: SET_PROJECT,
    target: target,
    project: project
  };
}

var reducer = createReducer(initialState, _defineProperty({}, SET_PROJECT, function (state, _ref) {
  var project = _ref.project,
      target = _ref.target;

  return _extends({}, state, _defineProperty({}, target, _extends({}, state[target], { project: project })));
}));

export default reducer;

export function saga() {
  return regeneratorRuntime.wrap(function saga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}