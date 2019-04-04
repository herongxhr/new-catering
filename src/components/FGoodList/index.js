import React from 'react';
import { Card, InputNumber, Button, List } from 'antd';
import goodsWine from './wine.png';
import './index.less';

export default class FGoodList extends React.Component {
    render() {
        const { records, changeGoodsNum, addToCart } = this.props;
        return (
            <div >
                <List
                    className="goodsList"
                    column={4}
                    dataSource={records}
                    renderItem={item => {
                        if (item) {
                            const goodsTitle = <span>{item.brand} {item.goodsName}{item.property}</span>;
                            const goodsDescription = (
                                <div>
                                    <h4> ￥{`${item.price || 0} `}元{item.unit}</h4>
                                    <div className="goodsProvider" >
                                        {item.supplier && item.supplier.supplierName} </div>
                                </div>
                            )
                            return (<List.Item
                                className="goodsListItem"
                                key={item.id} >
                                <Card
                                    bordered={false}
                                    actions={[
                                        <InputNumber
                                            defaultValue={1}
                                            min={1}
                                            size="small"
                                            onChange={value => changeGoodsNum(value, item.id)}
                                        />,
                                        <Button style={{ width: 100 }}
                                            type="primary"
                                            onClick={() => addToCart(item.id)} >
                                            加入购物车 </Button>
                                    ]}
                                    hoverable
                                    cover={<img alt={item.goodsName} src={item.img1 || goodsWine}
                                    />} >
                                    <Card.Meta
                                        className="cardMeta"
                                        title={goodsTitle}
                                        description={goodsDescription}
                                    />
                                </Card>
                            </List.Item>
                            )
                        }
                    }
                    }
                />
            </div>
        )
    }
}