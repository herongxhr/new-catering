/*
 * @Author: suwei 
 * @Date: 2019-03-21 14:41:19 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-21 15:00:23
 */
import React ,{ Fragment } from 'react';
import {  Alert,Tag , Table, Button, Popconfirm } from 'antd';
import { connect } from 'dva';

class DeliveryConfirm extends React.Component {
  constructor(props) {
    super(props)
  
    this.state = {
       showPop:false,
       showReject:false
    }
  }
  handleAgree = (params) => {
    this.setState({
      showPop:true
    })
  }
  handleReject = (params) => {
    this.setState({
      showReject:true
    })
  }
  render() {
    return (
      <div >
        <Popconfirm title="是否要继续此操作？" onConfirm={() => this.handleAgree()}>
          {this.state.showReject ? '' : this.state.showPop?<span>已同意</span>:<Button type='primary' style={{marginRight:10}} >同意</Button>}
        </Popconfirm>
        <Popconfirm title="是否要继续此操作？" onConfirm={() => this.handleReject()}>          
          {this.state.showPop ? '': this.state.showReject?<span>已拒绝</span>:<Button type='danger' style={{marginRight:10}} >拒绝</Button>}
        </Popconfirm>
    </div>
    )
  }
}

// export default DeliveryConfirm
export default connect(({ }) => ({
}))(DeliveryConfirm);