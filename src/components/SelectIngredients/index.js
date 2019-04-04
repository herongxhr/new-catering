/*
 * @Author: suwei 
 * @Date: 2019-03-27 12:02:30 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 10:39:05
 */
import React from 'react';
import { Modal, Select, Input, Table, Tag } from 'antd';
import styles from './index.module.less';
const { Search } = Input;

class Selectf extends React.Component {
	cacheOriginData = [];
	count = 0

	constructor(props) {
		super(props)

		this.state = {
			data: props.dataSource,
		}
	}

	getRowByKey(key, newData) {
		const { data } = this.state;
		return (newData || data).filter(item => item.id === key)[0];
	}

	// deleteMeal = (params) => {
	// 	this.props.dispatch({
	// 		type: 'meal/saveMeal',
	// 		payload: params,
	// 	})
	// }

	render() {
		const { deleteMeal } = this.props;
		const tagListDom = this.props.mealArray.map(item => (
			// 自己新增的绿色显示
			<Tag color={'green'}
				style={{
					height: 32,
					lineHeight: "32px",
					fontSize: "14px",
					marginBottom: 10
				}}
				key={item.id}
				// 判断是不是自己加的菜
				closable={true}
				afterClose={() => deleteMeal(item.id)}
			>
				{item.goodsName}{item.property}
			</Tag>));

		//暴露出的方法
		const {
			handleModalVisble,
			handleModalHidden,
			handleFilter,
			visible,
		} = this.props;

		const {
			data
		} = this.state

		const columns = [{
			title: '食材名称',
			dataIndex: 'goodsName',
			key: 'goodsName',
		}, {
			title: '计量单位',
			dataIndex: 'unit',
			key: 'unit',
		}, {
			title: '规格',
			dataIndex: 'property',
			key: 'property',
		},
		{
			title: '价格',
			dataIndex: 'price',
			key: 'price',
		},
		{
			title: '图片',
			dataIndex: 'img0',
			key: 'img0',
			render: () => {
				return <a>查看</a>
			}
		}, 
		{
			title: '操作',
			dataIndex: 'opertaion',
			key: 'opertaion',
			render: (text, record) => {
				let newRecord = {
					id:record.id,
					forStaff:0,
					skuId:record.id,
					goodsName:record.wholeName,
					unit:record.unit,
					price:record.price
				}
				
				return	this.props.mealArray.some(item => item.id == record.id)
						? <span>已添加</span>
						: <a onClick={(() => this.props.addMeal(newRecord))}>添加</a>
			}
		}];

		return (
			<Modal
				wrapClassName={styles.selectDishes}
				width={1100}
				closable={false}
				title="选择辅料"
				visible={visible}
				okText="保存"
				onOk={handleModalVisble}
				onCancel={handleModalHidden}
			>
				<div className={styles.leftContent}>
					<div className={styles.filterWrap}>
						<label style={{ width: 42 }}>类别：
							<Select
								style={{ width: 170 }}
								defaultValue={''}
							>
							</Select>
						</label>
						<Search
							placeholder="请输入关键字进行搜索"
							onSearch={value => this.filterToGetData({ keywords: value })}
							style={{ width: 190, marginLeft: 10 }}
						/>
					</div>
					<Table
						style={{ height: 594 }}
						columns={columns}
						dataSource={data}
						rowKey="id"
						onRow={record => {
							return {
								onClick: () => { },
							};
						}}
					/>
				</div>
				<div className={styles.rightResult}>
					<ul className={styles.tagList}>
						{tagListDom}
					</ul>
				</div>
			</Modal>
		)
	}
}

export default Selectf
