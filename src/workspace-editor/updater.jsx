import {take, call, fork, race} from 'redux-saga/effects';

const SUPPLY_MANAGERS = 'udacity/workspace/supply-managers';
const SUPPLY_PROJECT = 'udacity/workspace/supply-project';

export function supplyManagers(socket, managers) {
  return {
    type: SUPPLY_MANAGERS,
    socket,
    managers
  };
}

export function supplyProject(project) {
  return {
    type: SUPPLY_PROJECT,
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
function reducer(state = initialState) { return state; }

export default reducer;

export function* saga() {
  // when we get managers, start other sagas, cancel them if we get another
  let state = null;

  while (true) {
    const supply = yield take(SUPPLY_MANAGERS);

    if (state) {
      state.forEach(task => task.cancel());
    }

    state = [
      yield fork(editorSaga, supply.editor),
      yield fork(terminalSaga, supply.terminal),
      yield fork(filesSaga, supply.files)
    ];
  }
}

function* editorSaga(editorManager) {
  if (!editorManager) {
    return null; // Editor saga not needed
  }

  while (true) {
    const {
      setOpenFiles
    } = yield race({
      setOpenFiles: take(SET_OPEN_FILES)
    });

    if (setOpenFiles) {
      yield call(() => editorManager.setOpenFiles(setOpenFiles.files));
    }
  }
}

function* terminalSaga(terminalManager) {

}

function* filesSaga(filesManager) {

}

