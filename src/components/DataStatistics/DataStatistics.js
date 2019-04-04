import React, { Component } from 'react';
import './DataStatistics.less';
import { Tabs, } from 'antd';

const TabPane = Tabs.TabPane;

class DataStatistics extends Component {
    render() {
        return ( 
        <div className="DataStatistics">
            <Tabs>
                <TabPane tab="菜谱使用率" key="1"></TabPane>
                <TabPane tab="菜单变更率" key="2"></TabPane>
                <TabPane tab="设备使用情况" key="3"></TabPane>
            </Tabs>
        </div>
        );
    }
    }

export default DataStatistics;
