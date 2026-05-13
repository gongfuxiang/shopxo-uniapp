<template>
	<view :class="theme_view">
        <template v-if="tabs.length > 0">
            <!-- 搜索框 -->
            <view class="top-search bg-white spacing-mb">
                <view class="flex-row align-c" :style="top_content_style + menu_button_info">
                    <!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
                    <!-- #ifndef MP-ALIPAY -->
                    <view v-if="is_show_back" class="cp" @tap="handle_back">
                        <iconfont name="icon-arrow-left " size="36rpx" color="#333" class="ml-10"></iconfont>
                    </view>
                    <!-- #endif -->
                    <view class="wh-auto" :style="header_padding_left">
                        <component-search propIsDisabled @disabledSearch="handle_search"/>
                    </view>
                </view>
            </view>
            <!-- 轮播 -->
            <view v-if="slider_list.length > 0" class="padding-horizontal-main">
                <component-banner :propData="slider_list" propBackgroundColor="#333" propSelectedBackgroundColor="#999"></component-banner>
            </view>
            <!-- 导航栏 -->
            <view class="nav-tabs bs-bb" :class="{ 'bg-white': is_nav_sticky }" :style="nav_sticky_style">
                <scroll-view scroll-x :show-scrollbar="false" class="tabs-scroll nowrap">
                    <view class="tabs-scroll-content">
                        <view v-for="(item, index) in tabs" :key="index" class="tab-item flex-row align-c gap-5" :class="{ active: current_tabs_index === index }" :data-index="index" @tap="switch_tab">
                            <image v-if="!isEmpty(item.icon)" class="tabs-scroll-image radius va-m" :src="item.icon" mode="aspectFill"></image>
                            <text class="va-m">{{ item.name }}</text>
                        </view>
                    </view>
                </scroll-view>
            </view>
            <!-- 推荐直播间卡片区域 -->
            <template v-if="recommend_lives.length > 0">
                <view class="recommend-lives">
                    <view class="live-grid">
                        <view v-for="(item, index) in recommend_lives" :key="index" class="live-card-item">
							<view class="live-card" :data-value="item.url" @tap="url_event">
								<view class="live-cover pr">
									<image class="live-thumbnail" :src="item.cover" mode="aspectFill"></image>
									<!-- 直播状态标签 -->
								<view class="live-status-tag" :class="'status-' + item.status">
									<view v-if="item.status == 1" class="live-status-dots">
										<text class="dot"></text>
										<text class="dot"></text>
										<text class="dot"></text>
									</view>
									{{ item.status_name }}
								</view>
								</view>
								<view class="live-info flex-col jc-c"> 
									<view class="live-title text-line-2">{{ item.title }}</view>
									<view class="flex-row align-c jc-sb">
										<view class="live-anchor flex-row align-c gap-8">
											<text class="anchor-name text-line-1">{{ item.seller_name }}</text>
										</view>
										<view class="live-likes flex-row align-c gap-4">
											<iconfont name="icon-eye" size="20rpx" color="#fff"></iconfont>
											<text>{{ item.online_count || 0}}</text>
										</view>
									</view>
								</view>
							</view>
                        </view>
                    </view>
                </view>
                <!-- 结尾 -->
                <component-bottom-line :propStatus="true"></component-bottom-line>
            </template>
            <template v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" propLoadingLogoTop="50vh"></component-no-data>
            </template>
        </template>
		<template v-else>
			<component-no-data :propStatus="data_tabs_loding_status" :propMsg="data_tabs_loding_msg"></component-no-data>
		</template>

		<!-- 公共 -->
        <component-common ref="common"></component-common>
	</view>
</template>

