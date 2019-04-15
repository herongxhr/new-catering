import React, { Component } from 'react';
import { Card, DatePicker, Button, Row, Col, message, Form } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import ArrangeDishes from '@/components/ArrangeDishes';
import styles from './CustomMenu.less';
import BreadcrumbComponent from '@/components/BreadcrumbComponent';
import createHistory from 'history/createBrowserHistory';
import { routerRedux } from 'dva/router';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const FormItem = Form.Item;
const history = createHistory();
const { WeekPicker, } = DatePicker;
/**
 * 从模板新建菜单与自定义菜单共用一个页面
 */
class CustomMenu extends Component {
  state = {
    id: '',
    // menuTemplateId和templateFrom主要是由模板生成菜单时需要
    // 另外后端也需要传递这两个数据
    menuTemplateId: '',
    templateFrom: 'P',
    nd: '',
    week: '',
  }

  static getDerivedStateFromProps(props) {
    const { location: { state = {} } } = props;
    // 只有从模板新建，选择了模板后
    // location.state才存在，直接自定义菜单是location.state为undefined
    if (state) {
      const { menuTemplateId = '', templateFrom = '', id = '' } = state;
      return { menuTemplateId, templateFrom, id }
    }
    return null;
  }


  handleClickCancel = () => {
    history.goBack();
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, allMealsData, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const { weekMoment } = fieldsValue;
      const [, nd = '', week = ''] = weekMoment
        ? moment(weekMoment).format('YYYY-W').match(/^(\d{4})-(\d{2})/)
        : [];
      this.setState({ nd, week });
      if (!allMealsData.length) {
        this.warning();
        return;
      }
      dispatch({
        type: 'menuCenter/customMenu',
        payload: { ...this.state, nd, week },
        callback: data => this.goMenuDetails(data)
      })
    })
  }

  // 跳转到详情页
  // 同时传递后端返回的id和局部state中保存的templateType
  goMenuDetails = data => {
    const { id } = this.state;
    this.success();
    this.props.dispatch(routerRedux.push({
      pathname: `/menubar/my-menu/details`,
      // 如果是新增，后台返回id,编辑后台返回true,false
      state: { id: id || data }
    }))
  }

  success = () => {
    message.success('菜单保存成功')
  }
  warning = () => {
    message.warning('您还没有排餐呢')
  }

  componentDidMount() {
    const { id, menuTemplateId, templateFrom } = this.state;
    // 编辑模式
    if (id) {
      this.props.dispatch({
        type: `menuCenter/fetchMenuDetails`,
        payload: id
      })

    }
    // 如果是由模板生成菜单，则要请求模板中的菜品数据
    if (menuTemplateId && templateFrom) {
      this.props.dispatch({
        type: `menuCenter/fetch${templateFrom}TemplateDetails`,
        payload: menuTemplateId
      })
    }
  }
  // 不能选择的日期
  disabledWeek = current => {
    return current && current < moment().endOf('day');
  }

  render() {
    const { location, isLoading, form, menuDetails } = this.props;
    return (
      <div>
        <BreadcrumbComponent {...location} />
        <PageHeaderWrapper withTabs={false}>
          <Form onSubmit={this.handleSubmit} layout='inline'>
            <Row className={styles.filter}>
              <Col span={8} >
                <FormItem label={'适用周次'}>
                  {form.getFieldDecorator('weekMoment', {
                    // 新建时无初始值
                    initialValue: this.state.id
                      ? moment(`${menuDetails.nd}-${menuDetails.week}`, 'YYYY-W')
                      : moment(moment().add(1,'weeks'), 'YYYY-W'),
                    rules: [{
                      required: true,
                      message: '请选择菜单的适用周次！',
                    }]
                  })(
                    <WeekPicker
                      disabledDate={this.disabledWeek}
                      style={{ width: 260 }} placeholder="选择周次" />)}
                </FormItem>
              </Col>
            </Row>
            <ArrangeDishes isMy={true} {...this.props} />
            {/* 底部按钮 */}
            <div className={styles.footerWrap}>
              <div className={styles.footerBtn}>
                <Button
                  onClick={this.handleClickCancel}
                >取消</Button>
                <Button
                  type="primary"
                  htmlType='submit'
                  loading={isLoading}
                >保存</Button>
              </div>
            </div>
          </Form>
        </PageHeaderWrapper>
      </div>
    )
  }
}

const WrappedCustomMenu = Form.create()(CustomMenu)
export default connect(({ menuCenter, loading }) => ({
  isLoading: loading.effects['menuCenter/newMenu'],
  ...menuCenter
}))(WrappedCustomMenu);
