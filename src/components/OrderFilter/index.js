import React, { Fragment } from 'react'
import { Select, DatePicker, Input, Form, Menu, Dropdown, Icon, Radio, Button, Row, Col } from "antd";
const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;

export default ({ handleFilter, handleCustomOrder, defaultStatus }) => {
  const menu = (
    <Menu onClick={e => handleCustomOrder(e.key)}>
      <Menu.Item key="customS" >食材订单</Menu.Item>
      <Menu.Item key="customF" >辅料订单</Menu.Item>
    </Menu>
  )

  return (
    <Fragment>
      <Row style={{ padding: '20px 0' }}>
        <Col>
          <Form layout='inline'>
            <Form.Item label="日期选择:">
              <RangePicker
                style={{ width: 240 }}
                onChange={(_, dateStrings) => {
                  let [startDate, endDate] = dateStrings;
                  handleFilter({ startDate, endDate, })
                }} />
            </Form.Item>
            <Form.Item label="订单来源:">
              <Select
                style={{ width: 200 }}
                defaultValue=''
                onChange={value => handleFilter({ channel: value })}
              >
                <Option value="">全部</Option>
                <Option value="M">菜单生成</Option>
                <Option value="S">辅料超市</Option>
                <Option value="N">自建订单</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Search
                placeholder="订单号"
                onSearch={value => handleFilter({ keywords: value })}
                style={{ width: 300 }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row style={{ marginBottom: 20 }}>
        <Col span={12}>
          {/* 新建及按钮组部分 */}
          <Dropdown overlay={menu}>
            <Button type="primary">
              新建<Icon type="down" />
            </Button>
          </Dropdown>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Radio.Group
            defaultValue={defaultStatus || ''}
            onChange={e => handleFilter({
              status: e.target.value
            })}>
            <Radio.Button value=''>全部</Radio.Button>
            <Radio.Button value='0'>未下单</Radio.Button>
            <Radio.Button value='1'>已下单</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
    </Fragment>
  )
}

