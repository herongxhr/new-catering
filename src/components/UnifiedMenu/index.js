import React from 'react'
import { Table, Button, Dropdown, Menu, Badge, Radio, axios } from 'antd'
import WrappedInlineForm from '../InlineForm'
import { connect } from 'dva'
import { withRouter } from 'react-router'

import './index.less'


const ButtonGroup = Button.Group;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const tableColumns = [
  {
    title: '菜单编号',
    dataIndex: 'menuCode',
    key: 'menuCode',
  },
  {
    title: '周次',
    dataIndex: 'week',
    key: 'week',
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '下达单位',
    dataIndex: 'superiorName',
    key: 'superiorName',
  },
  {
    title: '下达时间',
    dataIndex: 'issuedTime',
    key: 'issuedTime',
  },
  {
    title: '执行状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      if (text == '已执行') {
        return text
      } else {
        return <span>
          <Badge status="warning" />
          <span>未执行</span>
        </span>
      }
    }
  }
];

class UnifiedMenu extends React.Component {
  state = {
    DataSource: null,
    status: 1
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'unifiedMenus/queryList',
      payload: { a: 1 }
    })

  }

  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">已执行</Menu.Item>
        <Menu.Item key="2">已失效</Menu.Item>
      </Menu>
    );

    const { unifiedMenus } = this.props
    const DataSource = unifiedMenus.MenusList.records
    return (
      <div className='TableOne'>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 20 }}>
          <WrappedInlineForm />
          <ButtonGroup>
            <Button>全部</Button>
            <Button onClick={this.handleHeaderClick}>未执行</Button>
            <Dropdown overlay={menu}>
              <Button>
                更多
              </Button>
            </Dropdown>
          </ButtonGroup>
        </div>
        <Table columns={tab1Columns} dataSource={DataSource} rowKey="id" style={{ padding: '0px 25px' }} onRow={(record) => {
          return {
            onClick: (event) => {
              this.props.history.push('/menubar/public/details')
            }
          }
        }} />
      </div>
    )
  }
}

const TableOne = withRouter(UnifiedMenu)


export default connect(({ unifiedMenus }) => ({
  unifiedMenus,
}))(UnifiedMenu); 