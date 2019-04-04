import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, Badge, Pagination, } from 'antd';
import CartPage from '../CartPage';
import GoodsFilter from '../../components/GoodsFilter';
import FGoodList from '../../components/FGoodList';
import './index.less';

const { Search } = Input;

class AccSupermarket extends PureComponent {
	state = {
		channel: '',
		type: '',
		data: {},
		queryParams: {
			type: 'F',
			keywords: '',
			catalogId: '',
			notInclude: '',
			brand: '',
			current: 1,
			pageSize: 12,
		}
	}
	static getDerivedStateFromProps(props) {
		const { location: { state } } = props;
		if (state) {
			const { channel = '', type = '', data = {} } = state;
			return { channel, type, data }
		} else {
			return null;
		}
	}
	// 获取辅料分类
	getCatalogF = (params = {}) => {
		this.props.dispatch({
			type: 'accSupermarket/fetchCatalogF',
			payload: {
				type: 'F',
				orderByField: '',
				isAsc: true,
				...params
			},
		})
	}
	// 获取品牌列表
	getBrands = (params = {}) => {
		this.props.dispatch({
			type: 'accSupermarket/fetchBrands',
			payload: {
				catalogId: '',
				current: 1,
				pageSize: 10,
				...params
			},
		})
	}
	// 获取辅料商品列表
	getFGoods = (params = {}) => {
		// 先更新state
		this.setState({
			queryParams: {
				...this.state.queryParams,
				...params,
			}
		});
		// 如果params中有catalogId属性，也就是点击了分类
		if (params.catalogId) {
			const brandParams = params.catalogId ? { catalogId: params } : undefined;
			this.getBrands(brandParams);
		}
		this.props.dispatch({
			type: 'accSupermarket/fetchFGoods',
			payload: {
				...this.state.queryParams,
				...params
			}
		})
	}

	// 显示购物车页面
	handleShowCartDrawer = () => {
		this.props.dispatch({
			type: 'accSupermarket/showCartDrawer',
		})
	}
	// 隐藏购物车页面
	handleHideCartDrawer = () => {
		this.props.dispatch({
			type: 'accSupermarket/hideCartDrawer',
		})
	}
	// 加购物车功能
	addToCart = skuId => {
		this.props.dispatch({
			type: 'accSupermarket/addToCart',
			payload: { skuId }
		})
	}
	// 只要修改数量，将改过数量的商品
	// 商品的id和改后的值保存到state中
	changeGoodsNum = (qty, id) => {
		this.props.dispatch({
			type: 'accSupermarket/changeGoodsNum',
			payload: { qty, id }
		})
	}
	deleteGoods = id => {
		this.props.dispatch({
			type: 'accSupermarket/deleteGoods',
			payload: { id }
		})
	}

	componentDidMount() {
		this.getCatalogF();
		this.getBrands();
		this.getFGoods();
	}

	render() {
		const {
			shoppingCart,
			catalogList,
			brandList,
			FGoodData,
			cartDrawerVisible,
		} = this.props;
		const records = FGoodData.records || [];
		const total = FGoodData.total || 0;
		const current = FGoodData.current || 1;
		const { catalogId, brand, notInclude } = this.state.queryParams;
		// 悬浮购物车图标
		const cartSquare = (
			<div className="shoppingCart">
				<Badge onClick={this.handleShowCartDrawer} className="cartInner" count={shoppingCart.length} >
					<Icon type="shopping-cart" style={{ fontSize: 20 }} />
					<div className="cartText">购物车</div>
				</Badge>
			</div>
		)

		return (
			<div className="supermarket-root">
				{/* 页面头部：面包屑+搜索框 */}
				<div className="header-container">
					<div className="headeInner">
						<a className="breadcrumb">辅料超市</a>
						<Search className="goodsSearch"
							placeholder="请输入关键字进行搜索"
							onSearch={value => this.getFGoods({ keywords: value })} />
					</div>
				</div>

				{/* 筛选区域 */}
				<div className="section-wrapper">
					<GoodsFilter
						catalogList={catalogList}
						brandList={brandList}
						getBrands={this.getBrands}
						getFGoods={this.getFGoods}
						changeGoodsNum={this.changeGoodsNum}
						catalogId={catalogId}
						brand={brand}
						notInclude={notInclude}
					/>
				</div>

				{/* 筛选商品结果列表 */}
				<div className="goodsCardList">
					<FGoodList
						addToCart={this.addToCart}
						changeGoodsNum={this.changeGoodsNum}
						records={records} />
					<Pagination
						style={{ float: 'right', marginBottom: 20 }}
						showQuickJumper
						current={current}
						total={total}
						pageSize={12}
						showTotal={total => `共${total}条数据`}
						onChange={(page, pageSize) => this.getFGoods({ current: page, pageSize })}
					/>
				</div>

				{/* 悬浮购物车图标 */}
				{cartSquare}

				{/* 购物车详情页 */}
				<CartPage
					FGoodData={FGoodData}
					deleteGoods={this.deleteGoods}
					changeGoodsNum={this.changeGoodsNum}
					shoppingCart={shoppingCart}
					cartDrawerVisible={cartDrawerVisible}
					handleShowCartDrawer={this.handleShowCartDrawer}
					handleHideCartDrawer={this.handleHideCartDrawer}
					{...this.props}
				/>
			</div>
		)
	}
}

export default connect(({ accSupermarket }) => ({
	...accSupermarket,
}))(AccSupermarket);