import React from 'react'

import './index.less'

class Cartoon extends React.Component {
  render() {
    const { value , bell } = this.props
    return(
      <div className='cartoon'>
        {bell ? <span className="iconfont">&#xe62b;</span> : null}
        <span>{value}</span>
        <div className='triangle'></div>
      </div>
    )
  }
}

export default Cartoon