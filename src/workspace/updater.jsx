import {takeEvery} from 'redux-saga';
import {actionChannel, fork, cancel, call} from 'redux-saga/effects';
import uuid from 'uuid';

const SUPPLY = 'udacity/workspace/supply-master';

export function supply({saga, predicate, reducer, initialState, target}) {
  if (!target) { target = uuid.v4(); }
  if (!predicate) { predicate = () => true; }

  return {
    type: SUPPLY,
    target,
    saga,
    reducer,
    initialState,
    predicate
  };
}

export const initialState = {};

function reducer(state = initialState, action) {
  if (action.type === SUPPLY) {
    if (!state[action.target]) {
      return Object.assign({}, state, {
        [action.target]: {
          reducer: action.reducer || ((state) => state),
          state: action.initialState || null
        }
      });
    } else {
      const newState = Object.assign({}, state[action.target]);

      // Load new reducer
      if (action.reducer) {
        newState.reducer = action.reducer;
      }

      // Reset state
      if (action.initialState) {
        newState.state = action.initialState;
      }

      return Object.assign({}, state, {
        [action.target]: Object.assign({}, state[action.target], newState)
      });
    }
  } else if (action.target && state[action.target]) {
    return Object.assign(
      {},
      state,
      {[action.target]: Object.assign({}, state[action.target], {
        state: state[action.target].reducer(
          state[action.target].state,
          action
        )})
      });
  } else {
    return state;
  }
}

export default reducer;

export function* saga() {
  let running = {};

  yield takeEvery(SUPPLY, function* (supply) {
    // If we already have something under that target, restart it.
    if (running[supply.target]) {
      const {task, channel} = running[supply.target];
      yield cancel(task);
      yield call(() => channel.close());
      delete running[supply.target];
    }

    // Get a channel for this saga.
    const eventChannel = yield actionChannel(
      (action) => action.target && action.target === supply.target && supply.predicate(action));

    running[supply.target] = {
      task: yield fork(supply.saga, eventChannel, supply.target),
      channel: eventChannel
    };
  });
}
