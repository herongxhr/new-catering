import React, { Component } from 'react';
import './Accepting.less';
import { Table,Badge } from 'antd';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import moment from 'moment'


const Columns = [{
    title: '配送单号',
    dataIndex: 'distributionNo',
    key: 'distributionNo',
    render:(text,record) =>{
      if(record.status == '0'){
        return(<Link to={{ pathname:"/pendingDeliveryDetail",state:{id:record.id} }}>{text}</Link>) 
      }
      if(record.status == '1'){
        return(<Link to={{ pathname:"/pendingDeliveryDetail",state:{id:record.id} }}>{text}</Link>) 
      }
      if(record.status == '2'){
        return(<Link to={{ pathname:"/pendingAcceDetail",state:{id:record.id} }}>{text}</Link>) 
      }
      if(record.status == '3'){
        return(<Link to={{ pathname:"/acceptedDetail",state:{id:record.id} }}>{text}</Link>) 
      }
    } 
  }, {
    title: '供应商',
    dataIndex: 'supplier',
    key: 'supplier',
    width:270,
    render:(text)=>text.supplierName
  }, {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      width:300
  }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(status){
        if(status == '0'){
          return (<span> <Badge status="warning" />待启动</span>)
        }
        if(status == '1'){
          return (<span> <Badge status="processing" />换货中</span>)
        }
        if(status == '2'){
          return (<span> <Badge status="success" />待验收</span>)
        }
        if(status == '3'){
          return (<span> <Badge status="default" />已验收</span>)
        }
      },
      width:160
  },{
    title: '配送日期',
    dataIndex: 'distributionDate',
    key: 'distributionDate',
    render:(text)=>{return <span>{moment(text).format("YYYY-MM-DD dddd")}</span>}
  }];
  
class Accepting extends Component {
    state={
        pagination: {},
    }
      componentDidMount() {
        this.props.queryList()
      }
      
      handleTableChange = (pagination) =>{
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        pager.pageSize = pagination.pageSize;
        this.setState({
          pagination: pager,
        });
        this.props.queryList({
          current:pagination.current,
          pageSize:pagination.pageSize,
          timeType:this.props.timeType
        })
        this.props.handleQuery({
          current:pagination.current,
          pageSize:pagination.pageSize,
        })
      }
    render() {
      const { delivery={} }= this.props
      const records = delivery.records || []
      const {current,total} = delivery
        return ( 
        <div className="accepting">
           <Table 
           columns={Columns} 
           dataSource={records} 
           onChange={this.handleTableChange} 
           pagination={{current,total}}
           rowKey="id"
           /> 
        </div>
        );
    }
    }

    export default connect(( {deliveryAcce} ) => ({
      delivery:deliveryAcce.delivery,
    }))(Accepting); 
