import React from 'react';
import { routerRedux } from 'dva/router'
import { Drawer, Badge, Icon, List, Row, Col } from 'antd';
import GoodsItem from '@/components/GoodsItem';
import styles from './index.module.less';

export default class CartPage extends React.Component {

    // 返回id相匹配的商品
    getDetailByGoodsId = skuId => {
        const { FGoodData } = this.props;
        const records = FGoodData.records || [];
        return records.find(item => item.skuId === skuId);
    }

    yieldPurOrder = () => {
        const { shoppingCart, dispatch } = this.props;
        dispatch(routerRedux.push({
            pathname: '/purOrder/detail/adjust',
            state: {
                channel: 'S',
                type: 'F',
                data: shoppingCart
            }
        }))
    }

    render() {
        const {
            className,
            cartDrawerVisible,
            shoppingCart,
            changeGoodsNum,
            deleteGoods,
            handleShowCartDrawer,
            handleHideCartDrawer
        } = this.props;
        // 购物车中商品数量
        let countCart = shoppingCart.length;
        // 购物车详情标题
        const cartPageTitle = (
            <Badge
                onClick={handleShowCartDrawer}
                className={styles.titleWithBadge}
                count={countCart} >
                <Icon type="shopping-cart" className={styles.shoppingCartIcon} />
                <div className={styles.cartText}>购物车</div>
            </Badge>
        )

        const cartPageFooter = (
            <div className={styles.cartPageFooter}>
                <Row>
                    <Col span={16}><span className={styles.goodsInCartCount}>
                        共有 <div className={styles.count}>{countCart || 0}</div> 件商品
                    <Icon
                            type="exclamation-circle"
                            theme="filled"
                            style={{ fontSize: 18, marginLeft: 20, color: "rgba(245, 34, 45, 1)" }}
                        />
                    </span>
                    </Col>
                    <Col span={8}>
                        <a className={styles.createOrder}
                            onClick={this.yieldPurOrder}
                        >生成采购单</a>
                    </Col>
                </Row>
            </div>
        )
        return (
            <div className={className}>
                <Drawer
                    className={styles.cartDrawer}
                    placement="right"
                    title={cartPageTitle}
                    closable={true}
                    width={470}
                    onClose={handleHideCartDrawer}
                    visible={cartDrawerVisible}
                    zIndex={99999}
                >
                    <div className={'itemWrap'}>
                        <List
                            dataSource={shoppingCart}
                            renderItem={item => {
                                return (
                                    <List.Item
                                        style={{ padding: 0 }}
                                        key={item.skuId}
                                    >
                                        <GoodsItem
                                            changeGoodsNum={changeGoodsNum}
                                            deleteGoods={deleteGoods}
                                            count={item.quantity}
                                            {...this.getDetailByGoodsId(item.skuId)}
                                        />
                                    </List.Item>
                                )
                            }}
                        />
                    </div>
                    {cartPageFooter}
                </Drawer>
            </div>
        )
    }
}
