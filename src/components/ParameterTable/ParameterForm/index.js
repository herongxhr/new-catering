/*
 * @Author: suwei 
 * @Date: 2019-03-22 14:15:46 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-28 09:22:39
 */
import React from 'react'
import { Form , Select , DatePicker ,Radio } from "antd";

import './index.less'

const Option = Select.Option;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class InForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const { handleFilter } = this.props
    return(
      <Form layout="inline">
        <FormItem label='日期选择' style={{ margin:20 }}>
            {
              getFieldDecorator('date', {
                initialValue: "",
              })( 
                <RangePicker 
                  style={{ width: 250 }}
                  onChange={(_, dateStrings) => {
                    let [startDate, endDate] = dateStrings;
                    handleFilter({ startDate, endDate, })
                  }} 
                /> 
              )
            }
        </FormItem>
        <FormItem label='供应商' style={{ marginTop:20 }}>
          {
            getFieldDecorator('search',{
                initialValue:'1',
            })(
              <Select     
                style={{ width: 250 }}
                onChange={(value) => handleFilter({ supplierId: value })}              
              > 
                <Option value="1">全部</Option>
                <Option value="2">本年</Option>
                <Option value="3">去年</Option>
                <Option value="4">本月</Option>
                <Option value="5">近3个月</Option>
              </Select>   
            )
          }
        </FormItem>
        <FormItem style={{marginLeft:250,marginTop:20}}>
        <RadioGroup onChange={e => {
								handleFilter({
									date: e.target.value
								})
							}} defaultValue="all">
            <RadioButton value="all">全部</RadioButton>
            <RadioButton value="month">本月</RadioButton>
              <RadioButton value="year">本年</RadioButton>
          </RadioGroup>      
        </FormItem>
      </Form>
    )
  }
}

const ParameterForm = Form.create()(InForm)

export default ParameterForm;
