import React, { Fragment } from 'react';
import { Card, Button, Row, Col, Steps } from 'antd';
import { connect } from 'dva';
import { routerRedux } from 'dva/router'
import DescriptionList from '../../components/DescriptionList';
import BreadcrumbComponents from '../../components/BreadcrumbComponent';
import PageHeadWrapper from '../../components/PageHeaderWrapper';
import styles from './MenuDetails.less';
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
  }

  static getDerivedStateFromProps(props) {
    const { location: { state } } = props;
    if (state) {
      const { id = '' } = state;
      return { id };
    }
    return null;
  }

  getMenuDetail = id => {
    this.props.dispatch({
      type: `menuCenter/fetchMenuDetails`,
      payload: id
    })
  }

  componentDidMount() {
    const { id } = this.state;
    this.getMenuDetail(id);
  }

  // action操作区按钮回调
  success() {
    message.success('操作成功')
  }

  // 点击调整菜单按钮，跳转到调整页面
  // 把id和菜单类型传递过去
  handleArrangeDishes = () => {
    const { id } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: `/menubar/my/update`,
      state: { id }
    }))
  }

  viewPurOrder = () => {
    const { id } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/pur-order/details',
      state: { id }
    }))
  }

  yieldPurOrder = () => {
    const { id } = this.state;
    this.props.dispatch(routerRedux.push({
      pathname: '/pur-order/adjust',
      state: {
        channel: 'M',
        type: "S",
        data: { id }
      }
    }))
  }
  render() {
    const { location, menuDetails, allMealsData } = this.props;
    // 是否我的菜单
    const isMy = !menuDetails.superiorId;
    // 操作区
    const action = (
      <Fragment>
        <ButtonGroup>
          {/* <Button>打印</Button> */}
          {/* {menuDetails.status === '00'
            && <Button onClick={this.getMenuDetail}>恢复</Button>} */}
          {menuDetails.status === '00'
            && <Button onClick={this.handleArrangeDishes}>调整菜单</Button>}
        </ButtonGroup>
        {menuDetails.status === '00'
          && <Button onClick={this.yieldPurOrder} type="primary">采购食材</Button>}
        {(menuDetails.status === '01' || menuDetails.status === '10')
          && <Button onClick={this.viewPurOrder} type="primary">查看订单</Button>}
      </Fragment >
    );
    // 详细描述
    const description = (
      <DescriptionList className={styles.headerList} size="small" col="2">
        <Description term="周次">{`第${menuDetails.week || ''}周`}</Description>
        {/* 下达单位只有订单为统一菜单时才显示 */}
        {!isMy && <Description term="下达单位">
          {menuDetails.superior
            ? menuDetails.superior.superiorName || ''
            : {}}
        </Description>}
        <Description term="日期">
          {getYMD(menuDetails.beginDate) + '~' + getYMD(menuDetails.endDate)}
        </Description>
        <Description term={isMy ? "生成日期" : "下达日期"}>{getYMD(menuDetails.createTime)}</Description>
      </DescriptionList>
    );
    // 汇总区
    const extra = (
      <Row>
        <Col>
          <div className={styles.textSecondary}>状态</div>
          <div style={{ fontSize: 18 }}>
            {menuDetails.statusDisplayName}
          </div>
        </Col>
      </Row>
    );

    return (
      <div className='menuDetails'>
        <BreadcrumbComponents {...location} />
        <PageHeadWrapper
          className={styles.headerWrap}
          title={`菜单编号：${menuDetails.menuCode || ''}`}
          logo={<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />}
          action={action}
          content={description}
          extraContent={extra}
          {...this.props}
        >
          {/* 进度条 */}
          <Card style={{ width: 1160, marginTop: 20 }}>
            <Steps current={menuDetails.status === '00' ? 1 : 2} progressDot>
              <Step title="菜单下达" description={getYMDHms(menuDetails.createTime)} />
              <Step title="采购食材" description={getYMDHms(menuDetails.orderCreateTime)} />
              <Step title="下达订单" description={getYMDHms(menuDetails.orderTime)} />
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

export default connect(({ menuCenter, loading }) => ({
  ...menuCenter,
  isLoading: loading.effects['menuCenter/fetchMenuDetails']
}))(MenuDetails)