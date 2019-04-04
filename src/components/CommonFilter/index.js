import React from 'react'
import { Select, DatePicker, Row, Col, Button, Radio, Menu, Dropdown } from 'antd';

const Option = Select.Option;
const { RangePicker } = DatePicker;

export default class OrderFilter extends React.Component {
  render() {
    const {
      className,
      handleFilterChange,
      filterData,
      handleMenuBtnClick,
      defaultStatus,
    } = this.props;

    const {
      datePicker1 = false,
      select1 = '',
      select2 = '',
      dropDownBtn,
      statusGroup = ''
    } = filterData;

    // 点击新建时会下拉的按钮
    const menu = (
      <Menu onClick={handleMenuBtnClick} >
        {dropDownBtn && dropDownBtn.map(item => (
          <Menu.Item key={item.key}>
            {item.text}
          </Menu.Item>))}
      </Menu>
    )

    const button1 = (
      <Dropdown overlay={menu}>
        <Button style={{ width: 110 }} icon="plus" type='primary' >
          新建
        </Button>
      </Dropdown>
    )

    return (
      <div className={className}>
        <Row>
          {/* 左侧列 */}
          <Col span={16}>
            {/* 第一行 */}
            <Row style={{ height: 32, marginBottom: 20 }}>
              {datePicker1 && <Col span={12}>
                <span >日期选择：</span>
                <RangePicker
                  style={{ width: 240 }}
                  onChange={(_, dateStrings) => {
                    let [startDate, endDate] = dateStrings;
                    handleFilterChange({ startDate, endDate, })
                  }} />
              </Col>}
              {/* 下拉框1 */}
              {select1 &&
                (<Col span={8}>
                  <label>{select1.label}
                    <Select
                      onChange={() => { }}
                    >{select1.options
                      .map(item => <Option value={item[0]}>{item[1]}</Option>)}
                    </Select>
                  </label>
                </Col>)}
              {/* 下拉框2 */}
              {select2 &&
                (<Col span={8}>
                  <label>{select2.label}
                    <Select
                      onChange={() => { }}
                    >{select2.options
                      .map(item => <Option value={item[0]}>{item[1]}</Option>)}
                    </Select>
                  </label>
                </Col>)}
            </Row>
            {/* 第二行 */}
            {dropDownBtn && <Row style={{ marginBottom: 20 }}>
              {/* 下拉式按钮 */}
              <Col>{button1}</Col>
            </Row>}
          </Col>
          {/* 右侧列 */}
          <Col span={8}>
            {/* 右一行，有下拉按钮时才出现 */}
            {dropDownBtn && <Row style={{ height: 32, marginBottom: 20 }}>
              <Col span={24}></Col>
            </Row>}
            {/* 右二行 */}
            <Row>
              <Col style={{ textAlign: 'right' }} >
                {/* 状态筛选按钮组 */}
                {statusGroup &&
                  <Radio.Group
                    defaultValue={defaultStatus}
                    onChange={e => handleFilterChange({ status: e.target.value })}>
                    {statusGroup.map(([value, text], index) =>
                      <Radio.Button key={index} value={value}>{text}</Radio.Button>)}
                  </Radio.Group>}
              </Col>
            </Row>
          </Col>
        </Row>
      </div >
    )
  }
}

