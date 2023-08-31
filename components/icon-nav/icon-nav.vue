<template>
	<view>
		<view v-if="propData.length > 0" class="icon-nav-list" :class="propData.length > 5 ? 'swiper-height-max' : 'swiper-height-min'">
			<uni-swiper-dot class="uni-swiper-dot-box" mode="default" :dots-styles="dotsStyles" @clickItem="click_item" :info="swiperData" :current="current">
				<swiper class="swiper-box" :indicator-dots="swiperData.length > 2" :autoplay="autoplay" :duration="duration" @change="swiper_change" :current="swiperDotIndex">
					<swiper-item v-for="(swiperItemData, i) in swiperData" :key="i">
						<view class="swiper-item" :class="'swiper-item' + i">
							<view v-for="(item, j) in swiperItemData" :key="j" class="swiper-item item">
								<view :class="'item-content '+((item.bg_color || null) == null ? 'item-exposed' : '')" :data-value="item.event_value" :data-type="item.event_type"
									@tap="navigation_event" :style="((item.bg_color || null) == null ? '' : 'background-color:'+item.bg_color+';')">
									<image :src="item.images_url" mode="aspectFit"></image>
								</view>
								<view class="title">{{item.name}}</view>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
		</view>
	</view>
</template>
<script>
	const app = getApp();
	export default {
		data() {
			return {
				swiperData: [],
				autoplay: false,
				duration: 500,
				styleIndex: -1,
				current: 0,
				swiperDotIndex: 0,
				dotsStyles: {
					backgroundColor: '#eee',
					bottom: '0',
					border: '0',
					color: '#fff',
					selectedBackgroundColor: app.globalData.get_theme_color(),
					selectedBorder: '0'
				},
			};
		},
		components: {},
		props: {
			propData: Array
		},
		beforeMount() {
			this.handle_data();
		},
		methods: {
			navigation_event(e) {
				app.globalData.operation_event(e);
			},
			// 数据处理
			handle_data() {
				this.swiperData = app.globalData.groupArry(this.propData, 10);
			},
			swiper_change(e) {
				this.current = e.detail.current
			},
			click_item(e) {
				this.swiperDotIndex = e
			},
		}
	};
</script>
<style scoped>
	.icon-nav-list {
		overflow: hidden;
		margin-bottom: 20rpx;
		padding: 20rpx;
	}

	.icon-nav-list .item {
		width: calc(20% - 40rpx);
		float: left;
		padding: 20rpx;
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.icon-nav-list .item .item-content {
		border-radius: 50%;
		padding: 20rpx;
		text-align: center;
		margin: 0 auto;
		-webkit-box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
		box-shadow: 0 2px 12px rgb(226 226 226 / 95%);
	}

	.icon-nav-list .item .item-content,
	.icon-nav-list .item image {
		width: 50rpx !important;
		height: 50rpx !important;
	}

	.icon-nav-list .item .item-exposed {
		padding: 0;
		-webkit-box-shadow: none;
		box-shadow: none;
	}

	.icon-nav-list .item .item-exposed,
	.icon-nav-list .item .item-exposed image {
		width: 90rpx !important;
		height: 90rpx !important;
	}

	.icon-nav-list .item .title {
		margin-top: 12rpx;
		font-size: 28rpx;
		text-align: center;
		-o-text-overflow: ellipsis;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		max-width: 100%;
		color: #666;
	}

	.swiper-height-min /deep/ .swiper-box {
		height: 180rpx;
	}

	.swiper-height-max /deep/ .swiper-box {
		height: 360rpx;
	}
</style>