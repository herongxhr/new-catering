import React, { Component } from 'react';
import styles from './Home.less';
import TodayMenuCard from '../../components/TodayMenuCard/TodayMenuCard'
import TodoListCard from '../../components/TodoListCard/TodoListCard'
import Accepting from '../../components/Accepting/Accepting'
import StatisticChart from '../../components/StatisticChart'
import { Card, Button, Tabs, Radio, Divider, Empty } from 'antd';
import moment from 'moment'
import { connect } from 'dva';
import { withRouter } from "react-router";
import homeBanner from './homeBanner.png';

const TabPane = Tabs.TabPane;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class Index extends Component {
  state = {
    timeType: 'today',
    pager: {
      current: '',
      pageSize: ''
    }
  }
  queryTodoList = () => {
    const { dispatch } = this.props;
    //请求待办事项
    dispatch({
      type: 'home/queryTodoLists',
    })
  }
  querytodayMenu = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/querytodayMenu',
    })
  }
  querydeviceInfo = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/querydeviceInfo',
    })
  }
  queryStatistics = (params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'home/queryStatistics',
      payload: {
        ...params
      }
    })
  }
  queryDelivery = (params = {}) => {
    const { dispatch, } = this.props;
    dispatch({
      type: 'deliveryAcce/queryDelivery',
      payload: {
        ...params
      }
    })
  }
  handleQuery = (data) => {
    this.setState(Object.assign(this.state.pager, data))
  }
  handleAccet = (value) => {
    this.setState({ timeType: value }, () => {
      this.queryDelivery({
        ...this.state.pager,
        timeType: this.state.timeType
      })
    })
  }
  handleStatistics = (e) => {
    this.queryStatistics({ timeType: e.target.value })
  }
  componentDidMount() {
    this.queryTodoList()
    this.querytodayMenu()
    this.querydeviceInfo()
    this.queryStatistics()
  }
  render() {
    const { home } = this.props
    const todoList = home.todoList || [];
    const todayMenu = home.todayMenu || {};
    const deviceInfo = home.deviceInfo || [];
    const statistics = home.statistics || [];
    var timestamp = Date.parse(new Date());
    const date = moment(timestamp).format("YYYY-MM-DD dddd")
    const weeks = moment(timestamp).format("WW")
    const operations = <span className='extra' onClick={
      () => {
        this.props.history.push('/delivery')
      }
    }>查看全部</span>;
    return (
      <div className={styles.app}>
        <div>{this.props.children}</div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.pic}>
              <img src={homeBanner} />
            </div>
            <div className={styles.time}>
              <h3>第{weeks}周</h3>
              <h6>{date}</h6>
            </div>
          </div>
          <div className={styles.data}>
            <div>
              <TodoListCard todoList={todoList} />
              <div className={styles.tools}>
                <Card title="常用工具" bordered={false} style={{ width: 350 }}>
                  <Button className={`${styles.toolsbtn} ${styles.cgml}`} onClick={() => {
                    this.props.history.push('/home/purCatalog')
                  }}>采购目录</Button>
                  <Button className={styles.toolsbtn} onClick={() => {
                    this.props.history.push('/parameter')
                  }}>本月台账</Button>
                  <Button className={styles.toolsbtn} onClick={() => {
                    this.props.history.push('/home/outStock')
                  }}>缺货上报</Button>
                </Card>
              </div>
            </div>
            <TodayMenuCard todayMenu={todayMenu} />
          </div>

          <div className={styles.accepting}>
            <Tabs tabBarExtraContent={operations} onChange={this.handleAccet}>
              <TabPane tab="今日验收" key="today">
                <Accepting queryList={this.queryDelivery} timeType={this.state.timeType} handleQuery={this.handleQuery} />
              </TabPane>
              <TabPane tab="明日验收" key="tomorrow">
                <Accepting queryList={this.queryDelivery} timeType={this.state.timeType} handleQuery={this.handleQuery} />
              </TabPane>
            </Tabs>
          </div>
          <div className={styles.wrapper}>
            <div className={styles.paying}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ width: 226, height: 65, fontSize: 16, lineHeight: 4, rgba: (0, 0, 0, 0.85) }}>应付款统计分析</p>
                <div>
                  <RadioGroup defaultValue="month" onChange={this.handleStatistics}>
                    <RadioButton value="month">本月</RadioButton>
                    <RadioButton value="quarter">本季度</RadioButton>
                    <RadioButton value="year">本年</RadioButton>
                  </RadioGroup>
                </div>
              </div>
              {statistics.length > 0 ? <StatisticChart statistics={statistics} /> : <Empty />}
            </div>
            <div className={styles.opening}>
              <div className={styles.timeTitle}>设备最后开机时间</div>
              <Divider />
              <div className={styles.openingItem}>
                <span>晨检仪</span>
                <span>{moment(deviceInfo.morningDetector).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <Divider />
              <div className={styles.openingItem}>
                <span>验货机</span>
                <span>{moment(deviceInfo.inspectionMachinemoment).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <Divider />
              <div className={styles.openingItem}>
                <span>易检设备</span>
                <span>{moment(deviceInfo.easyInspectionEquipment).format('YYYY-MM-DD HH:mm:ss')}</span>
              </div>
              <Divider />
              <div style={{ width: 350, height: 54, textAlign: 'center', marginTop: 18, color: '#54C4CE' }}>查看全部</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const ShowARouter = withRouter(Index);
export default connect(({ home, deliveryAcce }) => ({
  home, deliveryAcce
}))(ShowARouter);
