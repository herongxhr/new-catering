import React from 'react'
import { Icon } from 'antd';
import classNames from 'classnames';
import './index.less';
class SorterArrow extends React.Component {
  constructor(props) {
    super(props)
    const value = props.value || true
    this.state = {
      desc: value,
    }
  }

  handleSorter = () => {
    const { desc } = this.state;
    const { onChange } = this.props;
    this.setState({
      desc: !desc
    })
    if (onChange) {
      onChange(desc);
    }
  }

  render() {
    const { desc } = this.state;
    return (
      <div className='top-down' onClick={this.handleSorter}>
        <Icon type="caret-up"
          className={classNames({ 'blue-color': desc })} />
        <Icon type="caret-down"
          className={classNames({ 'blue-color': !desc })} />
      </div>
    )
  }
}

export default SorterArrow;