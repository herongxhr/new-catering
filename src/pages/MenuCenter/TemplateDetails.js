import React, { Component, Fragment } from 'react';
import { Button, Card, Tag, message } from 'antd';
import { getYMDHms } from '../../utils/utils';
import { routerRedux } from 'dva/router';
import { connect } from 'dva';
import DescriptionList from '../../components/DescriptionList';
import BreadcurmbComponent from '../../components/BreadcrumbComponent';
import PageHeaderWrapper from '../../components/PageHeaderWrapper';
import ShowArrangedDishes from '../../components/ShowArrangedDishes';

const ButtonGroup = Button.Group;
const { Description } = DescriptionList;
/**
 * 模板新建后会跳转到详情页
 * 模板查看和编辑页也会跳转到详情页
 * 此时location.state会带有templateType属性
 */
class TemplateDetails extends Component {
    state = {
        id: '',
        templateType: ''
    }

    static getDerivedStateFromProps(props) {
        const { location } = props;
        if (location.state) {
            const { id = '', templateType = '' } = location.state;
            return { id, templateType }
        }
        return null;
    }

    // 跳转至模板编辑页
    handleEditTemplate = () => {
        const { id } = this.state;
        this.props.dispatch(routerRedux.push({
            pathname: '/menubar/menu-template/new',
            state: { id, templateType: this.state.templateType }
        }))
    }

    // 对模板进行复制，删除等操作
    handleTemplateActions = e => {
        const { dispatch } = this.props;
        const { id, templateType } = this.state;
        // 通过e.target.id来获取当前操作类型copy,delete,edit
        const action = e.target.id;
        switch (action) {
            case 'update':
                dispatch(routerRedux.push({
                    pathname: '/menubar/menu-template/update',
                    state: { id, templateType }
                }));
                return;
            case 'copy':
            case 'delete':
                dispatch({
                    type: `menuCenter/templateActions`,
                    payload: { id, action, callback: this.callback }
                }).then(this.success)
            default:
                return;
        }
    }
    getTemplateDetails = () => {
        const { id, templateType } = this.state;
        this.props.dispatch({
            type: `menuCenter/fetch${templateType}TemplateDetails`,
            payload: id
        })
    }
    success() {
        message.success('操作成功');
    }
    componentDidMount() {
        this.getTemplateDetails();
    }

    render() {
        const { location, templateDetails, allMealsData } = this.props;
        const tags = templateDetails.tags || '';
        const description = (
            <DescriptionList>
                <Description term='使用次数'>{templateDetails.used}</Description>
                <Description term='上次使用'>{getYMDHms(templateDetails.lastTime) || '未使用'}</Description>
                <Description style={{ clear: 'both' }} term=''>
                    {tags.split(',').map((tag, index) => {
                        const colors = ['cyan', 'orange', 'green', 'magenta', 'lime', 'pruple', 'red', 'blue'];
                        return <Tag key={index} color={colors[index]}>{tag}</Tag>
                    })}
                </Description>
            </DescriptionList>
        );
        const action = (
            <Fragment>
                <ButtonGroup onClick={this.handleTemplateActions}>
                    {/* <Button id='copy' >复制</Button>
                    <Button id='delete' >删除</Button> */}
                    <Button id='update'>修改</Button>
                </ButtonGroup>
                <Button type='primary' id='yieldMenu'>使用</Button>
            </Fragment>
        );

        return (
            <div>
                <BreadcurmbComponent {...location} />
                <PageHeaderWrapper
                    title={`模板名称${templateDetails.templateName}`}
                    logo={
                        <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
                    }
                    action={action}
                    content={description}
                    {...this.props}
                >
                    {/* 排餐区 */}
                    <Card
                        bordered={false}
                        style={{ marginTop: 20 }}>
                        <ShowArrangedDishes
                            allMealsData={allMealsData}
                        />
                    </Card>
                </PageHeaderWrapper>
            </div>
        )
    }
}

export default connect(({ menuCenter }) => ({
    ...menuCenter
}))(TemplateDetails)