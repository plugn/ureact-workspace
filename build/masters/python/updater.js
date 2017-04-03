var _marked = [loadProjectSaga, runTestCommand].map(regeneratorRuntime.mark);

import { call, take } from 'redux-saga/effects';

var TEARDOWN = 'udacity/workspace/python/teardown';

export default function reducer(state) {
  return state;
}

export function teardown(target) {
  return {
    type: TEARDOWN,
    target: target
  };
}

export function makeSaga(socket, managers, project) {
  return regeneratorRuntime.mark(function _callee(events, target) {
    var action;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!project) {
              _context.next = 3;
              break;
            }

            _context.next = 3;
            return call(loadProjectSaga, project, managers, target);

          case 3:
            if (!true) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return take(events);

          case 6:
            action = _context.sent;
            _context.next = 3;
            break;

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  });
}

function loadProjectSaga(project, managers, target) {
  var _project$master$conf, openFiles, testCommand;

  return regeneratorRuntime.wrap(function loadProjectSaga$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _project$master$conf = project.master.conf, openFiles = _project$master$conf.openFiles, testCommand = _project$master$conf.testCommand;

          if (!(managers.editor && openFiles)) {
            _context2.next = 4;
            break;
          }

          _context2.next = 4;
          return call(managers.editor.setOpenFiles, openFiles);

        case 4:
          if (!(managers.terminal && testCommand)) {
            _context2.next = 7;
            break;
          }

          _context2.next = 7;
          return call(runTestCommand, managers, testCommand, target);

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked[0], this);
}

function runTestCommand(_ref, command, target) {
  var terminal = _ref.terminal,
      editor = _ref.editor;
  var termId;
  return regeneratorRuntime.wrap(function runTestCommand$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          termId = '' + target;

          if (!editor) {
            _context3.next = 4;
            break;
          }

          _context3.next = 4;
          return call(editor.saveAllFiles);

        case 4:
          _context3.next = 6;
          return call(newTerm, terminal, termId, command);

        case 6:
          _context3.next = 8;
          return call(terminal.SelectTab, termId);

        case 8:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked[1], this);
}

function newTerm(terminal, termId, command) {
  return new Promise(function (resolve) {
    terminal.newTerm(termId, '/bin/bash', ['-c', command], resolve);
  });
}