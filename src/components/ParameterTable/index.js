/*
 * @Author: suwei 
 * @Date: 2019-03-23 09:59:50 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-29 09:12:49
 */
import React from 'react'
import { Table } from 'antd'
import ParameterForm from './ParameterForm'
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import moment from  'moment'
import './index.less'

const Columns = [{
  title: '供应商',
  dataIndex: 'supplierName',
  key: 'supplierName',
}, {
  title: '结算月份',
  dataIndex: 'distributionDate',
  key: 'distributionDate',
  render:(text) => {
    return <span>{moment(text).format('YYYY年MM月')}</span>
  }
}, {
	title: '配送单数量(张)',
  dataIndex: 'distributionNum',
	key: 'distributionNum',
}, {
	title: '总金额',
  dataIndex: 'total',
  key: 'total',
}];



class ParameterTable extends React.Component {
  state = {
		current: 1,
		pageSize: 10,
		date: '',
		supplierId: '',
		startDate: '',
		endDate: '',
	}

  //请求台账表格数据
  queryParameterTable = (params = {}) => {
		this.setState({
			...params
    })
    console.log(this.state,params)
		this.props.dispatch({
			type: 'parameter/queryParameterTable',
			payload: {
				...this.state,
				...params
			},
		})
	}

  componentDidMount() {
    this.queryParameterTable()
  }

  //点击表格行套装
  handleLinkChange(record) {   
    const { props } = this
    props.dispatch(routerRedux.push({ 
      pathname: '/parameter/detail',
      state:{
        record,
      }
    }))
  }

  // //表格current跳转
  // handleTableChange = (page) => {   
	// 	const { dispatch } = this.props;
	// 	dispatch({
	// 		type: 'purOrder/queryOrderTable',
	// 		payload: { 
	// 			current:page,
	// 			pageSize:10
	// 		},
	// 	})
  // }

  //表格current跳转
  handleTableChange = pagination => {
		const { current, pageSize } = pagination;
		// 先改变state
		this.setState({ current, pageSize });
		// 发请求
		this.queryParameterTable({
			...this.state,
			current,
			pageSize
		})
	}

  render() {
    const { ParameterTable } = this.props   
    const {
			current,
      records,
      total,
		} = ParameterTable;
    return(
      <div className='ParameterTable'>
        <ParameterForm 
        	handleFilter={this.queryParameterTable}
        />
        <Table 
          columns={Columns} 
          dataSource={records} 
          rowKey='id'
          pagination={{
            total:total,
            current:current
          }}
          onChange={this.handleTableChange} 
          onRow={(record) => {
          return {
            onClick:() => {
              this.handleLinkChange(
                record
              )
            }
          }
        }} />
      </div>
    )
  }
}


export default connect(({parameter})=>({ParameterTable:parameter.ParameterTable}))
(ParameterTable);