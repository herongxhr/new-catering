import React from 'react';
import { List, Select, Input, Button, Badge, Radio, Spin, Row, Col, message } from 'antd';
import { routerRedux } from 'dva/router';
import MenuTemplateCard from '@/components/MenuTemplateCard';
import BreadcrumbWithTabs from '@/components/BreadcrumbWithTabs';
import { connect } from 'dva';
import styles from './MenuTemplate.less'
import SorterArrow from '@/components/SorterArrow';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

const Option = Select.Option;
const Search = Input.Search;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

// breadcrumbWithTabs中tabs数据
const tabList = [
  {
    key: 'unified',
    tab: '统一菜单',
  },
  {
    key: 'my',
    tab: '我的菜单',
  },
  {
    key: 'template',
    tab: '菜单模板',
  },
];
class MenuTemplate extends React.Component {
  state = {
    // 当前操作的模板
    currTemplateId: '',
    templateType: 'P',
    queryParams: {
      orderByField: 'create_date',
      isAsc: false,
      keywords: '',
      current: 1,
      pageSize: 9
    }
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
  // 点击tabs标签跳转到指定页面
  // 页面state中的activeTabKey会传给面包屑
  handleTabChange = key => {
    this.props.dispatch(routerRedux.push({
      pathname: `/menu-center/${key}`,
    }));
  }

  // 改变模板类型
  changeTemplateType = e => {
    this.setState({
      templateType: e.target.value
    }, () => this.getTemplateList())
  }

  // 模板项操作：查看/复制/删除/另存/编辑
  handleTemplateActions = (e, id) => {
    const { dispatch } = this.props;
    // 通过e.target.id来获取当前操作类型view,preview,copy,delete,edit, 
    const action = e.delAction || e.target.id;
    switch (action) {
      case 'preview':
        dispatch(routerRedux.push({
          pathname: '/menubar/menu-template/details',
          state: { templateId: id, templateType: this.state.templateType }
        }))
        break;
      case 'copy'://复制
      case 'delete'://删除
      case 'saveAsMy'://另存
        this.setState({
          currTemplateId: '',
        });
        // 调用相应的effect方法
        dispatch({
          type: `menuCenter/templateActions`,
          payload: { id, action },
          callback: this.callback
        }).then(this.success).then(this.getTemplateList);
        break;
      case 'custom':
        // 清空之前菜单数据，菜单模板详情数据
        dispatch({
          type: 'menuCenter/clearTemplateDetails'
        });
        dispatch(routerRedux.push({
          pathname: `/menubar/menu-template/custom`,
          state: { templateType: 'P' }
        }));
        break;
      case 'update':
        dispatch(routerRedux.push({
          pathname: '/menubar/menu-template/update',
          state: { templateId: id, templateType: this.state.templateType }
        }));
        return;
      default:
        return;
    }
  }

  success = () => {
    message.success('操作成功')
  }

  haveAnyTemplate = () => {
    this.props.dispatch({
      type: 'menuCenter/hasAnyTemplate'
    })
  }

  render() {
    const { location, loading, newTemplate } = this.props
    const { currTemplateId, templateType } = this.state;
    const itemLoading = loading.effects['menuCenter/templateActions'];
    const pageLoading = loading.effects[`menuCenter/fetch${templateType}MenuTemplate`]
    const templateList = this.props[`${templateType}MenuTemplate`];
    // 解构相应的（餐饮单位/管理单位）模板数据
    const records = this.props[`${templateType}MenuTemplate`].records || [];
    return (
      <div className={styles.template}>
        <BreadcrumbWithTabs
          {...location}
          tabList={tabList}
          onChange={this.handleTabChange}
          activeTabKey={'menu-template'}
        />
        <PageHeaderWrapper withTabs={true}>
          {/* 筛选区域 */}
          <Row className={styles.filterRow}>
            <Col span={4}>
              <Select style={{ width: 170 }}
                defaultValue="create_date"
                onChange={value => this.getTemplateList({ orderByAttr: value })}>
                <Option value="create_date">创建时间</Option>
                <Option value="modify_date">修改时间</Option>
                <Option value="used">使用次数</Option>
              </Select></Col>
            <Col span={1}>
              <SorterArrow onChange={value => this.getTemplateList({ isAsc: value })} />
            </Col>
            <Col span={19}><Search
              onChange={value => this.getTemplateList({ keywords: value })}
              placeholder="模板名称/标签"
              style={{ width: 300 }}
            /></Col>
          </Row>
          {/* 我的/推荐模板按钮组 */}
          <div className={styles.filterWrapper}>
            <Button onClick={this.handleTemplateActions} id="custom" type="primary" >创建模板</Button>
            <RadioGroup onChange={this.changeTemplateType} defaultValue={this.state.templateType}>
              <RadioButton value="P">我的</RadioButton>
              <Badge count={templateType === 'P' ? newTemplate : 0} >
                <RadioButton
                  style={{ borderRadius: '0 4px 4px 0', borderLeft: 'none' }}
                  value="C">
                  <span>推荐</span>
                </RadioButton>
              </Badge >
            </RadioGroup>
          </div>
          {/* 模板卡片展示区 */}
          <Spin tip='页面加载中...' size={'large'} spinning={pageLoading}>
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
                    spinning={item.id === currTemplateId && itemLoading}>
                  </MenuTemplateCard>
                </List.Item>
              )}
            />
          </Spin>
        </PageHeaderWrapper>
      </div>
    )
  }
}

export default connect(({ menuCenter, loading }) => ({
  CMenuTemplate: menuCenter.CMenuTemplate,
  PMenuTemplate: menuCenter.PMenuTemplate,
  templateActionResult: menuCenter.templateActionResult,
  loading,
  ...menuCenter,
}))(MenuTemplate);
