import React from 'react';
import {render} from  'react-dom';
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {fork} from 'redux-saga/effects';
import {createLogger} from 'redux-logger';
import {connect, Provider} from 'react-redux';

import {Workspace, WorkspaceEditor} from '../src/index';
import Project from '../src/models/project';

import workspaceApp, {
  saga as workspaceSaga,
  initialState as workspaceInitialState,
  supply
} from '../src/workspace/updater';

import workspaceEditorApp, {
  saga as workspaceEditorSaga,
  initialState as workspaceEditorInitialState
} from '../src/workspace-editor/updater';

const ConnectedWorkspace = connect(
  ({project, workspace}) => ({project, masterStates: workspace}),
  {supply})(Workspace);

const ConnectedWorkspaceEditor = connect()(WorkspaceEditor);

const devProject = new Project({
  id: 'p-1234',
  workspaceId: 'w-23428347',
  master: {
    kind: 'react',
    conf: {
      openFiles: ['/home/student_files/index.html'],
      previewFile: '/home/student_files/index.html'
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
      workspace: workspaceInitialState,
      editor: workspaceEditorInitialState,
      project: devProject
    };

    const app = combineReducers({
      workspace: workspaceApp,
      editor: workspaceEditorApp,
      project: (state = defaultState.project) => state
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
      yield fork(workspaceSaga);
      yield fork(workspaceEditorSaga);
    });

    this.setState({store});
  }

  render() {
    if (!this.state.store) { return null; }

    return (<Provider store={this.state.store}>
      <div>
        <ConnectedWorkspace target='workspace-1' server={'http://dev.udacity.com:8282'}/>
        <ConnectedWorkspaceEditor conf={this.state.conf} onChange={(conf) => this.setState({conf})}/>
      </div>
    </Provider>);
  }
}

render(
  <Demo/>
, document.getElementById('app'));
