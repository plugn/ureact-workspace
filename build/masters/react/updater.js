var _createReducer;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _marked = [autoSaveSaga].map(regeneratorRuntime.mark);

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { eventChannel, delay, takeLatest, buffers } from 'redux-saga';
import { take, call, put, fork, cancelled } from 'redux-saga/effects';
import { createReducer } from 'redux-create-reducer';

var TEST_CODE = 'udacity/workspace/react/test-code';
var SET_RENDER_CONTROL = 'udacity/workspace/react/set-render-control';
var UNSAVED_CHANGES = 'udacity/workspace/react/unsaved-changes';
var ALL_CHANGES_SAVED = 'udacity/workspace/react/all-changes-saved';

export function makeSaga(socket, managers, project) {
  return regeneratorRuntime.mark(function _callee(events, target) {
    var action, now;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fork(autoSaveSaga, {
              editor: managers.editor,
              files: managers.files,
              target: target
            });

          case 2:
            _context.next = 4;
            return call(managers.editor.setOpenFiles, project.master.conf.openFiles);

          case 4:
            if (!true) {
              _context.next = 18;
              break;
            }

            _context.next = 7;
            return take(events);

          case 7:
            action = _context.sent;

            if (!(action.type === TEST_CODE)) {
              _context.next = 16;
              break;
            }

            _context.next = 11;
            return call(managers.editor.saveAllFiles);

          case 11:
            _context.next = 13;
            return call(Date.now);

          case 13:
            now = _context.sent;
            _context.next = 16;
            return put(setRenderControl(now, target));

          case 16:
            _context.next = 4;
            break;

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
}

export function unsavedChanges(target) {
  return {
    type: UNSAVED_CHANGES,
    target: target
  };
}

export function allChangesSaved(target) {
  return {
    type: ALL_CHANGES_SAVED,
    target: target
  };
}

export function setRenderControl(renderControl, target) {
  return {
    type: SET_RENDER_CONTROL,
    renderControl: renderControl,
    target: target
  };
}

export function testCode(target) {
  return {
    type: TEST_CODE,
    target: target
  };
}

export var initialState = {
  renderControl: Date.now(),
  changesSaved: true
};

var reducer = createReducer(initialState, (_createReducer = {}, _defineProperty(_createReducer, SET_RENDER_CONTROL, function (state, action) {
  return _extends({}, state, { renderControl: action.renderControl });
}), _defineProperty(_createReducer, ALL_CHANGES_SAVED, function (state) {
  return _extends({}, state, { changesSaved: true });
}), _defineProperty(_createReducer, UNSAVED_CHANGES, function (state) {
  return _extends({}, state, { changesSaved: false });
}), _createReducer));

export default reducer;

var fileSaveEvents = ['newFile:post', 'newFolder:post', 'copy:post', 'move:post', 'remove:post'];

function autoSaveSaga(_ref) {
  var editor = _ref.editor,
      files = _ref.files,
      target = _ref.target,
      _ref$saveHook = _ref.saveHook,
      saveHook = _ref$saveHook === undefined ? function () {} : _ref$saveHook,
      _ref$saveInterval = _ref.saveInterval,
      saveInterval = _ref$saveInterval === undefined ? 10000 : _ref$saveInterval,
      _ref$saveDelay = _ref.saveDelay,
      saveDelay = _ref$saveDelay === undefined ? 1000 : _ref$saveDelay,
      _ref$retrySpeed = _ref.retrySpeed,
      retrySpeed = _ref$retrySpeed === undefined ? saveDelay / 5 : _ref$retrySpeed;
  var requestSave, version, savedVersion, inputChannel, save;
  return regeneratorRuntime.wrap(function autoSaveSaga$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          requestSave = void 0;
          version = 0;
          savedVersion = 0;
          inputChannel = true;
          _context4.prev = 4;
          save = regeneratorRuntime.mark(function save() {
            var startVersion;
            return regeneratorRuntime.wrap(function save$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    startVersion = version;
                    _context2.prev = 1;
                    _context2.next = 4;
                    return call(editor.saveAllFiles);

                  case 4:
                    _context2.next = 6;
                    return call(saveHook);

                  case 6:
                    savedVersion = startVersion;

                    if (!(version === savedVersion)) {
                      _context2.next = 12;
                      break;
                    }

                    _context2.next = 10;
                    return put(allChangesSaved(target));

                  case 10:
                    _context2.next = 16;
                    break;

                  case 12:
                    _context2.next = 14;
                    return delay(retrySpeed);

                  case 14:
                    _context2.next = 16;
                    return call(requestSave);

                  case 16:
                    _context2.next = 24;
                    break;

                  case 18:
                    _context2.prev = 18;
                    _context2.t0 = _context2['catch'](1);
                    _context2.next = 22;
                    return delay(retrySpeed);

                  case 22:
                    _context2.next = 24;
                    return call(requestSave);

                  case 24:
                  case 'end':
                    return _context2.stop();
                }
              }
            }, save, this, [[1, 18]]);
          });

          inputChannel = eventChannel(function (emitter) {
            // TODO: Somehow put(unsavedChanges(target)) from here
            function editMade() {
              version += 1;
              emitter({});
            }

            requestSave = editMade;

            editor.events().on('edit', editMade);

            fileSaveEvents.forEach(function (event) {
              return files.events().on(event, editMade);
            });

            var interval = setInterval(editMade, saveInterval);

            return function () {
              editor.events().removeListener('edit', editMade);
              clearInterval(interval);
              fileSaveEvents.forEach(function (event) {
                return files.events().removeListener(event, editMade);
              });
            };
          }, buffers.expanding(1000));

          _context4.next = 9;
          return call(takeLatest, inputChannel, regeneratorRuntime.mark(function _callee2() {
            return regeneratorRuntime.wrap(function _callee2$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return put(unsavedChanges(target));

                  case 2:
                    _context3.next = 4;
                    return delay(saveDelay);

                  case 4:
                    _context3.next = 6;
                    return call(save);

                  case 6:
                  case 'end':
                    return _context3.stop();
                }
              }
            }, _callee2, this);
          }));

        case 9:
          _context4.prev = 9;
          _context4.next = 12;
          return cancelled();

        case 12:
          if (!_context4.sent) {
            _context4.next = 15;
            break;
          }

          _context4.next = 15;
          return call(function () {
            return inputChannel.close();
          });

        case 15:
          return _context4.finish(9);

        case 16:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked[0], this, [[4,, 9, 16]]);
}