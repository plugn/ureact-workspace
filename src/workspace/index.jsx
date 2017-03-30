import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  // props:
  //   supply
  //   project == Project instance

  render() {
    let masterState = this.props.masterStates[this.props.target];

    if (masterState) {
      masterState = masterState.state;
    } else {
      masterState = null;
    }

    return (
      <this.props.project.master.Master
        conf={this.props.project.master.conf}
        project={this.props.project}
        target={this.props.target}
        supply={this.props.supply}
        server={this.props.server}
        state={masterState}
      />
    );
  }
}
