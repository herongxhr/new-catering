import React from 'react';
import { InputNumber } from 'antd';
import GoodsIcon from './wine.png';
import './index.less';

export default class GoodsItem extends React.Component {
    state = {
        isMouseOver: false,
    }

    // 鼠标覆盖
    handMouseOver = () => {
        this.setState({
            isMouseOver: true,
        })
    }
    // 鼠标离开
    handMouseOut = () => {
        this.setState({
            isMouseOver: false,
        })
    }

    render() {
        const {
            id,
            count,// 商品数量
            name,
            brand,
            price,
            priceType,
            provider,
            // isCollected,
            img,
            attribute,
            deleteGoods,
            changeGoodsNum
        } = this.props;

        const goodsItemWrapperStyle =
            this.state.isMouseOver ? "goodsItemWrapper itemMouseOver" : "goodsItemWrapper";

        return (
            <div>
                <div
                    onMouseOver={this.handMouseOver}
                    onMouseOut={this.handMouseOut}
                    className={goodsItemWrapperStyle}
                >
                    <div className="thumb">
                        <img src={GoodsIcon} alt={`${brand}${name}`} />
                    </div>
                    <span className="content">
                        <div className="details">
                            <div>{brand} {name}{attribute}</div>
                            <div>￥ {price} {priceType}</div>
                            <div style={{ fontSize: "12px", color: "rgba(0,0,0,0.45)" }}>{provider}</div>
                        </div>
                        <div className="actions">
                            {/* 删除按钮 */}
                            <a onClick={() => deleteGoods(id)}>删除</a>
                            {/* 修改购物车商品数量 */}
                            <InputNumber
                                value={count}
                                min={1}
                                size="small"
                                onChange={value => changeGoodsNum(value, id)}
                            />
                        </div>
                    </span>
                </div>
            </div>
        )
    }
}
