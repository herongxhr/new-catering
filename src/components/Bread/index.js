import React from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'dva';
import './index.less';
import GoBack from '../GoBack'

class Bread extends React.Component {
  render() {
    const { value , bread } = this.props;
    return (
      <div className='bread-wrapper' style={{
        background: "#fff",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)"
      }}
      >
        <div className="bread">
          <Breadcrumb >
            {
              bread.map((item, index, array) => {
                if (index === array.length - 1) {
                  return <Breadcrumb.Item key={index}>{item.breadContent}</Breadcrumb.Item>
                }
                return <Breadcrumb.Item key={index}><a href={item.href}>{item.breadContent}</a></Breadcrumb.Item>
              })
            }
          </Breadcrumb>
            {value ? <GoBack value={value} /> : null}
        </div>      

      </div>
    )
  }
}

export default connect(({})=>({}))
(Bread);