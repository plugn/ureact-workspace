import React from 'react';
import {render} from  'react-dom';
import {Workspace, WorkspaceEditor} from '../src/index';

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conf: {count: 0}
    };
  }

  render() {
    return (<div>
      <Workspace conf={this.state.conf}/>
      <WorkspaceEditor conf={this.state.conf} onChange={(conf) => this.setState({conf})}/>
    </div>);
  }
}

render(
  <Demo/>
, document.getElementById('app'));
