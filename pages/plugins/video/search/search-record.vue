<template>
	<view class="wh-auto ht pr search-record-container">
		<!-- 搜索框 -->
		<view class="header-top" :style="top_content_style + menu_button_info">
			<view id="search-height" class="flex-row align-c">
				<view class="cp" @tap="handle_back">
					<iconfont name="icon-arrow-left " size="36rpx" color="#333" class="mr-10"></iconfont>
				</view>
				<view class="wh-auto ht-auto">
					<search-component :propSearchQuery="search_query" @search="handle_search" />
				</view>
			</view>
		</view>
		<!-- 搜索历史记录 -->
		<view class="search-history flex-col jc-c align-c">
			<view v-for="(history, index) in search_history" :key="index" class="wh-auto history-item flex-row align-c jc-sb">
				<view class="flex-row align-c search-history-title cp" :data-value="history.text" @tap.stop="perform_search">
					<iconfont name="icon-time" size="32rpx"></iconfont>
					<text>{{ history.text }}</text>
				</view>
				<iconfont name="icon-close-line" size="24rpx" :data-index="index" @tap="delete_history"></iconfont>
			</view>
			<!-- 查看更多 -->
			<template v-if="is_view_more">
				<loadingComponent></loadingComponent>
			</template>
			<template v-else>
				<view class="more-history-btn cp" @tap="view_more_history">查看更多历史</view>
			</template>
		</view>
		<!-- 热搜列表 -->
		<view class="hot-search">
			<view class="hot-tabs">
				<scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll" style="white-space: nowrap;">
					<view class="tabs-scroll-content">
						<view v-for="(tab, index) in hot_tabs" :key="index" class="hot-tab-item cp" :class="(hot_current_tab === index) ? 'active' : ''" :data-index="index" @tap="switch_hot_tab">{{ tab }}</view>
					</view>
				</scroll-view>
			</view>
			<view class="hot-list flex-col align-c gap-10">
				<view v-for="(item, index) in hot_list" :key="index" :class="'cp wh-auto flex-row align-c jc-sb hot-item' + (index < 3 ? ' hot-item-top' : '')" :data-value="item.title" @tap.stop="perform_search">
					<view class="flex-row align-c gap-10">
						<view class="hot-num flex-row align-c jc-c">
							<view :class="index < 3 ? `hexagon-top hexagon-top-${index + 1}` : 'hexagon-no-top'"><span>{{ index + 1 }}</span></view>
						</view>
						<view class="hot-title">{{ item.title }}</view>
					</view>
					<view class="hot-hotness">热度 {{ item.hotness }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import searchComponent from '@/pages/plugins/video/components/search.vue';
import loadingComponent from '@/pages/plugins/video/components/loading.vue';
const app = getApp();
var system = app.globalData.get_system_info(null, null, true);
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO
bar_height = 0;
// #endif
export default {
	components: {
		searchComponent,
		loadingComponent
	},
	data() {
		return {
			// #ifdef H5 || MP-TOUTIAO
			top_content_style: 'padding-top:' + bar_height + 7 + 'px;padding-bottom:10px;',
			// #endif
			// #ifndef H5 || MP-TOUTIAO
			top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
			// #endif
			search_query: '',
			search_history: [
				{ text: '软件升级规则' },
				{ text: '进销存管理系统提升效率' },
				{ text: '任何人的错都是我的错' },
				{ text: '心中无敌，方能无敌于天下' }
			],
			hot_tabs: ['今日热搜', '点赞热榜', '评论热榜', '分享热榜', '分享热榜', '分享热榜', '分享热榜'],
			hot_current_tab: 0,
			hot_list: [
				{ title: '国家补贴至高补贴20%', hotness: '811.2万' },
				{ title: '夏季高质量睡眠秘诀', hotness: '2100' },
				{ title: '不要总认为自己比别人聪明', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' },
				{ title: '今天最好的表现是明天最低的要求', hotness: '311' }
			],
			is_view_more: false
		};
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
			this.setData({
				menu_button_info: menu_button_info
			});
		},
		// 返回
		handle_back() {
			app.globalData.page_back_prev_event();
		},
		handle_search(e) {
			this.search_query = e;
			app.globalData.url_open(`/pages/plugins/video/search/search?search_query=${this.search_query}`, false);
		},
		perform_search(e) {
			this.search_query = e.currentTarget.dataset.value;
			// uni.navigateTo({
			// 	url: `/pages/plugins/video/search/search?search_query=${this.search_query}`
			// });
		},
		delete_history(e) {
			const index = e.currentTarget.dataset.index;
			this.search_history.splice(index, 1);
		},
		view_more_history() {
			// 查看更多历史逻辑
			this.is_view_more = true;
			setTimeout(() => {
				this.is_view_more = false;
			}, 3000);
		},
		switch_hot_tab(e) {
			this.setData({
				hot_current_tab: e.currentTarget.dataset.index,
			});
			// 根据当前标签加载对应的数据
		}
	}
};
</script>

<style lang="scss" scoped>
.search-record-container {
    background: #fff;
}

.header-top {
	position: sticky;
	top: 0;
	background: #fff;
	z-index: 9;
    padding-left: 24rpx;
	box-sizing: border-box;
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

.search-history {
	padding: 20rpx 40rpx 24rpx 40rpx;
    gap: 40rpx;
    border-bottom: 2rpx solid #EDEDED;
    .search-history-title {
        font-weight: 500;
        font-size: 28rpx;
        color: #666666;
        line-height: 40rpx;
        gap: 20rpx;
    }
    .more-history-btn {
        font-weight: 400;
        font-size: 28rpx;
        color: #999999;
        line-height: 40rpx;
		margin-top: 40rpx;
    }
}

/* 热门搜索 */
.hot-search {
	padding: 40rpx;
}

.hot-tabs {
	display: flex;
	margin-bottom: 20rpx;
    .tabs-scroll-content {
        display: flex;
        align-items: center;
        gap: 40rpx;
    }
}

.hot-tab-item {
	flex: 1;
    position: relative;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	padding: 10rpx 0;
}

.hot-tab-item::after {
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

.hot-tab-item.active::after {
    width: 100%;
}

.hot-tab-item.active {
    color: #333;
}

.hot-item {
	height: 72rpx;
	padding-left: 20rpx;
	box-sizing: border-box;
	background: linear-gradient( 90deg, #F4F4F4 0%, #FFFFFF 100%);
	border-radius: 8px;
}

.hot-hotness {
	font-weight: 400;
	font-size: 24rpx;
	color: #999999;
	line-height: 34rpx;
}

.hot-item-top {
	background: linear-gradient( 90deg, #FFF5E9 0%, #FFFFFF 100%);
	border-radius: 8px;
}

.hot-num {
	width: 40rpx;
	height: 40rpx;
	font-weight: 500;
	font-size: 28rpx;
	color: #999999;
	line-height: 40rpx;
}


/* 修改六边形样式 */
.hexagon-top {
    position: relative;
    width: 40rpx;
    height: 20rpx !important;
    border-radius: 2rpx;
}

.hexagon-top::before,
.hexagon-top::after {
    content: "";
    position: absolute;
    left: 0;
    width: 0;
    height: 0;
    border-left: 20rpx solid transparent;
    border-right: 20rpx solid transparent;
}

.hexagon-top::before {
    bottom: 100%;
    border-bottom: 10rpx solid #E93633;
}

.hexagon-top::after {
    top: 100%;
    border-top: 10rpx solid #E93633;
}

.hexagon-top span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
	font-weight: 500;
	font-size: 20rpx;
	line-height: 28rpx;
}

.hexagon-top-1 {
    background: #E93633;
}

.hexagon-top-2 {
    background: #F5C242;
}

.hexagon-top-2::before {
    border-bottom: 10rpx solid #F5C242;
}

.hexagon-top-2::after {
    border-top: 10rpx solid #F5C242;
}

.hexagon-top-3 {
    background: #F19F58;
}

.hexagon-top-3::before {
    border-bottom: 10rpx solid #F19F58;
}

.hexagon-top-3::after {
    border-top: 10rpx solid #F19F58;
}
</style>