import styles from './workspace.scss';

@cssModule(styles)
export default class Workspace extends React.Component {
  render() {
    return (
      <div styleName='container'>
        Hello, I'm a Workspace
      </div>
    );
  }
}
