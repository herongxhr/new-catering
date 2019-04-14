/*
 * @Author: suwei 
 * @Date: 2019-03-27 12:02:30 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 10:39:05
 */
import React from 'react';
import { Modal, Select, Input, Table, Tag } from 'antd';
import { withRouter } from "react-router";
import styles from './index.module.less';
const { Search } = Input;

class SelectModal extends React.Component {
	cacheOriginData = [];
	count = 0
	// data = props.dataSource
	state = {
		cateringId: '',//餐饮单位id
		type: '',//类别：S:食材;F:辅料
		keywords: '',//关键字
		catalogId: '',//大类id
		subcatalogId: '',//子类id
		superiorId: '',//管理单位id
		notInclude: true,//未收录
		brand: '',//品牌
		current: 1,//当前页
		pageSize: 10,//页大小

	}

	static getDerivedStateFromProps(props) {
		return { type: props.type }
	}

	myGetSkuList = (params = {}) => {
		const { getSkuList } = this.props;
		this.setState(params);
		getSkuList({
			...this.state,
			...params,
		});
	}
	getRowByKey(key, newData) {
		const { data } = this.state;
		return (newData || data).filter(item => item.id === key)[0];
	}

	handlePreviewItem = id => {
		this.props.history.push({
			pathname: '/dishDetails',
			state: { id }
		})
	}
	componentDidMount() {
		this.myGetSkuList();
	}

	render() {
		const {
			deleteMeal,
			skuList,
			handleModalVisble,
			handleModalHidden,
			visible,
			mealArray,
			addMeal,
		} = this.props;
		const skuData = skuList.records || [];
		const tagListDom = mealArray.map(item => (
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
				onClose={() => deleteMeal(item.id)}
			>{item.viewSku.goodsName}{item.property}</Tag>));

		const columns = [
			{
				title: '名称',
				dataIndex: 'goodsName',
				width: 150,
				render: (text, record) =>
					<a onClick={() => this.handlePreviewItem(record.id)}>{text}</a>
			},
			{
				title: '单位',
				width: 80,
				dataIndex: 'unit',
			},
			{
				title: '规格',
				dataIndex: 'wholeName',
				render: text => text.length > 25 ? text.slice(0, 20) + '...' : text
			},
			{
				title: '价格',
				width: 80,
				dataIndex: 'price',
			},
			{
				title: '图片',
				width: 80,
				dataIndex: 'img0',
				render: () => {
					return <a>查看</a>
				}
			},
			{
				title: '操作',
				width: 80,
				key: 'opertaion',
				render: (_, record) => {
					let newRecord = {
						id: record.id,
						viewSku: { goodsName: record.wholeName },
						unit: record.unit || '',
						price: record.price || 0,
						skuId: record.id,
						quantity: 0,
						supplier: record.supplier || {}
					}
					return mealArray.some(item => item.id == record.id)
						? <span>已添加</span>
						: <a onClick={(() => addMeal(newRecord))}>添加</a>
				}
			}];

		return (
			<Modal
				wrapClassName={styles.selectDishes}
				width={1100}
				closable={false}
				title="选择商品"
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
								onChange={value => this.myGetSkuList({ catalogId: value })}
							>
								<Option value=''>全部</Option>
							</Select>
						</label>
						<Search
							placeholder="请输入关键字进行搜索"
							onSearch={value => this.myGetSkuList({ keywords: value })}
							style={{ width: 190, marginLeft: 10 }}
						/>
					</div>
					<Table
						style={{ height: 594 }}
						columns={columns}
						dataSource={skuData}
						rowKey="id"
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

export default withRouter(SelectModal);
