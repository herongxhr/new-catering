import React, { PureComponent } from 'react';
import { Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';
// import BreadcrumbView from './breadcrumb';

// const { TabPane } = Tabs;
// 此组件主要是完成头部内容的结构及其样式
// 其中内容区，操作区，其它内容区都的结构由外面传入
export default class PageHeader extends PureComponent {

    // 原型中不需要Tabs
    // onChange = key => {
    //     const { onTabChange } = this.props;
    //     if (onTabChange) {
    //         onTabChange(key);
    //     }
    // };

    render() {
        const {
            title,
            logo,
            action,
            content,
            extraContent,
            className,
            loading = false,
            wide = false,
            // tabList,
            // tabActiveKey,
            // tabDefaultActiveKey,
            // tabBarExtraContent,
            // hiddenBreadcrumb = false,
        } = this.props;

        const clsString = classNames(styles.pageHeader, className);
        // const activeKeyProps = {};
        // // 默认打开的tab页面
        // if (tabDefaultActiveKey !== undefined) {
        //     activeKeyProps.defaultActiveKey = tabDefaultActiveKey;
        // }
        // // 指定的打开的tab页面
        // if (tabActiveKey !== undefined) {
        //     activeKeyProps.activeKey = tabActiveKey;
        // }
        return (
            <div className={clsString}>
                <div className={wide ? styles.wide : ''}>
                    <Skeleton
                        // 显示占位图
                        loading={loading}
                        // 显示标题
                        title={true}
                        // 显示动画
                        active
                        paragraph={{ rows: 3 }}
                        avatar={{ size: 'large', shape: 'circle' }}
                    >
                        {/* {hiddenBreadcrumb ? null : <BreadcrumbView {...this.props} />} */}
                        <div className={styles.detail}>
                            {logo && <div className={styles.logo}>{logo}</div>}
                            <div className={styles.main}>
                                <div className={styles.row}>
                                    <h1 className={styles.title}>{title}</h1>
                                    {action && <div className={styles.action}>{action}</div>}
                                </div>
                                <div className={styles.row}>
                                    {content && <div className={styles.content}>{content}</div>}
                                    {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                                </div>
                            </div>
                        </div>
                        {/* {tabList && tabList.length ? (
                            <Tabs
                                className={"tabs"}
                                {...activeKeyProps}
                                onChange={this.onChange}
                                tabBarExtraContent={tabBarExtraContent}
                            >
                                {tabList.map(item => (
                                    <TabPane tab={item.tab} key={item.key} />
                                ))}
                            </Tabs>
                        ) : null} */}
                    </Skeleton>
                </div>
            </div>
        );
    }
}
