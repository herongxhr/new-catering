import React from 'react';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import styles from './index.module.less';

// 类似于按钮组的东西，显示效果更接近链接
export default class GoodsFilter extends React.Component {
    state = {
        pageSize: 10 // 请求品牌时品牌数量
    }
    // 获取更多品牌
    handleExpand = () => {
        const { getBrands } = this.props;
        let { catalogId, pageSize } = this.state;
        pageSize = pageSize > 10 ? 10 : 30;
        this.setState({ pageSize });
        getBrands({
            catalogId: catalogId,
            pageSize,
        })
    }

    render() {
        const {
            catalogList = [],
            brandList = [],
            catalogId,
            brand,
            notInclude,
            getFGoods,
        } = this.props;
        const { pageSize } = this.state;
        // 按分类筛选
        const catalogAllStyle = catalogList.some(item => item.id === catalogId) ? '' : styles.selected;
        const catalogFilterDom =
            <ul className={styles.filterRow}>
                <li id='all' className={catalogAllStyle}
                    onClick={() => getFGoods({ catalogId: '' })}>全部</li>
                {catalogList.sort((a, b) => a.sort - b.sort)
                    .map(item =>
                        <li
                            key={item.id}
                            className={classNames({ [styles.selected]: item.id === catalogId })}
                            onClick={() => getFGoods({ catalogId: item.id })}
                        >{item.catalogName}</li>
                    )}
            </ul>
        // 品牌筛选
        const brandAllStyle = brandList.some(item => item.id === brand) ? '' : styles.selected;
        const brandFilterDom =
            <ul className={classNames(styles.filterRow, {
                [styles.expanded]: pageSize > 10
            })}>
                <li id='' className={brandAllStyle}
                    onClick={() => getFGoods({ brand: '' })}>全部</li>
                {brandList.map(item =>
                    <li key={item.id}
                        className={classNames({ [styles.selected]: item.id === brand })}
                        onClick={() => getFGoods({ brand: item.id })}
                    > {item.brand}</li>
                )}
            </ul>
        //收录状态筛选
        const collectStatusList = [
            { id: true, collectName: '采购目录中商品' },
            { id: false, collectName: '采购目录外商品' }
        ]
        const collectAllStyle
            = collectStatusList.some(item => item.id === notInclude) ? '' : styles.selected;
        const collectFilterDom =
            <ul className={styles.filterRow}>
                <li id='' className={collectAllStyle}
                    onClick={() => getFGoods({ notInclude: '' })}>全部</li>
                {collectStatusList.map(item =>
                    <li key={item.id}
                        className={classNames({ [styles.selected]: item.id === notInclude })}
                        onClick={() => getFGoods({ notInclude: item.id })}
                    > {item.collectName}</li>
                )}
            </ul>

        return (
            <div className={styles.filterWraper}>
                <Row style={{ marginBottom: 20 }}>
                    <Col span={2}>
                        <span className={styles.title}>分类</span>
                    </Col>
                    <Col span={20}>

                        {catalogFilterDom}
                    </Col>
                </Row>
                <Row style={{ marginBottom: 20 }}>
                    <Col span={2}>
                        <span className={styles.title}>品牌</span>
                    </Col>
                    <Col span={20}>{brandFilterDom}</Col>
                    <Col span={2}>
                        <span className={styles.moreBrand}
                            onClick={this.handleExpand}
                        >{pageSize > 10 ? '收起' : '展开'}</span>
                    </Col>
                </Row>
                <Row>
                    <Col span={2}>
                        <span className={styles.title}>收录</span>
                    </Col>
                    <Col span={20}>
                        {collectFilterDom}
                    </Col>
                </Row>
            </div>
        )
    }
} 