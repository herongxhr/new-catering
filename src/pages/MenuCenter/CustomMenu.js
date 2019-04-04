import React, { Component } from 'react';
import { Card, DatePicker, Button, Row, Col, message } from 'antd';
import { connect } from 'dva';
import ArrangeDishes from '../../components/ArrangeDishes';
import styles from './index.module.less';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import createHistory from 'history/createBrowserHistory';
import { routerRedux } from 'dva/router';

const history = createHistory();
const { WeekPicker, } = DatePicker;
/**
 * 从模板新建菜单与自定义菜单共用一个页面
 */
class CustomMenu extends Component {
  state = {
    id: '',
    type: 'P',
    nd: '',
    week: '',
  }

  static getDerivedStateFromProps(props) {
    const { location } = props;
    // 只有从模板新建，选择了模板后
    // location.state才存在，直接自定义菜单是location.state为undefined
    if (location.state) {
      const { id = '', type = '' } = location.state;
      return { id, type }
    }
    return null;
  }

  // 选择周次回调
  handleSelectWeek = (_, dateString) => {
    const [, nd = '', week = ''] = dateString && dateString.match(/^(\d{4})-(\d{2})/);
    this.setState({ nd, week });
  }

  handleClickCancel = () => {
    history.goBack();
  }

  handleClickOk = () => {
    // 从局部state中取数据，再向后端传数据
    const { nd = '', week = '' } = this.state;
    if (!nd || !week) {
      this.warning();
      return;
    }
    const { type: templateFrom, ...rest } = this.state;
    this.props.dispatch({
      type: 'menuCenter/customMenu',
      payload: { templateFrom, ...rest },
      callback: this.goMenuDetails
    });
  }

  // 跳转到详情页
  // 同时传递后端返回的id和局部state中保存的templateType
  goMenuDetails = data => {
    const { type, id } = this.state;
    const url = type === 'C' ? 'unified-menu' : 'my-menu';
    this.success();
    this.props.dispatch(routerRedux.push({
      pathname: `/menubar/${url}/details`,
      state: { id: id || data, type: type }
    }))
  }

  success = () => {
    message.success('菜单保存成功')
  }
  warning = () => {
    message.warning('请选择菜单的适用周次');
  };

  componentDidMount() {
    const { id, type } = this.state;
    // 如果是从模板新建，要获取相应模板的详情
    if (id) {
      this.props.dispatch({
        type: `menuCenter/fetch${type}TemplateDetails`,
        payload: id
      })
    }
  }

  render() {
    const { location, loading } = this.props;
    const isLoading = loading.effects['menuCenter/newMenu'];
    return (
      <div>
        <BreadcrumbComponent {...location} />
        {/* 如果是自定义菜单时显示 */}
        <Card className={styles.wrap}>
          <Row>
            <Col span={8}>适用周次：<WeekPicker
              ref={ref => this.weekpicker = ref}
              style={{ width: 260 }}
              onChange={this.handleSelectWeek}
              placeholder="选择周次"
            />
            </Col>
          </Row>
        </Card>
        <Card
          className={styles.wrap}
          style={{ marginBottom: 76 }}
          bodyStyle={{ padding: 20 }}>
          {/* 排餐控件 */}
          <ArrangeDishes isMy={true} {...this.props} />
        </Card>
        {/* 底部按钮 */}
        <div className={styles.footerWrap}>
          <div className={styles.footerBtn}>
            <Button
              onClick={this.handleClickCancel}
            >取消</Button>
            <Button
              onClick={this.handleClickOk} type='primary'
              loading={isLoading}
            >保存</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ menuCenter, loading }) => ({
  loading,
  ...menuCenter
}))(CustomMenu);
