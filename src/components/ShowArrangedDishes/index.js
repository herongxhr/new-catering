import React, { Component, Fragment } from 'react';
import { Checkbox, Switch, Tag } from 'antd';
import { sortMealsData } from '../../utils/utils';
import styles from './index.module.less';
/**
 * 排餐表格，展示用，可显示辅料详情，可显示图片模式
 */
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

    /**
     * 根据是否图片模式，是否显示配料详情来返回每个单元格中的内容
     * @param{array} dishes 每一餐的菜品数据
     * @param{boolean} imgMode 是否图片模式
     * @param{boolean} showDetail 是否显示配料详情
     */
    getMealsTD = (meals = []) => {
        const { showDetail, imgMode } = this.state;
        return (
            <ul>
                {meals.map(item => {
                    // 防止报错，菜品信息数据
                    const viewFood = item.viewFood || {};
                    return <li key={item.foodId}>
                        {imgMode && <span className={styles.dishImg}>
                            <img src={viewFood.coverUrl} alt={viewFood.foodName} />
                        </span>}
                        {!imgMode && <div className={styles.dishName}>{viewFood.foodName}</div>}
                        {!imgMode && showDetail &&
                            <ul>{viewFood.gg.split('|').map((item, no) => (
                                <li key={no}>{item}</li>
                            ))}</ul>}
                    </li>
                })}
            </ul>
        )
    }

    // 构造表格行的DOM
    renderWeekday = weekdayNum => {
        const getTD = this.getMealsTD;
        const weekdaysName = ['一', '二', '三', '四', '五', '六', '日'];
        const mealsName = ['ZD', 'ZC', 'DX', 'WC'];//早点，中餐，点心，晚餐
        const { allMealsData } = this.props;
        // 按周几排列菜品数据
        const mealsSortedByWeekday = sortMealsData(allMealsData, 'zj');
        // 再把其中一天的数据按餐次进行排序
        const oneDayMealsSorted = mealsSortedByWeekday[weekdayNum] != null
            ? sortMealsData(mealsSortedByWeekday[weekdayNum], 'mealTimes') : {};
        if (mealsSortedByWeekday[weekdayNum]) {
            return (
                // 表示一星期中某一天的行
                <Fragment key={`${weekdayNum}rowWithPrice`}>
                    <tr key={weekdayNum}>
                        {/* 表示星期几的单元格 */}
                        <td>{weekdaysName[weekdayNum * 1 - 1]}</td>
                        {/* 渲染出早中晚餐单元格，有数据展示，没数据显示空 */}
                        {mealsName.map(mealName => {
                            //如果当餐有数据，计算单元格的内容
                            const oneMeal = oneDayMealsSorted[mealName] != null
                                ? getTD(oneDayMealsSorted[mealName]) : [];
                            return (
                                <td key={mealName} onClick={e => this.handleShowModal(e, weekdayNum, mealName)}>
                                    {oneMeal}
                                </td>
                            )
                        })}
                    </tr>
                    {<tr key={`${weekdayNum}price`}>
                        <td>预估价</td>
                        {mealsName.map(mealName => {
                            const oneMeal = oneDayMealsSorted[mealName] || [];
                            return (
                                <td key={`${mealName}price`} >
                                    {oneMeal.reduce((acc, curr) => {
                                        return acc = acc + curr.price;
                                    }, 0) || ''}
                                </td>
                            )
                        }
                        )}
                    </tr>}
                </Fragment>
            )
        }
    }

    render() {
        const weekdaysNum = ['1', '2', '3', '4', '5', '6', '7'];
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
                        {/* 周一到周日都调用一下方法生成表格行 */}
                        {weekdaysNum.map(weekdayNum => this.renderWeekday(weekdayNum)
                        ) || <tr><td>暂无数据</td></tr>}
                    </tbody>
                </table>
            </Fragment>
        )
    }
}