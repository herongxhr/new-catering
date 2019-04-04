import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import Moment from 'moment';
import { Card, Table, Badge } from 'antd';
import styles from './index.module.less';
import BreadcrumbWithTabs from '../../components/BreadcrumbWithTabs';
import CommonFilter from '../../components/CommonFilter';
import { getYMD } from '../../utils/utils';

// breadcrumbWithTabs中tabs数据
const tabList = [
	{
		key: 'unified-menu',
		tab: '统一菜单',
	},
	{
		key: 'my-menu',
		tab: '我的菜单',
	},
	{
		key: 'menu-template',
		tab: '菜单模板',
	},
];

// 列表表格上面筛选过滤功能组件所需数据
const filterData = {
	datePicker1: true,
	statusGroup: [
		['', '全部'],
		['0', '未执行'],
		['1', '已执行']
	]
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

	// 点击tabs标签跳转到指定页面
	// 页面state中的activeTabKey会传给面包屑
	handleTabChange = key => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menubar/${key}`,
		}));
	}

	// 查看订单详情
	handleShowDetail = record => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menubar/unified-menu/details`,
			state: {
				id: record.id,
				type: 'unified-menu'
			}
		}));
	}
	// 获取统一菜单列表
	getMenuData = (params = {}) => {
		this.setState(params);
		this.props.dispatch({
			type: 'menuCenter/fetchMenuData',
			payload: {
				...this.state,
				...params
			}
		});
	}

	componentDidMount() {
		this.getMenuData();
	}

	render() {
		const tableColumns = [
			{
				title: '菜单编号',
				dataIndex: 'menuCode',
				key: 'menuCode',
			},
			{
				title: '周次',
				dataIndex: 'week',
				key: 'week',
				render: text => `第${text}周`
			},
			{
				title: '日期',
				dataIndex: 'date',
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
				key: 'createTime',
				render: text => getYMD(text)
			},
			{
				title: '执行状态',
				dataIndex: 'status',
				key: 'status',
				render: text => {
					if (text === '1') {
						return (
							<span>
								<Badge status="success" />
								<span>已执行</span>
							</span>
						)
					} else if (text === '0') {
						return (
							<span>
								<Badge status="warning" />
								<span>未执行</span>
							</span>)
					} else {
						return (
							<span>
								<Badge status="default" />
								<span>已过期</span>
							</span>)
					}
				}
			}
		];
		const { location, menuList } = this.props;
		const records = menuList.records || [];
		// 状态筛选条状态值
		const { status } = this.state;
		return (
			<div>
				<BreadcrumbWithTabs
					{...location}
					tabList={tabList}
					onChange={this.handleTabChange}
					activeTabKey={'unified-menu'}
				/>
				<Card className={styles.tableList} bordered={false}>
					<div >
						<CommonFilter
							// 过滤器所用控件数据
							filterData={filterData}
							// 控制改变时的回调
							handleFilterChange={this.getMenuData}
							defaultStatus={status}
						/>
						<Table
							columns={tableColumns}
							dataSource={records}
							rowKey="id"
							onRow={(record) => {
								return {
									onClick: () => this.handleShowDetail(record)
								}
							}}
							pagination={{
								current: menuList.current || 1,
								pageSize: menuList.size || 10,
								total: menuList.total || 0
							}}
							onChange={({ current, pageSize }) =>
								this.getMenuData({ current, pageSize })}
						/>
					</div>
				</Card>
			</div>
		);
	}
}

export default connect(({ menuCenter }) => ({
	menuList: menuCenter.menuList,
}))(MenuCenter); 