<template>
	<view class="wh-auto ht-auto pr video-container">
		
		<view class="wh-auto ht-auto pr">
			<template v-if="tabs.length > 0">
				<!-- 搜索框 -->
				<view class="header-top">
					<view class="header-search" :style="top_content_style + menu_button_info">
						<view id="search-height" class="flex-row align-c">
							<!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
							<!-- #ifndef MP-ALIPAY -->
							<view class="cp" @tap="handle_back">
								<iconfont name="icon-arrow-left " size="36rpx" color="#333" class="mr-10"></iconfont>
							</view>
							<!-- #endif -->
							<view class="wh-auto ht-auto" :style="header_padding_left">
								<search-component :propSearchQuery="search_query" @search="handle_search" />
							</view>
						</view>
					</view>
					<!-- 导航栏 -->
					<view class="nav-tabs flex-row align-s jc-sb gap-10"> 
						<view class="tabs-scroll-content">
							<view v-for="(tab, index) in category_list" :key="index" class="tab-item" :class="(currentTab === index) ? 'active' : ''" :data-index="index" @click="switch_tab">{{ tab.name }}</view>
						</view>
						<view class="nav-tabs-filter" @click="toggle_filter_popup">
							<iconfont name="icon-filter" size="32rpx"></iconfont>
						</view>
					</view>
				</view>
				<!-- 推荐视频卡片区域 -->
				<view class="recommend-videos">
					<scroll-view scroll-y :show-scrollbar="false" class="recommend-scroll" @scrolltolower="on_scroll_lower_event" lower-threshold="60" scroll-with-animation="true">
						<template v-if="recommend_videos.length > 0">
							<view class="video-grid">
								<view v-for="(item, index) in recommend_videos" :key="index" class="video-card" :data-id="item.id" @tap="navigate_to_detail">
									<image class="video-thumbnail" :src="item.cover" mode="widthFix"></image>
									<view class="video-info flex-col jc-c"> 
										<view class="video-title text-line-2">{{ item.title }}</view>
										<view class="flex-row align-c jc-sb">
											<view class="video-date">{{ item.add_time_date }}</view>
											<view class="video-likes flex-row align-c gap-4">
												<iconfont name="icon-givealike-o-fine" size="24rpx"></iconfont>
												<text>{{ item.access_count }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<template v-if="page < page_total">
								<!-- 加载更多 -->
								<loadingComponent v-if="is_more_loading"></loadingComponent>
							</template>
							<template v-else>
								<!-- 结尾 -->
								<component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
							</template>
						</template>
						<template v-else>
							<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
						</template>
					</scroll-view>
				</view>
			</template>
			<template v-else>
				<component-no-data :propStatus="data_tabs_loding_status" :propMsg="data_tabs_loding_msg"></component-no-data>
			</template>
		</view>
		<!-- 选项卡更多弹窗 -->
        <componentPopup :propShow="filter_popup_status" propPosition="top" :propMask="true" @onclose="close_filter_popup">
            <view :class="'padding-bottom-lg ' + (['toutiao', 'app', 'h5'].includes(platform) ? 'padding-top-lg' : 'padding-top')" :style="{ 'padding-top': popup_top }">
                <view class="divider-b">
                    <view class="nav-list-more">
                        <view class="flex-row flex-wrap align-c">
                            <!-- 筛选列表 -->
                            <view v-for="(item, index) in popup_list" :key="index" class="filter-group">
                                <view class="filter-title">{{ item.title }}</view>
                                <view class="filter-options">
                                    <view v-for="(option, index) in item.list" :key="index" :class="'filter-option ' + (option.type == filter_params[item.id] ? 'active' : '')" :data-type="option.type" :data-id="item.id" @tap="select_filter">{{ option.name }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="tc padding-top-lg flex-row jc-c align-c" @tap="close_filter_popup">
                    <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                    <iconfont name="icon-arrow-top" color="#ccc" propContainerDisplay="flex"></iconfont>
                </view>
            </view>
        </componentPopup>
	</view>
</template>

<script>
import searchComponent from '@/pages/plugins/video/components/search.vue';
import componentPopup from '@/components/popup/popup';
import loadingComponent from '@/pages/plugins/video/components/loading.vue';
import componentNoData from '@/components/no-data/no-data';
import componentBottomLine from '@/components/bottom-line/bottom-line';
import { video_get_top_left_padding } from '@/common/js/common/common.js';
import { isEmpty } from '../../../../common/js/common/common';
const app = getApp();
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		searchComponent,
		componentPopup,
		loadingComponent,
		componentNoData,
		componentBottomLine
	},
	data() {
		return {
			// 5,7,0 是误差，， 10 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
			// #ifdef MP
			top_content_style: 'padding-top:' + (bar_height + 5) + 'px;padding-bottom:10px;',
			// #endif
			// #ifdef H5 || MP-TOUTIAO
			top_content_style: 'padding-top:' + (bar_height + 7) + 'px;padding-bottom:10px;',
			// #endif
			// #ifdef APP
			top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
			// #endif
			search_query: '',
			tabs: ['推荐', 'DIV装修', '商城管理', '多商户', '多门店', '客服','多门店', '客服'],
			currentTab: 0,
			recommend_videos: [],
			isLoadingMore: false,
			params: null,
			filter_popup_status: false,
			popup_top: '0rpx',
			platform: app.globalData.application_client_type(),
			popup_list: [
				{ title: '排序依据', id: 'sort', list: []},
				{ title: '发布时间', id: 'time', list: [] },
				{ title: '视频时长', id: 'duration', list: [] },
			],
			filter_params: {
				sort: 'default',
				time: 'default',
				duration: 'default',
			},
			is_more_loading: false,
			header_padding_left: '',
			category_list: [],
			page: 0,
			page_total: 1,
			search_cid: '',
			goods_bottom_line_status: false,
			data_tabs_loding_status: 1,
			data_tabs_loding_msg: '',
			data_list_loding_status: 1,
			data_list_loding_msg: '',
			search_history: [],
		};
	},
	onLoad(params) {
		// 设置参数
		this.setData({
			search_query: params.search_query || '',
			params: app.globalData.launch_params_handle(params),
		});
	},
	onShow() {
		this.init();
	},
	methods: {
		init() {
			// 小程序下，获取小程序胶囊的宽度
			let menu_button_info = 'max-width:100%';
			// #ifndef MP-TOUTIAO
				// #ifdef MP
				// 判断是否有胶囊
				const is_current_single_page = app.globalData.is_current_single_page();
				// 如果有胶囊的时候，做处理
				if (is_current_single_page == 0) {
					const custom = uni.getMenuButtonBoundingClientRect();
					menu_button_info = `max-width:calc(100% - ${custom.width + 10}px);`;
				}
				// #endif
			// #endif

			let padding_left = '';
			// #ifdef MP-ALIPAY
				padding_left = video_get_top_left_padding();
			// #endif
			this.setData({
				header_padding_left: padding_left,
				menu_button_info: menu_button_info,
			});
			// 获取头部的高度
			setTimeout(() => {
                const query = uni.createSelectorQuery().in(this);
                // 选择我们想要的元素
                query
                    .select('.header-top')
                    .boundingClientRect((res) => {
                        if ((res || null) != null) {
                            // data包含元素的宽度、高度等信息
                            this.setData({
                                popup_top: res.height * 2 + 'rpx',
                            });
                        }
                    })
                    .exec(); // 执行查询
            }, 500);
			this.search_history = uni.getStorageSync('cache_plugins_video_search_history_key') || [];

			// 初始化搜索页数据
			this.init_data();
		},
		init_data () {
			uni.request({
				url: app.globalData.get_request_url("searchinit", "index", "video"),
				method: 'POST',
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						// 数组数据更新
						this.popup_list.forEach(item => {
							if (item.id == 'sort') {
								item.list = new_data.search_order_by_list;
							} else if (item.id == 'time') {
								item.list = new_data.search_release_time_list;
							} else if (item.id == 'duration') {
								item.list = new_data.search_duration_list;
							}
						});
						this.setData({
							category_list: new_data.category_list,
							search_cid: new_data?.category_list[0]?.id || '',
							data_tabs_loding_status: 0,
							popup_list: this.popup_list
						})
						// 加载数据
						this.load_recommend_videos();
					} else {
						this.setData({
							data_tabs_loding_status: 2,
							data_tabs_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
					this.setData({
						data_tabs_loding_status: 2,
						data_list_loding_msg: this.$t('common.internet_error_tips'),
					});
				}
			});
		},
		handle_back() {
			app.globalData.page_back_prev_event();
		},
		handle_search(e) {
			this.setData({
				search_query: e,
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			})
			if (!isEmpty(e) && !this.search_history.includes(e)) {
				this.search_history.push(e);
				uni.setStorageSync('cache_plugins_video_search_history_key', this.search_history);
			}
			// 更新数据信息
			this.load_recommend_videos();
		},
		switch_tab(e) {
			const index = e?.currentTarget?.dataset?.index || 0;
			this.setData({
				currentTab: index,
				search_cid: this.category_list[index]?.id || '',
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			})
			// 根据当前标签加载对应的数据
			this.load_recommend_videos();
		},
		load_recommend_videos() {
			// 加载推荐视频数据的逻辑
			const { time = '', duration = '', sort = ''} = this.filter_params;
			const new_page = this.page + 1;
			uni.request({
				url: app.globalData.get_request_url("searchdatalist", "index", "video"),
				method: 'POST',
				data: {
					cid: this.search_cid,
					bwd: this.search_query, // 搜索关键字
					rt: time, // 发布时间
					dn: duration, // 视频时长
					by: sort, // 排序
					page: new_page,
				},
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const responseData = data.data;
						// 验证数据有效性并安全地合并数组
						if (responseData && Array.isArray(responseData.data)) {
							// 使用扩展运算符合并数组
							this.recommend_videos.push(...responseData.data);
						}
						this.setData({
							recommend_videos: this.recommend_videos,
							page: new_page,
							page_total: data.page_total,
							goods_bottom_line_status: new_page >= data.page_total,
							data_list_loding_status: 0
						})
					} else {
						this.setData({
							data_list_loding_status: 2,
							data_list_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
					this.setData({
						data_list_loding_status: 2,
						data_list_loding_msg: this.$t('common.internet_error_tips'),
					});
				}
			});
		},
		navigate_to_detail(e) {
			const id = e?.currentTarget?.dataset?.id || '';
			if (id == '') {
				return false;
			} else {
				app.globalData.url_open(`/pages/plugins/video/detail/detail?id=${id}`, false);
			}
		},
		on_scroll_lower_event() {
			debugger;
			this.load_more();
		},
		load_more() {
			debugger;
			// 加载更多数据的逻辑
			if (this.is_more_loading) {
				return;
			}
			this.is_more_loading = true;
			setTimeout(() => {
				// 假设这里加载了更多的视频数据
				const data = this.recommend_videos;
				const newVideos = [
					{
						thumbnail_url: 'http://shopxo.com/static/upload/images/plugins_homemiddleadv/2019/04/22/1555929400479636.jpg',
						title: '新视频标题',
						date: '2025-06-13',
						likes: 1500,
						detailId: '5'
					}
				];
				data.push(...newVideos);
				this.setData({
					recommend_videos: data,
					is_more_loading: false,
				});
			}, 20000);
		},
		toggle_filter_popup() {
			this.filter_popup_status = !this.filter_popup_status;
		},
		close_filter_popup() {
			this.filter_popup_status = false;
		},
		// 更新筛选条件的值
		select_filter(e) {
			const type = e?.currentTarget?.dataset?.type || '';
			const id = e?.currentTarget?.dataset?.id || '';
			if (!isEmpty(id)) {
				this.filter_params[id] = type;
			}
			this.setData({
				filter_params: this.filter_params,
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			});
			this.close_filter_popup();
			// 重新初始化数据
			this.load_recommend_videos();
		}
	}
};
</script>

<style lang="scss" scoped>
.header-top {
	position: sticky;
	top: 0;
	background: #fff;
	z-index: 9;
}
.header-search {
	padding-left: 24rpx;
	box-sizing: border-box;
}
/* 导航栏 */
.nav-tabs {
	position: relative;
	width: 100%;
	padding: 0 16rpx 20rpx 16rpx;
	box-sizing: border-box;
	.tabs-scroll-content {
		display: flex;
		align-items: center;
		overflow: hidden;
		overflow-x: auto;
		gap: 48rpx;
	}
	.nav-tabs-filter {
		padding-top: 8rpx;
		box-sizing: border-box;
	}
	.tab-item {
		position: relative;
		white-space: nowrap;
		padding-bottom: 8rpx;
		box-sizing: border-box;
		font-weight: 500;
		font-size: 28rpx;
		color: #666666;
		line-height: 40rpx;
	}

	.tab-item.active {
		color: #333333;
	}
	
	.tab-item::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 4px;
		background-color: #333;
		transition: width 0.6s ease;
	}

	.tab-item.active::after {
		width: 100%;
	}

	.tab-item.active {
		color: #333;
	}
}

@media (max-width: 500px) { 
	.nav-tabs {
		align-items: center;
		.nav-tabs-filter {
			padding-top: 0;
		}
	}
}

/* #ifdef MP-WEIXIN | APP-PLUS */
.tabs-scroll {
	::v-deep ::-webkit-scrollbar
	{
		width: 0rpx!important;
		height: 0rpx!important;
		background-color: transparent;
	}
}
/* #endif */
/* 推荐视频列表 */
.recommend-videos {
	padding: 20rpx 0;
	.video-grid {
		padding: 0 16rpx;
		column-count: 2;
		column-gap: 10px;
	}

	.video-card {
		background-color: #fff;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		overflow: hidden;
		break-inside: avoid;
		margin-bottom: 10px;
		width: 100%;
	}

	.video-thumbnail {
		width: 100%;
		object-fit: contain;
	}

	.video-info {
		padding: 20rpx;
		padding-top: 10rpx;
		gap: 20rpx;
	}

	.video-title {
		font-weight: 500;
		font-size: 28rpx;
		color: #333333;
		line-height: 40rpx;
	}

	.video-date,
	.video-likes {
		font-weight: 400;
		font-size: 24rpx;
		color: #999999;
		line-height: 34rpx;
	}
}

/* 筛选条件弹窗样式 */
.filter-group {
	margin-bottom: 40rpx;
}

.filter-title {
	font-weight: 400;
	font-size: 24rpx;
	color: #666666;
	line-height: 34rpx;
	margin-bottom: 24rpx;
}

.filter-options {
	display: flex;
	flex-wrap: wrap;
	gap: 20rpx;
}

.filter-option {
	font-weight: 400;
	font-size: 24rpx;
	color: #666666;
	line-height: 34rpx;
	padding: 10rpx 32rpx;
	background-color: #e8e8e8;
	border-radius: 4rpx;
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.filter-option:hover {
	background-color: #e0e0e0;
}
.filter-option.active {
	color: #333;
}
.nav-list-more {
	padding: 20rpx 40rpx;
}
::v-deep .popup {
	.popup-mask { 
		z-index: 8 !important;
	}
	.popup-content {
		z-index: 8 !important;
	}
}
.recommend-scroll {
	height: calc(100vh - 223rpx);
}
</style>