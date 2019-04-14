import React from 'react';
import { Table, Card, Badge, message, Popconfirm, Divider } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWithTabs from '../../components/BreadcrumbWithTabs';
import CommonFilter from '../../components/CommonFilter';
import { getYMD } from '../../utils/utils';
import styles from './My.less';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

// breadcrumbWithTabs中tabs数据
const tabList = [
	{
		key: 'unified',
		tab: '统一菜单',
	},
	{
		key: 'my',
		tab: '我的菜单',
	},
	{
		key: 'template',
		tab: '菜单模板',
	},
];

// 列表表格上面筛选过滤功能组件所需数据
const filterData = {
	datePicker1: true,
	dropDownBtn: [{
		key: 'custom',
		text: '自定义'
	}, {
		key: 'choice-template',
		text: '模板导入'
	}],
};
class MyMenu extends React.Component {
	state = {
		current: 1,
		pageSize: 10,
		startDate: '',
		endDate: '',
		status: '',
		onlyIssued: false
	}

	// 点击tabs标签跳转到指定页面
	// 页面state中的activeTabKey会传给面包屑
	handleTabChange = key => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menu-center/${key}`,
		}));
	}

	// 获取我的菜单列表
	getMenuList = (params = {}) => {
		this.setState(params);
		this.props.dispatch({
			type: 'menuCenter/fetchMenuList',
			payload: {
				...this.state,
				...params
			}
		});
	}

	componentDidMount() {
		this.getMenuList();
	}
	// 列表项操作：查看
	previewItem = record => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menu-center/my/details`,
			state: {
				id: record.id,
			}
		}));
	}
	// 列表项操作：采购
	yieldPurOrder = record => {
		this.props.dispatch(routerRedux.push({
			pathname: '/pur-order/adjust',
			state: {
				channel: 'M',
				type: "S",
				data: { id: record.id }
			}
		}))
	}
	// 列表项操作：调整
	updateMenu = record => {
		this.props.dispatch(routerRedux.push({
			pathname: '/menu-center/my/update',
			state: { id: record.id }
		}))
	}

	// 列表项操作：查看订单
	previewOrder = record => {
		this.props.dispatch(routerRedux.push({
			pathname: '/pur-order/details',
			state: { id: record.id }
		}))
	}
	// 列表项操作：删除
	handleDelete = record => {
		this.props.dispatch({
			type: 'menuCenter/deleteMyMenu',
			payload: record.id
		}).then(this.success).then(this.getMenuList);
	}
	success() {
		message.success('菜单删除成功')
	}

	// 列表项操作：新建
	handleBtnClick = e => {
		const { dispatch } = this.props;
		// 清空之前菜单数据，菜单详情数据
		dispatch({
			type: 'menuCenter/clearMenuDetails'
		})
		// 跳转页面,从模板新建要先经过选择模板
		dispatch(routerRedux.push({
			pathname: `/menu-center/my/${e.key}`,
		}))
	}

	render() {
		const tableColumns = [
			{
				title: '菜单编号',
				dataIndex: 'menuCode',
				render: (text, record) =>
					(<a onClick={() => this.previewItem(record)}>{text}</a>)
			}, {
				title: '周次',
				dataIndex: 'week',
				key: 'week',
			}, {
				title: '日期',
				dataIndex: 'date',
				key: 'date',
				render: (_, record) =>
					getYMD(record.beginDate) + '~' + getYMD(record.endDate)
			}, {
				title: '状态',
				dataIndex: 'statusDisplayName',
				render: text => `${text}`
			}, {
				title: '操作',
				dataIndex: 'status',
				width: 160,
				render: (_, record) => {
					const status = record.status || ''
					switch (status) {
						case '10':
							return <a onClick={() => this.previewOrder(record)}>查看订单</a>
						case '00'://待采购
							return (
								<span>
									<a onClick={() => this.yieldPurOrder(record)}
										style={{ color: 'orange' }}>采购</a>
									<Divider type={'vertical'} />
									<a onClick={() => this.updateMenu(record)}
									>调整</a>
									<Divider type={'vertical'} />
									<Popconfirm
										title='确定要删除吗？'
										onConfirm={() => this.handleDelete(record)}
									><a>删除</a></Popconfirm>
								</span >
							)
						case '01'://待下单
							return <a onClick={() => this.previewOrder(record)}>查看订单</a>
						case '09':
						default:
							break;
					}
				}
			},
		];
		const { location, menuList, isLoading } = this.props;
		// 状态筛选条状态值
		const records = menuList.records || [];
		return (
			<div className={styles.my}>
				<BreadcrumbWithTabs
					{...location}
					tabList={tabList}
					onChange={this.handleTabChange}
					activeTabKey={'my'}
				/>
				<PageHeaderWrapper withTabs={true}>
					<CommonFilter
						// 过滤器所用控件数据
						filterData={filterData}
						// 控制改变时的回调
						handleFilterChange={this.getMenuList}
						// 点击按钮时的回调
						handleMenuBtnClick={this.handleBtnClick}
						defaultStatus={this.state.status}
					/>
					<Table
						loading={isLoading}
						columns={tableColumns}
						dataSource={records}
						rowKey="id"
						pagination={{
							current: menuList.current || 1,
							pageSize: menuList.size || 10,
							total: menuList.total || 0
						}}
						onChange={({ current, pageSize }) =>
							this.getMenuList({ current, pageSize })}
					/>
				</PageHeaderWrapper>
			</div>
		)
	}
}

export default connect(({ menuCenter, loading }) => ({
	menuList: menuCenter.menuList,
	isLoading: loading.effects['menuCenter/fetchMenuData']
}))(MyMenu)