import { queryDelivery ,  queryCount , queryDistributionDetail , queryDetailReplacement ,
    queryExecute , queryTicket,querySignature } from '../services/api';

export default {
    namespace:'deliveryAcce',
    state: {
        delivery: {},
        count:{},
        detailData:{},
        execute:'',
        ticketData:[],
        signatureData:[]
    },
    effects: {
        *queryDelivery({payload}, { call, put }) {
            const data = yield call(queryDelivery,payload);
           // console.log(data)
            yield put({
                type:'saveDelivery',
                payload: data,
            })
        },
        *queryCount({payload}, { call, put }) {
            const data = yield call(queryCount,payload);
            yield put({
                type:'savecount',
                payload: data,
            })
        },
        *queryDistributionDetail({payload}, { call, put }) {
            const data = yield call(queryDistributionDetail,payload);
            //console.log(data)
            yield put({
                type:'savedetail',
                payload: data,
            })
        },
        *queryExecute({payload}, { call, put }) {
            const data = yield call(queryExecute,payload);
            yield put({
                type:'saveExecute',   
                payload: data,
            })
        },
        *queryTicket({payload}, { call, put }) {
            const data = yield call(queryTicket,payload);
            //console.log(data)
            yield put({
                type:'saveTicket',   
                payload: data,
            })
        },
        *querySignature({payload}, { call, put }) {
            const data = yield call(querySignature,payload);
            //console.log(data)
            yield put({
                type:'saveSignature',   
                payload: data,
            })
        },
    },
    reducers: {
        saveDelivery(state, { payload }) {
            return {
                ...state,
                delivery: payload,
            }
        },
        savecount(state, { payload }) {
            return {
                ...state,
                count: payload,
            }
        },
        savedetail(state, { payload }) {
            return {
                ...state,
                detailData: payload,
            }
        },
        saveExecute(state, { payload }) {
            return {
                ...state,
                execute: payload,
            }
        },
        saveTicket(state, { payload }) {
            return {
                ...state,
                ticketData: payload,
            }
        },
        saveSignature(state, { payload }) {
            return {
                ...state,
                signatureData: payload,
            }
        },
    }
}