import React from 'react'
import { withRouter } from "react-router";
import { Button } from 'antd'

class Go extends React.Component {
  handleGoBack = () => {
    const value = this.props.value
    this.props.history.push(value)
  }

  render() {
    return(
      <Button onClick={this.handleGoBack}>返回</Button>
    )
  }
}
const GoBack = withRouter(Go)

export default GoBack