<template>
	<view>
		<view :class="(is_single_page == 1 ? 'margin-top-xxxl single-page-top' : '')">
			<!-- 搜索框 -->
			<block v-if="is_single_page == 0">
				<view class="nav-search padding-horizontal-main bg-white" :style="'padding-top:'+(status_bar_height+8)+'px;'">
					<block v-if="is_goods_category_search_alone == 1">
						<component-search propPlaceholder="输入商品名称搜索"></component-search>
					</block>
					<block v-else>
						<component-search @onsearch="search_button_event" :propIsOnEvent="true" :propIsRequired="false" propPlaceholder="输入商品名称搜索"></component-search>
					</block>
				</view>
			</block>

			<!-- 分类内容 -->
			<view v-if="category_list.length > 0" :class="'category-content pr bs-bb '+(category_show_level == 0 ? 'goods-model' : '')" :style="'height:calc(100vh - '+(status_bar_height+48)+'px);'">
				<block v-if="category_show_level == 1">
					<!-- 一级模式 -->
					<view class="model-one padding-sm oh">
						<block v-for="(item, index) in category_list" :key="index">
							<view class="content-item padding-sm tc cp" :data-value="item.id" @tap="category_event">
								<view class="content auto bg-white wh-auto border-radius-main">
									<image v-if="(item.icon || null) != null" :src="item.icon" mode="aspectFit" class="icon radius"></image>
									<view class="text single-text">{{item.name}}</view>
								</view>
							</view>
						</block>
					</view>
				</block>
				<block v-else>
					<!-- 商品列表模式 -->
					<block v-if="category_show_level == 0">
						<!-- 一级导航 -->
						<view class="top-nav bg-white wh-auto pa br-b scroll-view-horizontal">
							<scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="'one-nav-item-'+nav_active_index" class="ht-auto">
								<block v-for="(item, index) in category_list" :key="index">
									<view :class="'text-size-sm item tc cr-base cp dis-inline-block ' + (nav_active_index == index ? 'cr-main border-color-main fw-b' : '')" :id="'one-nav-item-'+index"
										:data-index="index" :data-itemtwoindex="-1" :data-itemthreeindex="-1" @tap="nav_event">
										<view :class="'icon-content circle br auto ' + (nav_active_index == index ? 'border-color-main' : '')">
											<image :src="((item[category_goods_model_icon_field] || null) == null) ? common_static_url+'images.png' : item[category_goods_model_icon_field]"
												mode="aspectFit" class="icon dis-block auto wh-auto ht-auto circle"></image>
										</view>
										<view class="margin-top-xs">{{item.name}}</view>
									</view>
								</block>
							</scroll-view>
						</view>
						<!-- 二级导航 -->
						<view v-if="category_one_subset_count > 0" class="left-nav bg-white ht-auto">
							<scroll-view :scroll-y="true" class="ht-auto">
								<view :class="((common_site_type != 1) ? 'left-content-actual' : '')">
									<view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_item_two_index == -1 ? 'nav-active cr-main border-color-main' : '')"
										:data-index="nav_active_index" :data-itemtwoindex="-1" :data-itemthreeindex="-1" @tap="nav_event">
										<text>全部</text>
									</view>
									<block v-if="(data_content || null) != null && (data_content.items || null) != null && data_content.items.length > 0">
										<block v-for="(item, index) in data_content.items" :key="index">
											<view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_item_two_index == index ? 'nav-active cr-main border-color-main' : '')"
												:data-index="nav_active_index" :data-itemtwoindex="index" :data-itemthreeindex="-1" @tap="nav_event">
												<text>{{item.name}}</text>
											</view>
										</block>
									</block>
								</view>
							</scroll-view>
						</view>
						<!-- 商品列表 -->
						<view :class="'goods-right-content pa bs-bb padding-top-main padding-horizontal-main '+(category_one_subset_count > 0 ? '' : 'category-one-subset-content')">
							<scroll-view :scroll-y="true" class="ht-auto goods-list" :scroll-top="scroll_top" @scroll="scroll_event" @scrolltolower="scroll_lower" lower-threshold="60">
								<view :class="((common_site_type != 1) ? 'right-content-actual' : '')+' pr'">
									<!-- 三级导航 -->
									<view v-if="(data_three_content || null) != null && (data_three_content.items || null) != null && data_three_content.items.length > 0"
										class="word-list scroll-view-horizontal">
										<scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="'three-nav-item-'+nav_active_item_three_index">
											<view
												:class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right '+((nav_active_item_three_index == -1) ? 'bg-main-light br-main-light cr-main' : 'br-gray cr-gray')"
												:data-index="nav_active_index" :data-itemtwoindex="nav_active_item_two_index" :data-itemthreeindex="-1" @tap="nav_event">全部</view>
											<block v-for="(item, index) in data_three_content.items" :key="index">
												<view
													:class="'word-icon dis-inline-block text-size-sm round padding-top-xs padding-bottom-xs padding-left padding-right '+((nav_active_item_three_index == index) ? 'bg-main-light br-main-light cr-main' : 'br-gray cr-gray')"
													:id="'three-nav-item-'+index" :data-index="nav_active_index" :data-itemtwoindex="nav_active_item_two_index" :data-itemthreeindex="index"
													@tap="nav_event">{{item.name}}</view>
											</block>
										</scroll-view>
									</view>
									<!-- 右侧商品列表 -->
									<view v-if="(data_list || null) != null && data_list.length > 0" class="oh">
										<view v-for="(item, index) in data_list" :key="index" class="item bg-white border-radius-main oh pr spacing-mb">
											<!-- 商品主体内容 -->
											<view :data-value="item.goods_url+'&is_opt_back=1'" @tap="url_event">
												<image :src="item.images" mode="widthFix" class="goods-img radius fl"></image>
												<view class="goods-base padding-top-sm padding-right-sm fr">
													<view class="goods-base-content">
														<view class="goods-title text-size-sm multi-text">{{item.title}}</view>
														<view v-if="(item.simple_desc || null) != null" class="simple-desc cr-red text-size-xs margin-top-sm single-text">{{item.simple_desc}}</view>
													</view>
													<view class="margin-top-sm oh">
														<view class="sales-price text-size-sm single-text pa">{{currency_symbol}}{{item.min_price}}</view>
														<view v-if="common_site_type != 1" class="buy-opt tc pa">
															<block v-if="(item.is_error || 0) == 0">
																<view v-if="(item.buy_number || 0) > 0" class="dis-inline-block va-m cp" :data-index="index" data-type="0" @tap.stop="buy_number_event">
																	<uni-icons type="minus" size="46rpx" color="#f00"></uni-icons>
																</view>
																<view v-if="(item.buy_number || 0) > 0" class="buy-number dis-inline-block cr-base text-size-sm padding-left-xs padding-right-xs va-m">
																	{{item.buy_number}}
																</view>
																<view class="dis-inline-block va-m cp" :data-index="index" data-type="1" @tap.stop="buy_number_event">
																	<iconfont name="icon-icon-index-smbg-tj" size="40rpx" :color="themeColor"></iconfont>
																</view>
															</block>
															<block v-else>
																<text class="cr-grey text-size-xs">{{item.error_msg}}</text>
															</block>
														</view>
													</view>
												</view>
											</view>
											<!-- 标签插件 -->
											<view v-if="(plugins_label_data || null) != null && plugins_label_data.data.length > 0"
												:class="'plugins-label oh pa plugins-label-'+((plugins_label_data.base.is_user_goods_label_icon || 0) == 0 ? 'text' : 'img')+' plugins-label-'+(plugins_label_data.base.user_goods_show_style || 'top-left')">
												<block v-for="(lv,li) in plugins_label_data.data" :key="li">
													<view v-if="(lv.goods_ids || null) != null && lv.goods_ids.indexOf(item.id) != -1" class="lv dis-inline-block va-m"
														:data-value="((plugins_label_data.base.is_user_goods_label_url || 0) == 1) ? (lv.url || '') : ''" @tap="url_event">
														<view v-if="(plugins_label_data.base.is_user_goods_label_icon || 0) == 0" class="round cr-white bg-main text-size-xs fl"
															:style="((lv.bg_color || null) != null ? 'background-color:'+ lv.bg_color+' !important;' : '')+((lv.text_color || null) != null ? 'color:'+ lv.text_color+' !important;' : '')">
															{{lv.name}}
														</view>
														<image v-else class="dis-block" :src="lv.icon" mode="scaleToFill"></image>
													</view>
												</block>
											</view>
										</view>
									</view>
									<block v-else>
										<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
									</block>
								</view>
							</scroll-view>
						</view>
					</block>
					<block v-else>
						<!-- 一级导航 -->
						<view class="left-nav bg-white ht-auto">
							<scroll-view :scroll-y="true" class="ht-auto">
								<block v-for="(item, index) in category_list" :key="index">
									<view :class="'text-size-sm item tc cr-base cp oh ' + (nav_active_index == index ? 'nav-active cr-main border-color-main' : '')" :data-index="index"
										:data-itemindex="-1" @tap="nav_event">
										<text>{{item.name}}</text>
									</view>
								</block>
							</scroll-view>
						</view>
						<view class="right-container pa">
							<scroll-view :scroll-y="true" class="ht-auto">
								<!-- 一级内容基础容 -->
								<view v-if="(data_content || null) != null" class="padding-top-main padding-horizontal-main oh">
									<!-- 一级基础信息 -->
									<view v-if="(data_content.vice_name || null) != null || (data_content.describe || null) != null"
										class="one-content bg-white padding-main border-radius-main cp spacing-mb" :data-value="data_content.id" @tap="category_event">
										<view v-if="(data_content.vice_name || null) != null" class="text-size fw-b" :style="'color:' + data_content.bg_color + ';'">{{data_content.vice_name}}</view>
										<view v-if="(data_content.describe || null) != null" class="cr-grey margin-top-sm">{{data_content.describe}}</view>
									</view>
									<!-- 一二级数据渲染 -->
									<block v-if="(data_content.items || null) != null && data_content.items.length > 0">
										<!-- 二级模式 -->
										<block v-if="category_show_level == 2">
											<view class="two-content bg-white oh padding-main border-radius-main spacing-mb">
												<block v-for="(v, index) in data_content.items" :key="index">
													<view class="content-item padding-sm tc cp" :data-value="v.id" @tap="category_event">
														<view class="content wh-auto">
															<image v-if="(v.icon || null) != null" :src="v.icon" mode="aspectFit" class="icon radius"></image>
															<view class="text single-text">{{v.name}}</view>
														</view>
													</view>
												</block>
											</view>
										</block>
										<!-- 三级模式 -->
										<block v-if="category_show_level == 3">
											<block v-for="(v, index) in data_content.items" :key="index">
												<view class="spacing-nav-title">
													<text class="text-wrapper text-size-md">{{v.name}}</text>
													<text v-if="(v.describe || null) != null" class="vice-name margin-left-lg cr-gray">{{v.describe}}</text>
													<view :data-value="v.id" @tap="category_event" class="arrow-right padding-right-xxxl cr-gray fr cp">更多</view>
												</view>
												<view v-if="(v.items || null) != null && v.items.length > 0" class="bg-white oh padding-main border-radius-main spacing-mb">
													<block v-for="(vs, index2) in v.items" :key="index2">
														<view class="content-item padding-sm tc cp" :data-value="vs.id" @tap="category_event">
															<view class="content wh-auto">
																<image v-if="(vs.icon || null) != null" :src="vs.icon" mode="aspectFit" class="icon radius"></image>
																<view class="text single-text">{{vs.name}}</view>
															</view>
														</view>
													</block>
												</view>
											</block>
										</block>
									</block>
									<block v-else>
										<!-- 提示信息 -->
										<component-no-data propStatus="0" propMsg="没有子分类数据"></component-no-data>
									</block>
								</view>
								<view v-else>
									<!-- 提示信息 -->
									<component-no-data propStatus="0" propMsg="没有子分类数据"></component-no-data>
								</view>
							</scroll-view>
						</view>
					</block>
				</block>
			</view>

			<view v-if="category_list.length == 0 && data_list_loding_status != 0">
				<!-- 提示信息 -->
				<component-no-data :propStatus="data_list_loding_status"></component-no-data>
			</view>

			<!-- 仅商品模式展示购物车和规格选择 -->
			<block v-if="common_site_type != 1 && category_show_level == 0">
				<!-- 购物车列表 -->
				<block v-if="cart_status">
					<view class="cart-mask wh-auto ht-auto pf" @tap="cart_event"></view>
					<view class="cart-content bg-white border-radius-main pa oh">
						<block v-if="(cart || null) != null && (cart.data || null) != null && cart.data.length > 0">
							<view class="oh br-b padding-vertical-main padding-horizontal-main">
								<text class="va-m text-size-xs cr-base">已选商品</text>
								<view class="fr cp" @tap="cart_all_delete_event">
									<view class="dis-inline-block va-m">
										<uni-icons type="trash" size="12" color="#f00"></uni-icons>
									</view>
									<text class="cr-red va-m text-size-xs margin-left-xs">清空</text>
								</view>
							</view>
							<scroll-view :scroll-y="true" class="cart-list goods-list">
								<view v-for="(goods, index) in cart.data" :key="index" class="item padding-main oh spacing-mb">
									<navigator :url="goods.goods_url" hover-class="none">
										<image :src="goods.images" mode="widthFix" class="goods-img radius fl br"></image>
										<view class="goods-base fr">
											<view class="goods-base-content">
												<view class="goods-title text-size-sm single-text">{{goods.title}}</view>
												<view v-if="goods.spec != null" class="text-size-xs cr-grey margin-top-sm">
													<block v-for="(sv, si) in goods.spec" :key="si">
														<text v-if="si > 0" class="padding-left-xs padding-right-xs">;</text>
														<text>{{sv.value}}</text>
													</block>
												</view>
											</view>
											<view class="margin-top-sm oh">
												<view class="sales-price text-size-sm single-text dis-inline-block va-m">{{currency_symbol}}{{goods.price}}</view>
												<view class="tc fr">
													<block v-if="goods.is_error == 0">
														<view v-if="(goods.stock || 0) > 0" class="dis-inline-block va-m cp" :data-index="index" data-type="0" @tap.stop="cart_buy_number_event">
															<uni-icons type="minus" size="46rpx" color="#f00"></uni-icons>
														</view>
														<view v-if="(goods.stock || 0) > 0" class="buy-number dis-inline-block cr-base text-size-sm padding-left-xs padding-right-xs va-m">
															{{goods.stock}}
														</view>
														<view class="dis-inline-block va-m cp" :data-index="index" data-type="1" @tap.stop="cart_buy_number_event">
															<iconfont name="icon-icon-index-smbg-tj" size="40rpx" :color="themeColor"></iconfont>
														</view>
													</block>
													<block v-else>
														<text class="cr-red">{{goods.error_msg}}</text>
													</block>
												</view>
											</view>
										</view>
									</navigator>
								</view>
							</scroll-view>
						</block>
						<block v-else>
							<component-no-data propStatus="0" propMsg="请先选购商品"></component-no-data>
						</block>
					</view>
				</block>
				<!-- 购物车底部导航 -->
				<view class="botton-nav round pa bg-main-pair oh">
					<view class="cart dis-inline-block va-m margin-left-xxl pr cp" @tap="cart_event">
						<uni-icons type="cart" size="32rpx" color="#fff"></uni-icons>
						<view v-if="(cart || null) != null && (cart.buy_number || 0) != 0" class="badge-icon pa">
							<component-badge :propNumber="cart.buy_number"></component-badge>
						</view>
					</view>
					<view class="cart-total-price single-text dis-inline-block fw-b cr-white va-m margin-left-xl">
						<text class="text-size-sm">{{currency_symbol}}</text>
						<text class="text-size-lg">{{(cart || null) == null ? 0 : (cart.total_price || 0)}}</text>
					</view>
					<button type="default" size="mini" hover-class="none" @tap="buy_submit_event" class="text-size-sm pa radius-0 bg-main cr-white">去结算</button>
				</view>
			</block>

			<!-- 购物车抛物线 -->
			<component-cart-para-curve ref="cart_para_curve"></component-cart-para-curve>

			<!-- 商品购买 -->
			<component-goods-buy ref="goods_buy" v-on:CartSuccessEvent="goods_cart_back_event"></component-goods-buy>

			<!-- 快捷导航 -->
			<component-quick-nav :propIsNav="true" :propIsBar="true"></component-quick-nav>

			<!-- 用户基础 -->
			<component-user-base ref="user_base"></component-user-base>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	import base64 from '../../common/js/lib/base64.js';
	import componentGoodsBuy from "../../components/goods-buy/goods-buy";
	import componentSearch from "../../components/search/search";
	import componentQuickNav from "../../components/quick-nav/quick-nav";
	import componentNoData from "../../components/no-data/no-data";
	import componentPopup from "../../components/popup/popup";
	import componentBadge from "../../components/badge/badge";
	import componentCartParaCurve from '../../components/cart-para-curve/cart-para-curve';
	import componentUserBase from "../../components/user-base/user-base";

	var common_static_url = app.globalData.get_static_url('common');
	// 状态栏高度
	var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
	// #ifdef MP-TOUTIAO
	bar_height = 0;
	// #endif

	var icon_type = app.globalData.data.category_goods_model_icon_type;
	export default {
		data() {
			return {
				common_static_url: common_static_url,
				status_bar_height: bar_height,
				data_bottom_line_status: false,
				data_list_loding_status: 1,
				data_list_loding_msg: '',
				data_is_loading: 0,
				user: null,
				tabbar_params: null,
				common_site_type: 0,
				category_list: [],
				data_content: null,
				data_three_content: null,
				cart: null,
				data_list: [],
				data_total: 0,
				data_page_total: 0,
				data_page: 1,
				currency_symbol: app.globalData.data.currency_symbol,
				is_first: 1,
				search_keywords_value: '',
				nav_active_index: 0,
				nav_active_item_two_index: -1,
				nav_active_item_three_index: -1,
				scroll_top: 0,
				scroll_top_old: 0,
				cart_status: false,
				goods_choose_data: {},
				category_one_subset_count: 0,
				// 基础配置
				category_show_level: 0,
				// 自定义分享信息
				share_info: {},
				// 是否单页预览
				is_single_page: app.globalData.is_current_single_page() || 0,
				// 商品列表模式一级分类图标类型
				category_goods_model_icon_field: (icon_type == 0) ? 'realistic_images' : ((icon_type == 1) ? 'icon' : 'big_images'),
				// 商品分类页面搜索进入独立搜索页面
				is_goods_category_search_alone: app.globalData.data.is_goods_category_search_alone,
				// 临时操作数据
				temp_opt_data: null,
				// 标签插件
				plugins_label_data: null,
				themeColor: app.globalData.get_theme_color()
			};
		},

		components: {
			componentGoodsBuy,
			componentSearch,
			componentQuickNav,
			componentNoData,
			componentPopup,
			componentBadge,
			componentCartParaCurve,
			componentUserBase
		},
		props: {},

		onShow() {
			// 基础参数
			this.setData({
				user: app.globalData.get_user_cache_info(),
				tabbar_params: app.globalData.get_page_tabbar_switch_params()
			});

			// 数据加载
			this.init();

			// 初始化配置
			this.init_config();

			// 清除tab参数
			app.globalData.remove_page_tabbar_switch_params();

			// 用户头像和昵称设置提示
			if ((this.$refs.user_base || null) != null) {
				this.$refs.user_base.init('goods-category');
			}
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.init();
		},

		methods: {
			// 初始化配置
			init_config(status) {
				if ((status || false) == true) {
					this.setData({
						common_site_type: app.globalData.get_config('config.common_site_type'),
						currency_symbol: app.globalData.get_config('currency_symbol'),
						category_show_level: app.globalData.get_config('config.category_show_level')
					});
				} else {
					app.globalData.is_config(this, 'init_config');
				}
			},

			// 获取数据
			init() {
				if (this.is_first == 1) {
					this.setData({
						data_list_loding_status: 1
					});
				}

				uni.request({
					url: app.globalData.get_request_url("category", "goods"),
					method: 'POST',
					data: {},
					dataType: 'json',
					success: res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							var data = res.data.data;
							var index = this.nav_active_index;
							var temp_category = data.category || [];
							// 全部分类子集数量
							var category_one_subset_count = 0;
							// 是否指定分类
							var tabbar_params = this.tabbar_params;
							if (temp_category.length > 0) {
								for (var i in temp_category) {
									// 是否指定分类
									if ((tabbar_params || null) != null && (tabbar_params.id || null) != null && temp_category[i]['id'] == tabbar_params.id) {
										index = i;
										break;
									}
									// 是否全部数据都无二级
									if ((temp_category[i]['items'] || null) != null && temp_category[i]['items'].length > 0) {
										category_one_subset_count++;
									}
								}
							}
							// 设置分类及右侧数据和及基础数据
							var upd_data = {
								category_list: temp_category,
								data_content: temp_category[index] || null,
								nav_active_index: index,
								category_one_subset_count: category_one_subset_count,
								plugins_label_data: (data.plugins_label_data || null) == null || (data.plugins_label_data.base || null) == null || (data.plugins_label_data.data ||
									null) == null || data.plugins_label_data.data.length <= 0 ? null : data.plugins_label_data,
							}
							// 指定分类则重新读取列表数据
							if (tabbar_params != null && this.nav_active_index != index) {
								upd_data['is_first'] = 1;
								upd_data['data_page'] = 1;
								upd_data['data_list'] = [];
								upd_data['data_list_loding_status'] = 1;
								upd_data['nav_active_item_two_index'] = -1;
								upd_data['nav_active_item_three_index'] = -1;
							}
							// 非商品列表模式
							if (this.category_show_level != 0) {
								upd_data['data_list_loding_status'] = temp_category.length == 0 ? 0 : 3;
								upd_data['data_bottom_line_status'] = true;
							}
							this.setData(upd_data);

							// 商品列表模式
							if (this.category_show_level == 0) {
								// 商品列表模式获取购物车数据
								this.get_cart_data();
								// 获取商品列表、仅首次请求商品列表
								if (this.is_first == 1) {
									this.get_goods_list(1);
								}
							} else {
								// 分类模式下、仅首次请求购物车接口和商品模式下
								if (this.is_first == 1 && this.category_show_level == 0) {
									this.get_cart_data();
								}
							}
							// 是否首次记录
							this.setData({
								is_first: 0
							});
						} else {
							this.setData({
								data_list_loding_status: 2,
								data_list_loding_msg: res.data.msg
							});
						}

						// 基础自定义分享
						this.setData({
							share_info: {
								path: '/pages/goods-category/goods-category'
							}
						});

						// 分享菜单处理、延时执行，确保基础数据已加载完成
						setTimeout(function() {
							app.globalData.page_share_handle(this.share_info);
						}, 3000);
					},
					fail: () => {
						uni.stopPullDownRefresh();
						this.setData({
							data_list_loding_status: 2,
							data_list_loding_msg: '服务器请求出错'
						});
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 获取商品列表
			get_goods_list(is_mandatory) {
				// 分页是否还有数据
				if ((is_mandatory || 0) == 0) {
					if (this.data_bottom_line_status == true) {
						uni.stopPullDownRefresh();
						return false;
					}
				}

				// 是否加载中
				if (this.data_is_loading == 1) {
					return false;
				}
				this.setData({
					data_is_loading: 1
				});

				// 请求参数
				var data = {
					page: this.data_page,
					wd: this.search_keywords_value || ''
				};
				// 分类id
				if ((this.data_content || null) != null) {
					// 主分类id
					data['category_id'] = this.data_content['id'];
					// 是否选中了二级分类
					if (this.nav_active_item_two_index != -1) {
						data['category_id'] = this.data_content['items'][this.nav_active_item_two_index]['id'];
					}
					// 是否选中了三级分类
					if (this.data_three_content != null && this.nav_active_item_three_index != -1) {
						data['category_id'] = this.data_three_content['items'][this.nav_active_item_three_index]['id'];
					}
				}

				// 获取数据
				uni.request({
					url: app.globalData.get_request_url("datalist", "search"),
					method: 'POST',
					data: data,
					dataType: 'json',
					success: res => {
						if (res.data.code == 0) {
							var data = res.data.data;
							if (data.data.length > 0) {
								if (this.data_page <= 1) {
									var temp_data_list = data.data;
								} else {
									var temp_data_list = this.data_list || [];
									var temp_data = data.data;
									for (var i in temp_data) {
										temp_data_list.push(temp_data[i]);
									}
								}
								this.setData({
									data_list: temp_data_list,
									data_total: data.total,
									data_page_total: data.page_total,
									data_list_loding_status: 3,
									data_page: this.data_page + 1,
									data_is_loading: 0
								});

								// 是否还有数据
								this.setData({
									data_bottom_line_status: (this.data_page > 1 && this.data_page > this.data_page_total)
								});

								// 购物车数据处理
								this.cart_data_list_handle();
							} else {
								this.setData({
									data_list_loding_status: 0,
									data_total: 0,
									data_is_loading: 0
								});
								if (this.data_page <= 1) {
									this.setData({
										data_list: [],
										data_bottom_line_status: false
									});
								}
							}
						} else {
							this.setData({
								data_list_loding_status: 0,
								data_list_loding_msg: res.data.msg,
								data_is_loading: 0
							});
							app.globalData.showToast(res.data.msg);
						}
					},
					fail: () => {
						this.setData({
							data_list_loding_status: 2,
							data_list_loding_msg: '服务器请求出错',
							data_is_loading: 0
						});
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 重置滑动位置
			reset_scroll() {
				this.setData({
					scroll_top: this.scroll_top_old
				});
				this.$nextTick(() => {
					this.setData({
						scroll_top: 0
					});
				});
			},

			// 滑动事件位置记录
			scroll_event(e) {
				this.setData({
					scroll_top_old: e.detail.scrollTop
				});
			},

			// 滚动加载
			scroll_lower(e) {
				this.get_goods_list();
			},

			// 导航事件
			nav_event(e) {
				var index = e.currentTarget.dataset.index;
				var two_index = e.currentTarget.dataset.itemtwoindex;
				var three_index = e.currentTarget.dataset.itemthreeindex;
				var temp_data_content = this.category_list[index] || null;
				var temp_data_three_content = null;
				if (two_index != -1 && temp_data_content != null) {
					temp_data_three_content = temp_data_content['items'][two_index];
				}
				this.setData({
					nav_active_index: index,
					nav_active_item_two_index: two_index,
					nav_active_item_three_index: three_index,
					data_content: temp_data_content,
					data_three_content: temp_data_three_content,
					data_page: 1,
					data_list_loding_status: 1,
					data_list: []
				});

				// 商品模式则读取商品
				if (this.category_show_level == 0) {
					this.reset_scroll();
					this.get_goods_list(1);
				}
			},

			// 分类事件
			category_event(e) {
				uni.navigateTo({
					url: '/pages/goods-search/goods-search?category_id=' + e.currentTarget.dataset.value
				});
			},

			// 搜索事件
			search_button_event(e) {
				// 商品列表模式
				if (this.category_show_level == 0) {
					this.setData({
						search_keywords_value: e || '',
						data_page: 1,
						data_list_loding_status: 1,
						data_list: []
					});
					this.get_goods_list(1);
				} else {
					// 进入搜索页面
					uni.navigateTo({
						url: '/pages/goods-search/goods-search' + (((e || null) == null) ? '' : '?keywords=' + e)
					});
				}
			},

			// url事件
			url_event(e) {
				app.globalData.url_event(e);
			},

			// 列表数据操作
			buy_number_event(e) {
				if (!app.globalData.is_single_page_check()) {
					return false;
				}
				var user = app.globalData.get_user_info(this);
				if (user != false) {
					// 用户未绑定手机则转到登录页面
					if (app.globalData.user_is_need_login(user)) {
						uni.navigateTo({
							url: "/pages/login/login?event_callback=buy_number_event"
						});
						return false;
					} else {
						var index = e.currentTarget.dataset.index;
						var type = parseInt(e.currentTarget.dataset.type) || 0;
						var temp_goods = this.data_list[index];
						this.setData({
							goods_choose_data: temp_goods
						});

						// 是否存在多规格
						if ((temp_goods.is_exist_many_spec || 0) != 0) {
							// 是否购物车中操作
							if (type == 0) {
								this.setData({
									cart_status: true
								});
								app.globalData.showToast('不同规格的商品需在购物车减购');
							} else {
								if ((this.$refs.goods_buy || null) != null) {
									this.$refs.goods_buy.init(temp_goods, {
										buy_event_type: 'cart'
									});
								}
							}
							return false;
						}

						// 数据操作处理
						this.buy_number_event_handle(e, type, temp_goods);
					}
				}
			},

			// 加入购物车成功回调
			goods_cart_back_event(e) {
				// 重新获取购物车数据
				this.get_cart_data();
			},

			// 列表数量事件处理
			buy_number_event_handle(e, type, goods, spec = '') {
				var res = this.buy_number_handle(type, goods, 'buy_number');
				if (res === false) {
					return false;
				}

				// 为0或减操作则查询
				var cart_item = null;
				if (type == 0 || (type == 1 && goods['buy_number'] > 0)) {
					var cart_data = this.cart.data;
					var params_spec = ((spec || null) == null || typeof(spec) != 'object') ? '' : JSON.stringify(spec);
					for (var i in cart_data) {
						if (goods['id'] == cart_data[i]['goods_id']) {
							var cart_spec = ((cart_data[i]['spec'] || null) == null || typeof(cart_data[i]['spec']) != 'object') ? '' : JSON.stringify(cart_data[i]['spec']);
							if (type == 0 || (type == 1 && cart_spec == params_spec)) {
								cart_item = cart_data[i];
							}
							break;
						}
					}
				}

				// 数据临时记录
				this.setData({
					temp_opt_data: {
						pos: e,
						goods: goods,
						type: type,
					}
				});

				// 操作类型
				if (res == 0) {
					if (cart_item == null) {
						app.globalData.showToast('购物车id有误');
						return false;
					}
					this.cart_delete(cart_item.id);
				} else if (cart_item == null) {
					this.cart_save(goods['id'], res, spec);
				} else {
					var number = (type == 0) ? parseInt(cart_item['stock']) - res : res + parseInt(cart_item['stock']);
					this.cart_update(cart_item.id, goods['id'], number);
				}
				return true;
			},

			// 购物车抛物线动画
			cart_para_curve_handle() {
				if ((this.temp_opt_data || null) != null && (this.temp_opt_data.type || 0) == 1) {
					if ((this.$refs.cart_para_curve || null) != null) {
						var self = this;
						uni.createSelectorQuery().select('.botton-nav .cart').boundingClientRect().exec(function(res) {
							self.$refs.cart_para_curve.init(res, self.temp_opt_data.pos, self.temp_opt_data.goods.images);
						});
					}
				}
			},

			// 购物车数量操作
			cart_buy_number_event(e) {
				if (!app.globalData.is_single_page_check()) {
					return false;
				}
				var user = app.globalData.get_user_info(this);
				if (user != false) {
					// 用户未绑定手机则转到登录页面
					if (app.globalData.user_is_need_login(user)) {
						uni.navigateTo({
							url: "/pages/login/login?event_callback=cart_buy_number_event"
						});
						return false;
					} else {
						var index = e.currentTarget.dataset.index;
						var type = parseInt(e.currentTarget.dataset.type) || 0;
						var temp_data = this.cart.data;
						var temp_goods = temp_data[index];

						// 数据操作处理
						var res = this.buy_number_handle(type, temp_goods, 'stock');
						if (res === false) {
							return false;
						}

						// 数据临时记录
						this.setData({
							temp_opt_data: {
								pos: e,
								goods: temp_goods,
								type: type,
							}
						});

						// 操作类型
						if (res == 0) {
							this.cart_delete(temp_goods['id']);
						} else {
							var number = (type == 0) ? parseInt(temp_goods['stock']) - res : res + parseInt(temp_goods['stock']);
							this.cart_update(temp_goods['id'], temp_goods['goods_id'], number);
						}
					}
				}
			},

			// 数量操作处理
			buy_number_handle(type, goods, buy_number_field) {
				// 加减处理
				var buy_number = parseInt(goods[buy_number_field]) || 0;
				if (type == 0) {
					buy_number -= 1;
				} else {
					buy_number += 1;
				}
				if (buy_number < 0) {
					buy_number = 0;
				}

				// 数据校验
				var buy_min_number = parseInt(goods['buy_min_number']) || 1;
				var buy_max_number = parseInt(goods['buy_max_number']) || 0;
				var spec_buy_min_number = parseInt(goods['spec_buy_min_number']) || 0;
				var spec_buy_max_number = parseInt(goods['spec_buy_max_number']) || 0;
				var inventory = parseInt(goods['inventory']);
				var inventory_unit = goods['inventory_unit'];

				// 最小起购数量
				var min = (spec_buy_min_number > 0) ? spec_buy_min_number : buy_min_number;
				if (min > 0) {
					if (type == 0) {
						if (buy_number < min) {
							buy_number = 0;
						}
					} else {
						if (buy_number < min) {
							buy_number = min;
						}
					}
				}

				// 最大购买数量
				var max = (spec_buy_max_number > 0) ? spec_buy_max_number : buy_max_number;
				if (max > 0 && buy_number > max) {
					buy_number = max;
					app.globalData.showToast('限购' + max + inventory_unit);
					return false;
				}

				// 数量是否改变
				if (goods[buy_number_field] == buy_number) {
					app.globalData.showToast('数量未改变');
					return false;
				}

				// 操作数量
				var opt_number = 1;
				if (type == 0) {
					if (buy_number <= 0) {
						opt_number = 0;
					}
				} else {
					if (buy_number > goods['buy_number']) {
						opt_number = buy_number - goods['buy_number'];
					}
				}
				return opt_number;
			},

			// 购物车添加
			cart_save(goods_id, buy_number, spec = '') {
				uni.request({
					url: app.globalData.get_request_url('save', 'cart'),
					method: 'POST',
					data: {
						"goods_id": goods_id,
						"stock": buy_number,
						"spec": spec
					},
					dataType: 'json',
					success: res => {
						if (res.data.code == 0) {
							this.cart_para_curve_handle();
							this.get_cart_data();
						} else {
							if (app.globalData.is_login_check(res.data)) {
								app.globalData.showToast(res.data.msg);
							}
						}
					},
					fail: () => {
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 购物车更新
			cart_update(cart_id, goods_id, buy_number) {
				uni.request({
					url: app.globalData.get_request_url("stock", "cart"),
					method: 'POST',
					data: {
						"id": cart_id,
						"goods_id": goods_id,
						"stock": buy_number
					},
					dataType: 'json',
					success: res => {
						if (res.data.code == 0) {
							this.cart_para_curve_handle();
							this.get_cart_data();
						} else {
							if (app.globalData.is_login_check(res.data)) {
								app.globalData.showToast(res.data.msg);
							} else {
								app.globalData.showToast('提交失败，请重试！');
							}
						}
					},
					fail: () => {
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 购物车删除
			cart_delete(cart_id) {
				uni.request({
					url: app.globalData.get_request_url('delete', 'cart'),
					method: 'POST',
					data: {
						"id": cart_id
					},
					dataType: 'json',
					success: res => {
						if (res.data.code == 0) {
							this.get_cart_data();
						} else {
							if (app.globalData.is_login_check(res.data)) {
								app.globalData.showToast(res.data.msg);
							} else {
								app.globalData.showToast('提交失败，请重试！');
							}
						}
					},
					fail: () => {
						app.globalData.showToast('服务器请求出错');
					}
				});
			},

			// 获取购物车数据
			get_cart_data() {
				if (this.user != null) {
					uni.request({
						url: app.globalData.get_request_url("index", "cart"),
						method: 'POST',
						data: {},
						dataType: 'json',
						success: res => {
							if (res.data.code == 0) {
								var data = res.data.data;
								var temp_cart = data.data || [];
								this.setData({
									cart: res.data.data
								});
								this.cart_data_list_handle();

								// 导航购物车处理
								if (data.buy_number <= 0) {
									app.globalData.set_tab_bar_badge(2, 0);
								} else {
									app.globalData.set_tab_bar_badge(2, 1, data.buy_number);
								}
							}
						},
						fail: () => {
							app.globalData.showToast('服务器请求出错');
						}
					});
				}
			},

			// 购物车更新列表数据处理
			cart_data_list_handle() {
				var temp_cart = this.cart || null;
				if (temp_cart != null) {
					var temp_data_list = this.data_list;
					if (temp_data_list.length > 0) {
						for (var i in temp_data_list) {
							temp_data_list[i]['buy_number'] = 0;
							if (temp_cart.data.length > 0) {
								for (var k in temp_cart.data) {
									if (temp_cart.data[k]['goods_id'] == temp_data_list[i]['id']) {
										temp_data_list[i]['buy_number'] += parseInt(temp_cart.data[k]['stock']);
									}
								}
							}
						}
					}
					this.setData({
						data_list: temp_data_list
					});
				}
			},

			// 批量删除操作
			cart_all_delete_event(e) {
				uni.showModal({
					title: '温馨提示',
					content: '挑了这么久，真的要清空吗？',
					confirmText: '确认',
					cancelText: '暂不',
					success: result => {
						if (result.confirm) {
							var ids = [];
							var temp_data = this.cart.data;
							for (var i in temp_data) {
								ids.push(temp_data[i]['id']);
							}
							this.cart_delete(ids.join(','));
						}
					}
				});
			},

			// 购物车状态
			cart_event(e) {
				this.setData({
					cart_status: !this.cart_status
				});
			},

			// 购物车结算
			buy_submit_event(e) {
				if (!app.globalData.is_single_page_check()) {
					return false;
				}

				// 获取购物车数据
				var ids = [];
				if ((this.cart || null) != null) {
					var temp_data = this.cart.data || [];
					for (var i in temp_data) {
						if (temp_data[i]['is_error'] == 0) {
							ids.push(temp_data[i]['id']);
						}
					}
				}
				if (ids.length <= 0) {
					app.globalData.showToast('请先选购商品');
					return false;
				}

				// 进入订单确认页面
				var data = {
					"buy_type": "cart",
					"ids": ids.join(',')
				};
				uni.navigateTo({
					url: '/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data)))
				});
			}
		}
	};
</script>
<style>
	@import './goods-category.css';
</style>