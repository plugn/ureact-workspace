import React from 'react';
import reducer, {
  initialState,
  makeSaga as makeMasterSaga,
  testCode
} from './updater';
import {components, bootstrap, Socket, PanelManager} from '@udacity/web-terminal-client';
const {Files, Editor, Layout} = components;
import {ControlledFrame} from './frame';
import ReactMasterConfigurator from './configurator.jsx';
import {connect} from 'react-redux';

@connect(null, (dispatch, {target}) => ({onTestCode: () => testCode(target)}))
export default class ReactMaster extends React.Component {
  static kind() {
    return 'react';
  }

  static configurator() {
    return ReactMasterConfigurator;
  }

  componentWillMount() {
    this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
    bootstrap();

    // Create our managers before our child components mount
    this.managers = {
      editor: new PanelManager(),
      files: new PanelManager()
    };

    // Horribly annoying hack to deal with the lack of componentDidUnmount
    //
    // We have to disconnect the socket we created, but can only do it *after* unmounting
    // and cleaning up children. componentWillUnmount runs parent first, so we can't use
    // it for this purpose.
    this.childrenUnmountCallbacks = {};
    this.childrenUnmount = [
      new Promise(resolve => this.childrenUnmountCallbacks.editor = resolve),
      new Promise(resolve => this.childrenUnmountCallbacks.files = resolve),
      new Promise(resolve => this.childrenUnmountCallbacks.html = resolve)
    ];
  }

  componentDidMount() {
    this.startProject(this.props.project);
  }

  componentWillReceiveProps(newProps) {
    this.startProject(newProps.project);
  }

  componentWillUnmount() {
    Promise.all(this.childrenUnmount).finally(() => this.teardown());
  }

  startProject(project) {
    // After our managers are initialized, and we have the project, pass them off.
    const masterSaga = makeMasterSaga(this.socket, this.managers, project);
    this.props.supply({
      saga: masterSaga,
      target: this.props.target,
      initialState,
      reducer
    });
  }

  // Final cleanup after all children have unmounted.
  teardown() {
    this.socket.disconnect();
    this.props.teardown && this.props.teardown();
  }

  testCode() {
    this.props.onTestCode && this.props.onTestCode();
  }

  render() {
    const conf = this.props.project.master.conf;

    // On first render we don't have this.props.state yet.
    const state = this.props.state || initialState;

    const editorPanel = (
      <Editor
        onUnmount={() => this.childrenUnmountCallbacks.editor()}
        socket={this.socket} manager={this.managers.editor}
        filesManager={this.managers.files}
      />);

    const filesPanel = (
      <Files
        onUnmount={() => this.childrenUnmountCallbacks.files()}
        socket={this.socket}
        manager={this.managers.files}
        editorManager={this.managers.editor}
      />);

    const reactPanel = (
      <HtmlPanel
        onUnmount={() => this.childrenUnmountCallbacks.html()}
        url={this.socket.serverUrl + '/files' + conf.previewFile}
        iframeControl={state.renderControl}
        onTestCode={() => this.testCode()}
      />
    );

    return (
      <div className='theme_dark'>
      <Layout
        layout={{
          override: true,
          is_hidden: {},
          maximized: '',
          layout: {
            type: 'horizontal',
            parts: [
              {weight: 3.0, type: 'vertical', parts: [
                {weight: 5, type: 'horizontal', parts: [
                  {weight: 1, key: 'files', component: filesPanel},
                  {weight: 5, key: 'editor', component: editorPanel}
                ]},
                {weight: 4, key: 'react', component: reactPanel}
              ]}
            ]
          }
        }}
      />
        </div>
    );
  }
}

class HtmlPanel extends React.Component {
  static get propTypes() {
    return {
      id: React.PropTypes.string,
      url: React.PropTypes.string,
      iframeControl: React.PropTypes.number,
      onTestCode: React.PropTypes.func,
      onFrameLoad: React.PropTypes.func,
      onToggleMaximize: React.PropTypes.func,
      onUnmount: React.PropTypes.func,
      testCodeActive: React.PropTypes.bool,
      testCodeText: React.PropTypes.string,
      maximized: React.PropTypes.bool
    };
  }

  componentWillUnmount() {
    this.props.onUnmount && this.props.onUnmount();
  }

  testCode() {
    this.props.onTestCode && this.props.onTestCode();
  }

  frameLoad(frame) {
    this.props.onFrameLoad && this.props.onFrameLoad(frame);
  }

  toggleMaximize() {
    this.props.onToggleMaximize && this.props.onToggleMaximize();
  }

  render() {
    const frameHeight = this.props.maximized ? '100%' : 'calc(100% - 52px)';

    return (<div id={this.props.id} className='full-height'>
          <div
            className='btn-transparent'
            style={{top: 10, right: 10, position: 'absolute'}}
            onClick={() => this.toggleMaximize()}>
            <div className='icon-expand'/>
          </div>
          {(() => {
            if (this.props.url) {
              return (
                <ControlledFrame
                  renderControl={this.props.iframeControl}
                  url={this.props.url} className='previewer-iframe'
                  style={{height: frameHeight}}
                  onLoad={(frame) => this.frameLoad(frame)}
                />
              );
            } else {
              const testCodeText = this.props.testCodeText || 'Test Code';
              return (
                <div
                  style={{padding: 1}}
                  className='meta'>Click '{testCodeText}' to preview your code here.
                </div>);
            }
          })()}
      {!this.props.maximized ? <div className='test-code-panel'>
                   <button onClick={() => this.testCode()}>
                     Test Code
                   </button>
      </div> : null}
    </div>);
  }
}
