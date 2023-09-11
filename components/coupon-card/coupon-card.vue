<template>
	<view class="padding-bottom padding-horizontal-main">
		<view class="coupon-card oh pr flex-row">
			<view class="card-left flex-col jc-sa align-c" :class="propData.type > 4 ? 'failure' : ''">
				<view class="price cr-white">
					<text v-if="propData.type == 0" class="symbol text-size">{{currency_symbol}}</text>
					<text class="num text-size-xxl">{{propData.discount_value}}</text>
					<text v-if="propData.type_unit" class="unit text-size-md">{{propData.type_unit}}</text>
				</view>
				<text v-if="(propData.desc || null) != null" class="desc cr-white text-size-xs single-text">{{propData.desc}}</text>
			</view>
			<view class="card-right flex-1 flex-width flex-row jc-sb align-c" :class="propData.type > 4 ? 'failure' : ''">
				<view class="card-info flex-1 flex-width" :class="propData.type > 4 ? 'failure' : ''">
					<view class="title text-size-lg single-text">{{propData.use_limit_type_name}}</view>
					<view v-if="prprDate" class="date text-size-md cr-grey-9 single-text padding-top-sm">{{prprDate}}</view>
					<view v-if="propIsProgress" class="progress padding-top-sm flex-row align-c">
						<progress class="flex-1" :percent="prprGet" stroke-width="6" activeColor="#FF7004" backgroundColor="#fff" border-radius="3" />
						<view class="percent text-size-xss cr-grey-9 padding-left-main">
							已领{{prprGet}}%
						</view>
					</view>
					<view v-if="propIsPeriodOfValidity" class="padding-top-sm text-size-xs cr-red">快过期</view>
				</view>
				<view v-if="propData.is_operable == 1" class="card-type">
					<!-- 按钮状态 1-领取，2-已领取，3-已抢完，4-去使用,5-已使用，6-已过期 -->
					<view v-if="propData.type===1" class="card-btn dis-inline-block cr-white" @tap="receive">{{propData.is_operable_name}}</view>
					<view v-else-if="propData.type==2" class="card-btn dis-inline-block cr-red br-red received">{{propData.is_operable_name}}</view>
					<view v-else-if="propData.type==3" class="card-btn dis-inline-block cr-white robbed">{{propData.is_operable_name}}</view>
					<navigator v-else-if="propData.type==4" :url="home_page_url" open-type="switchTab" hover-class="none">
						<view class="card-btn dis-inline-block cr-white">
							{{propData.is_operable_name}}
						</view>
					</navigator>
					<view v-if="propData.type==5" class="card-image pa top-0 right-0">
						<image :src="coupon_static_url + 'coupon-used.png'" mode="scaleToFill"></image>
					</view>
					<view v-else-if="propData.type==6" class="card-image pa top-0 right-0">
						<image :src="coupon_static_url + 'coupon-expire.png'" mode="scaleToFill"></image>
					</view>
					<view v-else @tap="receive">暂无type参数</view>
				</view>
			</view>
			<view class="card-circle-top" :style="{background:`${propBg}`}"></view>
			<view class="card-circle-bottom" :style="{background:`${propBg}`}"></view>
		</view>
	</view>
</template>

<script>
	const app = getApp();
	var coupon_static_url = app.globalData.get_static_url('coupon', true);
	export default {
		name: "coupon-card",
		props: {
			propData: {
				type: Object,
				default: () => {
					return {
						// 按钮状态 1-领取，2-已领取，3-已抢完，4-去使用,5-已使用，6-已过期
						type: 1
					}
				}
			},
			// 有效日期 // 2023.08.30-2023.09.1
			prprDate: {
				type: String,
				default: ''
			},
			// 领取数量
			prprGet: {
				type: Number,
				default: 10
			},
			// 半圆背景
			propBg: {
				type: String,
				default: '#fff'
			},
			// 进度条
			propIsProgress: {
				type: Boolean,
				default: false
			},
			// 有效期提示
			propIsPeriodOfValidity: {
				type: Boolean,
				default: false
			},
			// 按钮状态 1-领取，2-已领取，3-已抢完，4-去使用,5-已使用，6-已过期
			propStatus: {
				type: Number,
				default: 1
			},
			// 是否可重复领取
			propRepeatedClaim: {
				type: Boolean,
				default: false
			},
			// 是否可点击
			propDisabled: {
				type: Boolean,
				default: false
			},
			// 领取 已领取 已抢完 去使用
			propBtnName: {
				type: String,
				default: ''
			},
			// 下标
			propIndex: {
				type: Number,
				default: 1
			}

		},
		data() {
			return {
				coupon_static_url: coupon_static_url,
				// 符号
				currency_symbol: app.globalData.data.currency_symbol,
				// 首页地址
				home_page_url: app.globalData.data.tabbar_pages[0]
			};
		},
		methods: {
			receive(e) {
				this.$emit('call-back', this.propIndex, this.propData.id)
			}
		}
	}
</script>

<style scoped>
	.coupon-card {
		border-radius: 24rpx;
		height: 208rpx;
	}

	.card-left {
		width: 176rpx;
		padding: 24rpx 12rpx;
		background: linear-gradient(95deg, #FF994B 0%, #FF6E00 100%);
	}

	.card-left.failure {
		background: linear-gradient(95deg, #EEEEEE 0%, #FAFAFA 100%);
	}

	.card-right {
		padding: 32rpx 24rpx 32rpx 46rpx;
		background-color: #FFE4D1;
	}

	.card-right.failure {
		background: #FFFFFF;
	}

	.card-info.failure {
		padding-right: 116rpx;
	}

	.card-btn {
		width: 116rpx;
		text-align: center;
		padding: 6rpx 0;
		background: linear-gradient(93deg, #FF9747 0%, #FF6E01 100%);
		border-radius: 13px;
	}

	.robbed {
		background: #FBD3B7;
	}

	.received {
		border-radius: 13px;
		background: transparent;
	}

	/deep/ .uni-progress-bar,
	/deep/ .uni-progress-inner-bar {
		border-radius: 6rpx;
	}

	.card-circle-top,
	.card-circle-bottom {
		width: 40rpx;
		height: 40rpx;
		background-color: #fff;
		border-radius: 50%;
		position: absolute;
		left: 180rpx;
		z-index: 1;
	}

	.card-circle-top {
		top: -20rpx;
	}

	.card-circle-bottom {
		bottom: -20rpx;
	}

	.card-image image {
		width: 136rpx;
		height: 108rpx;
	}
</style>