import React, { Component } from 'react';
import { Card, Button, Row, Col, message, Input } from 'antd';
import { connect } from 'dva';
import ArrangeDishes from '../../components/ArrangeDishes';
import styles from './index.module.less';
import { routerRedux } from 'dva/router';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import EditableTagGroup from '../../components/EditableTagGroup';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
/**
 * 新建模板与编辑模板共用一个页面
 */
class CustomTemplate extends Component {
  state = {
    id: '',
    templateType: '',
  }

  static getDerivedStateFromProps(props) {
    const { location } = props;
    // 编辑模式才有state
    if (location.state) {
      const { id = '', templateType = '' } = location.state;
      return { id, templateType, }
    }
    return null;
  }

  // 输入模板名称
  handleTemplateNameInput = e => {
    this.props.dispatch({
      type: 'menuCenter/handleTemplateNameInput',
      payload: e.target.value
    })
  }

  // 编辑标签的回调
  editTag = (tag, flag) => {
    this.props.dispatch({
      type: 'menuCenter/editTag',
      payload: { tag, flag }
    })
  }

  handleClickCancel = () => {
    history.goBack();
  }

  handleClickOk = () => {
    // 新建id为undefined, 请求方法会根据有无id请求不同接口
    const { id } = this.state;
    const { templateName } = this.props;
    if (!templateName) {
      this.warning();
      return;
    }
    // 向后端传送数据
    this.props.dispatch({
      type: 'menuCenter/customTemplate',
      payload: { id, callback: this.goTemplateDetails }
    })
  }

  // 跳转到详情页
  // 同时传递后端返回的id和局部state中保存的templateType
  goTemplateDetails = () => {
    this.success();
    this.props.dispatch(routerRedux.push({
      pathname: '/menubar/menu-template/details',
      state: { ...this.state }
    }));
  }

  success = () => {
    message.success('模板保存成功')
  }

  warning = () => {
    message.warning('请输入模板名称');
  };

  componentDidMount() {
    console.log('4didMout', this.props)
    const { id, templateType } = this.state;
    // 如果是从编辑模板，要获取相应模板的详情
    if (id) {
      this.props.dispatch({
        type: `menuCenter/fetch${templateType}TemplateDetails`,
        payload: id
      })
    }
  }

  render() {
    const { location, loading, tagString, templateName } = this.props;
    const isLoading = loading.effects['menuCenter/customTemplate'];
    return (
      <div>
        <BreadcrumbComponent {...location} />
        {/* 如果是自定义菜单时显示 */}
        <Card className={styles.wrap}>
          <Row gutter={24}>
            <Col span={8}>
              <Row>
                <Col style={{ marginBottom: 10 }}>模板名称：</Col>
                <Col>
                  <Input
                    allowClear
                    value={templateName}
                    onChange={this.handleTemplateNameInput} />
                </Col>
              </Row>
            </Col>
            <Col span={16}>
              <Row>
                <Col style={{ marginBottom: 10 }}>标签：</Col>
                <Col>{/* 从模板新建才显示标签 */}
                  <EditableTagGroup editTag={this.editTag} tagString={tagString} /></Col>
              </Row>
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
            <Button onClick={this.handleClickCancel}>取消</Button>
            <Button
              onClick={this.handleClickOk}
              loading={isLoading}
              type='primary'>保存</Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ menuCenter, loading }) => ({
  loading,
  ...menuCenter
}))(CustomTemplate);
