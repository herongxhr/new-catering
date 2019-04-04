import { queryGoodsByOrderId } from '../services/api';

export default {
    namespace: 'orderById',
    state: {
        orderDetail: {
            orderInfo: {},
            goodsDetail: []
        },
    },

    effects: {
        *fetchGoodsByOrderId({ payload }, { call, put }) {
            const data = yield call(queryGoodsByOrderId, payload);
            // select 用于从 state 里获取数据。
            // const todos = yield select(state => state.todos);
            yield put({
                type: 'saveGoods',
                payload: {
                    data
                },
            })
        }
    },
    reducers: {
        saveGoods(state, { payload }) {
            return {
                ...state,
                orderDetail: payload.data,
            };
        }
    }
}