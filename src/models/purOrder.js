import { queryModalSelect, queryOrderForm, putOrderForm, queryOrderSelectf, 
    queryOrderTable, queryOrderDetails, 
    queryOrderPlace, queryDeleteByIds, mallPreOrder, camenuPreOrder } from '../services/api';

export default {
    namespace: 'purOrder',
    state: {
        orderTable: {},
        orderDetails: [],
        orderItemGoods: [],
        orderSelectf: [],
        changeOrderForm: false,
        modalSelect: [],
        orderTableForm: [], //采购订单表单列表
        alertPrice: false,
        orderPlace:'',
        orderDelete:''
    },
    effects: {
        *camenuPreOrder({ payload }, { call, put }) {
            const data = yield call(camenuPreOrder, payload);
            for(let i = 0; i < data.length; i++) {
                data[i].goodsName = data[i].viewSku ? data[i].viewSku.wholeName : null
                data[i].skuId = data[i].viewSku ? data[i].viewSku.id : null
                data[i].id = data[i].viewSku ? data[i].viewSku.id : null
                data[i].supplierId = data[i].supplier ? data[i].supplier.supplierName : null
            }
            yield put({
                type: 'saveMallPreOrder',
                payload: data
            });
        },
        *mallPreOrder({ payload }, { call, put }) {
            const data = yield call(mallPreOrder, payload);
            for(let i = 0; i < data.length; i++) {
                data[i].goodsName = data[i].viewSku ? data[i].viewSku.wholeName : null
                data[i].skuId = data[i].viewSku ? data[i].viewSku.id : null
                data[i].id =  data[i].viewSku ? data[i].viewSku.id : null
                data[i].supplierId = data[i].supplier ? data[i].supplier.supplierName : null
            }
            yield put({
                type: 'saveMallPreOrder',
                payload: data
            });
        },
        *queryModalSelect({ payload }, { call, put }) {
            const data = yield call(queryModalSelect, payload);
            yield put({
                type: 'saveModalSelect',
                payload: data,
            })
        },
        *queryOrderSelectf({ payload, callback }, { call, put }) {
            const { type } = payload
            const data = yield call(queryOrderSelectf, payload);
            yield put({
                type: 'queryModalSelect',
                payload: {
                    type
                }
            })
            if (data) {
                if (callback && typeof callback === 'function') {
                    callback(data);
                }
            }
        },
        *queryOrderTable({ payload }, { call, put }) {
            const data = yield call(queryOrderTable, payload);
            //console.log(data)
            yield put({
                type: 'savePurOrderTable',
                payload: data || {},
            })
        },
        *judgeDetailsOrderForm({ payload }, { call, put }) {
            const data = yield call(queryOrderDetails, payload);
            const { orderDetailVos } = data
            for(let i = 0; i < orderDetailVos.length; i++) {
                orderDetailVos[i].goodsName = orderDetailVos[i].viewSku.wholeName
                orderDetailVos[i].skuId = orderDetailVos[i].viewSku.id
                orderDetailVos[i].supplierId = orderDetailVos[i].supplier.supplierName
                orderDetailVos[i].id = orderDetailVos[i].viewSku.id
                orderDetailVos[i].editable = true
            }
            yield put({
                type: 'saveMallPreOrder',
                payload: orderDetailVos || {},
            })
        },        
        *getOrderDetails({ payload }, { call, put }) {
            const data = yield call(queryOrderDetails, payload);
            console.log(data)
            yield put({
                type: 'savePurOrderDetails',
                payload: data || {},
            })
        },
        *queryOrderForm({ payload }, { call, put }) {
            const { id , callback } = payload
            if(id) {
                const data = yield call(putOrderForm, payload);
                callback(data)     
            } else {
                const data = yield call(queryOrderForm, payload);
                callback(data) 
            }
        },
        *queryOrderPlace({ payload }, { call, put }) {
            const { callback , id } = payload
            const data = yield call(queryOrderPlace, id);
            callback(data)
            yield put({
                type: 'saveOrderPlace',
                payload: data,
            })
            if(data){
                yield put({
                    type: 'queryOrderTable',
                })
            }
        },
        *queryDeleteByIds({ payload }, { call, put }) {
            const data = yield call(queryDeleteByIds, payload);
            yield put({
                type: 'saveDeleteByIds',
                payload: data,
            })
            if(data){
                yield put({
                    type: 'queryOrderTable',
                })
            }
        },
    },
    reducers: {
        clearOrderTableForm(state, { payload }) {
            return {
                ...state,
                orderTableForm: []
            }
        },            
        saveMallPreOrder(state, { payload }) {
            return {
                ...state,
                orderTableForm: payload
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
                orderTableForm: payload
            }
        },
        addOrderTableForm(state, { payload }) {
            state.orderTableForm.push(payload)
            return {
                ...state,
                orderTableForm: state.orderTableForm
            }
        },
        delelteOrderTableForm(state, { payload }) {
            const { orderTableForm } = state
            for (let i = 0; i < orderTableForm.length; i++) {
                if (orderTableForm[i].skuId == payload) {
                    orderTableForm.splice(i, 1)
                    i--
                }
            }
            return {
                ...state,
                orderTableForm: [...state.orderTableForm]
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
                orderDetails: payload,
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
    }
}