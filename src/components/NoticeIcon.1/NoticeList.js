import React from 'react';
import { Avatar, List, Skeleton } from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.module.less';

let ListElement = null;

export default function NoticeList({
    // 列表项数据
    data = [],
    // 点击消息列表项的回调
    onClick,
    // 点击清空按钮的回调
    onClear,
    // 消息分类的tabs标题
    title,
    locale,
    // 没有消息时的文本
    emptyText,
    emptyImage,
    // 当前Tab的加载状态
    loading,
    // 加载更多的回调
    onLoadMore,
    // 控制弹层的显示和隐藏
    visible,
    // 是否已加载完所有消息
    loadedAll = true,
    // 允许滚动自加载
    scrollToLoad = true,
    // 是否显示清空按钮
    showClear = true,
    // 加载时占位骨架的数量
    skeletonCount = 5,
    // 加载时占位骨架的属性
    skeletonProps = {},
}) {
    if (data.length === 0) {
        return (
            <div className={styles.notFound}>
                {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
                <div>{emptyText || locale.emptyText}</div>
            </div>
        );
    }

    // 先从类数组对象创建一个数组，然后为其增加对象元素
    // 对象元素有loading属性及其值
    const loadingList = Array.from({ length: loading ? skeletonCount : 0 }).map(() => ({ loading }));
    const LoadMore = loadedAll ? (
        <div className={classNames(styles.loadMore, styles.loadedAll)}>
            <span>{locale.loadedAll}</span>
        </div>
    ) : (
            <div className={styles.loadMore} onClick={onLoadMore}>
                <span>{locale.loadMore}</span>
            </div>
        );

    // 列表List的onScroll Api, 其参数为事件对象event
    const onScroll = event => {
        // 禁用滚动加载|| 正在加载 || 已加载完全部消息
        if (!scrollToLoad || loading || loadedAll) return;
        if (typeof onLoadMore !== 'function') return;
        // 此时currentTarget为List组件
        const { currentTarget: t } = event;
        if (t.scrollHeight - t.scrollTop - t.clientHeight <= 40) {
            onLoadMore(event);
            ListElement = t;
        }
    };

    // 如果弹层要隐藏并且之前滚动加载过数据
    // 让列表List返回顶部
    if (!visible && ListElement) {
        try {
            // scrollTo() 方法可把内容滚动到指定的坐标。
            // scrollTo(xpos,ypos)
            ListElement.scrollTo(null, 0);
        } catch (err) {
            ListElement = null;
        }
    }
    return (
        <div>
            <List className={styles.list} loadMore={LoadMore} onScroll={onScroll}>
                {[...data, ...loadingList].map((item, i) => {
                    const itemCls = classNames(styles.item, {
                        [styles.read]: item.read,
                    });
                    // eslint-disable-next-line no-nested-ternary
                    const leftIcon = item.avatar ? (
                        typeof item.avatar === 'string' ? (
                            <Avatar className={styles.avatar} src={item.avatar} />
                        ) : (
                                <span className={styles.iconElement}>{item.avatar}</span>
                            )
                    ) : null;

                    return (
                        <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
                            <Skeleton avatar title={false} active {...skeletonProps} loading={item.loading}>
                                <List.Item.Meta
                                    className={styles.meta}
                                    avatar={leftIcon}
                                    title={
                                        <div className={styles.title}>
                                            {item.title}
                                            <div className={styles.extra}>{item.extra}</div>
                                        </div>
                                    }
                                    description={
                                        <div>
                                            <div className={styles.description} title={item.description}>
                                                {item.description}
                                            </div>
                                            <div className={styles.datetime}>{item.datetime}</div>
                                        </div>
                                    }
                                />
                            </Skeleton>
                        </List.Item>
                    );
                })}
            </List>
            {showClear ? (
                <div className={styles.clear} onClick={onClear}>
                    {locale.clear} {title}
                </div>
            ) : null}
        </div>
    );
}
