import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  render() {
    let masterState = this.props.masterStates[this.props.target];

    if (masterState) {
      masterState = masterState.state;
    } else {
      masterState = null;
    }

    return (
      <div style={{position: 'relative', height: '500px', width: '1000px'}}>
        <this.props.project.master.Master
          conf={this.props.project.master.conf}
          project={this.props.project}
          target={this.props.target}
          supply={this.props.supply}
          server={this.props.server}
          state={masterState}
        />
      </div>
    );
  }
}
