import React from 'react';
import {render} from  'react-dom';
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {fork} from 'redux-saga/effects';
import {createLogger} from 'redux-logger';
import {connect, Provider} from 'react-redux';

import {Workspace, WorkspaceEditor} from '../src/index';
import Project from '../src/models/project';

import masterApp, {
  saga as masterSaga,
  initialState as masterInitialState,
  supply, getState
} from '../src/masters/updater';

import workspaceEditorApp, {
  saga as workspaceEditorSaga,
  initialState as workspaceEditorInitialState,
  getProject, setProject
} from '../src/workspace-editor/updater';

const ConnectedWorkspace = connect(
  ({editor, master}) => ({editorStates: editor, masterStates: master}),
  (dispatch, ownProps) => {
    return {
      supply: (opts) =>
        dispatch(supply({
          target: ownProps.target,
          ...opts
        }))
    };
  },
  ({editorStates, masterStates}, dispatchProps, ownProps) => {
    return {
      ...dispatchProps,
      ...ownProps,
      project: getProject(editorStates, 'workspace-editor'),
      masterState: getState(masterStates, ownProps.target)
    };
  })(Workspace);

const ConnectedWorkspaceEditor = connect(
  ({editor, master}) => ({editorStates: editor, masterStates: master}),
  (dispatch, ownProps) => {
    return {
      supply: (opts) =>
        dispatch(supply({
          target: ownProps.target,
          ...opts
        })),
      onChangeProject: (project) =>
        dispatch(setProject(project, ownProps.target))
    };
  },
  ({editorStates, masterStates}, dispatchProps, ownProps) => {
    return {
      ...dispatchProps,
      ...ownProps,
      project: getProject(editorStates, ownProps.target),
      masterState: getState(masterStates, ownProps.target)
    };
  })(WorkspaceEditor);

const devProject = new Project({
  id: 'p-1234',
  workspaceId: 'w-23428347',
  master: {
    kind: 'react',
    conf: {
      openFiles: ['/home/workspace/index.html'],
      previewFile: '/home/workspace/index.html'
    }
  }
});

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      store: null
    };
  }

  componentDidMount() {
    this.createStore();
  }

  createStore() {
    const id = x => x;
    const devtools = window.devToolsExtension
                   ? window.devToolsExtension({name: 'workspace-demo'})
                   : id;

    const sagaMiddleware = createSagaMiddleware();

    const defaultState = {
      master: masterInitialState,
      editor: workspaceEditorInitialState
    };

    const app = combineReducers({
      master: masterApp,
      editor: workspaceEditorApp
    });

    const store = createStore(
      app,
      defaultState,
      compose(
        applyMiddleware(sagaMiddleware, createLogger()),
        devtools
      )
      );

    sagaMiddleware.run(function* () {
      yield fork(masterSaga);
      yield fork(workspaceEditorSaga);
    });

    this.setState({store});
  }

  render() {
    if (!this.state.store) { return null; }

    return (<Provider store={this.state.store}>
      <div>
        <ConnectedWorkspace target='workspace-view' server={'http://dev.udacity.com:8282'}/>
        <ConnectedWorkspaceEditor target='workspace-editor' server={'http://dev.udacity.com:8282'}/>
        <button
          onClick={() => this.state.store.dispatch(setProject(devProject, 'workspace-editor'))}>Set default project</button>
      </div>
    </Provider>);
  }
}

render(
  <Demo/>
, document.getElementById('app'));
