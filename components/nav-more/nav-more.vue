<template>
	<view>
		<view class="more cr-black padding-top-main padding-bottom-sm flex-row flex-warp align-c" @click="open_popup">
			<text>更多</text>
			<iconfont name="icon-icon-fenlei-more"></iconfont>
		</view>
		<!-- 弹窗 -->
		<component-popup :propShow="popup_status" :propIsBar="propIsBar" propPosition="top" :propMask="false" :propTop="propTop" @onclose="quick_close_event">
			<view class="padding-vertical-lg">
				<view class="padding-left-main padding-bottom-main">全部分类</view>
				<view class="divider-b">
					<slot></slot>
				</view>
				<view class="tc padding-top-lg" @click="quick_close_event">
					<text>点击收起</text>
					<iconfont name="icon-icon-fenlei-top"></iconfont>
				</view>
			</view>
		</component-popup>
	</view>
</template>

<script>
	import componentPopup from "../popup/popup";
	export default {
		name: "more",
		components: {
			componentPopup
		},
		props: {
			propData: {
				type: Array,
				default: () => {
					return []
				}
			},
			propTop: {
				type: String,
				default: ''
			},
			propStatus: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			propStatus(newVal, oldVal) {
				if (newVal !== oldVal) {
					this.setData({
						popup_status: newVal
					});
				}
			}
		},
		data() {
			return {
				popup_status: false,
				propIsBar: false
			};
		},
		methods: {
			// 打开弹窗
			open_popup() {
				this.$emit('open-popup', true);
			},
			// 关闭弹窗
			quick_close_event(e) {
				this.setData({
					popup_status: false
				});
			},
		}
	}
</script>

<style scoped>
	.more {
		width: 30rpx;
		background-color: #fff;
		padding: 15rpx 20rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 101;
		white-space: normal;
		word-break: break-all;
	}
</style>