import React from 'react';
import reducer, {
  initialState,
  makeSaga as makeMasterSaga,
  testCode
} from './updater';
import {components, bootstrap, Socket, PanelManager} from '@udacity/web-terminal-client';
const {Files, Editor, Layout} = components;
import {ControlledFrame} from './frame';
import {connect} from 'react-redux';

@connect(null, {onTestCode: testCode})
export default class ReactMaster extends React.Component {
  static kind() {
    return 'react';
  }

  componentWillMount() {
    this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
    bootstrap();

    // Create our managers before our child components mount
    this.managers = {
      editor: new PanelManager(),
      files: new PanelManager()
    };
  }

  componentDidMount() {
    // After our managers are initialized, and we have the project, pass them off.
    const masterSaga = makeMasterSaga(this.socket, this.managers, this.props.project);
    this.props.supply({
      saga: masterSaga,
      target: this.props.target,
      initialState,
      reducer
    });
  }

  testCode() {
    this.props.onTestCode && this.props.onTestCode(this.props.target);
  }

  render() {
    const conf = this.props.project.master.conf;

    // On first render we don't have this.props.state yet.
    const state = this.props.state || initialState;

    const editorPanel = (
      <Editor
        socket={this.socket} manager={this.managers.editor}
        filesManager={this.managers.files}
      />);

    const filesPanel = (
      <Files
        socket={this.socket}
        manager={this.managers.files}
        editorManager={this.managers.editor}
      />);

    const reactPanel = (
      <HtmlPanel
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
      testCodeActive: React.PropTypes.bool,
      testCodeText: React.PropTypes.string,
      maximized: React.PropTypes.bool
    };
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
