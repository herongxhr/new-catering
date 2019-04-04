/*
 * @Author: suwei 
 * @Date: 2019-03-20 14:43:54 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 15:34:50
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Row, Col, Table, Tag, Modal, Alert, message } from 'antd';
import DescriptionList from '../../components/DescriptionList';
import Bread from '../../components/Bread'
import PageHeadWrapper from '../../components/PageHeaderWrapper';
import styles from './index.module.less';
import { routerRedux, Redirect } from 'dva/router';
import moment from 'moment'
import { Scrollbars } from 'react-custom-scrollbars';
import DisAcceptTable from '../../components/DisAcceptTable'



const { Description } = DescriptionList;

// 定义表格列
const tabColumns = [
	{
		title: '商品',
		key: "viewSku",
		dataIndex: "viewSku",
		render:(text)=>text.wholeName
	},
	{
		title: '单位',
		key: "unit",
		dataIndex: "viewSku",
		render:(text)=> {
			return text.unit
		}
	},
	{
		title: '单价',
		key: "price",
		dataIndex: "price"
	},
	{
		title: '数量',
		key: "quantity",
		dataIndex: "quantity"
	},
	{
		title: '供应商',
		key: "supplier",
		dataIndex: "supplier",
		render:(text)=>text.supplierName
	},
	{
		title: '配送日期',
		key: "requiredDate",
		dataIndex: "requiredDate",
		render:(text)=>moment(text).format('YYYY-MM-DD')
	},
]

const bread = [{
	href: '/purOrder',
	breadContent: '采购订单'
}, {
	breadContent: '详情'
}]

class PurOrderDetails extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			initLoading: true,
			loading: false,
			data: [],
			list: [],
			current: 1,
			visible: false,
			id: '',// 订单id
		}
	}

	static getDerivedStateFromProps(props) {
		const { location } = props
		if (location.state) {
			const { id = '' } = location.state;
			return { id }
		}
		return null;
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	}

	handleOk = (e) => {
		this.setState({
			visible: false,
		});
		message.success('操作成功');
	}

	handleOrder = (e) => {
		const { dispatch } = this.props;
		const payload = {}
		payload.callback = (params) => {
			if(params) {
				this.getOrderDetails()
			}
		}
		payload.id = this.state.id
		dispatch({
			type: 'purOrder/queryOrderPlace',
			payload: payload
		})
		this.setState({
			visible: false,
		});
	}

	handleCancel = (e) => {
		this.setState({
			visible: false,
		});
	}

	purOrderAdjust = (pathname, id) => {
		const { props } = this
		props.dispatch(routerRedux.push({
			pathname,
			state:{
				adjustId:id
			}
		}))
	}

	getOrderDetails = () => {
		const { id } = this.state;
		this.props.dispatch({
			type: 'purOrder/getOrderDetails',
			payload: id
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

	showDistributionModal = (orderNo, e) => {
		e.stopPropagation()
		this.setState({
			visible: true,
		});
		this.queryDelivery({
			orderNo: orderNo
		})
	}

	componentDidMount() {
		this.getOrderDetails()
	}

	render() {
		const modalObject = {
			width: '340px',
			height: '140px',
			display: 'flex',
		}
		const {
			location,
			orderDetails={},
		} = this.props;
		const {
			...rest
		} = orderDetails //取值
	
		const startDate = rest.startDate || ''
		const endDate = rest.endDate || ''
		let orderDetailVos = rest.orderDetailVos || []
		
		let orderChannel;
		if (rest.channel === 'M') {
			orderChannel = '菜单生成';
		} else if (rest.channel === 'S') {
			orderChannel = '辅料订单';
		} else {
			orderChannel = '自建订单';
		}

		const extra = (
			<Row>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>状态</div>
					<div className={styles.heading}>{rest.status === '1' ? '已下单' : '未下单'}</div>
				</Col>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>总金额</div>
					<div className={styles.heading}>{rest.total}元</div>
				</Col>
			</Row>
		);

		const description = (
			<DescriptionList className={styles.headerList} size="small" col="2">
				<Description term="订单来源">{orderChannel}</Description>
				<Description term="采购区间">
				{ startDate&&endDate ? `${moment(startDate).format('YYYY-MM-DD')}~${moment(endDate).format('YYYY-MM-DD')}` : ''}
				</Description>
				<Description term="创建时间">{moment(rest.createTime).format('YYYY-MM-DD')}</Description>
				<Description term="备注内容">{rest.remark}</Description>
			</DescriptionList>
		);


		const cardTitle = (
			<span className={styles.cardTitle}>商品明细：<Tag color="cyan">共{orderDetailVos ? orderDetailVos.length : '0'}条</Tag></span>
		);


		const chooseButtonGroup = () => {
			if (rest.status == '1') return otherAction
			else return action
		}

		const action = (
			<Fragment>
				<Button>打印</Button>
				<Button style={{ marign: '0px 20px' }}>删除</Button>
				<Button onClick={() => this.purOrderAdjust('/purOrder/detail/adjust',this.state.id)}>调整</Button>
				<Button type="primary" onClick={this.showModal}>下单</Button>
			</Fragment>
		);

		const otherAction = (
			<Fragment>
				<Button>打印</Button>
				<Button style={{ marign: '0px 20px' }}>再来一单</Button>
				<Button type="primary" onClick={this.showDistributionModal.bind(this, rest.orderNo)}>查看配送验收情况</Button>
			</Fragment>
		)

		const loadMore = () => {
			return (
				<div style={{
					textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
				}}
				>
					<Button onClick={this.onLoadMore}>加载更多</Button>
				</div>
			)
		}

		const { loading, data, visible } = this.state 

		const { delivery = {} } = this.props
		const deliveryRecords = delivery.records || []
		return (
			<div className={styles.PurOrderDetails}>
				{  orderDetailVos   ? null : <Redirect to='/purOrder'></Redirect>}
				<Bread bread={bread} value='/purOrder'></Bread>
				{/* 页头容器 */}
				<PageHeadWrapper
					className={styles.pageHeadWrap}
					title={`采购单号：${rest.orderNo ? rest.orderNo : ''}`}
					logo={
						<img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
					}
					action={chooseButtonGroup()}
					content={description}
					
					extraContent={extra}
					{...this.props}
				>
					<Card
						title={cardTitle}
						className={styles.tableCard}
						bordered={false}
						headStyle={{ padding: "14px 30px 6px" }}
						bodyStyle={{ padding: "0 30px" }}
					>
						<Table
							pagination={false}
							loading={loading}
							rowKey='id'
							columns={tabColumns}
							dataSource={orderDetailVos}
							footer={() => loadMore()}
						/>
					</Card>
					{
						rest.status == '1' ? ( 
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
					) :  ( 
						<Modal
							visible={visible}
							onOk={this.handleOrder}
							onCancel={this.handleCancel}
							bodyStyle={modalObject}
							width='340px'
							closable={false}
						>
							<Alert message="采购单将下发给各供货商，确认下单？" type="warning" showIcon style={{ background: 'white', border: '0px', marginTop: '40px' }} />
						</Modal> 
					)
					}
				</PageHeadWrapper>
			</div>
		)
	}
}

export default connect(({ purOrder , deliveryAcce }) => ({
	delivery: deliveryAcce.delivery,
	orderDetails: purOrder.orderDetails,
	orderItemGoods: purOrder.orderItemGoods
}))(PurOrderDetails)