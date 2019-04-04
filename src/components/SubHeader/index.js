import React from 'react'
import './index.less'
import { Breadcrumb } from 'antd';

class SubHeader extends React.Component {
  render() {
    return(
      <div className='SubHeader'>
       <Breadcrumb>
          <Breadcrumb.Item><a href="/menubar">{this.props.title}</a></Breadcrumb.Item>
          <Breadcrumb.Item><a href="/menubar">{this.props.subTitle}</a></Breadcrumb.Item>
          <Breadcrumb.Item><a href="/createtemplate">{this.props.cascade}</a></Breadcrumb.Item>
        </Breadcrumb>
      </div>
    )
  }
}

export default SubHeader