import React, { PureComponent } from 'react';
import Link from 'umi/link';
import RightContent from '../GlobalHeader/RightContent';
import BaseMenu from '../SiderMenu/BaseMenu';
import { getFlatMenuKeys } from '../SiderMenu/SiderMenuUtils';
import styles from './index.less';
import { title } from '../../defaultSettings';

/**
 * 这个组件主要是引进了BaseMenu组件，菜单的真正数据是在那里定义的
 * 另外引入了RightContent区域，这个就是顶部菜单旁边的一排小图标
 * 有消息，图像，搜索，多语言等
 */
export default class TopNavHeader extends PureComponent {
    state = {
        maxWidth: undefined,
    };

    static getDerivedStateFromProps(props) {
        return {
            // 流式布局时宽度要减掉logo区165，左边距40，还有右部小图标区
            maxWidth: (props.contentWidth === 'Fixed' ? 1200 : window.innerWidth) - 280 - 165 - 40,
        };
    }

    render() {
        const { theme, contentWidth, menuData, logo } = this.props;
        const { maxWidth } = this.state;
        const flatMenuKeys = getFlatMenuKeys(menuData);
        return (
            <div className={`${styles.head} ${theme === 'light' ? styles.light : ''}`}>
                <div
                    ref={ref => {
                        this.maim = ref;
                    }}
                    className={`${styles.main} ${contentWidth === 'Fixed' ? styles.wide : ''}`}
                >
                    <div className={styles.left}>
                        <div className={styles.logo} key="logo" id="logo">
                            <Link to="/">
                                <img src={logo} alt="logo" />
                                <h1>{title}</h1>
                            </Link>
                        </div>
                        <div
                            style={{
                                maxWidth,
                            }}
                        >
                            <BaseMenu {...this.props} flatMenuKeys={flatMenuKeys} className={styles.menu} />
                        </div>
                    </div>
                    <RightContent {...this.props} />
                </div>
            </div>
        );
    }
}
