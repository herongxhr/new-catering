import React, { PureComponent } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import Moment from 'moment';
import isNewPng from './new.png';
import './index.less';

export default class TemplateCard extends PureComponent {
  state = {
    cardHover: false,
  }

  handleMouseOver = () => {
    this.setState({
      cardHover: true
    })
  }

  handleMouseOut = () => {
    this.setState({
      cardHover: false
    })
  }

  render() {
    const {
      templateFrom = '',
      itemData,
      isSelect,
      handleTemplateActions,
    } = this.props;

    const {
      // 有的属性可能会没有，设置默认值
      id = '',
      createDate = '',
      echoMealTimesesVO = '',
      echoZjsVO = '',
      tags = '',
      used = 0,
      templateName = '',
      lastTime = '未使用'
    } = itemData;

    const cardFooter = !this.state.cardHover
      ? [<span>创建于：{Moment(createDate).format('YYYY-MM-DD HH:mm:ss')}</span>]
      : [<span id='preview'> 查看详情</span>,
      <span id='choice'>选择</span>];

    const clsString = isSelect ? 'templateCard selected' : 'templateCard';
    return (
      <Card
        className={clsString}
        bodyStyle={{ height: 147, padding: 20 }}
        actions={cardFooter}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseOut}
        onClick={e => handleTemplateActions(e, id, templateFrom)}
      >
        <div className='templateCardContent'>
          {templateFrom === 'C' && <span className={'newPng'}><img src={isNewPng} /></span>}
          {/* 模板名称 */}
          <Row style={{ marginBottom: 10 }} >
            <Col span={16}>{templateName}</Col>
            {templateFrom === 'P' && <Col style={{ textAlign: 'right' }} span={8}>{used}次</Col>}
          </Row>
          {/* 排几餐，排几天 */}
          <Row style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }} span={24}>
            <Col>
              {/* 排几餐 */}
              <Row>
                <Col span={18}>{echoMealTimesesVO}</Col>
                {templateFrom === 'C' && <Col span={6} style={{ textAlign: 'right' }}>使用次数</Col>}
                {templateFrom === 'P' && <Col span={6} style={{ textAlign: 'right' }}>上次使用</Col>}
              </Row>
              {/* 排几天 */}
              <Row>
                <Col span={18}>{echoZjsVO}</Col>
                {templateFrom === 'C' && <Col span={6} style={{ textAlign: 'right' }}>
                  {used}次
                </Col>}
                {templateFrom === 'P' && <Col span={6} style={{ textAlign: 'right' }}>
                  {Moment(lastTime).format('YYYY-MM-DD HH:mm:ss')}
                </Col>}
              </Row>
            </Col>
          </Row>
          {/* 标签 */}
          <Row style={{ marginBottom: 16 }} span={24}>
            <Col>{tags.split(',').map((tag, index) => {
              const colors = ['cyan', 'orange', 'green', 'magenta', 'lime', 'pruple', 'red', 'blue'];
              return <Tag key={index} color={colors[index]}>{tag}</Tag>
            })}</Col>
          </Row>
        </div>
      </Card>
    )
  }
}