/*
 * @Author: suwei 
 * @Date: 2019-03-21 09:53:01 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-21 16:16:06
 */
import React from 'react';
import { connect } from 'dva';
import { Tabs } from 'antd'
import Bread from '../../components/Bread'
import DeliveryTable from './DeliveryTable'

import './index.less'
import { denodeify } from 'q';

const TabPane = Tabs.TabPane;

class E extends React.Component {
  state = {
    DataSource: [],
    status:'1',
    bread:[{
      href:'/delivery',
      breadContent:'配送验收'
    },{
      breadContent:'待配送'
    }],
    query:{
      startDate:'',
      endDate:'',
      supplierId:'',
      status:'1',
      current:'',
      pageSize:'',
      isCountReplacement:'1'
    }
  }

  queryDelivery = (params = {}) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryAcce/queryDelivery',
      payload:{
        ...this.state.query,
       ...params,
      }
    })
  }
  //统一传参数的函数
  handleFilterChange = (params = {}) => {
		// 改变state中相应参数的值
		const newQueryParams = {
			...this.state.query,
			// 直接展开参数进行覆盖
			...params,
		}
		this.setState({
			query: newQueryParams
		});
		// 请求接口
		this.queryDelivery(newQueryParams);
	}
  queryCount = (params = {}) =>{
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryAcce/queryCount',
      payload:{
       ...params,
      }
    })
  }

  callback = (value) =>{
   this.setState({status:value},()=>{
    if(this.state.status=='1') {
      this.setState({
        bread:[{
          href:'/delivery',
          breadContent:'配送验收'
        },{
          breadContent:'待配送'
        }],
      })  
   }
   if(this.state.status=='2') {
    this.setState({
      bread:[{
        href:'/delivery',
        breadContent:'配送验收'
      },{
        breadContent:'待验收'
      }]
    })
   }
   if(this.state.status=='3') {
    this.setState({
      bread:[{
        href:'/delivery',
        breadContent:'配送验收'
      },{
        breadContent:'已验收'
      }]
    })
   }
    this.handleFilterChange({
      status:this.state.status,
      isCountReplacement:this.state.status == 1 ? '1' : '0'
    })
   })
  }
componentDidMount() {
    this.queryDelivery()
    this.queryCount()
  }
  render() {
    const { delivery={},count={} } = this.props;
    return (
      <div className='DeliveryAcce'>
        <Bread bread={this.state.bread} />
        <Tabs defaultActiveKey="1" onChange={this.callback}>
					{this.state.status&&<TabPane tab={(count.replacement) ? '待配送'+'('+count.replacement+')' :'待配送'} key="1">
            <DeliveryTable delivery={delivery} 
            handleFilterChange={this.handleFilterChange}  
            status={this.state.status}
            />
					</TabPane>}
					{this.state.status&&<TabPane tab={(count.pending) ? '待验收'+'('+count.pending+')' : '待验收'} key="2">
            <DeliveryTable delivery={delivery} 
            handleFilterChange={this.handleFilterChange} 
            status={this.state.status}
            />
					</TabPane>}
        {this.state.status&&<TabPane tab={(count.accepted) ? '已验收'+'('+count.accepted+')' : '已验收'} key="3">
          <DeliveryTable delivery={delivery} 
          handleFilterChange={this.handleFilterChange} 
          status={this.state.status}
          />
        </TabPane>}
				</Tabs>
      </div>
    );
  }
}

export default connect(({ deliveryAcce }) => ({
  delivery:deliveryAcce.delivery,
  count:deliveryAcce.count
}))(E);