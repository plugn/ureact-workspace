import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  // props:
  //   supply
  //   project == Project instance

  render() {
    return (
      <this.props.project.master.Master
        conf={this.props.project.master.conf}
        project={this.props.project}
        supply={this.props.supply}
        server={this.props.server}
      />
    );
  }
}
