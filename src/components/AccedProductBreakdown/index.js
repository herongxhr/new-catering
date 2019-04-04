import React from 'react';
import { connect } from 'dva';
import { Alert, Table,Badge } from 'antd';
import { withRouter } from "react-router";
import moment from 'moment'

class AccedProductBreakdown extends React.Component {
  state = {
    proExpander: true,
    opertion: true
  }
  handleProExpender = () => {
    this.setState({
      proExpander: !this.state.proExpander,
    })
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
    const { detailData = {} } = this.props
    const { disOrderDetailVos = []} = detailData
    const tab1Columns = [{
      title: '商品',
      dataIndex: 'disviewSku',
      key: 'disviewSku',
      render: (disviewSku, record) => {
        const params = disviewSku.property
        return (
          record.skuId === record.distributionSkuId ?
            <span>{disviewSku.wholeName}</span> :
            <div>
              <div style={{ textDecoration: 'line-through ' }}>{record.viewSku.wholeName}</div>
              <div><Badge status="warning" />{disviewSku.wholeName}</div>
            </div>
        )
      }
    }, {
      title: '单位',
      dataIndex: 'distributionUnit',
      key: 'distributionUnit',
      render:(text,record)=>{
        return (
          record.skuId === record.distributionSkuId ?
            <span>{text}</span> :
            <div>
              <div style={{ textDecoration: 'line-through ' }}>{record.unit}</div>
              <div>{text}</div>
            </div>
        )
      }
    }, {
      title: '单价(元)',
      dataIndex: 'distributionPrice',
      key: 'distributionPrice',
      render:(text,record)=>{
        return (
          record.skuId === record.distributionSkuId ?
            <span>{text}</span> :
            <div>
              <div style={{ textDecoration: 'line-through ' }}>{record.price}</div>
              <div>{text}</div>
            </div>
        )
      }
    }, {
      title: '数量',
      dataIndex: 'validQuantity',
      key: 'validQuantity',
      render:(text,record)=>{
        return (
          record.skuId === record.distributionSkuId ?
            <span>{text}</span> :
            <div className='tabItem'>
              <div style={{ textDecoration: 'line-through ' }}>{record.quantity}</div>
              <div>{text}</div>
            </div>
        )
      }
    },
    {
      title: '总价(元)',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (text, record) => {
        return (
          record.skuId === record.distributionSkuId ?
          <span>{record.distributionPrice * record.distributionQuantity}</span>
          :
          <div>
              <div style={{ textDecoration: 'line-through ' }}>{record.price*record.quantity}</div>
              <div>{record.distributionPrice * record.distributionQuantity}</div>
          </div>
        )
      }
    },
    {
      title: '验收数量',
      dataIndex: 'validQuantity',
      key: 'acceptQuantity',
      render: (text, record) => {
        return (
          record.skuId === record.distributionSkuId ?
            <span>{text}</span> :
            <div>
              <div style={{ textDecoration: 'line-through ' }}>无</div>
              <div>{text}</div>      
            </div>
        )
      }
    },
    {
      title: '验收总价(元)',
      dataIndex: 'validTotalPrice',
      key: 'validTotalPrice',
      render: (text, record) => {
        return (
          record.skuId === record.distributionSkuId ?
          <span>{record.distributionPrice * record.validQuantity}</span>
          :
          <div className='tabItem'>
              <div style={{ textDecoration: 'line-through ' }}>无</div>
              <div>{record.distributionPrice * record.validQuantity}</div>
          </div>
        )
      }
    },
    {
      title: '进货渠道',
      dataIndex: 'supplies',
      key: 'supplies',
      render: (text,record) => {
        return(
          record.skuId === record.distributionSkuId ? 
          ( text ? <span>{text}</span>
            : <span style={{ color: '#F5222D' }}>未上传</span>)
         :  <div className='tabItem'>
              <div style={{ textDecoration: 'line-through ' }}>无</div>
              <div>
                {text ? <span>{text}</span>
                : <span style={{ color: '#F5222D' }}>未上传</span>} 
              </div>
          </div>
        )}
    },
    {
      title: '生产日期',
      dataIndex: 'productDate',
      key: 'productDate',
      render: (text,record) => {
        return (
          record.skuId === record.distributionSkuId ? 
          ( text ? <span>{moment(text).format('YYYY-MM-DD')}</span>
            : <span style={{ color: '#F5222D' }}>未上传</span>)
         :  <div>
              <div style={{ textDecoration: 'line-through ' }}>无</div>
              <div>
                {text ? <span>{moment(text).format('YYYY-MM-DD')}</span>
                : <span style={{ color: '#F5222D' }}>未上传</span>} 
              </div>
          </div>
          )
      }
    },
    {
      title: '有效期(天)',
      dataIndex: 'validDay',
      key: 'validDay',
      render: (text,record) => {
        return (record.skuId === record.distributionSkuId ? 
          ( text ? <span>{text}</span>
            : <span style={{ color: '#F5222D' }}>未上传</span>)
         :  <div>
              <div style={{ textDecoration: 'line-through ' }}>无</div>
              <div>
                { text ? <span>{text}</span>
                : <span style={{ color: '#F5222D' }}>未上传</span>}
              </div>
          </div>)
      }
    }
    ];
    const total = disOrderDetailVos ? disOrderDetailVos.length : 0
    return (
      <div className='productBreakdown'>
        <div className='productHead'>
          <div className='productTitle'>商品明细</div>
          <Alert message={`共${total}条`} type="warning" showIcon className='alert' />
          <div className='operation' onClick={this.handleProExpender}>{this.state.proExpander ? '收起' : '展开'}</div>
        </div>
        {this.state.proExpander ?
          <div className='exchangeTable'>
            <Table
              columns={tab1Columns}
              rowKey='id'
              dataSource={disOrderDetailVos}
              pagination={false}
              rowClassName={(record) => record.skuId === record.distributionSkuId ? '' : 'tabItem'}
            />
          </div> : ''}
      </div>
    )
  }
}
export default connect(({ deliveryAcce }) => ({
  detailData: deliveryAcce.detailData,
}))(withRouter(AccedProductBreakdown));