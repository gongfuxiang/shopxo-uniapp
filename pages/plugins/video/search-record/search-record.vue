<template>
	<view class="wh-auto ht pr search-record-container bottom-line-exclude-bottom">
		<template v-if="search_history_data.length > 0">
			<!-- 搜索框 -->
			<view class="header-top" :style="top_content_style + menu_button_info">
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
			<!-- 搜索历史记录 -->
			<view v-if="show_search_history.length > 0" class="search-history flex-col jc-c align-c">
				<view class="wh-auto flex-row align-c jc-sb">
					<text class="size-14 cr-6">历史记录</text>
					<view class="flex-row algin-c gap-5" @tap="clear_history">
						<iconfont name="icon-delete" size="28rpx" color="#999"></iconfont>
						<text class="size-12 cr-9">清除记录</text>
					</view>
				</view>
				<view v-for="(history, index) in show_search_history" :key="index" class="wh-auto history-item flex-row align-c jc-sb">
					<view class="flex-1 flex-row align-c search-history-title cp" :data-value="history" @tap.stop="perform_search">
						<iconfont name="icon-time" size="32rpx"></iconfont>
						<text>{{ history }}</text>
					</view>
					<iconfont name="icon-close-line" size="24rpx" :data-index="index" @tap="delete_history"></iconfont>
				</view>
				<!-- 查看更多 -->
				<template v-if="search_history.length > show_search_history.length">
					<template v-if="is_view_more">
						<loadingComponent></loadingComponent>
					</template>
					<template v-else>
						<view class="more-history-btn cp" @tap="view_more_history">查看更多历史</view>
					</template>
				</template>
			</view>
			<!-- 热搜列表 -->
			<view v-if="search_history_data.length > 0" class="hot-search">
				<view class="hot-tabs">
					<scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll" style="white-space: nowrap;">
						<view class="tabs-scroll-content">
							<view v-for="(tab, index) in search_history_data" :key="index" class="hot-tab-item cp" :class="(hot_current_tab === index) ? 'active' : ''" :data-index="index" @tap="switch_hot_tab">{{ tab.name }}</view>
						</view>
					</scroll-view>
				</view>
				<view class="hot-list flex-col align-c gap-10">
					<view v-for="(item, index) in search_history_data[hot_current_tab].data" :key="index" :class="'cp wh-auto flex-row align-c jc-sb gap-10 hot-item' + (index < 3 ? ' hot-item-top' : '')" :data-url="item.url" @tap.stop="perform_url">
						<view class="flex-1 flex-row align-c gap-10">
							<view class="hot-num flex-row align-c jc-c">
								<view :class="index < 3 ? `hexagon-top hexagon-top-${index + 1}` : 'hexagon-no-top'"><span>{{ index + 1 }}</span></view>
							</view>
							<view class="hot-title">{{ item.title }}</view>
						</view>
						<view class="hot-hotness flex-row align-c gap-5">
							<template v-if="search_history_data[hot_current_tab].field == 'add_time_tips'">
								<iconfont name="icon-time" size="32rpx" color="#999"></iconfont>
							</template>
							<template v-else>
								<iconfont name="icon-fire" size="32rpx" color="#999"></iconfont>
							</template>
							{{ item[search_history_data[hot_current_tab].field] }}
						</view>
					</view>
				</view>
			</view>
		</template>
		<template v-else>
			<component-no-data :propStatus="data_loding_status" :propMsg="data_loding_msg"></component-no-data>
		</template>
	</view>
</template>

<script>
import searchComponent from '@/pages/plugins/video/components/search.vue';
import loadingComponent from '@/pages/plugins/video/components/loading.vue';
import componentNoData from '@/components/no-data/no-data';
import { video_get_top_left_padding } from '@/common/js/common/common.js';
import { isEmpty } from '../../../../common/js/common/common';
const app = getApp();
var system = app.globalData.get_system_info(null, null, true);
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		searchComponent,
		loadingComponent,
		componentNoData
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
			search_history: [],
			show_search_history: [],
			search_history_data: [],
			hot_current_tab: 0,
			is_view_more: false,
			header_padding_left: '',
			data_loding_status: 1,
			data_loding_msg: '',
		};
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
				menu_button_info: menu_button_info
			});
			// 搜索历史记录
			this.search_history = uni.getStorageSync('cache_plugins_video_search_history_key') || [];
			if (this.search_history.length > 0) {
				this.show_search_history = this.search_history.filter((item, index) => index < 5);
			} else {
				this.show_search_history = [];
			}
			// 初始化数据
			this.search_query = '';

			this.init_data();
		},
		init_data() {
			uni.request({
				url: app.globalData.get_request_url("searchrecord", "index", "video"),
				method: 'POST',
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						this.setData({
							search_history_data: new_data.search_history_data
						})
					} else {
						this.setData({
							data_loding_status: 2,
							data_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
					this.setData({
						data_loding_status: 2,
						data_loding_msg: this.$t('common.internet_error_tips'),
					});
				}
			});
		},
		// 返回
		handle_back() {
			app.globalData.page_back_prev_event();
		},
		handle_search(e) {
			// 保存搜索历史记录
			if (!isEmpty(e) && !this.search_history.includes(e)) {
				this.search_history.push(e);
				uni.setStorageSync('cache_plugins_video_search_history_key', this.search_history);
			}
			this.search_query = e;
			// 跳转到搜索页
			app.globalData.url_open(`/pages/plugins/video/search/search?search_query=${this.search_query}`, false);
		},
		perform_search(e) {
			const value = e?.currentTarget?.dataset?.value || '';
			// 直接跳转到搜索页
			this.handle_search(value);
		},
		delete_history(e) {
			const index = e?.currentTarget?.dataset?.index;
			const data = this.show_search_history[index];
			if (!isEmpty(data)) {
				const newIndex = this.search_history.findIndex(item => item == data);
				this.search_history.splice(newIndex, 1);
			}
			this.show_search_history.splice(index, 1);
			uni.setStorageSync('cache_plugins_video_search_history_key', this.search_history);
		},
		perform_url(e) {
			const url = e?.currentTarget?.dataset?.url || '';
			if (!isEmpty(url)) {
				app.globalData.url_open(url);
			}
		},
		view_more_history() {
			// 查看更多历史逻辑
			this.is_view_more = true;
			setTimeout(() => {
				this.is_view_more = false;
				// 每次显示5条数据
				this.show_search_history = this.search_history.filter((item, index) => index < ((this.show_search_history.length - 1) + 5)) 
			}, 500);
		},
		switch_hot_tab(e) {
			this.setData({
				hot_current_tab: e.currentTarget.dataset.index,
			});
		},
		clear_history() {
			uni.setStorageSync('cache_plugins_video_search_history_key', []);
			this.setData({
				search_history: [],
				show_search_history: [],
			});
		}
	}
};
</script>
<style lang="scss" scoped>
    @import './search-record.css';
</style>