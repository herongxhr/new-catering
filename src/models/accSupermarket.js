import { queryCatalogF, queryBrands, queryFGoods } from '../services/api';

export default {
    namespace: 'accSupermarket',
    state: {
        catalogList: [],
        brandList: [],
        FGoodData: {},
        cartDrawerVisible: false,
        shoppingCart: [],
        // 暂存购物车中数量
        cartCache: []

    },
    effects: {
        *fetchCatalogF({ payload }, { call, put }) {
            const data = yield call(queryCatalogF, payload);
            yield put({
                type: 'saveCatalogF',
                payload: data || []
            });
        },
        *fetchBrands({ payload }, { call, put }) {
            const data = yield call(queryBrands, payload);
            yield put({
                type: 'saveBrands',
                payload: data || []
            });
        },
        *fetchFGoods({ payload }, { call, put }) {
            const data = yield call(queryFGoods, payload);
            yield put({
                type: 'saveFGoods',
                payload: data || {}
            })
        }
    },

    reducers: {
        saveCatalogF(state, { payload }) {
            return {
                ...state,
                catalogList: payload
            };
        },
        saveBrands(state, { payload }) {
            return {
                ...state,
                brandList: payload.records
            }
        },
        saveFGoods(state, { payload }) {
            return {
                ...state,
                FGoodData: payload || {}
            }
        },
        // 显示购物车页面
        showCartDrawer(state) {
            return {
                ...state,
                cartDrawerVisible: true,
            }
        },
        // 隐藏购物车详情
        hideCartDrawer(state) {
            return {
                ...state,
                cartDrawerVisible: false,
            }
        },
        // 暂存商品的数量
        changeGoodsNum(state, { payload }) {
            const { qty, id } = payload;
            const isExact = state.cartCache.some(item => item.skuId === id)
            return {
                ...state,
                cartCache: isExact
                    ? state.cartCache.map(item => {
                        if (item.skuId === id) {
                            return { skuId: id, qty }
                        } else {
                            return item;
                        }
                    })
                    : state.cartCache.concat({ skuId: id, qty })
            }
        },
        // 加商品到购物车
        addToCart(state, { payload }) {
            const { skuId } = payload;
            // 先确定要加的商品的数量
            let currItem;
            const quantity = (currItem = state.cartCache.find(item => item.skuId === skuId))
                ? currItem.qty : 1;
            // 再看一下现有购物车里，有没有要加的商品
            const isExist = state.shoppingCart.find(item => item.skuId === skuId);
            // 如果有的话,改一下数量
            if (isExist) {
                return {
                    ...state,
                    shoppingCart: state.shoppingCart.map(item => {
                        if (item.skuId === skuId) {
                            return { skuId, quantity: item.quantity + quantity }
                        }
                        return item;
                    }),
                }
            } else {
                return {
                    ...state,
                    shoppingCart: state.shoppingCart.concat({ skuId, quantity }),
                }
            }
            // 如果购物车为空，直接把商品加进去
        },
        // 修改购物车内商品数量
        changeCartNum(state, { payload }) {
            let { id, value } = payload;
            return {
                ...state,
                shoppingCart: state.shoppingCart.map(item => {
                    if (item.id === id) {
                        return {
                            id,
                            quantity: value,
                        }
                    }
                    return item;
                })
            }
        },
        // 删除购物车中商品
        deleteGoods(state, { payload }) {
            let { id } = payload;
            return {
                ...state,
                shoppingCart: state.shoppingCart.filter(item => item.id !== id),
            }
        }
    },
};