import React from 'react';
import { Table, Card, Badge, message } from 'antd';
//import WrappedInlineForm from '../InlineForm';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import BreadcrumbWithTabs from '../../components/BreadcrumbWithTabs';
import CommonFilter from '../../components/CommonFilter';
import styles from './My.less';

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
	statusGroup: [
		['', '全部'],
		['0', '未执行'],
		['1', '已执行']
	]
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

	// 查看订单详情
	handleView = record => {
		this.props.dispatch(routerRedux.push({
			pathname: `/menu-center/my/details`,
			state: {
				id: record.id,
				type: 'my'
			}
		}));
	}

	// 查看订单详情
	handleDelete = (e, record) => {
		e.stopPropagation();
		this.props.dispatch({
			type: 'menuCenter/deleteMyMenu',
			payload: record.id
		}).then(this.success)
			.then(this.getMenuData);
	}

	// 获取我的菜单列表
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

	success() {
		message.success('菜单删除成功')
	}

	componentDidMount() {
		this.getMenuData();
	}

	// commonFilter新建按钮点击回调
	// 下拉式按钮返回e指向当前点击按钮本身
	// 自定义菜单时，清空之前排餐数据
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
				key: 'menuCode',
			}, {
				title: '周次',
				dataIndex: 'week',
				key: 'week',
			}, {
				title: '日期',
				dataIndex: 'date',
				key: 'date',
			}, {
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
			}, {
				title: '操作',
				key: 'actions',
				render: (_, record) => {
					const status = record.status || '1'
					if (status === '0') {
						return <a onClick={e => { this.handleDelete(e, record) }}>删除</a>
					} else if (status === '1') {
						return <span onClick={() => this.handleView(record)}
							style={{ cursor: 'pointer' }}>查看</span>;
					} else {
						return <span>已过期</span>
					}
				}
			}];
		const { location, menuList } = this.props;
		// 状态筛选条状态值
		const records = menuList.records || [];
		// 状态筛选条状态值
		const { status } = this.state;
		return (
			<div>
				<BreadcrumbWithTabs
					{...location}
					tabList={tabList}
					onChange={this.handleTabChange}
					activeTabKey={'my'}
				/>
				<Card className={styles.tableList} bordered={false}>
					<div >
						<CommonFilter
							// 过滤器所用控件数据
							filterData={filterData}
							// 控制改变时的回调
							handleFilterChange={this.getMenuData}
							// 点击按钮时的回调
							handleMenuBtnClick={this.handleBtnClick}
							defaultStatus={status}
						/>
						<Table
							columns={tableColumns}
							dataSource={records}
							rowKey="id"
							onRow={record => {
								return {
									onClick: () => this.handleView(record)
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
		)
	}
}

export default connect(({ menuCenter }) => ({
	menuList: menuCenter.menuList
}))(MyMenu)