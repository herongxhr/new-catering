import { queryPurCatalog,queryIngreType,queryPriceHistory,queryIngreDetail    } from '../services/api';

export default {
    namespace:'purCatalog',
    state: {
        catalogData: {},
        ingreTypeList:[],
        historyList:[],
        detailData:{}
    },
    effects: {
        *queryPurCatalog({payload}, { call, put }) {
            const data = yield call(queryPurCatalog,payload);
            //console.log(data)
            yield put({
                type:'savePurCatalog',
                payload: data,
            })
        },
        *queryIngreType({payload}, { call, put }) {
            const data = yield call(queryIngreType,payload);
            //console.log(data)
            yield put({
                type:'saveIngreType',
                payload: data,
            })
        },
        *queryPriceHistory({payload}, { call, put }) {
            const data = yield call(queryPriceHistory,payload);
            //console.log(data)
            yield put({
                type:'savePriceHistory',
                payload: data,
            })
        },
        *queryIngreDetail({payload}, { call, put }) {
            const data = yield call(queryIngreDetail,payload);
            //console.log(data)
            yield put({
                type:'saveIngreDetail',
                payload: data,
            })
        }
    },
    reducers: {
        savePurCatalog(state, { payload }) {
            return {
                ...state,
                catalogData: payload,
            }
        },
        saveIngreType(state, { payload }) {
            return {
                ...state,
                ingreTypeList: payload,
            }
        },
        savePriceHistory(state, { payload }) {
            return {
                ...state,
                historyList: payload,
            }
        },
        saveIngreDetail(state, { payload }) {
            return {
                ...state,
                detailData: payload,
            }
        }
    }
}