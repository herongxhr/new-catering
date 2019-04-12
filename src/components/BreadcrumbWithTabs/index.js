import React from 'react';
import { Breadcrumb, Tabs } from "antd";
import { Link } from "dva/router";
import BreadcrumbMap from '../../breadcrumbConfig';
import MenuContext from '@/layouts/MenuContext';
import styles from './index.less';

const { TabPane } = Tabs;
/**
 * 从location对象的pathname中直接映射出面包屑
 * @param {object} param0 页面组件的props.location对象
 * 从中解构出pathname
 */
export default class BreadcrumbWithTabs extends React.Component {
    render() {
        const {
            tabList, onChange, activeTabKey
        } = this.props;
        return (
            <MenuContext.Consumer>
                {({ location: { pathname } }) => {
                    const pathSnippets = pathname.split('/').filter(i => i);
                    let extraBreadcrumbItems = pathSnippets.map((_, index) => {
                        let url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
                        return (
                            <Breadcrumb.Item key={url}>
                                <Link to={url}>{BreadcrumbMap[url]}</Link>
                            </Breadcrumb.Item>
                        )
                    });
                    return (
                        <div style={{
                            position: 'fixed',
                            top: 70,
                            zIndex: 9999
                        }}
                            className={styles.wrap}>
                            <div className={styles.centerLayout}>
                                <Breadcrumb className={styles.breadcrumb}>
                                    {extraBreadcrumbItems}
                                </Breadcrumb>
                                {tabList && tabList.length ? (
                                    <Tabs
                                        className={styles.tabs}
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
                }}
            </MenuContext.Consumer>

        )
    }
}



