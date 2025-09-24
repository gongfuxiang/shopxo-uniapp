<template>
	<view class="wh-auto ht-auto pr video-container">
		<scroll-view  scroll-y :show-scrollbar="false" class="ht" @scrolltolower="on_scroll_lower_event" @scrolltoupper="on_scroll_upper_event" lower-threshold="60" scroll-with-animation="true">
			<view class="wh-auto ht-auto pr">
				<!-- 搜索框 -->
				<view class="header-top">
					<view class="ht-auto" :style="top_content_style + menu_button_info">
						<view id="search-height" class="wh-auto ht-auto" :style="header_padding_left">
							<search-component :propSearchQuery="search_query" :propIsDisabled="true" @disabledSearch="handle_search"/>
						</view>
					</view>
					<template v-if="recommend_videos.length > 0">
						<!-- 导航栏 -->
						<view class="nav-tabs">
							<scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll" style="white-space: nowrap;">
								<view class="tabs-scroll-content">
									<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }" :data-index="index" @click="switch_tab">{{ tab }}</view>
								</view>
							</scroll-view>
						</view>
					</template>
				</view>
				<template v-if="recommend_videos.length > 0">
					<!-- 推荐视频卡片区域 -->
					<view class="recommend-videos">
						<view class="video-grid">
							<view v-for="(item, index) in recommend_videos" :key="index" class="video-card" :data-value="item" @click="navigate_to_detail">
								<image class="video-thumbnail" :src="item.thumbnail_url" mode="widthFix"></image>
								<view class="video-info flex-col jc-c"> 
									<view class="video-title text-line-2">{{ item.title }}</view>
									<view class="flex-row align-c jc-sb">
										<view class="video-date">{{ item.date }}</view>
										<view class="video-likes flex-row align-c gap-4">
											<iconfont name="icon-givealike-o-fine" size="24rpx"></iconfont>
											<text>{{ item.likes }}</text>
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
	</view>
</template>

<script>
import searchComponent from '@/pages/plugins/video/components/search.vue';
import componentNoData from '@/components/no-data/no-data';
import { video_get_top_left_padding } from '@/common/js/common/common.js';
const app = getApp();
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		searchComponent,
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
			tabs: ['推荐', 'DIV装修', '商城管理', '多商户', '多门店', '客服','多门店', '客服'],
			currentTab: 0,
			recommend_videos: [],
			isLoadingMore: false,
			data_list_loding_status: 1,
			data_list_loding_msg: '',
			menu_button_info: '',
			header_padding_left: '',
		};
	},
	mounted() {
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
			setTimeout(() => {
				this.setData({
					header_padding_left: padding_left,
					menu_button_info: menu_button_info,
					data_list_loding_status: 0,
					recommend_videos: [
						{
							thumbnail_url: 'http://shopxo.com/static/upload/images/plugins_homemiddleadv/2019/04/22/1555929400479636.jpg',
							title: '进销存软件究竟要怎么选？',
							date: '2025-06-12',
							likes: 2189,
							detailId: '1'
						},
						{
							thumbnail_url: 'http://shopxo.com/static/upload/images/plugins_expressforkdn/2019/03/11/1552286675575734.png',
							title: '一分钟告诉你，进销存是什么，进销存对企业有什么用...',
							date: '2025-06-12',
							likes: 2189,
							detailId: '2'
						},
						{
							thumbnail_url: 'http://shopxo.com/static/upload/images/goods_category/2023/08/12/1691819651259940.png',
							title: '全自动Excel进销存管理系统',
							date: '2025-06-12',
							likes: 2189,
							detailId: '3'
						},
						{
							thumbnail_url: 'http://shopxo.com/static/upload/images/common/2019/05/17/1558073623641199.jpg',
							title: '管家婆进销存到底有多简单',
							date: '2025-06-12',
							likes: 2189,
							detailId: '4'
						},
					]
				});
			}, 100);
		},
		handle_search() {
			// 跳转到搜索记录页面
			app.globalData.url_open(`/pages/plugins/video/search/search-record`, false);
		},
		switch_tab(e) {
			const index = e.currentTarget.dataset.index;
			this.currentTab = index;
			// 根据当前标签加载对应的数据
			this.load_recommend_videos();
		},
		load_recommend_videos() {
			// 加载推荐视频数据的逻辑
			// 根据当前标签加载对应的数据
			console.log('加载推荐视频数据');
		},
		navigate_to_detail(e) {
			const item = e.currentTarget.dataset.value;
			app.globalData.url_open(`/pages/plugins/video/detail/detail?id=${item.detailId}`, false);
		},
		on_scroll_lower_event() {
			this.loadMore();
		},
		on_scroll_upper_event() {
			this.loadMore();
		},
		loadMore() {
			// 加载更多数据的逻辑
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
					recommend_videos: data
				});
			}, 200);
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
/* 导航栏 */
.nav-tabs {
	position: relative;
	width: 100%;
	padding: 0 16rpx 20rpx 16rpx;
	.tabs-scroll-content {
		display: flex;
		align-items: center;
		gap: 48rpx;
	}
	.tab-item {
		position: relative;
		white-space: nowrap;
		padding-bottom: 8rpx;
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

/* #ifdef MP-WEIXIN | APP-PLUS */
.tabs-scroll {
	::v-deep ::-webkit-scrollbar {
		width: 0rpx!important;
		height: 0rpx!important;
		background-color: transparent;
	}
}
/* #endif */
/* 推荐视频列表 */
.recommend-videos {
	padding: 20rpx 16rpx;
	.video-grid {
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
</style>