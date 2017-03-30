import React from 'react';

export default class Frame extends React.Component {
  static get propTypes() {
    return {
      className: React.PropTypes.string,
      style: React.PropTypes.object,
      url: React.PropTypes.string.isRequired,
      onLoad: React.PropTypes.func
    };
  }

  onLoad() {
    this.props.onLoad && this.props.onLoad(this.frame);
  }

  render() {
    return (
      <iframe
        ref={(frame) => this.frame = frame}
        style={this.props.style}
        src={this.props.url}
        className={this.props.className}
        onLoad={() => this.onLoad()}
      />
    );
  }
}

export class ControlledFrame extends React.Component {
  static get propTypes() {
    return {
      renderControl: React.PropTypes.number,
      ...Frame.propTypes
    };
  }

  render() {
    const url = `${this.props.url}?v=${this.props.renderControl}`;
    return <Frame key={this.props.renderControl} {...this.props} url={url}/>;
  }
}
