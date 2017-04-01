import styles from './workspace-editor.scss';
import Project from '../models/project';
import {components, Socket, PanelManager} from '@udacity/web-terminal-client';
const {Terminal, Layout} = components;

class Settings extends React.Component {
  handleChangeProject(project) {
    this.props.onChangeProject && this.props.onChangeProject(project);
  }

  onChangeConf(conf) {
    this.handleChangeProject({
      ...this.props.project,
      master: {
        ...this.props.project.master,
        conf
      }
    });
  }

  render() {
    const Configurator = this.props.project.master.Master.configurator();

    return (<div>
      <h2>Settings</h2>
      <Configurator
        conf={this.props.project.master.conf}
        onChangeConf={(conf) => this.onChangeConf(conf)}
      />
    </div>);
  }
}

@cssModule(styles)
export default class WorkspaceEditor extends React.Component {
  handleChangeProject(project) {
    this.props.onChangeProject && this.props.onChangeProject(project);
  }

  render() {
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

    if (!this.props.project) {
      return (<h2>
        No Project Specified!
        {/* TODO: Create dialogue for initial creation of project. */}
        <button onClick={() => this.handleChangeProject(devProject)}>Set default project/create new project</button>
      </h2>);
    }

    return (
      <div>
        <Settings
          project={this.props.project}
          onChangeProject={(p) => this.handleChangeProject(p)}
        />
        <div style={{position: 'relative', height: '500px', width: '600px', marginTop: 20}}>
          <this.props.project.master.Master
            conf={this.props.project.master.conf}
            project={this.props.project}
            target={this.props.target}
            supply={this.props.supply}
            server={this.props.server}
            state={this.props.masterState}
          />
        </div>
        <FreeTerminal server={this.props.server}/>
      </div>
    );
  }
}

class FreeTerminal extends React.Component {
  componentWillMount() {
    this.socket = new Socket(this.props.server, 'username'); // TODO: Add username prop
    this.terminalManager = new PanelManager();

    this.terminalUnmountCallback = null;
    this.terminalUnmounted = new Promise(resolve => this.terminalUnmountCallback = resolve);

  }

  componentDidMount() {
    this.terminalManager.newTerm('free-shell', '/bin/bash');
    this.focusInterval = setInterval(() =>
      this.terminalManager.SelectTab('free-shell'), 200); // eslint-disable-line
  }

  componentWillUnmount() {
    this.terminalUnmounted.finally(() => {
      clearInterval(this.focusInterval);
      this.socket.disconnect();
    });
  }

  render() {
    const terminalPanel = (
      <Terminal
        onUnmount={() => this.terminalUnmountCallback()}
        socket={this.socket}
        manager={this.terminalManager}
      />
    );

    return (
      <div style={{position: 'relative', width: '600px', height: '300px'}}>
        <Layout
          layout={{
            override: true,
            is_hidden: {},
            maximized: '',
            layout: {
              weight: 1,
              key: 'terminal',
              component: terminalPanel
            }
          }}
        />
      </div>
    );
  }
}
