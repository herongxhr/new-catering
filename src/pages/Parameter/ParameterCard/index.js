/*
 * @Author: suwei 
 * @Date: 2019-03-23 10:47:07 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-25 10:08:44
 */
import React from 'react'
import { Card , List} from 'antd'
import ParameterList from '../ParameterList'
import { connect } from 'dva';

import './index.less'

const data = [
  {
    date: '2018-12-02 周二',
    number:'12345678',
    price:'$94,700'
  },
  {
    date: '2018-12-03 周三',
    number:'12345678',
    price:'$94,700'
  },
  {
    date: '2018-12-04 周四',
    number:'12345678',
    price:'$94,700'
  },
  {
    date: '2018-12-05 周五',
    number:'12345678',
    price:'$94,700'
  },
];


class ParameterCard extends React.Component {

  queryParameterUnfold() {
    const { dispatch , location , id } = this.props
    console.log(id);
    dispatch({
      type:'parameter/queryParameterUnfold',
      payload: {
        id,
        // startDate:location.startDate,
      }
    })
  }

  componentDidMount() {
    this.queryParameterUnfold()
  }

  render() {
    const { ParameterUnfold } = this.props
    const { records } = ParameterUnfold
    return(
      <Card title='明细' className='ParameterDetail-card'>
        <List
          itemLayout="horizontal"
          dataSource={records}
          renderItem={item => (
            <ParameterList date={item.distributionDate} number={item.distributionNo} price={item.total} id={item.id} />
          )}
        />
    </Card>
    )
  }
}

export default connect(({parameter})=>({ParameterUnfold:parameter.ParameterUnfold}))
(ParameterCard);
