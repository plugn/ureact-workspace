import styles from './ureact-package-boilerplate.scss';

@cssModule(styles)
export default class UreactPackageBoilerplate extends React.Component {
  render() {
    return (
      <div styleName='container'>
        Hello, I'm ureact-package-boilerplate
      </div>
    );
  }
}