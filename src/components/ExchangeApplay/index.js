/*
 * @Author: suwei 
 * @Date: 2019-03-21 11:07:42 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-21 15:23:10
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import './index.less'
import { Alert, Tag, Table, Button, Popconfirm } from 'antd';
import { withRouter } from "react-router";
import 'ant-design-pro/dist/ant-design-pro.css'; 
import { CountDown } from 'ant-design-pro';

class ExchangeApplay extends React.Component {
  state = {
    expander: true,
    opertion: true,
  }

  handleExpender = () => {
    this.setState({
      expander: !this.state.expander,
    })
  }
  queryDistributionDetail = (params = {}) => {
    const { dispatch, location } = this.props;
    const id = location.state && location.state.id;
    dispatch({
        type: 'deliveryAcce/queryDistributionDetail',
        payload: {
            ...params,
            id
        }
    })
}
 
  queryExecute = (params={}) =>{
    const { dispatch} = this.props;
    dispatch({
      type: 'deliveryAcce/queryExecute',
      payload: {
        ...params,
      }
    }).then(
      this.queryDistributionDetail
    )
  }
  handleAgree = (params) => {
    const applyId= params.id
   this.queryExecute({
     id:applyId,
     approveStatus:'1',
   })
  }
  handleRefuse = (params) => {
    const applyId= params.id
    this.queryExecute({
      id:applyId,
      approveStatus:'0',
    })
  }

  componentDidMount() {
    this.queryDistributionDetail()
  }
  render() {
    const tab1Columns = [{
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render:(text,record)=>{
       const replaceViewSku= record.replaceViewSku||{}
       const replaceGoods = replaceViewSku.goodsName
       const targetViewSku= record.targetViewSku||{}
       const targetGoods = targetViewSku.goodsName
          return (
            <div className='tags'>
              <div>{ targetGoods ? <Tag color='cyan'>订单商品</Tag> : ''}</div>
              <div>{replaceGoods ? <Tag color='orange'>置换商品</Tag> : ''}</div>
            </div>
          )
      }
    }, {
      title: '商品',
      dataIndex: 'targetViewSku',
      key: 'targetViewSku',
      render:(text,record)=>{
        const replaceViewSku = record.replaceViewSku
        return (
          <div>
            <div>{text.wholeName}</div>
            <div  className='applyItem'>{replaceViewSku.wholeName}</div>
          </div>
        )
      }
    }, {
      title: '单位',
      dataIndex: 'targetUnit',
      key: 'targetUnit',
      render:(text,record)=>{
        return (
          <div>
            <div>{text}</div>
            <div className='applyItem'>{record.replaceUnit}</div>
          </div>
        )
      }
    }, {
      title: '单价(元)',
      dataIndex: 'targetPrice',
      key: 'targetPrice',
      render:(text,record)=>{
        return (
          <div>
            <div>{text}</div>
            <div className='applyItem'>{record.replacePrice}</div>
          </div>
        )
      }
    }, {
      title: '数量',
      dataIndex: 'targetQuantity',
      key: 'targetQuantity',
      render:(text,record)=>{
        return (
          <div>
            <div>{text}</div>
            <div className='applyItem'>{record.replaceQuantity}</div>
          </div>
        )
      }
    },
    {
      title: '总价(元)',
      dataIndex: 'combineTotal',
      key: 'combineTotal',
      render:(text,record)=>{
        return (
          <div>
            <div>{record.targetQuantity*record.targetPrice}</div>
            <div className='applyItem'>{record.replaceQuantity*record.replacePrice}</div>
          </div>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (text,record)=>{
        if(record.approveStatus === null){
          return(
            <div>
               <Fragment>
                 <Popconfirm title="是否要继续此操作？" onConfirm={this.handleAgree.bind(this,record)}>
                  <Button type='primary' style={{marginRight:10}} >同意</Button>
                 </Popconfirm>
                 <Popconfirm title="是否要继续此操作？" onConfirm={ this.handleRefuse.bind(this,record)}>
                  <Button type='danger' style={{marginRight:10}} >拒绝</Button>
                 </Popconfirm>
               </Fragment>
            </div>
          )
        }else{
         return(
          <span>{record.approveStatus === '0' ? <span style={{color:'red'}}>已拒绝</span> : '已同意'}</span>
         ) 
       }
      }
    }
    ];
    const { detailData = {} } = this.props
    const replacementVoList = detailData.replacementVoList || []
    const total = replacementVoList.length ? replacementVoList.length : 0
    const replaceCommitTime = detailData.replaceCommitTime || ''
    const targetTime = replaceCommitTime + 86400000;
    return (
      // 换货申请的逻辑待修改
      <div className='exchangeApplay'>
        <div className='exchangeHead'>
          <div className='exchangeTitle'>换货申请</div>
            <Alert message={`共${total}条`} type="warning" showIcon className='alert' />
            <Alert message={<span>
                                <span style={{color:'#E51C23',fontSize:14}}>剩余处理时间</span>
                                {replaceCommitTime ? 
                                <CountDown style={{ fontSize: 14 ,color:'#E51C23',marginLeft:5}} target={targetTime} /> : ''}
                            </span>}
                  type="warning" showIcon className='changeTime' 
                  style={{ backgroundColor: 'rgba(229, 28, 35, 0.05)',border: '1px solid rgba(229, 28, 35, 1)'}}/>
          <div className='operation' onClick={this.handleExpender}>{this.state.expander ? '收起' : '展开'}</div>
        </div>
        {this.state.expander ?
          <div className='exchangeTable'>
            <Table
              style={{ background: 'white' }}
              columns={tab1Columns}
              dataSource={replacementVoList}
              rowKey='id'
              pagination={false}
              footer={() => <div className="changeMark">
                换货备注：{detailData.replaceRemark}
            </div>}
            />
          </div> : ''
        }
      </div>
    )
  }
}

export default connect(({ deliveryAcce }) => ({
  detailData: deliveryAcce.detailData,
  execute:deliveryAcce.execute
}))(withRouter(ExchangeApplay));