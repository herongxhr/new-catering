import React from 'react';
import { List, Select, Input, Button, Badge, Radio, Card, Row, Col, message } from 'antd';
import { routerRedux } from 'dva/router';
import MenuTemplateCard from '../../components/MenuTemplateCard';
import BreadcrumbWithTabs from '../../components/BreadcrumbWithTabs';
import { connect } from 'dva';
import styles from './index.module.less'
import SorterArrow from '../../components/SorterArrow';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

// breadcrumbWithTabs中tabs数据
const tabList = [
  {
    key: 'unified-menu',
    tab: '统一菜单',
  },
  {
    key: 'my-menu',
    tab: '我的菜单',
  },
  {
    key: 'menu-template',
    tab: '菜单模板',
  },
];
class MenuTemplate extends React.Component {
  state = {
    activeTabKey: 'menu-template',
    // 当前操作的模板
    currTemplateId: '',
    templateType: 'P',
    queryParams: {
      orderByAttr: 'create_date',
      isAsc: false,
      keywords: '',
      current: 1,
      pageSize: 9
    }
  }

  // 点击tabs标签跳转到指定页面
  // 页面state中的activeTabKey会传给面包屑
  handleTabChange = key => {
    this.props.dispatch(routerRedux.push({
      pathname: `/menubar/${key}`,
    }));
  }

  // 改变模板类型
  changeTemplateType = e => {
    this.setState({
      templateType: e.target.value
    })
    this.props.dispatch({
      type: `menuCenter/fetch${e.target.value}MenuTemplate`,
      payload: {
        ...this.state.queryParams
      }
    })
  }
  // 对模板进行复制，删除等操作
  handleTemplateActions = (e, id) => {
    const { dispatch } = this.props;
    // 通过e.target.id来获取当前操作类型copy,delete,edit
    const action = e.delAction || e.target.id;
    switch (action) {
      case 'view':
      case 'preview':
        dispatch(routerRedux.push({
          pathname: '/menubar/menu-template/details',
          state: { id, templateType: this.state.templateType }
        }))
        return;
      case 'update':
        dispatch(routerRedux.push({
          pathname: '/menubar/menu-template/update',
          state: { id, templateType: this.state.templateType }
        }));
        return;
      case 'copy':
      case 'delete':
      case 'saveAsMy':
        this.setState({
          currTemplateId: id,
        });
        // 调用相应的effect方法
        dispatch({
          type: `menuCenter/templateActions`,
          payload: { id, action, callback: this.callback }
        }).then(this.getTemplateList)
      default:
        return;
    }
  }

  callback = () => {
    message.success('操作成功')
  }
  // 创建模板
  handleNewTemplate = () => {
    const { dispatch } = this.props;
    // 清空之前菜单数据，菜单详情数据
    dispatch({
      type: 'menuCenter/clearTemplateDetails'
    })
    dispatch(routerRedux.push({
      pathname: `/menubar/menu-template/new`,
      state: { templateType: 'P' }
    }))
  }

  haveAnyTemplate = () => {
    this.props.dispatch({
      type: 'menuCenter/hasAnyTemplate'
    })
  }

  getTemplateList = (params = {}) => {
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        ...params
      }
    });
    this.props.dispatch({
      type: `menuCenter/fetch${this.state.templateType}MenuTemplate`,
      payload: { ...this.state.queryParams, ...params }
    })
  }
  componentDidMount() {
    // 使用默认请求参数请求模板数据
    this.getTemplateList();
    this.haveAnyTemplate();
  }

  render() {
    const { location, loading, queryHasAnyTemplate } = this.props
    const { currTemplateId, templateType } = this.state;
    const isLoading = loading.effects['menuCenter/templateActions'];
    const templateList = this.props[`${templateType}MenuTemplate`];
    // 解构相应的（餐饮单位/管理单位）模板数据
    const records = this.props[`${templateType}MenuTemplate`].records || [];
    return (
      <div>
        <BreadcrumbWithTabs
          {...location}
          tabList={tabList}
          onChange={this.handleTabChange}
          activeTabKey={this.state.activeTabKey}
        />
        <Card style={{ width: 1160, margin: '20px auto', }}>
          {/* 筛选区域 */}
          <Row>
            <Col span={4}>
              <Select style={{ width: 170 }}
                defaultValue="create_date"
                onChange={value => this.getTemplateList({ orderByAttr: value })}>
                <Option value="create_date">创建时间</Option>
                <Option value="modify_date">修改时间</Option>
                <Option value="used">使用次数</Option>
              </Select></Col>
            <Col span={1}><SorterArrow onChange={value => this.getTemplateList({ isAsc: value })} /></Col>
            <Col span={19}><Search
              onChange={value => this.getTemplateList({ keywords: value })}
              placeholder="模板名称/标签"
              style={{ width: 300 }}
            /></Col>
          </Row>
          {/* 我的/推荐模板按钮组 */}
          <div className={styles.filterWrapper}>
            <Button onClick={this.handleNewTemplate} type="primary" >创建模板</Button>
            <RadioGroup onChange={this.changeTemplateType} defaultValue={this.state.templateType}>
              <RadioButton value="P">我的</RadioButton>
              <Badge count={templateType === 'P' ? queryHasAnyTemplate : 0} >
                <RadioButton
                  style={{ borderRadius: '0 4px 4px 0', borderLeft: 'none' }}
                  value="C">
                  <span>推荐</span>
                </RadioButton>
              </Badge >
            </RadioGroup>
          </div>
          {/* 模板卡片展示区 */}
          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={records}
            pagination={{
              showQuickJumper: true,
              current: templateList.current || 1,
              total: templateList.total || 0,
              defaultPageSize: 9,
              pageSize: templateList.size || 9,
              showTotal: total => `共${total}条数据`,
              onChange: (page, size) => this.getTemplateList({ current: page, size })
            }}
            renderItem={item => (
              <List.Item style={{ marginBottom: 30 }}>
                <MenuTemplateCard
                  itemData={item}
                  key={item.id}
                  // 指出模板类型
                  templateType={templateType}
                  handleTemplateActions={this.handleTemplateActions}
                  // 当前卡片必须与点击的卡片相同时，具备加载状态
                  spinning={item.id === currTemplateId && isLoading}>
                </MenuTemplateCard>
              </List.Item>
            )}
          />
        </Card>
      </div>
    )
  }
}

export default connect(({ menuCenter, loading }) => ({
  CMenuTemplate: menuCenter.CMenuTemplate,
  PMenuTemplate: menuCenter.PMenuTemplate,
  templateActionResult: menuCenter.templateActionResult,
  queryHasAnyTemplate: menuCenter.queryHasAnyTemplate,
  loading
}))(MenuTemplate);

