import {takeEvery} from 'redux-saga';
import {actionChannel, fork, cancel, call} from 'redux-saga/effects';
import uuid from 'uuid';

const SUPPLY = 'udacity/workspace/supply-master';

export function supply({saga, predicate, target}) {
  if (!target) { target = uuid.v4(); }
  if (!predicate) { predicate = () => true; }

  return {
    type: SUPPLY,
    target,
    saga,
    predicate
  };
}

// Reducer is no-op for now, all actions just manipulate sagas.
//
// There is no ephemeral state that doesn't live in managers today.
function reducer(state) { return state; }

export const initialState = {};
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
