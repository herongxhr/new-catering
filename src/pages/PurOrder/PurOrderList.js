/*
 * @Author: suwei 
 * @Date: 2019-03-21 17:55:51 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 15:34:52
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Tag, Menu, Button, Radio, Badge, Divider, Dropdown, Icon, Modal, Popconfirm, message } from 'antd';
import WrappedOrderFilter from '../../components/OrderFilter';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import DisAcceptTable from '../../components/DisAcceptTable'
import { withRouter } from 'react-router'
import { Scrollbars } from 'react-custom-scrollbars';
import { routerRedux } from 'dva/router';
import styles from './index.module.less';
import moment from 'moment'
// 定义表格列

class PurOrder extends React.Component {
	state = {
		current: 1,
		pageSize: 10,
		channel: '',
		keywords: '',
		status: '',
		startDate: '',
		endDate: '',
		orderByField: '',
		isAsc: '',
		visible: false
	}

	// 请求采购订单表格数据
	changeToGetData = (params = {}) => {
		this.setState({
			...params
		})
		this.props.dispatch({
			type: 'purOrder/queryOrderTable',
			payload: {
				...this.state,
				...params
			},
		})
	}
	
	queryDelivery = (params = {}) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'deliveryAcce/queryDelivery',
			payload: {
				...params
			}
		})
	}

	//新建按钮跳转
	handleLinkChange = (pathname, type) => {
		let channel = 'N'
		const { props } = this
		props.dispatch(routerRedux.push({
			pathname,
			state: { type , channel }
		}))
	}
	//下单
	previewOrder = (e,record) => {
		const { dispatch } = this.props;
		const payload = {}
		payload.callback = (params) => {
			if(params) {
				this.TableLinkChange('/purOrder/details',record)
			} else {
				message.error('下单失败')		
			}
		}
		payload.id = record.id
		dispatch({
			type: 'purOrder/queryOrderPlace',
			payload: payload
		})
	}
	
	orderDelete = (e,id) => {
		const { dispatch } = this.props;
		dispatch({
			type: 'purOrder/queryDeleteByIds',
			payload: {
				ids: [id]
			},
		})
	}
	//表格点击行跳转
	TableLinkChange = (pathname, record) => {
		this.props.dispatch(routerRedux.push({
			pathname,
			state: { id: record.id }
		}))
	}

	//表格 current 跳转
	handleTableChange = pagination => {
		const { current, pageSize } = pagination;
		// 先改变state
		this.setState({ current, pageSize });
		// 发请求
		this.changeToGetData({
			...this.state,
			current,
			pageSize
		})
	}

	showDistributionModal = (orderNo, e) => {
		e.stopPropagation()
		this.setState({
			visible: true,
		});
		this.queryDelivery({
			orderNo: orderNo
		})
	}

	//modal展示
	handleOk = (e) => {
		this.setState({
			visible: false,
		});
	}

	componentDidMount() {
		this.changeToGetData();
	}

	render() {
		const {
			className,
			location,
			orderTable,
		} = this.props;

		const tabColumns = [
			{
				title: '采购单号',
				key: 'orderNo',
				dataIndex: 'orderNo',
				filterMultiple: true,
			},
			{
				title: '订单来源',
				key: 'channel',
				dataIndex: 'channel',
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
				render: (text, record) => {
					return record.status === "0" ?
						(<div className='opertion' onClick={(e) => {e.stopPropagation()}}>
							<Popconfirm title="确定继续此操作?" onConfirm={(e) => this.previewOrder(e, record)}>
								<a className='orders'>下单</a>
							</Popconfirm>
							<Divider type="vertical" onClick={(e) => {e.stopPropagation()}}/>
							<Popconfirm title="确定继续此操作?" onConfirm={(e) =>this.orderDelete(e, record)}>
								<a className='delete'>删除</a>
							</Popconfirm>
						</div>) :
						(<a className={styles.acceptance} onClick={this.showDistributionModal.bind(this, record.orderNo)}>配送验收情况</a>)
				},
			}
		];
		// 点击新建时会下拉的按钮
		const dropdownBtn = () => {
			const pathname = '/purOrder/detail/adjust'
			const menu = (
				<Menu>
					<Menu.Item key="FOrder" onClick={() => this.handleLinkChange(pathname, 'S')}>食材订单</Menu.Item>
					<Menu.Item key="SOrder" onClick={() => this.handleLinkChange(pathname, 'F')}>辅料订单</Menu.Item>
				</Menu>
			)
			return (
				<span>
					<Dropdown overlay={menu}>
						<Button type="primary">
							<Icon type="plus" />新建<Icon type="down" />
						</Button>
					</Dropdown>
				</span>
			)
		}
		// 表格数据
		const current = orderTable.current || 1;
		const total = orderTable.total || 0;
		const records = orderTable.records || [];
		const { delivery = {} } = this.props
		const deliveryRecords = delivery.records || []
		return (
			<div className={className}>
				{/* 面包屑 */}
				<BreadcrumbComponent {...location} />
				<div className={styles.orderWrapper}>
					{/* 排序筛选部分 */}
					<WrappedOrderFilter
						handleFilter={this.changeToGetData}
						className="wrappedOrderForm" />
					<div className="buttonsWrapper">
						{/* 新建及按钮组部分 */}
						{dropdownBtn()}
						<span>
							<Radio.Group defaultValue="" onChange={e => {
								this.changeToGetData({
									status: e.target.value
								})
							}} >
								<Radio.Button value="">全部</Radio.Button>
								<Radio.Button value="0">未下单</Radio.Button>
								<Radio.Button value="1">已下单</Radio.Button>
							</Radio.Group>
						</span>
					</div>
					<div style={{ marginTop: 30 }}>
						<Table
							columns={tabColumns}
							dataSource={records}
							pagination={{ total, current }}
							onChange={this.handleTableChange}
							rowKey="id"
							onRow={ record => {
								return {
									onClick: () => {
										this.TableLinkChange('/purOrder/details', record)
									}
								}
							}}
						/>
					</div>
				</div>
				<Scrollbars style={{ width: 1060, height: 628 }}>
					<Modal title="配送验收情况"
						className={styles.orderModal}
						visible={this.state.visible}
						onOk={this.handleOk}
						//onCancel={this.handleCancel}
						closable={false}
						width={1060}
						maskStyle={{ background: 'rgba(0,0,0,0.25)' }}
						footer={[
							<Button key="submit" type="primary" onClick={this.handleOk}>
								关闭
							</Button>,
						]}
					>
						<DisAcceptTable records={deliveryRecords} />
					</Modal>
				</Scrollbars>
			</div>
		)
	}
}

export default connect(({ purOrder, deliveryAcce }) => ({
	orderTable: purOrder.orderTable,
	delivery: deliveryAcce.delivery,
}))(withRouter(PurOrder))