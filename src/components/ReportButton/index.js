import React from 'react'
import { Button, Modal, Radio, Form, Input, Checkbox,message } from 'antd'
import './index.less';
import { connect } from 'dva';

const { TextArea } = Input;

class ReportButton extends React.Component {
  state = {
    visible: false,
    checked: false
  }

    showModal = (e) => {
      e.preventDefault();
      this.setState({
        visible: true,
      });
    }
    handleOk = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          const { dispatch } = this.props;
          dispatch({
            type: 'report/querySave',
            payload:{
            ...values,
            }
          }) 
          this.setState({
            visible: false,
          });
          //console.log('Received values of form: ', values);
        }
      });
    }
  
    handleCancel = (e) => {
      e.preventDefault();
      this.setState({
        visible: false,
      });
    }
    handleOnchange = () =>{
      this.setState({checked:!this.state.checked})
    }
    renderReportForm = () =>{
      const {getFieldDecorator} = this.props.form;
      return(
        <Form layout='vertical'>
            <Form.Item
            label="请选择商品类型"
            >
            {getFieldDecorator('type', {
                    initialValue:'S',
            })(
                <Radio.Group buttonStyle="solid">
                    <Radio.Button value="S" className='checkBtn'>食材</Radio.Button>
                    <Radio.Button value="F" className='checkBtn btn'>辅料</Radio.Button>
                </Radio.Group>
            )}
            </Form.Item>
            <Form.Item
            label="商品名称"
            >
            {getFieldDecorator('goodsName', {
                    initialValue:'',
                    rules: [{ required: true, message: '商品名称不能为空！' }],
            })(
              <Input placeholder='请输入' style={{width:260}}/>
            )}
            </Form.Item>
            <Form.Item
            label="备注"
            >
            {getFieldDecorator('description', {
                    initialValue:'',
                    rules: [{ required: true, message:'备注不能为空！'}],
            })(
              <TextArea placeholder='请简要描述您所需要的商品，以便工作人员准确入库' style={{width:650,height:90}}/>
            )}
            </Form.Item>
            <Form.Item>
            {getFieldDecorator('eager', {
                  initialValue:'',
            })(
              <Checkbox onChange={this.handleOnchange}>紧急<span style={{color:'rgba(0,0,0,0.45)',fontSize:12}}>（勾选此选项后，请务必填写您的联系电话，以便工作人员与您进行联系）</span></Checkbox>
            )}
            </Form.Item>
            <Form.Item
            label="联系电话"
            >
            {getFieldDecorator('telephone', {
                    initialValue:'',
                    rules:[{required:this.state.checked, message:'联系电话不能为空'}]
            })(
              <Input placeholder='请输入' style={{width:260}}/>
            )}
            </Form.Item>
        </Form>
      )
    }
	render() { 
		return(
			<div>
            <Button type='primary' onClick={this.showModal}>上报商品</Button>
            <Modal 
              className="reportBtn"
              title="上报商品"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="提交"
              cancelText="取消"
              width={780}
              closable={false}
              afterClose={() => {
                this.props.form.resetFields();
              }}  
              >
                {this.renderReportForm()}
              </Modal>
     </div>
		)
	}
}
const WrappedReportButton = Form.create()(ReportButton)
export default connect(({ report}) => ({
  report,
}))(WrappedReportButton)