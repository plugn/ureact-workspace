import React from 'react';

export default class ReactMasterConfigurator extends React.Component {
  onChangePreviewFile(preview) {
    this.props.onChangeConf && this.props.onChangeConf({
      ...this.props.conf,
      previewFile: preview
    });
  }

  onChangeOpenFiles(openFiles) {
    openFiles = JSON.parse(openFiles);

    this.props.onChangeConf && this.props.onChangeConf({
      ...this.props.conf,
      openFiles
    });
  }

  render() {
    return (<div>
      <h2>Configurator</h2>
      <label htmlFor='react-master-config-previewFile'>Preview File</label>
      <input
        type='text'
        id='react-master-config-previewFile'
        value={this.props.conf.previewFile}
        onChange={(e) => this.onChangePreviewFile(e.target.value)}
      />
      <br/>
      <label htmlFor='react-master-config-previewFile'>Open Files</label>
      <textarea
        style={{width: '500px'}}
        id='react-master-config-previewFile'
        value={JSON.stringify(this.props.conf.openFiles, null, 2)}
        onChange={(e) => this.onChangeOpenFiles(e.target.value)}
      />
    </div>);
  }
}
