/*
 * @Author: suwei 
 * @Date: 2019-03-28 16:42:13 
 * @Last Modified by:   suwei 
 * @Last Modified time: 2019-03-28 16:42:13 
 */
import React, { Component } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon, Badge } from 'antd';
import { connect } from 'dva';
import logo from './logo.png';
import MenuDropDown from '../MenuDropDown'
import styles from './index.module.less';

const menus = [
	{
		path: '/home',
		name: '工作台',
		icon: 'home'
	},
	{
		path: '/menubar',
		name: '菜单中心',
		icon: 'bars'
	},
	{
		path: '/accSupermarket',
		name: '辅料超市',
		icon: 'shopping'
	},
	{
		path: '/purOrder',
		name: '采购订单',
		icon: 'profile'
	},
	{
		path: '/delivery',
		name: '配送验收',
		icon: 'bar-chart'
	},
	{
		path: '/parameter',
		name: '台帐',
		icon: 'read'
	}
]
class BaseMenu extends Component {
	getMenuItems = menus => {
		const matchUrl = this.props
		// .location.pathname.match(/(\/.+)\/?/)[0];
		const selectedMenuItem = menus.find(item => item.path === matchUrl);
		const menuItems = menus.map(menu => (
			<Menu.Item key={menu.name}>
				<Link to={menu.path}>
					<Icon type={menu.icon} />
					<span>{menu.name}</span>
				</Link>
			</Menu.Item>
		))
		return (
			<Menu
				key="Menu"
				theme="dark"
				mode="horizontal"
				className={styles.baseMenu}
				defaultSelectedKeys={[selectedMenuItem]}
			>
				<Menu.Item disabled style={{ width: 125 }} key="logo">
					<img src={logo} alt="安品" />
				</Menu.Item>
				{menuItems}
				<Menu.Item
					style={{ width: 60, textAlign: 'right', float: 'right' }}
					key="setting">
					<MenuDropDown />
				</Menu.Item>
				<Menu.Item
					style={{ width: 60, float: 'right' }}
					key="message" >
					<Link to='/message'>
						<Badge count={5}>
							<Icon
								style={{ fontSize: 16 }}
								type="bell"></Icon>
						</Badge>
					</Link>
				</Menu.Item>
			</Menu>
		)
	}

	render() {
		return (
			<div className={styles.menuWrap}>
				{this.getMenuItems(menus)}
			</div>
		);
	}
}

export default connect(({ menu }) => ({
	menuData: menu.memuData	
}))(BaseMenu)
