import styles from './workspace-editor.scss';

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
    let masterState = this.props.masterStates[this.props.target];

    if (masterState) {
      masterState = masterState.state;
    } else {
      masterState = null;
    }

    return (
      <div>
        <Settings
          project={this.props.project}
          onChangeProject={(p) => this.handleChangeProject(p)}
        />
        <div style={{position: 'relative', height: '500px', width: '1000px', marginTop: 20}}>
          <this.props.project.master.Master
            conf={this.props.project.master.conf}
            project={this.props.project}
            target={this.props.target}
            supply={this.props.supply}
            server={this.props.server}
            state={masterState}
          />
        </div>
      </div>
    );
  }
}
