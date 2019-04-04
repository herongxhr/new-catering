import React from 'react';
import { connect } from 'dva';
import './index.less'
import Img from "./pic.jpg"
import { withRouter } from "react-router";

class Ticket extends React.Component {
  queryTicket = (params = {}) => {
    const { dispatch, location } = this.props;
    const id = location.state && location.state.id;
    dispatch({
      type: 'deliveryAcce/queryTicket',
      payload: {
        ...params,
        id:id
      }
    })
  }
  componentDidMount(){
    this.queryTicket()
  }
  render() {
    // .sort((a,b)=>a.type.codePointAt(0)-b.type.codePointAt(0))
    const { ticketData=[] } = this.props
    return (
        <div className='ticket'>
            <div className='ticketTitle'>索证索票</div>
            <div className='ticketPic'>
            {
              ticketData.map((item,index)=>{
                return(
                  <figure key={index}>
                    <img src={Img} alt=""/>
                    <figcaption>
                        {item.ticketName}
                    </figcaption>            
                </figure>
                )
              })
            }
           </div>
    </div>
    )
  }
}
export default connect(({deliveryAcce }) => ({
  ticketData:deliveryAcce.ticketData,
}))(withRouter(Ticket));