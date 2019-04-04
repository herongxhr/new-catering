import React from 'react'
import { Form , Select , DatePicker , Input } from "antd";


const Option = Select.Option;

const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;


class InlineForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return(
      <Form layout="inline" style={{paddingTop:20}} >
        <FormItem label='日期选择' style={{marginLeft:30}}>
          {
            getFieldDecorator('date',{
                initialValue:'1',
            })(
              <Select     
                style={{ width: 200 }}              
              > 
                <Option value="1">全部</Option>
                <Option value="2">本年</Option>
                <Option value="3">去年</Option>
                <Option value="4">本月</Option>
                <Option value="5">近3个月</Option>
                <Option value="6"> <RangePicker /> </Option>
              </Select>            
            )
          }
        </FormItem>
        {/* <FormItem style={{marginLeft:20}}>
          {
            getFieldDecorator('search',{
                initialValue:'',
            })(
              <Search
                placeholder="请输入关键字进行搜索"
                onSearch={value => console.log(value)}
                style={{ width:300 }}
            />
            )
          }
        </FormItem> */}
      </Form>
    )
  }
}

const WrappedInlineForm = Form.create()(InlineForm)

export default WrappedInlineForm;
