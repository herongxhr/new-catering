import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Spin, message } from 'antd';

/**
 * 
 * @param {object} options 
 * 其中method属性为请求方法
 * url属性为请求的相对地址
 * data为参数对象，data中showLoading为是否显示加载器
 * data中的params属性为axios方法参数对象中的params属性
 * data中的axiosData为axios中post方法的数据体
 * 
 */
export default async function request(options) {
    let loading;
    let isShowLoading = options.data && options.data.showLoading;
    if (isShowLoading) {
        ReactDOM.render(<Spin />, document.getElementById('ajaxLoading'));
    }
     // let baseApi = 'http://yapi.jgzh.com/mock/21/';
    let baseApi = 'http://anpin.jgzh.test/';
    try {
        const response = await axios({
            method: options.method,
            url: options.url,
            baseURL: baseApi,
            params: (options.data && options.data.params) || '',
            data: (options.data && options.data.axiosData) || {},
        });
        //关闭加载中
        if (isShowLoading) {
            loading = document.getElementById('ajaxLoading');
            loading.style.display = 'none';
        }
        //此时的response为axios返回的response而不是后台返回的json对象
        if (response.status >= 200 && response.status < 300) {
            //res为后台返回的json对象
            let res = response.data;
            if (res.code == 0) {
                return res.data;
            } else {
                message.info(res.msg);
            }
        } else { //axios返回状态码为其它时
            console.log(response.data);
        }
    } catch (error) { //发送axios请求出错时
        console.log(error)
    }
}
