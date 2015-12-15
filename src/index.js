import React, {PropTypes} from 'react';
import qr from 'qr.js';
import omit from 'lodash.omit';


class Module extends React.Component {
  static propTypes = {
    value: PropTypes.bool.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }

  render() {
    if (!this.props.value) return null; // Don't render anything for empty modules.
    return <rect x={this.props.x} y={this.props.y} width="1" height="1" />;
  }
}

export default class QrSvg extends React.Component {

  static propTypes = {
    children: PropTypes.string.isRequired,
    size: PropTypes.number,
    module: PropTypes.func,
  }

  static defaultProps = {
    module: Module,
  }

  render() {
    const opts = omit(this.props, ['size', 'children', 'module']);
    const {modules} = qr(this.props.children, {opts});
    return (
      <svg
        style={{display: 'block'}}
        width={this.props.size}
        height={this.props.size}
        viewBox={`0 0 ${modules.length} ${modules.length}`}
      >
        {this.renderModules(modules)}
      </svg>
    );
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.children !== this.props.children) return true;
    if (nextProps.size !== this.props.size) return true;
    if (nextProps.module !== this.props.module) return true;
    return false;
  }

  renderModules(modules) {
    // React performs worst when rendering a long list of items, so we'll group
    // them by row. This could probably be smarter.
    return modules.map((row, y) => (
      <g key={`${this.props.children}--${y}`}>{this.renderRow(row, y)}</g>
    ));
  }

  renderRow(row, y) {
    const ModuleComponent = this.props.module;
    return row.map((value, x) => (
      <ModuleComponent key={`${x}--${y}`} value={value} x={x} y={y} />
    ));
  }
}
