import React from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

const PageHeaderWrapper = ({
  children,
  contentWidth,//Fixed or Fluid
  withTabs,
  logo,
  title,
  action,
  content,
  extraContent,
}) => {
  return (
    // 整个pageHeaderWrapper
    <div style={withTabs
      ? { margin: '104px -24px 0' }
      : title && content//如果是显示内容的详情页
        ? { margin: '36px -24px 0' }
        : { margin: '36px -24px 0', paddingTop: 20 }}
      className={styles.container}
    >
      {title && content && (
        // 头部区域，中间有无背景色的分隔
        <div className={styles.header} >
          {/* 头部居中部分 */}
          <Row className={`${contentWidth === 'Fixed' ? styles.headerContetntWide : ''}`} >
            {/* logo */}
            <Col span={1} className={styles.logo}>{logo}</Col>
            {/* logo右内容 */}
            <Col className={styles.main} span={23}>
              {/* 标题和操作区 */}
              <Row className={styles.row}>
                <Col span={12}><h1>{title}</h1></Col>
                <Col span={12} style={{textAlign: 'right'}}>{action}</Col>
              </Row>
              {/* 描述和状态区 */}
              <Row >
                {content && <Col span={16}>{content}</Col>}
                {extraContent && <Col span={8} style={{textAlign: 'right'}}>{extraContent}</Col>}
              </Row>
            </Col>
          </Row>
        </div>
      )}
      {/* 主要内容区域 */}
      {children ? (
        <div className={`${contentWidth === 'Fixed' ? styles.mainContentWide : ''}`}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
