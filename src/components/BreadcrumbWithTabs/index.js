import React from 'react';
import { Breadcrumb, Tabs } from "antd";
import { Link } from "dva/router";
import BreadcrumbMap from '../../breadcrumbConfig';
import './index.less';

const { TabPane } = Tabs;
/**
 * 从location对象的pathname中直接映射出面包屑
 * @param {object} param0 页面组件的props.location对象
 * 从中解构出pathname
 */
export default class BreadcrumbWithTabs extends React.Component {

    render() {
        const {
            pathname, tabList, onChange, activeTabKey
        } = this.props;

        const pathSnippets = pathname.split('/').filter(i => i);
        let extraBreadcrumbItems = pathSnippets.map((_, index) => {
            let url = `/${pathSnippets.slice(0, index + 1).join('/')}/`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>{BreadcrumbMap[url]}</Link>
                </Breadcrumb.Item>
            )
        });
        return (
            <div className="breadcrumbWithTabs">
                <div className="centerLayout">
                    <Breadcrumb className="breadcrumb">
                        {extraBreadcrumbItems}
                    </Breadcrumb>
                    {tabList && tabList.length ? (
                        <Tabs
                            className={"tabs"}
                            defaultActiveKey={activeTabKey}
                            onChange={key => onChange(key)}
                        >
                            {tabList.map(item => (
                                <TabPane tab={item.tab} key={item.key} />
                            ))}
                        </Tabs>) : ''}
                </div>
            </div>
        )
    }
}



