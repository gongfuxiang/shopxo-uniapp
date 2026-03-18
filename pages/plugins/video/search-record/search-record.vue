<template>
	<view class="search-record-container pr bottom-line-exclude-bottom">
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
						<component-search :propSearchQuery="search_keywords" @search="handle_search" />
					</view>
				</view>
			</view>
			<!-- 搜索历史记录 -->
			<view v-if="show_search_history.length > 0" class="search-history flex-col jc-c align-c">
				<view class="wh-auto flex-row align-c jc-sb">
					<text class="size-14 cr-6">{{$t('common.history_record')}}</text>
					<view class="flex-row algin-c gap-5" @tap="clear_history">
						<iconfont name="icon-delete" size="28rpx" color="#999"></iconfont>
						<text class="size-12 cr-9">{{$t('common.clear_record')}}</text>
					</view>
				</view>
				<view v-for="(history, index) in show_search_history" :key="index" class="wh-auto history-item flex-row align-c jc-sb">
					<view class="flex-1 flex-row align-c search-history-title cp" :data-value="history" @tap.stop="history_search_event">
						<iconfont name="icon-time" size="32rpx"></iconfont>
						<text>{{ history }}</text>
					</view>
					<iconfont name="icon-close-line" size="24rpx" :data-index="index" @tap="delete_history"></iconfont>
				</view>
				<!-- 查看更多 -->
				<template v-if="search_history.length > show_search_history.length">
					<template v-if="is_view_more">
						<component-loading></component-loading>
					</template>
					<template v-else>
						<view class="more-history-btn cp" @tap="view_more_history">{{$t('common.view_more')}} {{$t('common.history')}}</view>
					</template>
				</template>
			</view>
			<!-- 热搜列表 -->
			<view v-if="search_history_data.length > 0" class="bg-white padding-xxl">
				<view class="hot-tabs">
					<scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll" style="white-space: nowrap;">
						<view class="tabs-scroll-content">
							<view v-for="(tab, index) in search_history_data" :key="index" class="hot-tab-item cp" :class="(hot_current_tab === index) ? 'active' : ''" :data-index="index" @tap="switch_hot_tab">{{ tab.name }}</view>
						</view>
					</scroll-view>
				</view>
				<view class="hot-list flex-col align-c gap-10">
					<view v-for="(item, index) in search_history_data[hot_current_tab].data" :key="index" :class="'cp wh-auto flex-row align-c jc-sb gap-10 hot-item' + (index < 3 ? ' hot-item-top' : '')" :data-value="item.url" @tap.stop="url_event">
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
		
		<!-- 公共 -->
        <component-common ref="common"></component-common>
	</view>
</template>

<script>
import componentSearch from '@/pages/plugins/video/components/search.vue';
import componentLoading from '@/pages/plugins/video/components/loading.vue';
import componentNoData from '@/components/no-data/no-data';
import { video_get_top_left_padding, isEmpty } from '@/common/js/common/common.js';
import componentCommon from '@/components/common/common';
const app = getApp();
var system = app.globalData.get_system_info(null, null, true);
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		componentSearch,
		componentLoading,
		componentNoData,
		componentCommon
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
			search_keywords: '',
			search_history: [],
			show_search_history: [],
			search_history_data: [],
			hot_current_tab: 0,
			is_view_more: false,
			header_padding_left: '',
			data_loding_status: 1,
			data_loding_msg: '',
            cache_key: 'cache_plugins_video_search_history_key',
		};
	},
	onLoad(params) {
	    // 调用公共事件方法
	    app.globalData.page_event_onload_handle(params);

	    // 设置参数
	    this.setData({
	        params: params,
	    });
	},
	
	onShow() {
	    // 调用公共事件方法
	    app.globalData.page_event_onshow_handle();
	    
	    // 加载数据
	    this.init();
	    
	    // 公共onshow事件
	    if ((this.$refs.common || null) != null) {
	        this.$refs.common.on_show();
	    }
	    
	    // 分享菜单处理
	    app.globalData.page_share_handle();
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
			this.search_history = uni.getStorageSync(this.cache_key) || [];
			if (this.search_history.length > 0) {
				this.show_search_history = this.search_history.filter((item, index) => index < 5);
			} else {
				this.show_search_history = [];
			}
			// 初始化数据
			this.search_keywords = '';

			this.init_data();
		},

        // 初始化数据
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

		// 返回事件
		handle_back() {
			app.globalData.page_back_prev_event();
		},

        // url事件
        url_event(e) {
            app.globalData.url_event(e);
        },

        // 热搜切换事件
        switch_hot_tab(e) {
        	this.setData({
        		hot_current_tab: e.currentTarget.dataset.index,
        	});
        },

        // 搜索处理
		handle_search(value) {
			// 保存搜索历史记录
			if (!isEmpty(value) && !this.search_history.includes(value)) {
				this.search_history.unshift(value);
				uni.setStorageSync(this.cache_key, this.search_history);
			}
			this.search_keywords = value;
			// 跳转到搜索页
			app.globalData.url_open(`/pages/plugins/video/search/search?keywords=${this.search_keywords}`, false);
		},

        // 历史搜索事件
		history_search_event(e) {
			const value = e?.currentTarget?.dataset?.value || '';
			// 直接跳转到搜索页
			this.handle_search(value);
		},

        // 删除历史搜索记录
		delete_history(e) {
			const index = e?.currentTarget?.dataset?.index;
			const data = this.show_search_history[index];
			if (!isEmpty(data)) {
				const newIndex = this.search_history.findIndex(item => item == data);
				this.search_history.splice(newIndex, 1);
			}
			this.show_search_history.splice(index, 1);
			uni.setStorageSync(this.cache_key, this.search_history);
		},

        // 查看更多历史搜索记录
		view_more_history() {
			// 查看更多历史逻辑
			this.is_view_more = true;
			setTimeout(() => {
				this.is_view_more = false;
				// 每次显示5条数据
				this.show_search_history = this.search_history.filter((item, index) => index < ((this.show_search_history.length - 1) + 5)) 
			}, 500);
		},

        // 清除历史搜索记录
		clear_history() {
			uni.setStorageSync(this.cache_key, []);
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