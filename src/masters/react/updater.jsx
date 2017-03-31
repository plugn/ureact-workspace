import {eventChannel, delay, takeLatest, buffers} from 'redux-saga';
import {take, call, put, fork, cancelled} from 'redux-saga/effects';
import {createReducer} from 'redux-create-reducer';

const TEST_CODE = 'udacity/workspace/react/test-code';
const SET_RENDER_CONTROL = 'udacity/workspace/react/set-render-control';
const UNSAVED_CHANGES = 'udacity/workspace/react/unsaved-changes';
const ALL_CHANGES_SAVED = 'udacity/workspace/react/all-changes-saved';

export function makeSaga(socket, managers, project) {
  return function* (events, target) {
    yield fork(autoSaveSaga, {
      editor: managers.editor,
      files: managers.files,
      target
    });

    yield call(managers.editor.setOpenFiles, project.master.conf.openFiles);

    while (true) {
      const action = yield take(events);

      if (action.type === TEST_CODE) {
        yield call(managers.editor.saveAllFiles);
        const now = yield call(Date.now);
        yield put(setRenderControl(now, target));
      }
    }
  };
}

export function unsavedChanges(target) {
  return {
    type: UNSAVED_CHANGES,
    target
  };
}

export function allChangesSaved(target) {
  return {
    type: ALL_CHANGES_SAVED,
    target
  };
}

export function setRenderControl(renderControl, target) {
  return {
    type: SET_RENDER_CONTROL,
    renderControl,
    target
  };
}

export function testCode(target) {
  return {
    type: TEST_CODE,
    target
  };
}

export const initialState = {
  renderControl: Date.now(),
  changesSaved: true
};

const reducer = createReducer(initialState, {
  [SET_RENDER_CONTROL](state, action) {
    return {...state, renderControl: action.renderControl};
  },
  [ALL_CHANGES_SAVED](state) {
    return {...state, changesSaved: true};
  },
  [UNSAVED_CHANGES](state) {
    return {...state, changesSaved: false};
  }
});

export default reducer;

const fileSaveEvents = ['newFile:post', 'newFolder:post', 'copy:post', 'move:post', 'remove:post'];

function* autoSaveSaga({
  editor, files, target,
  saveHook = () => {},
  saveInterval = 10000,
  saveDelay = 1000,
  retrySpeed = saveDelay / 5
}) {
  let requestSave;
  let version = 0;
  let savedVersion = 0;

  let inputChannel = true;

  try {
    inputChannel = eventChannel(emitter => {
      // TODO: Somehow put(unsavedChanges(target)) from here
      function editMade() {
        version += 1;
        emitter({});
      }

      requestSave = editMade;

      editor.events().on('edit', editMade);

      fileSaveEvents.forEach(event =>
        files.events().on(event, editMade));

      const interval = setInterval(editMade, saveInterval);

      return () => {
        editor.events().removeListener('edit', editMade);
        clearInterval(interval);
        fileSaveEvents.forEach(
          event => files.events().removeListener(event, editMade));
      };
    }, buffers.expanding(1000));

    function* save() {
      let startVersion = version;
      try {
        yield call(editor.saveAllFiles);
        yield call(saveHook);
        savedVersion = startVersion;

        if (version === savedVersion) {
          yield put(allChangesSaved(target));
        } else {
          // Changes where made since we started saving, so try again.
          yield delay(retrySpeed);
          yield call(requestSave);
        }

      } catch (e) {
        yield delay(retrySpeed);
        yield call(requestSave);
      }
    }

    yield call(takeLatest, inputChannel, function* () {
      yield put(unsavedChanges(target));
      yield delay(saveDelay);
      yield call(save);
    });
  } finally {
    if (yield cancelled()) {
      yield call(() => inputChannel.close());
    }
  }
}
