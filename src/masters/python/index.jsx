import React from 'react';
import {makeSaga as makeMasterSaga} from './updater';
import {components, bootstrap, Socket, PanelManager} from '@udacity/web-terminal-client';
const {Terminal, Files, Editor, Layout} = components;

export default class PythonMaster extends React.Component {
  static kind() {
    return 'python';
  }

  componentWillMount() {
    this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
    bootstrap();

    // Create our managers before our child components mount
    this.managers = {
      editor: new PanelManager(),
      files: new PanelManager(),
      terminal: new PanelManager()
    };
  }

  componentDidMount() {
    // After our managers are initialized, and we have the project, pass them off.
    const masterSaga = makeMasterSaga(this.socket, this.managers, this.props.project);
    this.props.supply({
      saga: masterSaga,
      target: this.props.target
    });
  }

  render() {
    const terminalPanel = <Terminal socket={this.socket} manager={this.managers.terminal}/>;
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
                  {weight: 4, key: 'terminal', component: terminalPanel}
                ]}
              ]
            }
          }}
        />
      </div>
    );
  }
}

