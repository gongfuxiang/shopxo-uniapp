<template>
    <view :class="theme_view">
		<!-- 轮播 -->
		<block v-if="banner_list.length > 0">
			<component-banner :propData="banner_list" propMode="round" propRadius=""></component-banner>
		</block>

		<view class="spacing-mt" v-if="data_list.length > 0">
			<view class="padding-horizontal-main">
				<!-- 导航 -->
				<view class="spacing-nav-title flex-row jc-sb align-c">
					<view class="flex-row align-c">
						<image :src="weixinliveplayer_static_url + 'player-title-icon.png'" mode="scaleToFill" class="player-title-icon margin-right-xs"></image>
						<text class="text-wrapper">{{$t('index.index.63g4m1')}}</text>
					</view>
					<text data-value="/pages/plugins/weixinliveplayer/search/search" @tap="url_event" class="arrow-right padding-right cr-grey text-size-xs cp">{{$t('common.more')}}</text>
				</view>

				<!-- 数据列表 -->
				<view class="data-list">
					<view v-for="(item, index) in data_list" :key="index" class="item border-radius-main bg-white oh pr spacing-mb">
						<view class="flex-row jc-sb cp" :class="Number(item.status) > 3 ? 'expire' : '' " :data-value="'/pages/plugins/weixinliveplayer/detail/detail?id=' + item.id" @tap="url_event">
							<!-- <view class="pr"> -->
							<image class="radius" :src="item.share_img" mode="aspectFill"></image>
							<view v-if="item.status==='1'" class="pa bottom-0 left-0 live-content circle">
								<view class="live-action flex-row jc-sa align-e">
									<view class="live-1"></view>
									<view class="live-2"></view>
									<view class="live-3"></view>
								</view>
							</view>
							<!-- </view> -->
							<view class="base flex-1 flex-width flex-col jc-sb">
								<view>
									<view class="single-text text-size-md fw-b">{{item.name}}</view>
									<view class="margin-top-sm oh flex-row flex-nowrap align-c">
										<iconfont name="icon-zhibo-time" color="#ccc" size="28rpx" class="margin-right-sm"></iconfont>
										<view class="flex-row flex-nowrap align-c flex-1 flex-width cr-grey-9 single-text">
											{{item.start_time}} - {{item.end_time}}
										</view>
									</view>
								</view>
								<view class="self-e text-size-xs cr-grey-9 flex-row align-c" :class="' status-' + item.status">
									<!-- 未开始 -->
									<iconfont v-if="item.status==='0'" name="icon-zhibo-time margin-right-xs pr top-xs"></iconfont>
									<!-- 直播中 -->
									<div v-else-if="item.status==='1'" class="spread margin-right-sm">
										<div class="ring"></div>
										<div class="ring"></div>
										<div class="ring"></div>
									</div>
									<!-- 暂停中 -->
									<iconfont v-else-if="item.status==='2'" name="icon-player-pause margin-right-xs pr top-xs"></iconfont>
									<!-- 已结束 -->
									<iconfont v-else-if="item.status==='3'" name="icon-player-end margin-right-xs pr top-xs"></iconfont>
									<!-- 其他 -->
									<iconfont v-else name="icon-zhibo-shixiao margin-right-xs pr top-xs"></iconfont>
									{{item.status_name}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 结尾 -->
			<component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
		</view>
		<block v-else>
			<!-- 提示信息 -->
			<component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
		</block>

		<!-- 公共 -->
        <component-common ref="common"></component-common>
	</view>
</template>
<script>
	const app = getApp();
	import componentCommon from '@/components/common/common';
	import componentNoData from "@/components/no-data/no-data";
	import componentBanner from "@/components/slider/slider";
	import componentBottomLine from "@/components/bottom-line/bottom-line";
	var weixinliveplayer_static_url = app.globalData.get_static_url('weixinliveplayer', true);

	export default {
		data() {
			return {
				theme_view: app.globalData.get_theme_value_view(),
				weixinliveplayer_static_url: weixinliveplayer_static_url,
				data_list_loding_status: 1,
				data_bottom_line_status: false,
				data_list_loding_msg: '',
				data_list: [],
				data_base: null,
				banner_list: [],
				// 自定义分享信息
				share_info: {}
			};
		},

		components: {
			componentCommon,
			componentNoData,
			componentBanner,
			componentBottomLine
		},
		
		onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

		onShow() {
			// 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
			this.init();

			// 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
		},

		// 下拉刷新
		onPullDownRefresh() {
			this.init();
		},

		methods: {
			init() {
				// 获取数据
				this.get_data_list();
			},

			// 获取数据
			get_data_list() {
				this.setData({
					data_list_loding_status: 1
				});
				uni.request({
					url: app.globalData.get_request_url("index", "index", "weixinliveplayer"),
					method: 'POST',
					data: {},
					dataType: 'json',
					success: res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							var data = res.data.data;
							var status = (data.data || null) == null || data.data.length == 0;
							this.setData({
								data_base: data.base || null,
								banner_list: data.banner_list || [],
								data_list: data.data,
								data_list_loding_status: status ? 0 : 3,
								data_bottom_line_status: !status
							});

							if ((this.data_base || null) != null) {
								// 基础自定义分享
								this.setData({
									share_info: {
										title: this.data_base.seo_title || this.data_base.application_name,
										desc: this.data_base.seo_desc,
										path: '/pages/plugins/weixinliveplayer/index/index',
										img: ((this.banner_list || null) != null && this.banner_list.length > 0) ? this.banner_list[0]['images_url'] : ''
									}
								});

								// 导航名称
								if ((this.data_base.application_name || null) != null) {
									uni.setNavigationBarTitle({
										title: this.data_base.application_name
									});
								}
							}
						} else {
							this.setData({
								data_bottom_line_status: true,
								data_list_loding_status: 2,
								data_list_loding_msg: res.data.msg
							});
						}

						// 分享菜单处理
						app.globalData.page_share_handle(this.share_info);
					},
					fail: () => {
						uni.stopPullDownRefresh();
						this.setData({
							data_bottom_line_status: false,
							data_list_loding_status: 2,
							data_list_loding_msg: this.$t('common.internet_error_tips')
						});
					}
				});
			},

			// url事件
	        url_event(e) {
	            app.globalData.url_event(e);
	        }
		}
	};
</script>
<style>
	@import './index.css';
</style>