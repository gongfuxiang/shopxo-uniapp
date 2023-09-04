<template>
	<view>
		<view class="more cr-black padding-top-main padding-bottom-sm flex-row flex-warp align-c" @click="open_popup">
			<text>更多</text>
			<iconfont name="icon-icon-fenlei-more"></iconfont>
		</view>

		<!-- 弹窗 -->
		<component-popup :propShow="popup_status" :propIsBar="propIsBar" propPosition="top" @onclose="quick_close_event">

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

		},
		data() {
			return {
				popup_status: false,
			};
		}
	}
</script>

<style scoped>
	.more {
		width: 30rpx;
		background-color: #fff;
		padding: 20rpx;
		position: absolute;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 101;
	}
</style>