import React from 'react'
import Axios from '../../axios'
import { Card, Icon, Button } from 'antd'
import Clicker from '../Clicker'
import './index.less'

const { Meta } = Card;

class MarketCommodity extends React.Component {
  state = {
    commodity: []
  }
  componentDidMount() {
    Axios.ajax({
      url: '/supermarket'
    }).then((value) => {
      this.setState({
        commodity: value
      })
      console.log(this.state.commodity)
    })
  }

  render() {
    return (
      <div className='gallery'>
        {
          this.state.commodity.map(item =>
            <Card
              hoverable
              style={{ width: 278, height: 375 }}
              key={item.key}
              actions={[<Clicker style={{ width: 114 }} />, <Button type='primary'>加入购物车</Button>]}
            >
              <Meta
                title={item.product}
                description={item.company}
              />
            </Card>
          )
        }
      </div>
    )
  }
}

export default MarketCommodity