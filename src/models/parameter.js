import {  queryParameterTable , queryParameterUnfold , queryParameterUnfoldItem } from '../services/api';

export default {
    namespace: 'parameter',
    state: {
        ParameterTable:[],
        ParameterUnfold:[],
        ParameterUnfoldItem:[]
    },
    effects: {     
        *queryParameterTable({ payload }, { call, put }) {
            //call方法首参数为要调用的异步方法
            
            const  data  = yield call(queryParameterTable,payload);
            console.log(data);
            yield put({
                type: 'saveParameterTable',
                payload: data || {},
            });
        },
        *queryParameterUnfold({ payload }, { call, put }) {
          //call方法首参数为要调用的异步方法
          const  data  = yield call(queryParameterUnfold,payload);
          //console.log(data);
          yield put({
              type: 'saveParameterUnfold',
              payload: data || {},
          });
        },
        *queryParameterUnfoldItem({ payload }, { call, put }) {
            //call方法首参数为要调用的异步方法
            const  data  = yield call(queryParameterUnfoldItem,payload);
            //console.log(data);
            yield put({
                type: 'saveParameterUnfoldItem',
                payload: data || {},
            });
          },
    },
    reducers: {
        saveParameterTable(state, { payload }) {
            //console.log(payload);
            return {
                ...state,
                ParameterTable: payload,
            };
        },
        saveParameterUnfold(state, { payload }) {
          //console.log(payload);
          return {
              ...state,
              ParameterUnfold: payload,
          };
        },
        saveParameterUnfoldItem(state, { payload }) {
            //console.log(payload);
            return {
                ...state,
                ParameterUnfoldItem: payload,
            };
        },
    },
};