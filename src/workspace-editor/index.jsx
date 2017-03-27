import styles from './workspace-editor.scss';

@cssModule(styles)
export default class WorkspaceEditor extends React.Component {
  render() {
    return (
      <div styleName='container'>
        Hello, I'm a Workspace Editor

        <button onClick={() => this.props.onChange({count: this.props.conf.count + 1})}>Change conf!</button>
      </div>
    );
  }
}
