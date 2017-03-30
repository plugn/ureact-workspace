import {call, take} from 'redux-saga/effects';

const TEARDOWN = 'udacity/workspace/python/teardown';

export default function reducer(state) {
  return state;
}

export function teardown(target) {
  return {
    type: TEARDOWN,
    target
  };
}

export function makeSaga(socket, managers, project) {
  return function* (events, target) {
    // Instead yield put setproject with target and catch it
    if (project) {
      yield call(loadProjectSaga, project, managers, target);
    }

    while (true) {
      const action = yield take(events);

      // read actions and spawn other sagas
    }
  };
}

function* loadProjectSaga(project, managers, target) {
  const {
    openFiles,
    testCommand
  } = project.master.conf;

  if (managers.editor && openFiles) {
    yield call(managers.editor.setOpenFiles, openFiles);
  }

  if (managers.terminal && testCommand) {
    yield call(runTestCommand, managers, testCommand, target);
  }
}

function* runTestCommand({terminal, editor}, command, target) {
  const termId = `${target}`;

  if (editor) {
    yield call(editor.saveAllFiles);
  }

  yield call(newTerm, terminal, termId, command);
  yield call(terminal.SelectTab, termId);
}

function newTerm(terminal, termId, command) {
  return new Promise((resolve) => {
    terminal.newTerm(termId, '/bin/bash', ['-c', command], resolve);
  });
}
