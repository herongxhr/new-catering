import { queryTodoList, querytodayMenu,querydeviceInfo,queryStatistics } from '../services/api';

export default {
    namespace: 'home',
    state: {
        todoList: [],
        todayMenu:{},
        deviceInfo:[],
        statistics:[]
    },
    effects: {     
        *queryTodoLists(_, { call, put }) {
            //call方法首参数为要调用的异步方法
            const  data  = yield call(queryTodoList);
             //console.log(data);
            yield put({
                type: 'saveTodoLists',
                payload: data || [],
            });
        },
        *querytodayMenu(_, { call, put }) {
            //call方法首参数为要调用的异步方法
            const    data  = yield call(querytodayMenu);
            //console.log(data);
            yield put({
                type: 'saveTodayMenu',
                payload: data || {},
            });
        },
        *querydeviceInfo({payload}, { call, put }) {
            //call方法首参数为要调用的异步方 法
            const  data  = yield call(querydeviceInfo);
            //console.log(data);
            yield put({
                type: 'savedeviceInfo',
                payload: data || {},
            });
        },
        *queryStatistics({payload}, { call, put }) {
            const  data  = yield call(queryStatistics,payload);
           //console.log(data)
            yield put({
                type: 'savestatistics',
                payload: data || {},
            });
        }
        
    },
    reducers: {
        saveTodoLists(state, { payload }) {
            return {
                ...state,
                todoList: payload,
            };
        },
        saveTodayMenu(state, { payload }) {
            return {
                ...state,
                todayMenu: payload,
            };
        },
        savedeviceInfo(state, { payload }) {
            return {
                ...state,
                deviceInfo: payload,
            };
        },
        savestatistics(state, { payload }) {
            return {
                ...state,
                statistics: payload,
            };
        },
    },
};