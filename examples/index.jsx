import React from 'react';
import {render} from  'react-dom';
import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {fork} from 'redux-saga/effects';
import {createLogger} from 'redux-logger';
import {connect, Provider} from 'react-redux';

import {Workspace, WorkspaceEditor} from '../src/index';

import masterApp, {
  saga as masterSaga,
  initialState as masterInitialState,
  supply
} from '../src/masters/updater';

import workspaceEditorApp, {
  saga as workspaceEditorSaga,
  initialState as workspaceEditorInitialState,
  getProject, setProject
} from '../src/workspace-editor/updater';

const ConnectedWorkspace = connect(
  ({editor, master}) => ({project: getProject(editor), masterStates: master}),
  {supply})(Workspace);

const ConnectedWorkspaceEditor = connect(
  ({editor, master}) => ({project: getProject(editor), masterStates: master}),
  {supply, onChangeProject: setProject})(WorkspaceEditor);

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
        <ConnectedWorkspace target='workspace-1' server={'http://dev.udacity.com:8282'}/>
        <ConnectedWorkspaceEditor target='workspace-2' server={'http://dev.udacity.com:8282'}/>
      </div>
    </Provider>);
  }
}

render(
  <Demo/>
, document.getElementById('app'));
