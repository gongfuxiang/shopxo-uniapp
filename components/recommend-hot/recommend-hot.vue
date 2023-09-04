<template>
	<view class="spacing-mb">
		<view class="bg-white border-radius-main padding-vertical-main">
			<view class="hot-list flex-row flex-warp">
				<view v-for="(item,index) in hotData" :key="index" class="flex-width-half">
					<view class="padding-horizontal-main">
						<view class="flex-row margin-bottom-xs">
							<text class="text-size fw-b">新品推荐</text>
							<view class="hot-go border-radius-main margin-left-sm pr">
								<text class="cr-white padding-right-sm">GO!</text>
								<iconfont class="icon-icon-index-xptj-jiantou cr-white"></iconfont>
							</view>
						</view>
						<view class="cr-grey-9 text-sm margin-bottom-sm">全年最低价 优惠多多</view>
						<swiper class="swiper" circular :autoplay="propAutoplay" :vertical="propVertical" :interval="propInterval" :duration="propDuration">
							<swiper-item v-for="(swiperItem,swiperIndex) in item.d" :key="swiperIndex">
								<view class="swiper-item">
									<view class="flex-row">
										<view v-for="(listItem,listIndex) in swiperItem" :key="listIndex" class="flex-1" :class="swiperItem.length > 2 ? '' : 'flex-width-half'" @click="banner_event">
											<view class="padding-main">
												<image src="@/static/images/common/user.png" mode="widthFix" class="wh-auto">
												</image>
												<view class="price">
													<text class="sales-price va-m text-size-xss va-b">¥</text>
													<text class="sales-price va-m">8970.99</text>
												</view>
											</view>
										</view>
										<view class="flex-1 flex-width-half" @tap="banner_event">
											<view class="padding-main">
												<image src="@/static/images/common/user.png" mode="widthFix" class="wh-auto">
												</image>
												<view class="price">
													<text class="sales-price va-m text-size-xss va-b">¥</text>
													<text class="sales-price va-m">8970.99</text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	export default {
		name: "recommend-hot",
		props: {
			propData: {
				type: Array,
				default: () => [{
					a: 1,
					b: 2,
					c: 3,
					d: [1, 2, 3, 4, 5, 6, 7]
				}, {
					a: 1,
					b: 2,
					c: 3,
					d: [1, 2, 3, 4, 5, 6, 7]
				}, {
					a: 1,
					b: 2,
					c: 3,
					d: [1, 2, 3, 4, 5, 6, 7]
				}]
			},
			propVertical: {
				type: Boolean,
				default: true
			},
			propInterval: {
				type: Number,
				default: 6000
			},
			propAutoplay: {
				type: Boolean,
				default: true
			},
			propDuration: {
				type: Number,
				default: 1000
			}
		},
		data() {
			return {
				hotData: []
			};
		},
		mounted() {
			this.set_data(this.propData);
		},
		methods: {
			banner_event() {
				console.log('你点几了图片，开始进入详情');
			},
			// 轮播数据处理
			set_data(data) {
				this.hotData = data;
				this.hotData.forEach((item, i) => {
					let swiperData = [];
					if (this.hotData.length % 2 == 0) {
						// 偶数
						swiperData = app.globalData.group_arry(item.d, 2);
					} else {
						// 奇数
						if (this.hotData.length === i + 1) {
							swiperData = app.globalData.group_arry(item.d, 4);
						} else {
							swiperData = app.globalData.group_arry(item.d, 2);
						}
					}
					item.d = swiperData

				})
			}
		}
	}
</script>

<style scoped>
	.hot-list>.flex-width-half:last-of-type {
		width: 100%;
	}

	.hot-list .swiper {
		height: 214rpx;
	}

	.hot-go {
		background: linear-gradient(90deg, #FF8F42 0%, #FE541E 100%);
		padding-left: 14rpx;
		padding-right: 42rpx;
		line-height: 44rpx;
	}

	.hot-go .iconfont {
		position: absolute;
		top: 0;
	}
</style>