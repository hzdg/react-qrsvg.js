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
    const {modules} = qr(this.props.children, opts);
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

  renderModules(modules) {
    const ModuleComponent = this.props.module;
    return modules.reduce((blocks, row, x) => {
      row.forEach((value, y) => {
        blocks.push(<ModuleComponent value={value} x={x} y={y} />);
      });
      return blocks;
    }, []);
  }
}
