import React from 'react'
import {  Table} from 'antd'
import { connect } from 'dva';
import { withRouter } from "react-router";
import './index.less'
import moment from 'moment'

class DeliveryLog extends React.Component {
  state = {
    opertion:true
  }
  queryDistributionDetail = (params = {}) => {
    const { dispatch, location } = this.props;
    const id = location.state && location.state.id;
    dispatch({
      type: 'deliveryAcce/queryDistributionDetail',
      payload: {
        ...params,
        id:id
      }
    })
  }
  componentDidMount(){
    this.queryDistributionDetail()
  }
  render() {
    const {detailData={}} = this.props
    const logVos = detailData.logVos || []
    const tab1Columns = [{
      title: '操作类型',
      dataIndex: 'type',
      key: 'type',
    },{
      title: '操作人',
      dataIndex: 'operator',
      key: 'operator',
    }, {
      title: '操作时间',
      dataIndex: 'operationTime',
      key: 'operationTime',
      render:(text)=>{
        return(
           text ? <span>{moment(text).format("YYYY-MM-DD HH:mm:ss")}</span> : ''
        )
      }
    },{
        title: '耗时',
        dataIndex: 'useTime',
        key: 'useTime',
      }
     ];
    return(
      <div className='DeliveryLog'>
        <div className='delilogTitle'>
            配送验收日志
        </div>
          <Table  
            columns={tab1Columns}  
            rowKey='id'
            dataSource={logVos}
            />
      </div>
    )
  }
}
export default connect(({deliveryAcce }) => ({
  detailData:deliveryAcce.detailData,
}))(withRouter(DeliveryLog));