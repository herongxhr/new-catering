import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './GridContent.module.less';
// 流式布局容器，用来设置是头部是固定宽度还是流式的
// 内部为PageHeader
class GridContent extends PureComponent {
    render() {
        const { contentWidth, children } = this.props;
        let className = `${styles.main}`;
        // 网站容器的宽度是流式的还是固定的
        if (contentWidth === 'Fixed') {
            className = `${styles.main} ${styles.wide}`;
        }
        return <div className={className}>{children}</div>;
    }
}

export default connect(({ setting }) => ({
    contentWidth: setting.contentWidth
}))(GridContent)