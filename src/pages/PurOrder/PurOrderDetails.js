import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Table, Tag, Modal, Alert, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeadWrapper from '@/components/PageHeaderWrapper';
import styles from './PurOrderDetails.less';
import { routerRedux } from 'dva/router';
import { getYMD } from '../../utils/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import DisAcceptTable from '@/components/DisAcceptTable'
import BreadcrumbComponent from '@/components/BreadcrumbComponent';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

// 定义表格列
const tabColumns = [
	{
		title: '商品',
		key: "viewSku",
		dataIndex: "viewSku",
		render: text => text.wholeName
	},
	{
		title: '单位',
		key: "unit",
		dataIndex: "unit",
		// render:(text)=> {
		// 	return text.unit
		// }
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
		render: (text) => text.supplierName
	},
	{
		title: '配送日期',
		key: "requiredDate",
		dataIndex: "requiredDate",
		render: text => getYMD(text)
	},
]
class PurOrderDetails extends React.Component {
	state = {
		current: 1,
		visible: false,
		id: '',// 订单id
	}

	static getDerivedStateFromProps(props) {
		const { location: { state = {} } } = props;
		return { id: state.id || '' };
	}

	getOrderDetails = () => {
		const { id } = this.state;
		this.props.dispatch({
			type: 'purOrder/getOrderDetails',
			payload: id
		})
	}

	componentDidMount() {
		this.getOrderDetails();
	}
	// showModal = () => {
	// 	this.setState({
	// 		visible: true,
	// 	});
	// }

	// handleOk = (e) => {
	// 	this.setState({
	// 		visible: false,
	// 	});
	// 	message.success('操作成功');
	// }

	// handleOrder = (e) => {
	// 	const { dispatch } = this.props;
	// 	const payload = {}
	// 	payload.callback = (params) => {
	// 		if (params) {
	// 			this.getOrderDetails()
	// 		}
	// 	}
	// 	payload.id = this.state.id
	// 	dispatch({
	// 		type: 'purOrder/queryOrderPlace',
	// 		payload: payload
	// 	})
	// 	this.setState({
	// 		visible: false,
	// 	});
	// }

	// handleCancel = (e) => {
	// 	this.setState({
	// 		visible: false,
	// 	});
	// }

	// purOrderAdjust = (pathname, id) => {
	// 	const { props } = this
	// 	props.dispatch(routerRedux.push({
	// 		pathname,
	// 		state: {
	// 			adjustId: id
	// 		}
	// 	}))
	// }



	// queryDelivery = (params = {}) => {
	// 	const { dispatch } = this.props;
	// 	dispatch({
	// 		type: 'deliveryAcce/queryDelivery',
	// 		payload: {
	// 			...params
	// 		}
	// 	})
	// }

	// showDistributionModal = (orderNo, e) => {
	// 	e.stopPropagation()
	// 	this.setState({
	// 		visible: true,
	// 	});
	// 	this.queryDelivery({
	// 		orderNo: orderNo
	// 	})
	// }


	render() {
		const { orderDetails, isLoading } = this.props;
		let orderDetailVos = orderDetails.orderDetailVos || []
		const extra = (
			<Row>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>状态</div>
					<div className={styles.heading}>
						{orderDetails.status === '1'
							? '已下单'
							: orderDetails.status === '0'
								? '未下单' : ''}
					</div>
				</Col>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>总金额</div>
					<div className={styles.heading}>{orderDetails.total || 0}元</div>
				</Col>
			</Row>
		);

		const description = (
			<DescriptionList className={styles.headerList} size="small" col="2">
				<Description term="订单来源">
					{orderDetails.channel === 'M'
						? '菜单生成'
						: orderDetails.channel === 'S'
							? '辅料订单'
							: '自建订单'}
				</Description>
				<Description term="采购区间">
					{getYMD(orderDetails.startDate)}~{getYMD(orderDetails.endDate)}
				</Description>
				<Description term="创建时间">{getYMD(orderDetails.createTime)}</Description>
				<Description term="备注内容">{orderDetails.remark || '无'}</Description>
			</DescriptionList>
		);

		const noFinished = orderDetails.status === '0';
		const isFinished = orderDetails.status === '1';
		const actions = (
			<Fragment>
				<ButtonGroup style={{ marginRight: 20 }}>
					{noFinished && <Button >删除</Button>}
					{noFinished && <Button onClick={() => { }}>调整</Button>}
					{isFinished && <Button >再来一单</Button>}
				</ButtonGroup>
				{/* <Button>打印</Button> */}
				{noFinished && <Button type="primary" >下单</Button>}
				{isFinished && <Button type="primary">查看配送验收情况</Button>}
			</Fragment>
		);

		// const { visible } = this.state
		// const { delivery = {} } = this.props
		// const deliveryRecords = delivery.records || []
		return (
			<div className={styles.wrap}>
				<BreadcrumbComponent />
				{/* 页头容器 */}
				<PageHeadWrapper
					withTabs={false}
					logo={
						<img alt=""
							src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
					}
					title={`采购单号：${orderDetails.orderNo || ''}`}
					action={actions}
					content={description}
					extraContent={extra}
				>
					<div className={styles.body}>
						<div className={styles.title}>商品明细</div>
						<Table
							loading={isLoading}
							columns={tabColumns}
							dataSource={orderDetailVos}
							rowKey='id'
							pagination={{
								current: orderDetails.current || 1,
								pageSize: orderDetails.pageSize || 10,
								total: orderDetails.total || 0
							}}
						/>
					</div>
					{/* {
						orderDetails.status == '1' ? (
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
						) : (
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
					} */}
				</PageHeadWrapper>
			</div>
		)
	}
}

export default connect(({ purOrder, deliveryAcce, loading }) => ({
	delivery: deliveryAcce.delivery,
	orderDetails: purOrder.orderDetails,
	orderItemGoods: purOrder.orderItemGoods,
	isLoading: loading.effects['purOrder/getOrderDetails'],
}))(PurOrderDetails)