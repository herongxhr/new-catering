/*
 * @Author: suwei 
 * @Date: 2019-03-28 16:42:20 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-28 17:15:27
 */
import React from 'react'
import { Menu, Icon, Dropdown, Avatar  } from 'antd';
import { Link } from 'dva/router';
import { withRouter } from "react-router";

import './index.less'

class MenuDropDown extends React.Component {
  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <div>
            <Avatar style={{ backgroundColor: '#87d068' }} icon="user" />
            <p>横店中心小学</p>
            <p>欢迎您</p>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="0">
          <a onClick={() => this.props.history.push('/Setting/information')}>      
            <Icon
              style={{ fontSize: 16 }}
              type="setting"></Icon>
              <span style={{marginLeft:10}}>账号设置</span>
          </a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href='/Setting/outStock' >
            <Icon type="snippets" />
            <span style={{marginLeft:10}}>缺样上报</span>
          </a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
        <Icon type="export" />
        <span style={{marginLeft:10}}>退出当前账户</span>
        </Menu.Item>
      </Menu>
    );
    return( 
      <Dropdown overlay={menu} placement="bottomRight" style={{width:220,height:242}} overlayClassName='menu-dropdown' trigger={['click']}>
        <a className="ant-dropdown-link" href="#">
          <Icon
          style={{ fontSize: 16 }}
          type="setting"></Icon>
        </a>
      </Dropdown>
    )
  }
}

export default withRouter(MenuDropDown)