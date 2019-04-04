import React from 'react'
import { Form, Select, DatePicker, Input, Button, Menu, Dropdown, Radio } from "antd";
import { connect } from 'dva';
import './index.less'
import moment, { now } from 'moment'

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class InForm extends React.Component {
  querySupplier = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deliveryAcce/querySupplier',
      payload: {
        ...params,
      }
    })
  }
  handleTimeType = (e) => {
    const {handleFilterChange} = this.props
     //获取本日
     const today = moment().format('YYYY-MM-DD');
    if(e.target.value == 'today'){
      handleFilterChange({
            startDate:today,
            endDate:today,
      })
    }
    if(e.target.value == 'all'){
      handleFilterChange({
            startDate:'',
            endDate:'',
      })
    }
  }
  handleMenu = (e) => {
    const {handleFilterChange} = this.props
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD')
    //获取本周
    const weekStartDate = moment().week(moment().week()).startOf('week').format('YYYY-MM-DD');
    const weekEndDate = moment().week(moment().week()).endOf('week').format('YYYY-MM-DD');
    //获取近三天的时间
    const threeDay = moment().add(3, 'days').format('YYYY-MM-DD')
    if(e.key == 'tomorrow'){
      handleFilterChange({
        startDate:tomorrow,
        endDate:tomorrow,
      })
    }
    if(e.key == 'threeDay'){
      handleFilterChange({
        startDate:tomorrow,
        endDate:threeDay,
      })
    }
    if(e.key == 'week'){
      handleFilterChange({
        startDate:weekStartDate,
        endDate:weekEndDate,
      })
    }
  }
  componentDidMount() {
    this.querySupplier()
  }
  render() {
    const { handleFilterChange, Supplier = [] } = this.props
    const { getFieldDecorator } = this.props.form;
    const menu = (
      <Menu onClick={this.handleMenu}>
        <Menu.Item key="tomorrow">明日</Menu.Item>
        <Menu.Item key="threeDay">近三天</Menu.Item>
        <Menu.Item key="week">本周</Menu.Item>
      </Menu>
    )
    const supplierOptions = Supplier.length > 0 && Supplier.map((item) => {
      return (
        <Option value={item.supplierId} key={item.supplierId}>{item.supplierVo.supplierName}</Option>
      )
    })
    return (
      <Form layout="inline">
        <FormItem label='日期选择' style={{ margin: 20 }}>
          {
            getFieldDecorator('date', {
              initialValue: '',
            })(
              <RangePicker style={{ width: 250 }} onChange={(value) => {
                handleFilterChange({
                  startDate: moment(value[0]).format("YYYY-MM-DD"),
                  endDate: moment(value[1]).format("YYYY-MM-DD")
                })
              }} />
            )
          }
        </FormItem>
        <FormItem label='供应商' style={{ marginTop: 20 }}>
          {
            getFieldDecorator('search', {
              initialValue: '',
            })(
              <Select
                style={{ width: 250 }}
                onChange={(value) => {
                  handleFilterChange({
                    supplierId: value
                  })
                }}
              >
                {supplierOptions}
              </Select>
            )
          }
        </FormItem>
        <FormItem style={{ marginLeft: 260, marginTop: 20 }}>
          <RadioGroup onChange={this.handleTimeType} defaultValue="all">
            <RadioButton value="all">全部</RadioButton>
            <RadioButton value="today">今日</RadioButton>
            <Dropdown overlay={menu}>
              <RadioButton value="more">更多</RadioButton>
            </Dropdown>
          </RadioGroup>
        </FormItem>
      </Form>
    )
  }
}

const DeliveryForm = Form.create()(InForm)

export default connect(({ deliveryAcce }) => ({
  delivery: deliveryAcce.delivery,
  Supplier: deliveryAcce.Supplier
}))(DeliveryForm);