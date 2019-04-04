import React from 'react'
import { Icon } from 'antd'

import './index.less'

class TotalNumber extends React.Component {
  render() {
    return(
      <div className='TotalNumber'>
        <Icon type="exclamation" />
        <span>{this.props.value}</span>
      </div>
    )
  }
}

export default TotalNumber