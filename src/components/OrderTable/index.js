import React from 'react';
import { Table, Tag, Tabs, Button, Radio, Badge, Divider } from 'antd';
import WrappedOrderForm from '../OrderFilter';
import { order } from '../../DataConfig'

import './index.less'


const tabColumns = [
  {
    title: '采购单号',
    dataIndex: 'purchase',
    key: 'purchase',
  },
  {
    title: '订单来源',
    dataIndex: 'ResultSource',
    key: 'ResultSource',
    render(ResultSource) {
      let orderArray = {
        '0': '菜单生成',
        '1': '辅料超市',
        '2': '新建',
      }
      return <Tag color="magenta">
        {/* {orderArray[ResultSource]} */}
        ResultSource
      </Tag>
    }
  },
  {
    title: '创建日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '摘要',
    dataIndex: 'subtract',
    key: 'subtract',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render(status) {
      return status == 1 ? <span><Badge status="warning" />未下单</span> : <span>已下单</span>
    }
  },
  {
    title: '操作',
    dataIndex: 'status',
    key: 'Status',
    render(status) {
      return status == 1 ? <div className='opertion'>
        <a className='orders' href='/details'>下单</a> <Divider type="vertical" /> <a className='delete'>删除</a>
      </div> : <a className='acceptance'>配送验收情况</a>
    }
  }
];

class OrderTable extends React.Component {
  state = {
    DataSource: [],
    tableSource: []
  }

  componentDidMount() {

  }

  all = () => {
    this.setState({
      tableSource: this.state.DataSource
    })
  }

  noOrder = () => {
    var dataSource = this.state.DataSource.filter(item => item.status == 1)
    this.setState({
      tableSource: dataSource
    })
  }

  order = () => {
    var dataSource = this.state.DataSource.filter(item => item.status == 0)
    this.setState({
      tableSource: dataSource
    })
  }

  render() {
    return (
      <div className='orderTable'>
        <WrappedOrderForm />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Button type='primary' icon="plus">新建</Button>
          </div>
          <div>
            <Radio.Group defaultValue="all" onChange={this.handleFormLayoutChange} >
              <Radio.Button value="all" onClick={this.all}>全部</Radio.Button>
              <Radio.Button value="noOrder" onClick={this.noOrder}>未下单</Radio.Button>
              <Radio.Button value="ordered" onClick={this.order}>已下单</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <div style={{ marginTop: 30 }}>
          <Table columns={tabColumns} dataSource={order.result} />
        </div>
      </div>
    )
  }
}

export default OrderTable