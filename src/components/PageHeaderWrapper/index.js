import React from 'react';
import { connect } from 'dva';
import GridContent from './GridContent';
import styles from './index.less';

const PageHeaderWrapper = ({
  children,
  contentWidth,
  withTabs,
  logo,
  title,
  action,
  content,
  extraContent,
}) => {
  return (
    // 全页面部分
    <div
      style={withTabs ? { margin: '104px -24px 0' } : { margin: '1px -24px 0' }}
      className={styles.container}>
      {title && content && (
        // 头部区域，中间有无背景色的分隔
        <div style={{ background: '#fff' }}>
          {/* 头部居中部分 */}
          <div
            className={`${styles.wrap} ${contentWidth === 'Fixed' ? styles.wide : ''}`}>
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
        </div>
      )}
      {/* 子内容全放在GridContent中，GridContent根据布局模式固定或流式 */}
      {children ? (
        <div className={styles['children-content']}>
          <GridContent>{children}</GridContent>
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
