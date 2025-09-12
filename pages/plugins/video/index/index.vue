
<template>
	<view>
		<!-- 搜索框 -->
		<view class="search-bar">
			<input type="text" v-model="searchQuery" placeholder="系统软件" @input="handleSearch" />
			<button @click="performSearch">搜索</button>
		</view>

		<!-- 导航栏 -->
		<view class="nav-tabs">
			<scroll-view scroll-x class="tabs-scroll">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }" @click="switchTab(index)">{{ tab }}</view>
			</scroll-view>
		</view>

		<!-- 推荐视频卡片区域 -->
		<view class="recommend-videos">
			<view class="video-grid">
				<view 
					v-for="(video, index) in recommendVideos" 
					:key="index" 
					class="video-card" 
					@click="navigateToDetail(video)"
				>
					<image 
						class="video-thumbnail" 
						:src="video.thumbnailUrl" 
						mode="aspectFill"
					></image>
					<text class="video-title">{{ video.title }}</text>
					<text class="video-date">{{ video.date }}</text>
					<text class="video-likes">👍 {{ video.likes }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchQuery: '',
			tabs: ['推荐', 'DIV装修', '商城管理', '多商户', '多门店', '客服'],
			currentTab: 0,
			recommendVideos: [
				{
					thumbnailUrl: 'http://shopxo.com/static/upload/images/common/2019/05/17/1558073623641199.jpg',
					title: '进销存软件究竟要怎么选？',
					date: '2025-06-12',
					likes: 2189,
					detailId: '1'
				},
				{
					thumbnailUrl: 'http://shopxo.com/static/upload/images/common/2019/05/17/1558073623641199.jpg',
					title: '一分钟告诉你，进销存是什么，进销存对企业有什么用...',
					date: '2025-06-12',
					likes: 2189,
					detailId: '2'
				},
				{
					thumbnailUrl: 'http://shopxo.com/static/upload/images/common/2019/05/17/1558073623641199.jpg',
					title: '全自动Excel进销存管理系统',
					date: '2025-06-12',
					likes: 2189,
					detailId: '3'
				},
				{
					thumbnailUrl: 'https://placehold.co/600x400',
					title: '管家婆进销存到底有多简单',
					date: '2025-06-12',
					likes: 2189,
					detailId: '4'
				},
				// 其他推荐视频...
			],
			isLoadingMore: false
		};
	},
	methods: {
		// ... existing methods ...
		handleSearch(event) {
			this.searchQuery = event.target.value;
		},
		performSearch() {
			// 这里可以添加搜索逻辑
			console.log('搜索关键词:', this.searchQuery);
		},
		switchTab(index) {
			this.currentTab = index;
			// 根据当前标签加载对应的数据
			this.loadRecommendVideos();
		},
		loadRecommendVideos() {
			// 加载推荐视频数据的逻辑
			// 根据当前标签加载对应的数据
			console.log('加载推荐视频数据');
		},
		navigateToDetail(video) {
			uni.navigateTo({
				url: `/pages/plugins/video/detail/detail?videoId=${video.detailId}`
			});
		},
		loadMore() {
			if (this.isLoadingMore) return;
			this.isLoadingMore = true;
			// 加载更多数据的逻辑
			setTimeout(() => {
				// 假设这里加载了更多的视频数据
				const newVideos = [
					{
						thumbnailUrl: 'https://placehold.co/600x400',
						title: '新视频标题',
						date: '2025-06-13',
						likes: 1500,
						detailId: '5'
					}
				];
				this.recommendVideos.push(...newVideos);
				this.isLoadingMore = false;
			}, 2000);
		}
	}
};
</script>

<style>
/* ... existing styles ... */

.search-bar {
	display: flex;
	align-items: center;
	padding: 10px;
	background-color: #f8f8f8;
	border-bottom: 1px solid #ddd;
}

.search-bar input {
	flex: 1;
	padding: 8px;
	border: 1px solid #ccc;
	border-radius: 4px;
	margin-right: 10px;
}

.search-bar button {
	padding: 8px 16px;
	background-color: #007bff;
	color: #fff;
	border: none;
	border-radius: 4px;
	cursor: pointer;
}

.nav-tabs {
	position: relative;
	width: 100%;
	background-color: #fff;
	border-bottom: 1px solid #ddd;
}

.tabs-scroll {
	white-space: nowrap;
}

.tab-item {
	display: inline-block;
	padding: 10px 20px;
	font-size: 16px;
	cursor: pointer;
}

.tab-item.active {
	color: #007bff;
	border-bottom: 2px solid #007bff;
}

.recommend-videos {
	padding: 10px;
}

.video-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

.video-card {
	width: calc(50% - 5px); /* Adjust for gap */
	background-color: #fff;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	border-radius: 4px;
	overflow: hidden;
}

.video-thumbnail {
	width: 100%;
	height: 200px;
	object-fit: cover;
}

.video-title {
	padding: 10px;
	font-size: 16px;
	color: #333;
}

.video-date,
.video-likes {
	padding: 0 10px 10px;
	font-size: 14px;
	color: #666;
}

.load-more {
	text-align: center;
	padding: 10px;
	color: #666;
	cursor: pointer;
}
</style>