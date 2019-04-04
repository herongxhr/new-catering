import {  queryList,  } from '../services/api';

export default {
    namespace: 'accept',
    state: {
        distributionList:{},
    },
    effects: {     
        *queryList({ payload }, { call, put }) {
            //call方法首参数为要调用的异步方法
            const  data  = yield call(queryList,payload);
            //console.log(data);
            yield put({
                type: 'saveDistributionList',
                payload: data || {},
            });
        },
        
    },
    reducers: {
        saveDistributionList(state, { payload }) {
            //console.log(payload);
            return {
                ...state,
                distributionList: payload,
            };
        },
    },
};