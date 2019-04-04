/*
 * @Author: suwei 
 * @Date: 2019-03-28 16:46:05 
 * @Last Modified by: suwei
 * @Last Modified time: 2019-03-30 15:32:12
 */

export default {
  namespace: 'meal',
  state: {
    mealArray: []
  },
  effects: {

  },
  reducers: {
    //采购订单加菜单
    // saveMeal(state, { payload }) {
    //   // const { callback } = payload
    //   // callback({
    //   //   ...state,
    //   //   mealArray: state.mealArray.concat(payload),
    //   // })
    //   return {
    //     ...state,
    //     mealArray: state.mealArray.concat(payload),
    //   };
    // },
    // //采购订单删除订单
    // deleteMeal(state, { payload }) {
    //   return {
    //     ...state,
    //     mealArray: state.mealArray.filter(item => item.id !== payload.id)
    //   }
    // },
    //设置加菜单
    addMeal(state, { payload }) {
      return {
        ...state,
        mealArray: state.mealArray.concat(payload),
      };
    },
    removeMeal(state, { payload }) {
      return {
        ...state,
        mealArray: state.mealArray.filter(item => item.skuId !== payload)
      }
    },
    //清除菜单
    clearMeal(state,{ payload }) {
      return {
        ...state,
        mealArray:[]
      }
    }
  }
}