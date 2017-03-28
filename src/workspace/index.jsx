import styles from './workspace.scss';
import {components, bootstrap, Socket, PanelManager} from '@udacity/web-terminal-client';

const {Terminal, Files, Editor, Layout} = components;

@cssModule(styles)
export default class Workspace extends React.Component {
  // props:
  //   supplyManagers
  //   project == project description object

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
    this.props.supplyManagers(this.socket, this.managers, this.props.project);
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
