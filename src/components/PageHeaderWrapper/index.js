import React from 'react';
import PageHeader from '../PageHeader';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.module.less';

const PageHeaderWrapper = ({
    children,
    contentWidth,
    wrapperClassName,
    top,
    ...restPropss
}) => (
        <div style={{ margin: '0 0 20px' }} className={wrapperClassName}>
            {top}
            <PageHeader
                wide={true}
                home={'Home'}
                key="pageheader"
                {...restPropss}
            />
            {children ? (
                <div className={styles.content}>
                    <GridContent>{children}</GridContent>
                </div>
            ) : null}
        </div>
    );
export default connect(({ setting }) => ({
    contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);