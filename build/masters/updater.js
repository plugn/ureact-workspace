var _marked = [saga].map(regeneratorRuntime.mark);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { takeEvery } from 'redux-saga';
import { actionChannel, fork, cancel, call } from 'redux-saga/effects';
import uuid from 'uuid';

var SUPPLY = 'udacity/workspace/supply-master';

export function supply(_ref) {
  var saga = _ref.saga,
      predicate = _ref.predicate,
      reducer = _ref.reducer,
      initialState = _ref.initialState,
      target = _ref.target;

  if (!target) {
    target = uuid.v4();
  }
  if (!predicate) {
    predicate = function predicate() {
      return true;
    };
  }

  return {
    type: SUPPLY,
    target: target,
    saga: saga,
    reducer: reducer,
    initialState: initialState,
    predicate: predicate
  };
}

export function getState(state, target) {
  return state[target] && state[target].state;
}

export var initialState = {};

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments[1];

  if (action.type === SUPPLY) {
    if (!state[action.target]) {
      return Object.assign({}, state, _defineProperty({}, action.target, {
        reducer: action.reducer || function (state) {
          return state;
        },
        state: action.initialState || null
      }));
    } else {
      var newState = Object.assign({}, state[action.target]);

      // Load new reducer
      if (action.reducer) {
        newState.reducer = action.reducer;
      }

      // Reset state
      if (action.initialState) {
        newState.state = action.initialState;
      }

      return Object.assign({}, state, _defineProperty({}, action.target, Object.assign({}, state[action.target], newState)));
    }
  } else if (action.target && state[action.target]) {
    return Object.assign({}, state, _defineProperty({}, action.target, Object.assign({}, state[action.target], {
      state: state[action.target].reducer(state[action.target].state, action) })));
  } else {
    return state;
  }
}

export default reducer;

export function saga() {
  var running;
  return regeneratorRuntime.wrap(function saga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          running = {};
          _context2.next = 3;
          return takeEvery(SUPPLY, regeneratorRuntime.mark(function _callee(supply) {
            var _running$supply$targe, task, channel, eventChannel;

            return regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!running[supply.target]) {
                      _context.next = 7;
                      break;
                    }

                    _running$supply$targe = running[supply.target], task = _running$supply$targe.task, channel = _running$supply$targe.channel;
                    _context.next = 4;
                    return cancel(task);

                  case 4:
                    _context.next = 6;
                    return call(function () {
                      return channel.close();
                    });

                  case 6:
                    delete running[supply.target];

                  case 7:
                    _context.next = 9;
                    return actionChannel(function (action) {
                      return action.target && action.target === supply.target && supply.predicate(action);
                    });

                  case 9:
                    eventChannel = _context.sent;
                    _context.next = 12;
                    return fork(supply.saga, eventChannel, supply.target);

                  case 12:
                    _context.t0 = _context.sent;
                    _context.t1 = eventChannel;
                    running[supply.target] = {
                      task: _context.t0,
                      channel: _context.t1
                    };

                  case 15:
                  case 'end':
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

        case 3:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[0], this);
}