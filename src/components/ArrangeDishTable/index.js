import React, { Component, Fragment } from 'react';
import { Checkbox, Switch } from 'antd';
import styles from './index.module.less';

export default class ShowArrangedDishes extends Component {
    state = {
        imgMode: false,
        showDetail: false
    }

    handleShowDetail = e => {
        this.setState({
            showDetail: e.target.checked
        })
    }
    // 切换图片模式与文本模式
    handleChangeMode = value => {
        this.setState({
            imgMode: value
        })
    }

    // 构造表格行的DOM
    // 根据参数是周几来得到当天的表格行数据
    // 行数据包括了预估价那一行
    renderWeekdayRow = weekday => {
        const weekdays = {
            monday: '一',
            tuesday: '二',
            wednesday: '三',
            thursday: '四',
            friday: '五',
            saturday: '六',
            sunday: '日'
        };
        const {
            camenuDetailVOMap,
            priceDataMap
        } = this.props;
        const getDL = this.getDisheList;
        // 检查父组件传递的数据是否某一天的数据
        if (camenuDetailVOMap[weekday]) {
            const {
                lunch = [], breakfast = [], dessert = [], dinner = []
            } = camenuDetailVOMap[weekday];
            if (priceDataMap[weekday]) {
                var {
                    lunch: lunchVal, breakfast: breakfastVal, dessert: dessertVal, dinner: dinnerVal
                } = priceDataMap[weekday];
            }

            return (
                <Fragment>
                    <tr>
                        <td>{weekdays[weekday]}</td>
                        <td>{getDL(breakfast)}</td>
                        <td>{getDL(lunch)}</td>
                        <td>{getDL(dessert)}</td>
                        <td>{getDL(dinner)}</td>
                    </tr>
                    <tr>
                        <td>预估价</td>
                        <td>{lunchVal}</td>
                        <td>{breakfastVal}</td>
                        <td>{dessertVal}</td>
                        <td>{dinnerVal}</td>
                    </tr>
                </Fragment>
            )
        }
    }
    /**
     * 根据是否图片模式，是否显示配料详情来返回每个单元格中的内容
     * @param{array} dishes 每一餐的菜品数据
     * @param{boolean} imgMode 是否图片模式
     * @param{boolean} showDetail 是否显示配料详情
     */
    getDisheList = (dishes) => {
        const { showDetail, imgMode } = this.state;
        return (
            <ul>
                {!!dishes.length && dishes.map(item => (
                    <li key={item.foodId}>
                        {imgMode && <span className={styles.dishImg}>
                            <img src={item.cover} alt={item.foodName} />
                        </span>}
                        {!imgMode && <div className={styles.dishName}>{item.foodName}</div>}
                        {!imgMode && showDetail &&
                            <ul>{item.foodDetails.map(item => (
                                <li key={item.sort}>{item.goodsName}</li>
                            ))}</ul>}
                    </li>))}
            </ul>
        )
    }

    render() {
        return (
            <Fragment>
                <div className={styles.tableControls} onChange={() => { }}>
                    <span style={{ float: "left" }}>
                        <Checkbox onChange={this.handleShowDetail}>配料详情</Checkbox>
                    </span>
                    <span style={{ float: "right" }}>图片模式：
                    <Switch onChange={this.handleChangeMode} />
                    </span>
                </div>
                {/* 排餐表格 */}
                <table className={styles.arrangeDisthTable} >
                    <thead>
                        <tr>
                            <th>周</th><th>早餐</th><th>中餐</th><th>点心</th><th>晚餐</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderWeekdayRow('monday')}
                        {this.renderWeekdayRow('tuesday')}
                        {this.renderWeekdayRow('wednesday')}
                        {this.renderWeekdayRow('thursday')}
                        {this.renderWeekdayRow('friday')}
                        {this.renderWeekdayRow('saturday')}
                        {this.renderWeekdayRow('sunday')}
                    </tbody>
                </table>
            </Fragment>

        )
    }
}