import React, { Component } from 'react';
import './TodoListCard.less';
import {  Divider,Badge  } from 'antd';
import { withRouter } from "react-router";

class TodoListCard extends Component {
  render() {
    const { todoList }= this.props
    return (
      <div className="TodoListCard">
          <div className='todoTitle'>待办事项</div>
          <Divider />
          <div className='todoItem' onClick={() => {this.props.history.push({pathname:'/menubar',state:{status:'0'}})}} >
            <span>待执行菜单</span><span><Badge count={todoList.notExecutedMenu} style={{ backgroundColor: '#FF9500'}} /></span>
          </div>
          <Divider />
          <div className='todoItem' onClick={() => {this.props.history.push('/purOrder')}}>
            <span>待下单</span><span><Badge count={todoList.pendingOrder} style={{ backgroundColor: '#FF9500'}} /></span>
          </div>
          <Divider />
          <div className='todoItem' onClick={() => {this.props.history.push('/delivery')}}>
            <span>换货审核</span><span><Badge count={todoList.replacementReview} style={{ backgroundColor: '#FF9500'}} /></span>
          </div>
          <Divider />
          <div className='todoItem' onClick={() => {this.props.history.push('/delivery')}}>
            <span>待验收</span><span><Badge count={todoList.pendingAcceptance} style={{ backgroundColor: '#FF9500'}} /></span>
          </div>
      </div>
    );
  }
}


const ShowTodoListCardRouter = withRouter(TodoListCard);
export default ShowTodoListCardRouter;