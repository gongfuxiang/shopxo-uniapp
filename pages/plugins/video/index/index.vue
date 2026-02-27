<template>
	<view class="wh-auto ht-auto pr video-container bottom-line-exclude-bottom">
		<template v-if="tabs.length > 0">
			<scroll-view  scroll-y :show-scrollbar="false" class="ht" lower-threshold="60" scroll-with-animation="true" @scroll="on_scroll_event">
				<view class="wh-auto ht-auto pr">
					<!-- 搜索框 -->
					<view class="header-top">
						<view id="search-height" class="ht-auto flex-row align-c" :style="top_content_style + menu_button_info">
							<!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
							<!-- #ifndef MP-ALIPAY -->
							<view v-if="is_show_back" class="cp" @tap="handle_back">
								<iconfont name="icon-arrow-left " size="36rpx" color="#333" class="ml-10 mr-10"></iconfont>
							</view>
							<!-- #endif -->
							<view class="wh-auto ht-auto" :style="header_padding_left">
								<search-component propIsDisabled @disabledSearch="handle_search"/>
							</view>
						</view>
					</view>
					<!-- 轮播 -->
					<view v-if="slider_list.length > 0" class="padding-horizontal-main">
						<component-banner :propData="slider_list" propBackgroundColor="#333" propSelectedBackgroundColor="#999"></component-banner>
					</view>
					<template v-if="tabs.length > 0">
						<!-- 导航栏 -->
						<view class="nav-tabs" :class="{ 'nav-tabs-sticky': is_nav_sticky }" :style="nav_sticky_style">
							<scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll nowrap">
								<view class="tabs-scroll-content">
									<view v-for="(item, index) in tabs" :key="index" class="tab-item flex-row align-c gap-5" :class="{ active: current_tabs_index === index }" :data-index="index" :data-id="item.id" @tap="switch_tab">
										<image v-if="!isEmpty(item.icon)" class="tabs-scroll-image radius va-m" :src="item.icon" mode="aspectFill"></image>
										<text class="va-m">{{ item.name }}</text>
									</view>
								</view>
							</scroll-view>
						</view>
					</template>
					<template v-if="recommend_videos.length > 0">
						<!-- 推荐视频卡片区域 -->
						<view class="recommend-videos">
							<view class="video-grid">
								<view v-for="(item, index) in recommend_videos" :key="index" class="video-card" :data-id="item.id" @tap="navigate_to_detail">
									<image class="video-thumbnail" :src="item.cover" mode="widthFix"></image>
									<view class="video-info flex-col jc-c"> 
										<view class="video-title text-line-2">{{ item.title }}</view>
										<view class="flex-row align-c jc-sb">
											<view class="video-date">{{ item.add_time_date }}</view>
											<view class="video-likes flex-row align-c gap-4">
												<iconfont name="icon-givealike-o-fine" size="24rpx"></iconfont>
												<text>{{ item.give_thumbs_count }}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</template>
					<template v-else>
						<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
					</template>
				</view>
			</scroll-view>
		</template>
		<template v-else>
			<component-no-data :propStatus="data_tabs_loding_status" :propMsg="data_tabs_loding_msg"></component-no-data>
		</template>
	</view>
</template>

<script>
import searchComponent from '@/pages/plugins/video/components/search.vue';
import componentNoData from '@/components/no-data/no-data';
import componentBanner from '@/components/slider/slider';
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
		componentNoData,
		componentBanner,
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
			is_show_back: true,
			tabs: [],
			current_tabs_index: 0,
			current_tabs_id: '',
			recommend_videos: [],
			isLoadingMore: false,
			data_list_loding_status: 1,
			data_tabs_loding_status: 1,
			data_tabs_loding_msg: '',
			data_list_loding_msg: '',
			menu_button_info: '',
			header_padding_left: '',
			slider_list: [],
			is_nav_sticky: false, // 控制nav-tabs是否处于粘性状态
			// #ifdef H5 || MP-TOUTIAO
			nav_sticky_threshold: 55, // 粘性阈值，与CSS中的top值对应
			// #endif
			// #ifdef MP || APP
			nav_sticky_threshold: bar_height + 53, // 粘性阈值，与CSS中的top值对应
			// #endif
			nav_sticky_style: '',
		};
	},
	onShow() {
		this.init();
	},
	methods: {
		isEmpty,
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
			let pages = getCurrentPages();
			this.setData({
				is_show_back: pages.length > 1 && !app.globalData.is_tabbar_pages(),
				header_padding_left: padding_left,
				menu_button_info: menu_button_info,
			});
			// 初始化数据
			this.init_data();
		},
		init_data() {
			// 获取数据
			uni.request({
				url: app.globalData.get_request_url("indexinit", "index", "video"),
				method: 'POST',
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						this.setData({
							tabs: new_data.category_list,
							current_tabs_id: new_data.category_list.length > 0 ? new_data.category_list[this.current_tabs_index].id : '',
							data_tabs_loding_status: 0,
							slider_list: new_data.slider_list,
						});
						// 获取第一个分类的视频列表
						this.get_video_list(this.current_tabs_id);
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
		get_video_list(id = '') {
			this.setData({
				data_list_loding_status: 1,
				data_list_loding_msg: '',
			});
			// 获取数据
			uni.request({
				url: app.globalData.get_request_url("indexdatalist", "index", "video"),
				method: 'POST',
				data: {
					id: id,
				},
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						this.setData({
							recommend_videos: new_data.data_list,
							data_list_loding_status: 0,
						});
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
			})
		},
		handle_search() {
			// 跳转到搜索记录页面
			app.globalData.url_open(`/pages/plugins/video/search-record/search-record`, false);
		},
		switch_tab(e) {
			const id = e?.currentTarget?.dataset?.id || 0;
			const index = e?.currentTarget?.dataset?.index || 0;
			this.setData({
				current_tabs_index: index,
				current_tabs_id: id,
			});
			// 根据当前标签加载对应的数据
			this.get_video_list(id);
		},
		navigate_to_detail(e) {
			const id = e?.currentTarget?.dataset?.id || '';
			if (id == '') {
				return false;
			} else {
				app.globalData.url_open(`/pages/plugins/video/detail/detail?id=${id}`, false);
			}
		},
		handle_back() {
			app.globalData.page_back_prev_event();
		},
		// 滚动事件处理
		on_scroll_event(e) {
			const scrollTop = e.detail.scrollTop;
			console.log(this.nav_sticky_threshold);
			
			// 当滚动距离大于等于阈值时，设置nav-tabs为粘性状态（背景变白）
			this.setData({
				is_nav_sticky: scrollTop >= this.nav_sticky_threshold,
				nav_sticky_style: 'top:' + this.nav_sticky_threshold * 2 + 'rpx;',
			});
		}
	}
};
</script>
<style lang="scss" scoped>
    @import './index.css';
</style>