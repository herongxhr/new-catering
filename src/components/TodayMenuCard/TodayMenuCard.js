import React, { Component } from 'react';
import styles from './TodayMenuCard.less';
import { Scrollbars } from 'react-custom-scrollbars';
import homeToday from './today.png';
import { Empty } from 'antd';

class TodayMenuCard extends Component {
  render() {
    const { todayMenu } = this.props;
    const breakfast = todayMenu.breakfast || []
    const lunch = todayMenu.lunch || []
    const dessert = todayMenu.dessert || []
    const dinner = todayMenu.dinner || []
    return (
      <div className={styles.menuCard}>
        <div className={styles.title}>今日菜单</div>
        <div className={styles.todaymenu}>
          <div className={styles.breakfast}>
            <div>早餐</div>
            <Scrollbars style={{ width: 180, height: 334, marginTop: 2 }}>
              {
                (breakfast.length > 0) ?
                  breakfast.map((data, index) => <li key={index}>{data}</li>) : <Empty
                    image={homeToday}
                    description={
                      <span>
                        暂未排餐哦~
                      </span>
                    }
                  />
              }
            </Scrollbars>
          </div>
          <div className={styles.lunch}>
            <div>中餐</div>
            <Scrollbars style={{ width: 180, height: 334, marginTop: 2 }}>
              {
                (lunch.length > 0) ?
                  lunch.map((data, index) => <li key={index}>{data}</li>) : <Empty
                    image={homeToday}
                    description={
                      <span>
                        暂未排餐哦~
                      </span>
                    }
                  />
              }
            </Scrollbars>
          </div>
          <div className={styles.dessert}>
            <div>点心</div>
            <Scrollbars style={{ width: 180, height: 334, marginTop: 2 }}>
              {
                (dessert.length > 0) ?
                  (dessert.map((data, index) => <li key={index}>{data}</li>)) : (<Empty
                    image={homeToday}
                    description={
                      <span >
                        暂未排餐哦~
                    </span>
                    }
                  />)
              }
            </Scrollbars>
          </div>
          <div className={styles.dinner}>
            <div>晚餐</div>
            <Scrollbars style={{ width: 180, height: 334, marginTop: 2 }}>
              {
                (dinner.length > 0) ?
                  dinner.map((data, index) => <li key={index}>{data}</li>) : <Empty
                    image={homeToday}
                    description={
                      <span >
                        暂未排餐哦~
                    </span>
                    }
                  />
              }
            </Scrollbars>
          </div>
        </div>

      </div>
    );
  }
}

export default TodayMenuCard;