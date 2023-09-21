<template>
	<view>
		<view class="notice-content spacing-mb flex-row">
			<iconfont :name="propIcon" :color="propIconColor" size="32rpx"></iconfont>
			<view class="padding-left-sm flex-1 flex-width">
				<view v-for="(item,index) in propDatas" :key="index" :class="setLineNum + (index === 0 ? '' : ' margin-top-sm')">
					{{item}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "notice",
		props: {
			propData: {
				type: [String, Array],
				default: ''
			},
			propIcon: {
				type: String,
				default: 'icon-icon-index-notice'
			},
			propIconColor: {
				type: String,
				default: '#ccc'
			},
			// 设置行数，默认为空不限行数  单行 single-text 双行 multi-text 
			setLineNum: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				propDatas: []
			};
		},
		mounted() {
			this.handle_data(this.propData);
		},
		methods: {
			handle_data(data) {
				this.propDatas = []
				if (data.constructor == Array) {
					this.propDatas = data
				} else {
					this.propDatas.push(data);
				}
			}
		}
	}
</script>

<style>

</style>