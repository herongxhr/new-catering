import {
    queryModalSelect,
    queryOrderForm,
    putOrderForm,
    querySkuList,
    queryPurOrderList,
    queryOrderDetails,
    toYieldOrder,
    queryDeleteByIds,
    mallPreOrder,
    camenuPreOrder
} from '../../../services/api';

export default {
    namespace: 'purOrder',
    state: {
        orderTable: {},
        orderDetails: [],
        orderItemGoods: [],
        orderSelectf: [],
        changeOrderForm: false,
        modalSelect: [],
        alertPrice: false,
        orderPlace: '',
        orderDelete: '',
        skuItems: [], 
        skuList: {},
        mealArray: []
    },
    effects: {
        // 菜单预订单
        *camenuPreOrder({ payload }, { call, put }) {
            const data = yield call(camenuPreOrder, payload);
            yield put({
                type: 'savePreOrder',
                payload: data || []
            });
        },
        // 辅料超市预订单
        *mallPreOrder({ payload }, { call, put }) {
            const data = yield call(mallPreOrder, payload);
            yield put({
                type: 'savePreOrder',
                payload: data || []
            });
        },
        *queryModalSelect({ payload }, { call, put }) {
            const data = yield call(queryModalSelect, payload);
            yield put({
                type: 'saveModalSelect',
                payload: data,
            })
        },
        *fetchSkuList({ payload }, { call, put }) {
            const data = yield call(querySkuList, payload);
            yield put({
                type: 'saveSkuList',
                payload: data || {}
            })
        },
        *fetchPurOrderList({ payload }, { call, put }) {
            const data = yield call(queryPurOrderList, payload);
            //console.log(data)
            yield put({
                type: 'savePurOrderTable',
                payload: data || {},
            })
        },
        // for (let i = 0; i < data.length; i++) {
        //     data[i].goodsName = data[i].viewSku ? data[i].viewSku.wholeName : null
        //     data[i].skuId = data[i].viewSku ? data[i].viewSku.id : null
        //     data[i].id = data[i].viewSku ? data[i].viewSku.id : null
        //     data[i].supplierId = data[i].supplier ? data[i].supplier.supplierName : null
        // }
        *adjustOrder({ payload }, { call, put }) {
            const data = yield call(queryOrderDetails, payload);
            const { orderDetailVos } = data
            for (let i = 0; i < orderDetailVos.length; i++) {
                orderDetailVos[i].goodsName = orderDetailVos[i].viewSku.wholeName
                orderDetailVos[i].skuId = orderDetailVos[i].viewSku.id
                orderDetailVos[i].supplierId = orderDetailVos[i].supplier.supplierName
                orderDetailVos[i].id = orderDetailVos[i].viewSku.id
            }
            yield put({
                type: 'saveMallPreOrder',
                payload: orderDetailVos || {},
            })
        },
        *getOrderDetails({ payload }, { call, put }) {
            const data = yield call(queryOrderDetails, payload);
            yield put({
                type: 'savePurOrderDetails',
                payload: data || {},
            })
        },
        *queryOrderForm({ payload }, { call, put }) {
            const { id, callback } = payload
            if (id) {
                const data = yield call(putOrderForm, payload);
                callback(data)
            } else {
                const data = yield call(queryOrderForm, payload);
                callback(data)
            }
        },
        *yieldOrder({ payload }, { call }) {
            yield call(toYieldOrder, payload);
        },
        *queryDeleteByIds({ payload }, { call, put }) {
            const data = yield call(queryDeleteByIds, payload);
            yield put({
                type: 'saveDeleteByIds',
                payload: data,
            })
            if (data) {
                yield put({
                    type: 'queryOrderTable',
                })
            }
        },
    },
    reducers: {
        clearOrderTableForm(state) {
            return {
                ...state,
                skuItems: []
            }
        },
        savePreOrder(state, { payload }) {
            return {
                ...state,
                skuItems: payload
            }
        },
        priceVerify(state, { payload }) {
            return {
                ...state,
                alertPrice: payload
            }
        },
        InputorderForm(state, { payload }) {
            return {
                ...state,
                skuItems: payload
            }
        },

        delelteOrderTableForm(state, { payload }) {
            const { skuItems } = state
            for (let i = 0; i < skuItems.length; i++) {
                if (skuItems[i].skuId == payload) {
                    skuItems.splice(i, 1)
                    i--
                }
            }
            return {
                ...state,
                skuItems: [...state.skuItems]
            }
        },
        saveModalSelect(state, { payload }) {
            return {
                ...state,
                modalSelect: payload
            }
        },
        // saveOrderSelectf(state, { payload }) {

        //     return {
        //         ...state,
        //         orderSelectf: payload,
        //     }
        // },
        savePurOrderTable(state, { payload }) {
            return {
                ...state,
                orderTable: payload,
            }
        },
        savePurOrderDetails(state, { payload }) {
            return {
                ...state,
                orderDetails: payload || {},
            }
        },
        saveOrderPlace(state, { payload }) {
            return {
                ...state,
                orderPlace: payload,
            }
        },
        saveDeleteByIds(state, { payload }) {
            return {
                ...state,
                orderDelete: payload,
            }
        },
        saveSkuList(state, { payload }) {
            return {
                ...state,
                skuList: payload || {}
            }
        },
        // //设置加菜单
        // addMeal(state, { payload }) {
        //     return {
        //         ...state,
        //         mealArray: state.mealArray.concat(payload),
        //     };
        // },
        addSkuItem(state, { payload }) {
            return {
                ...state,
                skuItems: state.skuItems.concat(payload)
            }
        },
        deleteSkuItem(state, { payload }) {
            return {
                ...state,
                skuItems: state.skuItems.filter(item => item.skuId !== payload)
            }
        },
        //清除菜单
        clearMeal(state) {
            return {
                ...state,
                mealArray: []
            }
        }
    }
}