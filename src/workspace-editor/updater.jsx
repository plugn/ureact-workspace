import {take, call, fork, race} from 'redux-saga/effects';

const SUPPLY = 'udacity/workspace/supply-managers';

export function supply(socket, managers, project) {
  return {
    type: SUPPLY,
    socket,
    managers,
    project
  };
}

export const initialState = {
  managers: {},
  socket: null
};

// Reducer is no-op for now, all actions just manipulate sagas.
//
// There is no ephemeral state that doesn't live in managers today.
function reducer(state) { return state; }

export default reducer;

export function* saga() {
  let running = null;

  while (true) {
    const supply = yield take(SUPPLY);

    if (running) {
      yield call(() => running.cancel());
    }

    running = yield fork(projectSaga, supply);
  }
}

function* projectSaga({managers, socket, project}) {
  console.log('got', project, managers, socket);
}
