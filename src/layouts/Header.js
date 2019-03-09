import React, { Component } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';

const { Header } = Layout;

/**
 * 主要定义了头部区域在手机端或布局为顶部菜单时的宽度
 * 还定义了一些方法，如对消息操作的方法
 * 还有定义了点击头像区域时对不同页面的跳转
 * 如果是顶部菜单且不是手机端时引入TopNavHeader组件
 * 如果是手机端且是顶部菜单时，引入GlobalHeader组件
 */
class HeaderView extends Component {
    state = {
        visible: true,
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.autoHideHeader && !state.visible) {
            return {
                visible: true,
            };
        }
        return null;
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener
    // passive: Boolean，表示 listener 永远不会调用 preventDefault()。
    // 如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告
    componentDidMount() {
        document.addEventListener('scroll', this.handScroll, { passive: true });
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.handScroll);
    }

    // 设置头部宽度
    // 在手机端，或者是顶部菜单时或者不固定头部的时候，宽度为100%
    // 否则，如果菜单收起的话，留80px宽度
    // 菜单不收起时，留给sideMenu菜单256px宽度
    getHeadWidth = () => {
        const { isMobile, collapsed, setting } = this.props;
        const { fixedHeader, layout } = setting;
        if (isMobile || !fixedHeader || layout === 'topmenu') {
            return '100%';
        }
        return collapsed ? 'calc(100%-80px)' : 'calc(100%-256px)';
    };

    // 清除消息时的回调
    handleNoticeClear = type => {
        // 操作成功提示
        message.success(
            `${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({
                id: `component.globalHeader.${type}`,
            })}`
        );

        // 然后改变state
        // 其中type为类型，有通知，消息，待办三种
        const { dispatch } = this.props;
        dispatch({
            type: 'global/clearNotices',
            payload: type,
        });
    };

    // 是菜单栏右侧的头像菜单点击回调
    // 主要是跳转到指定route
    handleMenuClick = ({ key }) => {
        const { dispatch } = this.props;
        if (key === 'userCenter') {
            router.push('/account/center');
            return;
        }
        if (key === 'triggerError') {
            router.push('/exception/trigger');
            return;
        }
        if (key === 'userinfo') {
            router.push('/account/settings/base');
            return;
        }
        if (key === 'logout') {
            dispatch({
                type: 'login/logout',
            });
        }
    };

    // 消息功能弹出tab的显示与隐藏
    handleNoticeVisibleChange = visible => {
        if (visible) {
            const { dispatch } = this.props;
            dispatch({
                type: 'global/fetchNotices',
            });
        }
    };

    // 消息功能弹出tab的显示与隐藏
    handleNoticeVisibleChange = visible => {
        if (visible) {
            const { dispatch } = this.props;
            dispatch({
                type: 'global/fetchNotices',
            });
        }
    };

    // 当页面滚动时，且设置了自动隐藏菜单时的回调
    handScroll = () => {
        const { autoHideHeader } = this.props;
        const { visible } = this.state;
        if (!autoHideHeader) {
            return;
        }
        // 获取页面滚动条纵坐标
        const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
        if (!this.ticking) {
            this.ticking = true;
            //https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame
            requestAnimationFrame(() => {
                // 向上滚动时
                if (this.oldScrollTop > scrollTop) {
                    this.setState({
                        visible: true,
                    });
                    // 坐标大于300并且菜单是显示状态
                } else if (scrollTop > 300 && visible) {
                    this.setState({
                        visible: false,
                    });
                } else if (scrollTop < 300 && !visible) {
                    this.setState({
                        visible: true,
                    });
                }
                this.oldScrollTop = scrollTop;
                this.ticking = false;
            });
        }
    };

    render() {
        const { isMobile, handleMenuCollapse, setting } = this.props;
        const { navTheme, layout, fixedHeader } = setting;
        const { visible } = this.state;
        const isTop = layout === 'topmenu';
        const width = this.getHeadWidth();
        const HeaderDom = visible ? (
            <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
                {isTop && !isMobile ? (
                    <TopNavHeader
                        theme={navTheme}
                        mode="horizontal"
                        onCollapse={handleMenuCollapse}
                        onNoticeClear={this.handleNoticeClear}
                        onMenuClick={this.handleMenuClick}
                        onNoticeVisibleChange={this.handleNoticeVisibleChange}
                        {...this.props}
                    />
                ) : (
                        <GlobalHeader
                            onCollapse={handleMenuCollapse}
                            onNoticeClear={this.handleNoticeClear}
                            onMenuClick={this.handleMenuClick}
                            onNoticeVisibleChange={this.handleNoticeVisibleChange}
                            {...this.props}
                        />
                    )}
            </Header>
        ) : null;
        return (
            <Animate component="" transitionName="fade">
                {HeaderDom}
            </Animate>
        );
    }
}

export default connect(({
    // user,
    global,
    setting,
    loading
}) => ({
    //currentUser: user.currentUser,
    collapsed: global.collapsed,
    fetchingMoreNotices: loading.effects['global/fetchMoreNotices'],
    fetchingNotices: loading.effects['global/fetchNotices'],
    loadedAllNotices: global.loadedAllNotices,
    notices: global.notices,
    setting,
}))(HeaderView);
