import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Table, Divider } from 'antd';
import styles from './Unified.less';
import BreadcrumbWithTabs from '../../components/BreadcrumbWithTabs';
import CommonFilter from '../../components/CommonFilter';
import { getYMD } from '../../utils/utils';
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
// 列表表格上面筛选过滤功能组件所需数据
const filterData = {
	datePicker1: true,
};
class MenuCenter extends React.Component {
	state = {
		current: 1,
		pageSize: 10,
		startDate: '',
		endDate: '',
		status: '',
		onlyIssued: true
	}

	static getDerivedStateFromProps(props) {
		const { location: { state = {} } } = props;
		return { status: state.status || '' }
	}

	// 点击tabs标签跳转到指定页面
	handleTabChange = key => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menu-center/${key}`,
		}));
	}

	// 获取统一菜单列表
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
			pathname: `/menu-center/unified/details`,
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
	render() {
		const tableCols = [
			{
				title: '菜单编号',
				dataIndex: 'menuCode',
				render: (text, record) =>
					(<a onClick={() => this.previewItem(record)}>{text}</a>)
			},
			{
				title: '周次',
				dataIndex: 'week',
				render: text => `第${text || ''}周`
			},
			{
				title: '日期',
				key: 'date',
				render: (_, record) =>
					getYMD(record.beginDate) + '~' + getYMD(record.endDate)
			},
			{
				title: '下达单位',
				key: 'superiorName',
				render: (_, record) => {
					const superior = record.superior || {}
					return superior.superiorName
				}
			},
			{
				title: '下达时间',
				dataIndex: 'createTime',
				render: text => getYMD(text)
			},
			{
				title: '状态',
				dataIndex: 'statusDisplayName',
				render: text => `${text}`
			},
			{
				title: '操作',
				width: 160,
				dataIndex: 'status',
				render: (_, record) => {
					const status = record.status || ''
					switch (status) {
						case '10':
							return <a onClick={() => this.previewOrder(record)}>查看订单</a>
						case '00'://待采购
							return (
								<span>
									<a onClick={() => this.yieldPurOrder(record)}>采购</a>
									<Divider type={'vertical'} />
									<a onClick={() => this.updateMenu(record)}
										style={{ color: 'orange' }}>调整</a>
								</span>
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
		const records = menuList.records || [];
		// 状态筛选条状态值
		const { status } = this.state;
		return (
			<div className={styles.unified}>
				<BreadcrumbWithTabs
					{...location}
					tabList={tabList}
					onChange={this.handleTabChange}
					activeTabKey={'unified'}
				/>
				<PageHeaderWrapper withTabs={true}>
					<CommonFilter
						// 过滤器所用控件数据
						filterData={filterData}
						// 控制改变时的回调
						handleFilterChange={this.getMenuList}
						defaultStatus={status}
					/>
					<Table
						loading={isLoading}
						columns={tableCols}
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
		);
	}
}

export default connect(({ menuCenter, loading }) => ({
	menuList: menuCenter.menuList,
	isLoading: loading.effects['menuCenter/fetchMenuList']
}))(MenuCenter); 