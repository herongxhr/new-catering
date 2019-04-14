import {
	queryCateringSupplier,
	queryCateringCatalog,
	querySaveSettingData,
	queryDosingTable,
	queryDeleteFavoriteSupplier,
	queryfavoriteSupplier,
	queryBaseView,
	querySendBaseView,
	queryModifyPassword,
	queryListQuery,
	queryMySupplier
} from '../services/api';
import { message } from 'antd';

export default {
	namespace: 'useSetting',
	state: {
		baseView: [],
		sendBaseView: [],
		modifyPassword: [],
		listQuery: [],
		mySupplier: [],
		savefavoriteSupplier: false,
		saveSettingData: false,
		dosingTable: [],
		cateringCatalog: []
	},
	effects: {
		*queryCateringSupplier({ payload }, { call, put }) {
			const data = yield call(queryCateringSupplier, payload);
			if (data) {
				message.success('保存成功')
			}
		},
		*querySettingCateringCatalog({ payload }, { call, put }) {
			const data = yield call(queryCateringCatalog, payload);
			yield put({
				type: 'saveCateringCatalog',
				payload: data,
			})
		},
		*querySaveSettingData({ payload }, { call, put }) {
			const data = yield call(querySaveSettingData, payload);
			yield put({
				type: 'saveSettingData',
				payload: data,
			})
		},
		*queryBaseView({ payload }, { call, put }) {
			const data = yield call(queryBaseView, payload);
			yield put({
				type: 'saveBaseView',
				payload: data,
			})
		},
		*querySendBaseView({ payload }, { call, put }) {
			const data = yield call(querySendBaseView, payload);
			yield put({
				type: 'save',
				payload: data || {},
			});
			//上报商品判断渲染
			if (data) {
				yield put({
					type: 'saveSendBaseView'
				});
				message.success('提交成功');
			}
		},
		*queryModifyPassword({ payload }, { call, put }) {
			const data = yield call(queryModifyPassword, payload);
			yield put({
				type: 'save',
				payload: data || {},
			});
			//上报商品判断渲染
			if (data) {
				yield put({
					type: 'saveModifyPassword'
				});
				message.success('提交成功');
			}
		},
		*queryListQuery({ payload }, { call, put }) {
			const data = yield call(queryListQuery, payload);
			yield put({
				type: 'saveListQuery',
				payload: data,
			})
		},
		*fetchMySupplier({ payload }, { call, put }) {
			const data = yield call(queryMySupplier, payload);
			yield put({
				type: 'saveSupplier',
				payload: data || [],
			})
		},
		*queryfavoriteSupplier({ payload }, { call, put }) {
			const data = yield call(queryfavoriteSupplier, payload);
			yield put({
				type: 'queryListQuery'
			})
		},
		*queryDeleteFavoriteSupplier({ payload }, { call, put }) {
			const data = yield call(queryDeleteFavoriteSupplier, payload);
			yield put({
				type: 'queryListQuery'
			})
		},
		*queryDosingTable({ payload }, { call, put }) {
			const data = yield call(queryDosingTable, payload);
			const record = []
			for (let i = 0; i < data.length; i++) {
				record.push({
					skuId: data[i].skuId,
					quantity: data[i].quantity,
					unit: data[i].unit,
					goodsName: data[i].viewSku.goodsName
				})
			}
			yield put({
				type: 'saveDosingTable',
				payload: record,
			})
		},
	},
	reducers: {
		saveCateringCatalog(state, { payload }) {
			console.log(payload)
			return {
				...state,
				cateringCatalog: payload
			}
		},
		saveSettingData(state, { payload }) {
			if (payload) {
				message.success('提交成功')
			} else {
				message.error('服务器报错')

			}
			return {
				...state,
				saveSettingData: payload
			}
		},
		//Input输入改变值
		inputChangeDosingTable(state, { payload }) {
			// console.log(payload)
			return {
				...state,
				dosingTable: payload
			}
		},
		//设置选菜模板改变常用配料
		addDosingTable(state, { payload }) {
			state.dosingTable.push(payload)
			return {
				...state,
				dosingTable: state.dosingTable
			}
		},
		delelteDosingTable(state, { payload }) {
			console.log(state)
			const { dosingTable } = state
			for (let i = 0; i < dosingTable.length; i++) {
				if (dosingTable[i].skuId == payload) {
					dosingTable.splice(i, 1)
					i--
				}
			}
			return {
				...state,
				dosingTable: [...state.dosingTable]
			}
		},
		saveBaseView(state, { payload }) {
			return {
				...state,
				baseView: payload,
			}
		},
		saveSendBaseView(state, { payload }) {
			return {
				...state,
				sendBaseView: payload,
			}
		},
		saveModifyPassword(state, { payload }) {
			return {
				...state,
				modifyPassword: payload,
			}
		},
		saveListQuery(state, { payload }) {
			return {
				...state,
				listQuery: payload,
			}
		},
		saveSupplier(state, { payload }) {
			return {
				...state,
				mySupplier: payload || [],
			}
		},
		saveDosingTable(state, { payload }) {
			return {
				...state,
				dosingTable: payload
			}
		},
	}
};