<script>
import componentSearch from '@/pages/plugins/live/components/search.vue';
import componentNoData from '@/components/no-data/no-data';
import componentBottomLine from '@/components/bottom-line/bottom-line';
import componentBanner from '@/components/slider/slider';
import componentCommon from '@/components/common/common';
import { live_get_top_left_padding, isEmpty } from '@/common/js/common/common.js';
const app = getApp();
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		componentSearch,
		componentNoData,
        componentBottomLine,
		componentBanner,
		componentCommon
	},
	data() {
		return {
            theme_view: app.globalData.get_theme_value_view(),
			// 5,7,0 是误差，， 10 是下边距，66是高度，bar_height是不同小程序下的导航栏距离顶部的高度
			// #ifdef MP
			top_content_style: 'padding-top:' + (bar_height + 5) + 'px;padding-bottom:10px;',
			// #endif
			// #ifdef H5 || MP-TOUTIAO
			top_content_style: 'padding-top:' + (bar_height + 7) + 'px;padding-bottom:10px;',
			// #endif
			// #ifdef APP
			top_content_style: 'padding-top:' + bar_height + 'px;padding-bottom:10px;',
			// #endif
            is_first: true,
			is_show_back: true,
			tabs: [],
			current_tabs_index: 0,
			current_tabs_status: '', // 当前选中的状态值
			recommend_lives: [],
			isLoadingMore: false,
			data_list_loding_status: 1,
			data_tabs_loding_status: 1,
			data_tabs_loding_msg: '',
			data_list_loding_msg: '',
			menu_button_info: '',
			header_padding_left: '',
            data_base: null,
			slider_list: [],
			is_nav_sticky: false, // 控制nav-tabs是否处于粘性状态
			nav_sticky_threshold: 0, // 粘性阈值，与CSS中的top值对应
			nav_sticky_style: '',
            // 自定义分享信息
            share_info: {},
		};
	},
    
    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);
    
        // 设置参数
        this.setData({
            params: params,
        });
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
        
        // 分享菜单处理
        app.globalData.page_share_handle();
	},
    
    // 下拉刷新
    onPullDownRefresh() {
        this.init_data(true);
    },

	// 滚动事件处理
	onPageScroll(e) {
		// 当滚动距离大于等于阈值时，设置nav-tabs为粘性状态（背景变白）
		this.setData({
			is_nav_sticky: e.scrollTop >= this.nav_sticky_threshold
		});
	},

	methods: {
		isEmpty,
        // 初始化
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
			let padding_left = '';
			// #ifdef MP-ALIPAY
				padding_left = live_get_top_left_padding();
			// #endif
			let pages = getCurrentPages();
			this.setData({
				is_show_back: pages.length > 1 && !app.globalData.is_tabbar_pages(),
				header_padding_left: padding_left,
				menu_button_info: menu_button_info,
			});
			// 初始化数据
			this.init_data(!this.is_first);
		},
        
        // 初始化数据
		init_data(is_list_loading = false) {
			// 获取数据
			uni.request({
				url: app.globalData.get_request_url("indexinit", "index", "live"),
				method: 'POST',
				dataType: 'json',
				success: res => {
                    uni.stopPullDownRefresh();
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						const live_status_tabs = new_data.live_status_tab_list || [];
						this.setData({
                            is_first: false,
                            data_base: new_data.base || null,
							tabs: live_status_tabs,
							current_tabs_status: live_status_tabs.length > 0 ? live_status_tabs[this.current_tabs_index].index : '',
							data_tabs_loding_status: 0,
							slider_list: new_data.slider_list,
						});
                        if ((this.data_base || null) != null) {
                            // 基础自定义分享
                            this.setData({
                                share_info: {
                                    title: this.data_base.seo_title || this.data_base.application_name,
                                    desc: this.data_base.seo_desc,
                                    path: '/pages/plugins/live/index/index',
                                    img: this.data_base.header_logo || '',
                                },
                            });

                            // #ifndef MP-ALIPAY
                            // 导航名称
                            if ((this.data_base.application_name || null) != null) {
                                uni.setNavigationBarTitle({
                                    title: this.data_base.application_name,
                                });
                            }
                            // #endif
                        }
						// 获取第一个状态的直播间列表
						this.get_live_list(this.current_tabs_status, is_list_loading);

                        // 获取节点位置
                        this.view_style_handle();
					} else {
						this.setData({
							data_tabs_loding_status: 2,
							data_tabs_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
                    uni.stopPullDownRefresh();
					this.setData({
						data_tabs_loding_status: 2,
						data_list_loding_msg: this.$t('common.internet_error_tips'),
					});
				}
			});
		},

        // 样式处理，获取头部的高度
        view_style_handle(num = 0) {
            let self = this;
            setTimeout(() => {
                const query = uni.createSelectorQuery().in(self);
                query.select('.top-search').boundingClientRect((res) => {
                    if((res || null) == null) {
                        if(num <= 10) {
                            self.view_style_handle(num+1);
                        }
                    } else {
                        self.setData({
                            nav_sticky_threshold: res.height,
                            nav_sticky_style: 'top:' + res.height + 'px;',
                        });
                    }
                }).exec();
            }, 100);
        },
        
        // 获取数据列表
		get_live_list(status = '', is_list_loading = false) {
			this.setData({
				data_list_loding_status: 1,
				data_list_loding_msg: '',
                recommend_lives: is_list_loading ? this.recommend_lives : [],
			});
			// 获取数据
			uni.request({
				url: app.globalData.get_request_url("indexdatalist", "index", "live"),
				method: 'POST',
				data: {
					// 与文档 live_status_tab_list：空-全部，0-离线，1-在线，2-离开
					status: status,
				},
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						this.setData({
							recommend_lives: new_data.data_list,
							data_list_loding_status: 0,
						});
					} else {
						this.setData({
							data_list_loding_status: 2,
							data_list_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
					this.setData({
						data_list_loding_status: 2,
						data_list_loding_msg: this.$t('common.internet_error_tips'),
					});
				}
			})
		},

        // 搜索事件
		handle_search() {
			// 跳转到搜索记录页面
			app.globalData.url_open(`/pages/plugins/live/search-record/search-record`, false);
		},

        // 选项卡切换事件
		switch_tab(e) {
			const index = e?.currentTarget?.dataset?.index || 0;
			const status = this.tabs[index]?.index || '';
			this.setData({
				current_tabs_index: index,
				current_tabs_status: status,
			});
			// 根据当前标签加载对应的数据
			this.get_live_list(status);
		},

        // url事件
        url_event(e) {
            app.globalData.url_event(e);
        },

        // 返回上一页事件
		handle_back() {
			app.globalData.page_back_prev_event();
		}
	}
};
</script>
<style lang="scss" scoped>
    @import './index.css';
</style>
