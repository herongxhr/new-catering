import React, { Fragment } from 'react';
import { Card, Button, Row, Col, Steps } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import DescriptionList from '../../components/DescriptionList';
import BreadcrumbComponents from '../../components/BreadcrumbComponent';
import PageHeadWrapper from '../../components/PageHeaderWrapper';
import styles from './index.module.less';
import ShowArrangedDishes from '../../components/ShowArrangedDishes';
import { getYMD, getYMDHms } from '../../utils/utils';

const Step = Steps.Step;
const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

/**
 * 菜单详情组件，不同状态显示不同按钮
 * 统一菜单和我的菜单共用一个组件，只是路径不一样
 * 通过location.state.type进行区分
 */
class MenuDetails extends React.Component {
  state = {
    id: '',
    type: '',
  }

  static getDerivedStateFromProps(nextProps) {
    const { location: { state } } = nextProps;
    if (state) {
      const { id = '', type = '' } = state;
      return { id, type };
    }
    return null;
  }

  getMenuDetail = () => {
    const { id } = this.state;
    this.props.dispatch({
      type: `menuCenter/fetchMenuDetails`,
      payload: id
    })
  }
  // 点击调整菜单按钮，跳转到调整页面
  // 把id和菜单类型传递过去
  handleArrangeDishes = () => {
    const { id, type } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: `/menubar/${type}/adjust`,
      state: { id, type }
    }))
  }

  viewPurOrder = () => {
    const { id } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/purOrder/details',
      state:  {id} 
    }))
  }
  yieldPurOrder = () => {
    const { id } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/purOrder/detail/adjust',
      state: {
        channel: 'M',
        type: "S",
        data: { id }
      }
    }))
  }

  componentDidMount() {
    this.getMenuDetail();
  }
  render() {
    const { location, menuDetails, allMealsData } = this.props;
    const { type } = this.state;
    // 是否我的菜单
    const isMy = type === 'my';
    // 菜单编号
    const menuCode = menuDetails.menuCode || '';
    const beginDate = menuDetails.beginDate || '';
    const endDate = menuDetails.endDate || '';
    // 菜单创建时间
    const createTime = menuDetails.createTime || '';
    // 适用年份
    const nd = menuDetails.nd || '';
    // 适用周次
    const week = menuDetails.week || '';
    const status = menuDetails.status || '';
    // 供应商
    const superior = menuDetails.superiorName || '';
    // 订单信息，未下单的订单没有订单信息
    const order = menuDetails.order || {};
    // 订单采购时间
    const orderCreateTime = order.createTime || '';
    // 订单的采购时间
    const orderTime = order.orderTime || '';
    // 记录订单是否已经执行，在下面内容中根据条件显示
    const canOperator = status === '0';
    // 操作区
    const action = (
      <Fragment>
        <ButtonGroup>
          {/* <Button>打印</Button> */}
          {canOperator && <Button onClick={this.getMenuDetail}>恢复</Button>}
          {canOperator && <Button onClick={this.handleArrangeDishes}>调整菜单</Button>}
        </ButtonGroup>
        {!canOperator && <Button onClick={this.viewPurOrder} type="primary">查看采购单</Button>}
        {canOperator && <Button onClick={this.yieldPurOrder} type="primary">采购食材</Button>}
      </Fragment >
    );
    // 详细描述
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="周次">{`第${week}周`}</Description>
        {/* 下达单位只有订单为统一菜单时才显示 */}
        {!isMy && <Description term="下达单位">{superior}</Description>}
        <Description term="日期">
          {getYMD(beginDate) + '~' + getYMD(endDate)}
        </Description>
        <Description term={isMy ? "生成日期" : "下达日期"}>{getYMD(createTime)}</Description>
      </DescriptionList>
    );
    // 汇总区
    const extra = (
      <Row>
        <Col>
          <div className={styles.textSecondary}>状态</div>
          <div style={{ fontSize: 18 }}>
            {!canOperator ? '已执行' : (status === '0' ? '未执行' : '已失效')}
          </div>
        </Col>
      </Row>
    );

    return (
      <div className='menuDetails'>
        <BreadcrumbComponents {...location} />
        <PageHeadWrapper
          className={styles.headerWrap}
          title={`菜单编号：${menuCode}`}
          logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
          action={action}
          content={description}
          extraContent={extra}
          {...this.props}
        >
          {/* 进度条 */}
          <Card style={{ width: 1160, marginTop: 20 }}>
            <Steps current={canOperator ? 1 : 2} progressDot>
              <Step title="菜单下达" description={getYMDHms(createTime)} />
              <Step title="采购食材" description={getYMDHms(orderCreateTime)} />
              <Step title="下达订单" description={getYMDHms(orderTime)} />
            </Steps>
          </Card>
          {/* 排餐区 */}
          <Card
            style={{ width: 1160, marginTop: 20 }}
            bodyStyle={{ padding: 20 }}>
            <ShowArrangedDishes
              allMealsData={allMealsData}
            />
          </Card>
        </PageHeadWrapper>
      </div>
    )
  }
}

export default connect(({ menuCenter }) => ({
  ...menuCenter
}))(MenuDetails)