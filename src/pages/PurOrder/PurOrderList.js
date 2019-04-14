import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Tag, Button, Badge, Divider, Modal, Popconfirm, message } from 'antd';
import WrappedOrderFilter from '../../components/OrderFilter';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import DisAcceptTable from '../../components/DisAcceptTable'
import { routerRedux } from 'dva/router';
import styles from './PurOrderList.less';
import moment from 'moment'
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
// 定义表格列

class PurOrderList extends React.Component {
	state = {
		current: 1,
		pageSize: 10,
		startDate: '',
		endDate: '',
		channel: '',
		keywords: '',
		status: '',
		orderByField: '',
		isAsc: '',
		visible: false
	}

	static getDerivedStateFromProps(props) {
		const { location: { state = {} } } = props;
		// 根据传递过来的key值，让status处于相应的状态
		return { status: state.key }
	}

	// 请求采购订单表格数据
	getPurOrderList = (params = {}) => {
		this.setState(params);
		this.props.dispatch({
			type: 'purOrder/fetchPurOrderList',
			payload: {
				...this.state,
				...params
			},
		})
	}

	componentDidMount() {
		this.getPurOrderList();
	}

	// 列表项操作：新建/查看/删除/下单/查看验收单
	handleListItemActions = (action, record) => {
		const { dispatch } = this.props;
		const actionId = action.id || action;
		switch (actionId) {
			case 'customF':// 新建
			case 'customS':
				dispatch({// 清除旧数据
					type: 'purOrder/clearOrderTableForm'
				})
				dispatch(routerRedux.push({
					pathname: `/pur-order/${actionId}`,
					state: { channel: `${actionId}`, type: actionId.substring(6, 8) }
				}))
				break;
			case 'preview':// 查看
				dispatch(routerRedux.push({
					pathname: '/pur-order/details',
					state: { id: record.id, type: record.type }
				}));
				break;
			case 'delete':// 删除
				dispatch({
					type: 'purOrder/queryDeleteByIds',
					payload: {
						ids: [record.id]
					},
				}).then(this.success).then(this.getPurOrderList);
				break;
			case 'order':// 下单
				dispatch({
					type: 'purOrder/yieldOrder',
					payload: record.id
				}).then(this.success).then(() => this.redirectToPurOrderDetails(record))
				break;
			case 'showModal':// 查看配送
				this.setState({
					visible: true,
				});
				dispatch({
					type: 'deliveryAcce/queryDelivery',
					payload: record.orderNo
				})
				break;
			default:
				break;
		}
	}

	// 下单后跳转
	redirectToPurOrderDetails = record => {
		this.props.dispatch(routerRedux.push({
			pathname: '/purOrder/details',
			state: { id: record.id }
		}))
	}

	//modal展示
	handleOk = () => {
		this.setState({
			visible: false,
		});
	}
	success = () => {
		message.success('操作成功')
	}

	render() {
		const tabColumns = [
			{
				title: '采购单号',
				width: 100,
				dataIndex: 'orderNo',
				filterMultiple: true,
				render: (text, record) => (<a
					onClick={() => this.handleListItemActions('preview', record)}>
					{text}</a>)
			},
			{
				title: '订单来源',
				dataIndex: 'channel',
				width: 60,
				render: (channel) => {
					switch (channel) {
						case 'N':
							return <Tag color="orange">自建订单</Tag>;
						case 'M':
							return <Tag color="green">菜单生成</Tag>
						case 'S':
							return <Tag color="cyan">辅料订单</Tag>
						default:
							break;
					}
				},
			},
			{
				title: '创建日期',
				width: 120,
				key: 'createTime',
				dataIndex: 'createTime',
				render: (text) => {
					return <span>{moment(text).format('YYYY-MM-DD')}</span>
				}
			},
			{
				title: '摘要',
				key: 'summary',
				dataIndex: 'summary',
			},
			{
				title: '状态',
				width: 100,
				key: 'status',
				dataIndex: 'status',
				render: (status) => {
					return status === '0' ?
						(<span><Badge status="warning" />未下单</span>) :
						(<span><Badge status="success" />已下单</span>)
				}
			},
			{
				title: '操作',
				width: 120,
				render: (_, record) => {
					const status = record.status || '';
					if (status === '0') {
						return (<div>
							<Popconfirm title="确定下单吗?" onClick={e => { e.stopPropagation() }}
								onConfirm={() => this.handleListItemActions('order', record)}>
								<a className='orders'>下单</a>
							</Popconfirm>
							<Divider type="vertical" />
							<Popconfirm title="确定要删除吗?" onClick={e => { e.stopPropagation() }}
								onConfirm={() => this.handleListItemActions('delete', record)}>
								<a>删除</a>
							</Popconfirm>
						</div>)
					}
					if (status === '1') {
						return <a
							onClick={() => this.handleListItemActions('showModal', record)}
						>配送验收情况</a>
					}
				},
			}
		];
		const { location, orderTable, isLoading, delivery } = this.props;
		const records = orderTable.records || [];
		const deliveryRecords = delivery.records || []
		return (
			<Fragment>
				{/* 面包屑 */}
				<BreadcrumbComponent {...location} hidden={true} />
				<PageHeaderWrapper withTabs={false}>
					{/* 排序筛选部分 */}
					<WrappedOrderFilter
						handleFilter={this.getPurOrderList}
						handleCustomOrder={this.handleListItemActions}
						className="wrappedOrderForm"
						defaultStatus={this.state.status}
					/>
					<Table
						columns={tabColumns}
						dataSource={records}
						pagination={{
							current: orderTable.current || 1,
							pageSize: orderTable.size || 10,
							total: orderTable.total || 0,
						}}
						onChange={({ current, size }) => this.getPurOrderList({ current, size })}
						rowKey="id"
						loading={isLoading}
					/>
					<Modal title="配送验收情况"
						className={styles.orderModal}
						visible={this.state.visible}
						bodyStyle={{ height: 485 }}
						closable={false}
						width={1060}
						maskStyle={{ background: 'rgba(0,0,0,0.25)' }}
						footer={[
							<Button type="primary" onClick={this.handleOk}>关闭</Button>
						]}
					>
						<DisAcceptTable records={deliveryRecords} />
					</Modal>
				</PageHeaderWrapper>
			</Fragment>
		)
	}
}

export default connect(({ purOrder, deliveryAcce, loading }) => ({
	orderTable: purOrder.orderTable,
	delivery: deliveryAcce.delivery,
	isLoading: loading.effects['purOrder/fetchPurOrderList']
}))(PurOrderList)