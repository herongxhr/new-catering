import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Table, Tag, Modal, Alert, message } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeadWrapper from '@/components/PageHeaderWrapper';
import styles from './PurOrderDetails.less';
import { routerRedux } from 'dva/router';
import { getYMD } from '../../utils/utils';
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

	// 列表项操作：新建/查看/删除/下单/查看验收单
	handleListItemActions = e => {
		const { id } = this.state;
		const { dispatch } = this.props;
		const action = e.target.id;
		switch (action) {
			case 'delete':// 删除
				dispatch({
					type: 'purOrder/queryDeleteByIds',
					payload: {
						ids: [id]
					},
				}).then(this.success).then(this.redirectToPurOrderList);
				break;
			case 'order':// 下单
				dispatch({
					type: 'purOrder/yieldOrder',
					payload: id
				}).then(this.success).then(() => this.redirectToPurOrderDetails(id))
				break;
			case 'showDeliveryModal':// 查看配送
				this.setState({
					visible: true,
				});
				dispatch({
					type: 'deliveryAcce/queryDelivery',
					payload: id
				})
				break;
			case 'adjust':
				dispatch(routerRedux.push({
					pathname: '/pur-order/adjust',
					state: { id }
				}))
				break;
			default:
				break;
		}
	}
	// 下单后跳转
	redirectToPurOrderDetails = id => {
		this.props.dispatch(routerRedux.push({
			pathname: '/pur-order/details',
			state: { id }
		}))
	}
	// 下单后跳转
	redirectToPurOrderList = () => {
		this.props.dispatch(routerRedux.push({
			pathname: '/pur-order/list',
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
		const { orderDetails, isLoading, delivery } = this.props;
		const goodsItems = orderDetails.orderDetailVos || [];
		const deliveryRecords = delivery.records || [];
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
				<ButtonGroup style={{ marginRight: 20 }} onClick={this.handleListItemActions}>
					{noFinished && <Button id='delete'>删除</Button>}
					{noFinished && <Button id='adjust'>调整</Button>}
					{isFinished && <Button id='buyAgain' >再来一单</Button>}
				</ButtonGroup>
				{/* <Button>打印</Button> */}
				{noFinished && <Button id='order' type="primary"
					onClick={this.handleListItemActions}>下单</Button>}
				{isFinished && <Button id='showDeliveryModal' type="primary"
					onClick={this.handleListItemActions}>查看配送验收情况</Button>}
			</Fragment>
		);

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
					<div className={styles.title}>商品明细</div>
					<Table
						loading={isLoading}
						columns={tabColumns}
						dataSource={goodsItems}
						rowKey='id'
						pagination={false}
						footer={data => (
							<h3 className={styles.total}>
								共有：<span style={{ color: 'orange' }}>{data.length || 0}</span> 件商品
							</h3>
						)}
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