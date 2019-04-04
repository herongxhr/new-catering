import React from 'react';
import { Breadcrumb,Button } from "antd";
import { Link } from "dva/router";
import BreadcrumbMap from '../../breadcrumbConfig';
import creatHistory from 'history/createBrowserHistory' 

const history = creatHistory();

/**
 * 从location对象的pathname中直接映射出面包屑
 * @param {object} param0 页面组件的props.location对象
 * 从中解构出pathname
 */
const BreadcrumbComponent = ({ pathname, className }) => {
    const pathSnippets = pathname.split('/').filter(i => i);
    let extraBreadcrumbItems = pathSnippets.map((_, index) => {
        let url = `/${pathSnippets.slice(0, index + 1).join('/')}/`;
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{BreadcrumbMap[url]}</Link>
            </Breadcrumb.Item>
        )
    });
    return (
        <div
            className={className}
            style={{
                background: "#fff",
                boxShadow: "0 2px 4px 0 rgba(0,0,0,0.1)",
            }}>
            <div style={{
                width: 1160,
                height: 60,
                margin: "0 auto",
                paddingLeft: 24,
                background: "#fff",
            }}>
                <Breadcrumb style={{float:'left', height: 60,lineHeight: "60px",}}>
                    {extraBreadcrumbItems}  
                </Breadcrumb>
                <Button style={{float:'right', marginTop:15}} onClick={()=>{history.goBack();}}>返回</Button>
            </div>
        </div>
    )
}

export default BreadcrumbComponent;