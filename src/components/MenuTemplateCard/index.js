import React from 'react';
import { Card, Spin, Popconfirm, Row, Col, Tag } from 'antd';
import Moment from 'moment';
import { getYMD, getYMDHms } from '../../utils/utils';
import './index.less';

export default class MenuTemplateCard extends React.Component {
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
  // 删除模板多一个二次确认的过程
  handleDelete = () => {
    const { handleTemplateActions, id } = this.props;
    handleTemplateActions({ delAction: 'delete' }, id);
  }

  render() {
    const {
      itemData,
      spinning,
      handleTemplateActions,
      templateType,
    } = this.props;
    const id = itemData.id || '';
    // 模板创建时间
    const templateCreateTime =
      (<span>创建于：{getYMDHms(itemData.createDate)}</span>);
    const cTemplateCardFooter = !this.state.cardHover
      ? [templateCreateTime]
      : [<span id='saveAsMy'> 保存为我的模板</span>, <span id='preview'>查看</span>]

    const pTemplateCardFooter = !this.state.cardHover
      ? [templateCreateTime]
      : [<span id='copy'> 复制</span>,
      <Popconfirm
        title='确定删除此模板吗？'
        onConfirm={this.handleDelete}>
        <span id='delete'>删除</span>
      </Popconfirm>,
      <span id='update'>编辑</span>,
      <span id='view'>查看</span>]
    return (
      <Spin spinning={spinning}>
        <Card
          className={"menuTemplateCard"}
          bodyStyle={{ height: 147, padding: 20 }}
          actions={templateType === 'P' ? pTemplateCardFooter : cTemplateCardFooter}
          onMouseOver={this.handleMouseOver}
          onMouseLeave={this.handleMouseOut}
          onClick={e => handleTemplateActions(e, id)}
        >
          <div className='templateCardContent'>
            <Row style={{ marginBottom: 16 }} span={24} >
              <Col span={16}>{itemData.templateName}</Col>
              <Col style={{ textAlign: 'right' }} span={8}>{itemData.used || 0}次</Col>
            </Row>
            {/* 餐次/排餐天数 */}
            <Row style={{ fontSize: 12, color: 'rgba(0,0,0,0.45)', marginBottom: 16 }} span={24}>
              <Col>
                <Row>
                  <Col span={18}>{itemData.echoMealTimesesVO}</Col>
                  <Col span={6} style={{ textAlign: 'right' }}>上次使用</Col>
                </Row>
                <Row>
                  <Col span={18}>{itemData.echoZjsVO}</Col>
                  <Col span={6} style={{ textAlign: 'right' }}>
                    {getYMD(itemData.lastTime) || '未使用'}
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* 标签 */}
            <Row style={{ marginBottom: 16 }} span={24}>
              <Col>{itemData.tags.split(',').map((tag, index) => {
                const colors = ['cyan', 'orange', 'green', 'magenta', 'lime', 'pruple', 'red', 'blue'];
                return <Tag key={index} color={colors[index]}>{tag}</Tag>
              })}</Col>
            </Row>
          </div>
        </Card>
      </Spin>
    )
  }
}