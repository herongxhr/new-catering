/*
 * @Author: suwei 
 * @Date: 2019-03-20 15:07:45 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 16:34:46
 */
import React, { PureComponent, Fragment } from 'react';
import { Table, Button, Input, Popconfirm, DatePicker, Select, Tag, message } from 'antd';
import { connect } from 'dva';
import Selectf from '../../components/SelectIngredients';
import moment from 'moment'
import isNull from 'lodash/isNull'
import { getYMD } from '../../utils/utils'

import './PurOrderTable.less'


const Option = Select.Option;
const dateFormat = 'YYYY/MM/DD';

class PurOrderTable extends PureComponent {
  index = 0;


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: [],
      visible: false,
    };
  }

  //获取单一表格数据
  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.id === key)[0];
  }

  //请求供货商列表
  querySupplier = (params = {}) => {
    this.props.dispatch({
      type: 'setting/querySupplier',
      payload: {
        ...params
      },
    })
  }

  componentDidMount() {
    this.querySupplier()
  }


  deleteMeal = (params) => {
    const { props } = this
    props.dispatch({
      type: 'purOrder/delelteOrderTableForm',
      payload: params
    })
    props.dispatch({
      type: 'meal/removeMeal',
      payload: params,
    })
  }

  addMeal = (params) => {
    params.editable = true
    this.props.dispatch({
      type: 'meal/addMeal',
      payload: params,
    })
    this.props.dispatch({
      type: 'purOrder/addOrderTableForm',
      payload: params
    })
  }

  //Input输入的时候改变值
  handleFieldChange = (e, fieldName, key) => {
    let changeValue = Number(e.target.value)
    const { props } = this
    const { orderTableForm } = props
    const newData = orderTableForm.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData)
    if (target) {
      if (changeValue == 0) {
        props.dispatch({
          type: 'purOrder/priceVerify',
          payload: true
        })
      }
      if (changeValue < 0) {
        props.dispatch({
          type: 'purOrder/priceVerify',
          payload: true
        })
      }
      if (changeValue > 0) {
        props.dispatch({
          type: 'purOrder/priceVerify',
          payload: false
        })
      }

      target[fieldName] = changeValue;
      props.dispatch({
        type: 'purOrder/InputorderForm',
        payload: newData
      })
    }
  }

  //datePicker输入的时候改变值
  handleDateChange(fieldName, key, date, dateString) {
    const { props } = this
    const { orderTableForm } = props
    const newData = orderTableForm.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = dateString;
      props.dispatch({
        type: 'purOrder/InputorderForm',
        payload: newData
      })
    }
  }

  range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  }
  
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  //select选择的时候改变值
  handleSelectChange(fieldName, key, value) {
    const { props } = this
    const { orderTableForm } = props
    const newData = orderTableForm.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = value;
      props.dispatch({
        type: 'purOrder/InputorderForm',
        payload: newData
      })
    }
  }

  handleModalVisble = (params) => {
    this.setState({
      visible: false,
    })
  }

  handleModalHidden = () => {
    this.setState({
      visible: false
    })
  }

  //请求食材选择器列表
  queryNewOrderSelectf = () => {
    const { props } = this
    props.dispatch({
      type: 'purOrder/queryOrderSelectf',
      payload: {
        cateringId: 'f970fb8a4e99402da175dba8ca87ef1c'
      },
      callback: (value) => {
        this.setState({
          visible: true,
          value: value
        });
      },
    })
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'meal/clearMeal',
    })
  }

  render() {
    const tabColumns = [
      {
        title: '商品',
        key: 'goodsName',
        dataIndex: 'goodsName',
        width: '25%',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '单位',
        key: 'unit',
        dataIndex: 'unit',
        render: (text, record) => {
          return text;
        },
      },
      {
        title: '单价',
        key: 'price',
        dataIndex: 'price',
        render: (text, record) => {
          if (record.price.toString() == '0') {
            return <Input
              style={{ width: '70px', border: '1px solid red' }}
              autoFocus
              onChange={e => this.handleFieldChange(e, 'price', record.id)}
              placeholder="单价"
            />
          }
          return <Input
            style={{ width: '70px' }}
            autoFocus
            onChange={e => this.handleFieldChange(e, 'price', record.id)}
            placeholder="单价"
            defaultValue={text}
          />
        },
      },
      {
        title: '数量',
        key: 'quantity',
        dataIndex: 'quantity',
        render: (text, record) => {  //render里面三个参数的意思 text , record ,index  当前行的值，当前行数据，行索引
          return (<Input
            onChange={e => this.handleFieldChange(e, 'quantity', record.id)}
            placeholder="0"
            style={{ width: '70px' }}
            defaultValue={text}
          />)
        },
      },
      {
        title: '供应商',
        key: 'supplierId',
        dataIndex: 'supplierId',
        render: (text, record) => {
          if (isNull(text)) {  //判断isNull
            return (
              <Select  onChange={this.handleSelectChange.bind(this, 'supplierId', record.id)} style={{ width: '218px' }} placeholder='请选择'>
                {supplier.map(item => (
                  <Option key={item.id} value={item.id}>{item.supplierName}</Option>
                ))}
              </Select>
            )
          } //可编辑
          return (
            <Select onChange={this.handleSelectChange.bind(this, 'supplierId', record.id)} style={{ width: '218px' }} placeholder='请选择'>
              {supplier.map(item => (
                <Option key={item.id} value={item.id}>{item.supplierName}</Option>
              ))}
            </Select>
          )
        },
      },
      {

        title: '配送日期',
        key: 'requiredDate',
        dataIndex: 'requiredDate',
        render: (text, record) => {
          const { requiredDate } = record
          const date = getYMD(requiredDate)
          return (
            <DatePicker 
            defaultValue={requiredDate ? moment(date, dateFormat) : null} 
            onChange={this.handleDateChange.bind(this, 'requiredDate', record.id)} 
            style={{ width: '130px' }} 
            format="YYYY-MM-DD"
            disabledDate={this.disabledDate}
            />
          )
        },
      },
      {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
          return (
            <span>
              <Popconfirm title="是否要删除此行？" onConfirm={() => this.deleteMeal(record.skuId)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        }
      }
    ];
    const { loading, visible } = this.state;
    const { supplier } = this.props
    //解数据
    const { value } = this.state
    const { records } = value
    const { orderTableForm } = this.props
    //
    const CardTitle = () => {
      return (
        <div style={{ marginBottom: '20px' }}>
          <span style={{ marginRight: '10px' }}>商品明细</span>
          <Tag color="cyan">{`共${orderTableForm.length}条`}</Tag>
        </div>
      )
    }
    return (
      <Fragment>
        {CardTitle()}
        <Table
          loading={loading}  //通过loading这个变量的值判断页面是否在加载中
          columns={tabColumns}
          dataSource={orderTableForm}
          pagination={false}
          rowKey='id'
          className='purorderTable'
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.queryNewOrderSelectf}
          icon="plus"
        >
          添加
        </Button>
        {
          visible ? <Selectf
            dataSource={records}
            handleModalVisble={this.handleModalVisble}
            handleModalHidden={this.handleModalHidden}
            addMeal={this.addMeal}
            deleteMeal={this.deleteMeal}
            mealArray={this.props.mealArray}
            visible={this.state.visible}

          /> : null
        }
      </Fragment>
    );
  }
}

export default connect(({ purOrder, meal, setting }) => ({
  orderTableForm: purOrder.orderTableForm,
  mealArray: meal.mealArray,
  supplier: setting.supplier
}))
  (PurOrderTable);