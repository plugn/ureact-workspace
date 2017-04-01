import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  render() {
    if (!this.props.project) {
      return <h2>No Project Specified!</h2>;
    }

    return (
      <div style={{position: 'relative', height: '500px', width: '1000px'}}>
        <this.props.project.master.Master
          conf={this.props.project.master.conf}
          project={this.props.project}
          target={this.props.target}
          supply={this.props.supply}
          server={this.props.server}
          state={this.props.master}
        />
      </div>
    );
  }
}
