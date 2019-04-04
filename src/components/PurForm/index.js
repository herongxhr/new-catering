import React from 'react'
import { Form, Cascader, DatePicker, Input, Button, LocaleProvider } from "antd";
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { connect } from 'dva';

const Search = Input.Search;
const FormItem = Form.Item;
const { RangePicker } = DatePicker;

class PurForm extends React.Component {


  queryIngreType = (params = {}) => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'purCatalog/queryIngreType',
      payload: {
        ...params,
      }
    })
  }
  handleIngreType = (value) => {
    const { queryParams } = this.props;
    const subcatalogId = value[1] || ''
    queryParams({ catalogId: value[0], subcatalogId: subcatalogId })
  }
  componentDidMount() {
    this.queryIngreType()
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { purCatalog, queryParams } = this.props;
    const ingreTypeList = purCatalog.ingreTypeList || [];
    let typeOptions = ingreTypeList.map(item => {
      return {
        value: item.id,
        label: item.catalogName,
        children: item.subCataLogs.map(subItem => {
          return {
            value: subItem.id,
            label: subItem.subcatalogName,
          }
        })
      }
    })
    return (
      <LocaleProvider locale={zh_CN}>
        <div>
          <Form layout="inline" onSubmit={this.handleSubmit}>
            <FormItem label='类别'>
              {
                getFieldDecorator('catalogId', {
                  initialValue: '',
                })(
                  <Cascader
                    style={{ width: 220 }}
                    onChange={this.handleIngreType}
                    placeholder="请选择食材类别"
                    options={typeOptions}
                  />
                )
              }
            </FormItem>

            <FormItem label='定价时间'>
              {
                getFieldDecorator('orderTime', {
                  initialValue: '',
                })(
                  <RangePicker style={{ width: 240, }}
                    onChange={(value) => {
                      const startDate = moment(value[0]).format('YYYY-MM-DD');
                      const endDate = moment(value[1]).format('YYYY-MM-DD');
                      queryParams(
                        {
                          startDate: startDate,
                          endDate: endDate
                        }
                      )
                    }}
                  />
                )
              }
            </FormItem>

            <FormItem>
              {
                getFieldDecorator('keywords', {
                  initialValue: '',
                })(
                  <Search
                    placeholder="请输入关键字进行搜索"
                    onSearch={(value) => {
                      queryParams({ keywords: value })
                    }}
                    style={{ width: 300, }}
                  />
                )
              }
            </FormItem>
          </Form>
        </div>
      </LocaleProvider>
    )
  }
}

const WrappedPurForm = Form.create()(PurForm)

export default connect(({ purCatalog }) => ({
  purCatalog,
}))(WrappedPurForm);

