import React, { Fragment } from 'react'
import { connect } from 'dva';
import { DatePicker, Select, Tag, Form, Button, InputNumber, Row, Col, message, Alert, Icon, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import BreadcrumbComponent from '@/components/BreadcrumbComponent';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import SelectIngredients from '@/components/SelectIngredients';
import moment from 'moment'
import styles from './PurOrderAdjust.less'

const Option = Select.Option;
class PurOrderAdjust extends React.Component {
  state = {
    selectModalVisible: false,
    visible: false,
    id: '',
    channel: '',
    type: '',
  }

  static getDerivedStateFromProps(props) {
    const { location: { state = {} } } = props;
    const { channel = '', id = '', type = '' } = state;
    return { channel, id, type };
  }

  //请求供货商列表
  getMySupplier = (params = {}) => {
    this.props.dispatch({
      type: 'useSetting/fetchMySupplier',
      payload: {
        ...params
      },
    })
  }
  // 根据state中的参数作不同的处理
  componentDidMount() {
    const { channel, id } = this.state;
    const { dispatch } = this.props;
    switch (channel) {
      case 'M'://菜单生成
        dispatch({
          type: 'purOrder/camenuPreOrder',
          payload: id
        })
        break;
      case 'S'://辅料超市
        dispatch({
          type: 'purOrder/mallPreOrder',
          payload: id
        })
        break;
      case 'customF'://自建辅料订单
      case 'customS'://自建食材订单
        break;
      default://调整采购单
        dispatch({
          type: 'purOrder/adjustOrder',
          payload: id
        })
        break;
    }
    this.getMySupplier()
  }
  // 提交表单
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) return;
      const { skusItem: orderDetails } = values;
      console.log('value', orderDetails);
      const { channel, id, type } = this.state;
      // if (this.validatorForm(orderTableForm) == 0) return
      // //处理传递给后端表格数据
      // object.type = type || ''
      // object.channel = channel || ''
      // object.orderDetails = orderTableForm || {}
      // if (data) {
      //   object.camenuId = data.id || ''
      // }
    })
  }


  cancelModalShow = () => {
    this.setState({
      visible: true
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false
    })
  }

  // 取消调整二次确认时的回调
  handleOK = () => {
    const { type, data, channel } = this.props.location.state;
    if (channel == 'M') {
      data.channel = 'M'
      this.TableLinkChange('/menubar/unified-menu/details', data)
    }
    if (channel == 'S') {
      data.channel = 'S'
      this.TableLinkChange('/accSupermarket', data)
    }
    if (channel == 'N') {
      this.TableLinkChange('/purOrder')
    }
  }

  //请求食材选择器列表
  showSkuModal = () => {
    this.setState({ selectModalVisible: true })
  }

  getSkuList = (params = {}) => {
    this.props.dispatch({
      type: 'purOrder/fetchSkuList',
      payload: params
    })
  }

  deleteMeal = (params) => {
    this.props.dispatch({
      type: 'purOrder/deleteSkuItem',
      payload: params,
    })
  }

  addMeal = (params) => {
    params.editable = true
    this.props.dispatch({
      type: 'purOrder/addSkuItem',
      payload: params
    })
  }

  handleModalVisble = () => {
    this.setState({
      selectModalVisible: false,
    })
  }

  handleModalHidden = () => {
    this.setState({
      selectModalVisible: false
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
    const { skuList, skuItems, isLoading, form, mySupplier } = this.props;
    const { getFieldDecorator } = form;
    const { channel, selectModalVisible } = this.state;
    getFieldDecorator('skus', { initialValue: skuItems });
    // 选择食材还是辅料
    const selectType = (channel === 'customF' || channel === 'S') ? 'F' : 'S';
    // 类型
    const modalObject = {
      width: '340px',
      height: '140px',
      display: 'flex',
    }
    return (
      <Fragment>
        <BreadcrumbComponent />
        <PageHeaderWrapper withTabs={false}>
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
              const supplier = item.supplier || {};
              const goodsName = `${viewSku.goodsName || ''} ${viewSku.spec || ''} ${viewSku.propertySimple || ''}`;
              const supplierId = supplier.supplierId || '';
              return (
                <Row key={item.id} gutter={24} className={styles.tableRow}>
                  {getFieldDecorator(`skusItem[${index}]['skuId']`, {
                    initialValue: item.skuId
                  })}
                  <Col span={6}>{goodsName}</Col>
                  <Col span={2}>{viewSku.unit}</Col>
                  <Col span={3}>
                    <Form.Item >

                      {getFieldDecorator(`skusItem[${index}]['price']`, {
                        initialValue: item.price,
                        rules: [{
                          validator: (_, value, callback) => {
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
                          validator: (_, value, callback) => {
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
                        initialValue: moment(moment(item.requiredDate) || moment().add(1, 'days'), 'YYYY/MM/DD'),
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
          <Button
            style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
            type="dashed"
            onClick={this.showSkuModal}
            icon="plus"
          >添加</Button>
          {/* 选择辅料或食材 */}
          <SelectIngredients
            handleModalVisble={this.handleModalVisble}
            handleModalHidden={this.handleModalHidden}
            getSkuList={this.getSkuList}
            type={selectType}//选择食材还是辅料
            skuList={skuList}
            addMeal={this.addMeal}
            deleteMeal={this.deleteMeal}
            mealArray={skuItems}
            visible={selectModalVisible}
          />
          <Modal
            visible={this.state.visible}
            onOk={this.handleOK}
            onCancel={this.handleCancel}
            bodyStyle={modalObject}
            width='340px'
            closable={false}
          >
            <Alert message='放弃所做的调整吗？' type="warning" showIcon
              style={{ background: 'white', border: '0px', marginTop: '40px' }} />
          </Modal>
        </PageHeaderWrapper>
      </Fragment>
    )
  }
}

const WrappedPurOrderAdjust = Form.create()(PurOrderAdjust)

export default connect(({ purOrder, loading, useSetting }) => ({
  orderDetails: purOrder.orderDetails,
  mySupplier: useSetting.mySupplier,
  skuList: purOrder.skuList,
  mealArray: purOrder.mealArray,
  skuItems: purOrder.skuItems,
  loading,
}))(WrappedPurOrderAdjust);
