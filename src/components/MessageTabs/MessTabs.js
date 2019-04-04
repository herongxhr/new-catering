import React, { Component } from 'react';
import { Tabs,  Menu, } from 'antd';

const TabPane = Tabs.TabPane;
  const tabListNoTitle = [{
    key: 'message',
    tab: '消息',
  }, {
    key: 'charge',
    tab: '代办',
  }];
  const contentListNoTitle = {
    message: <p>article content</p>,
    charge: <p>app content</p>,
  }

export default class MessTabs extends React.Component{
    state={
        noTitleKey: 'message',
    }
    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key });
      }
    render(){
        return(
            <Card
            style={{ width: '58%' }}
            tabList={tabListNoTitle}
            activeTabKey={this.state.noTitleKey}
            onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
            >
            {contentListNoTitle[this.state.noTitleKey]}
            </Card>
        )
    }
} 