import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  render() {
    return (
      <div styleName='container'>
        Hello, I'm a Workspace with conf = {JSON.stringify(this.props.conf)}
      </div>
    );
  }
}
