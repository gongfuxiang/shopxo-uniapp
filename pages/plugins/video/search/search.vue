<template>
	<view class="wh-auto ht-auto pr video-container">
		<scroll-view scroll-y :show-scrollbar="false" class="ht" @scrolltolower="on_scroll_lower_event" @scrolltoupper="on_scroll_upper_event" lower-threshold="60" scroll-with-animation="true">
			<view class="wh-auto ht-auto pr">
				<!-- 搜索框 -->
				<view class="header-top">
					<view class="wh-auto ht-auto" :style="top_content_style">
						<search-component :propsSearchQuery="search_query" @search="handle_search" />
					</view>
					<!-- 导航栏 -->
					<view class="nav-tabs flex-row align-s jc-sb gap-10"> 
						<view class="tabs-scroll-content">
							<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }" :data-index="index" @click="switch_tab">{{ tab }}</view>
						</view>
						<view class="nav-tabs-filter" @click="toggleFilterPopup">
							<iconfont name="icon-filter" size="32rpx"></iconfont>
						</view>
					</view>
				</view>
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
			</view>
		</scroll-view>
		<!-- 选项卡更多弹窗 -->
        <componentPopup :propShow="filterPopupStatus" propPosition="top" :propMask="true" @onclose="closeFilterPopup">
            <view :class="'padding-bottom-lg ' + (['toutiao', 'app', 'h5'].includes(platform) ? 'padding-top-lg' : 'padding-top')" :style="{ 'padding-top': popup_top }">
                <view class="divider-b">
                    <view class="nav-list-more">
                        <view class="flex-row flex-wrap align-c">
                            <!-- 排序依据 -->
                            <view class="filter-group">
                                <view class="filter-title">排序依据</view>
                                <view class="filter-options">
                                    <view v-for="(option, index) in sort_options" :key="index" class="filter-option" @click="selectSortOption(option)">{{ option }}</view>
                                </view>
                            </view>
                            <!-- 发布时间 -->
                            <view class="filter-group">
                                <view class="filter-title">发布时间</view>
                                <view class="filter-options">
                                    <view v-for="(option, index) in publish_time_options" :key="index" class="filter-option" @click="selectPublishTimeOption(option)">{{ option }}</view>
                                </view>
                            </view>
                            <!-- 视频时长 -->
                            <view class="filter-group">
                                <view class="filter-title">视频时长</view>
                                <view class="filter-options">
                                    <view v-for="(option, index) in video_duration_options" :key="index" class="filter-option" @click="selectVideoDurationOption(option)">{{ option }}</view>
                                </view>
                            </view>
                            <!-- 搜索范围 -->
                            <view class="filter-group">
                                <view class="filter-title">搜索范围</view>
                                <view class="filter-options">
                                    <view v-for="(option, index) in search_range_options" :key="index" class="filter-option" @click="selectSearchRangeOption(option)">{{ option }}</view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
                <view class="tc padding-top-lg flex-row jc-c align-c" @tap="closeFilterPopup">
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
const app = getApp();
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO
bar_height = 0;
// #endif
export default {
	components: {
		searchComponent,
		componentPopup	
	},
	data() {
		return {
			// 5,7,0 是误差，10 是下边距,bar_height是不同小程序下的导航栏距离顶部的高度
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
			],
			isLoadingMore: false,
			params: null,
			filterPopupStatus: false,
			popup_top: '0rpx',
			platform: app.globalData.application_client_type(),
			sort_options: ['综合排序', '最新发布', '最多点赞'],
			publish_time_options: ['不限', '一天内', '一周内', '半年内'],
			video_duration_options: ['不限', '1分钟以下', '1-5分钟', '5分钟以上'],
			search_range_options: ['不限', '最近看过', '还未看过']
		};
	},
	onLoad(params) {
		// 设置参数
		this.setData({
			search_query: params.search_query || '',
			params: app.globalData.launch_params_handle(params),
		});
	},
	created() {
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
		},
		handle_search(e) {
			this.search_query = e;
			if (this.search_query.trim() == '') {
				app.globalData.url_open(`/pages/plugins/video/search/search-record`, false);
			} else {
				app.globalData.url_open(`/pages/plugins/video/search/search?search_query=${this.search_query}`, false);
			}
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
			app.globalData.url_open(`/pages/plugins/video/detail/detail?videoId=${item.detailId}`, false);
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
		},
		toggleFilterPopup() {
			this.filterPopupStatus = !this.filterPopupStatus;
		},
		closeFilterPopup() {
			this.filterPopupStatus = false;
		},
		selectSortOption(option) {
			// 处理排序选项选择
			console.log('Selected sort option:', option);
			this.closeFilterPopup();
		},
		selectPublishTimeOption(option) {
			// 处理发布时间选项选择
			console.log('Selected publish time option:', option);
			this.closeFilterPopup();
		},
		selectVideoDurationOption(option) {
			// 处理视频时长选项选择
			console.log('Selected video duration option:', option);
			this.closeFilterPopup();
		},
		selectSearchRangeOption(option) {
			// 处理搜索范围选项选择
			console.log('Selected search range option:', option);
			this.closeFilterPopup();
		}
	}
};
</script>

<style>
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
	padding: 0 16rpx 20rpx 16rpx;
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
</style>