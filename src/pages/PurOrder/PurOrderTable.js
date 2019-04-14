import React, { Fragment } from 'react';
import { DatePicker, Select, Tag, Form, Button, InputNumber, Row, Col } from 'antd';
import { connect } from 'dva';
import moment from 'moment'
import styles from './PurOrderTable.less'

const Option = Select.Option;
class PurOrderTable extends React.Component {

  //请求供货商列表
  getMySupplier = (params = {}) => {
    this.props.dispatch({
      type: 'useSetting/fetchMySupplier',
      payload: {
        ...params
      },
    })
  }

  componentDidMount() {
    this.getMySupplier()
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const { skusItem } = values;
      console.log('value', skusItem);
    })
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

  render() {
    const { skuItems, isLoading, form, mySupplier } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    getFieldDecorator('skus', { initialValue: skuItems });
    return (
      <Fragment>
        <div className={styles.title}>
          <span style={{ marginRight: '10px' }}>商品明细</span>
          <Tag color="cyan">{`共${skuItems.length}条`}</Tag>
        </div>
        <Form onSubmit={this.handleSubmit}>
          <Row key={'rowTitle'} gutter={24} className={styles.tableTitle}>
            <Col span={6}>名称</Col>
            <Col span={2}>单位</Col>
            <Col span={3}>价格</Col>
            <Col span={3}>数量 </Col>
            <Col span={4}>供应商</Col>
            <Col span={4}>配送日期</Col>
            <Col span={2}>操作</Col>
          </Row>
          {skuItems.map((item, index) => {
            const viewSku = item.viewSku || {};
            const goodsName = `${viewSku.goodsName || ''} ${viewSku.spec || ''} ${viewSku.propertySimple || ''}`;
            const supplier = item.supplier || {};
            const supplierId = supplier.supplierId || '';
            return (
              <Row key={item.id} gutter={24} className={styles.tableRow}>
                {getFieldDecorator(`skusItem[${index}]['skuId']`, {
                  initialValue: item.skuId
                })}
                <Col span={6}>{goodsName}</Col>
                <Col span={2}>{item.unit}</Col>
                <Col span={3}>
                  <Form.Item >

                    {getFieldDecorator(`skusItem[${index}]['price']`, {
                      initialValue: item.price,
                      rules: [{
                        validator: (rules, value, callback) => {
                          if (value === 0) callback('请给商品报价');
                          callback();
                        }
                      }]
                    })(
                      <InputNumber min={0} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Form.Item >
                    {getFieldDecorator(`skusItem[${index}][quantity']`, {
                      initialValue: item.quantity,
                      rules: [{
                        validator: (rules, value, callback) => {
                          if (value === 0) callback('数量不能为0');
                          callback();
                        }
                      }]
                    })(
                      <InputNumber decimalSeparator={'0'} min={0} />
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    {getFieldDecorator(`skusItem[${index}]['supplierId']`, {
                      initialValue: supplierId,
                      rules: [{
                        required: true,
                        message: '请选择供应商'
                      }]
                    })(
                      <Select>
                        <Option value=''>请选择供应商</Option>
                        {mySupplier.map(item => (
                          <Option value={item.id}>{item.supplierName}</Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    {getFieldDecorator(`skusItem[${index}]['requiredDate']`, {
                      initialValue: moment(item.requiredDate || moment().add(1, 'days'), 'YYYY/MM/DD'),
                      rules: [{
                        required: true,
                        message: '请选择配送日期'
                      }]
                    })(
                      <DatePicker
                        disabledDate={this.disabledDate}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col span={2}><a>删除</a></Col>
              </Row>
            )
          })}
          <div className={styles.footerWrap}>
            <div className={styles.footer}>
              <Button onClick={this.cancelModalShow}>取消</Button>
              <Button type='primary' htmlType='submit'>保存</Button>
            </div>
          </div>
        </Form>
      </Fragment>
    );
  }
}

const wrappedPurOrderTable = Form.create()(PurOrderTable);

export default connect(({ purOrder, useSetting, loading }) => ({
  skuItems: purOrder.skuItems,
  mealArray: purOrder.mealArray,
  mySupplier: useSetting.mySupplier,
  isLoading: loading.effects['purOrder/']
}))(wrappedPurOrderTable);