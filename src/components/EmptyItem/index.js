import React from 'react';
import { Row, Col } from 'antd';
import ReportButton from '../ReportButton';
import emptyPng from './empty.png';
import Arrow from './arrow.png';

export default ({ }) => {
    return (
        <div style={{ textAlign: 'center' }}>
            <Row>
                <Col>
                    <img src={emptyPng} alt='没有搜索到商品' />
                </Col>
            </Row>
            <Row>
                <Col>非常抱歉</Col>
            </Row>
            <Row>
                <Col style={{ color: 'rgba(0,0,0,0.45)' }}>
                    没有找到相关商品
                </Col>
            </Row>
            <Row>
                <Col
                    style={{ color: 'rgba(255,149,0,1)' }}>
                    您可以提交您所需要的商品，工作人员将尽快安排入库
                </Col>
            </Row>
            <Row>
                <Col>
                    <img style={{ transform: 'rotateZ(45deg)' }} src={emptyPng} alt='没有搜索到商品' />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ReportButton />
                </Col>
            </Row>
        </div>
    )
}