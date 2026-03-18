<template>
    <view :class="theme_view">
        <template v-if="category_list.length > 0">
            <!-- 搜索框 -->
            <view class="header-top">
                <view class="header-search" :style="top_content_style + menu_button_info">
                    <view id="search-height" class="flex-row align-c">
                        <!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
                        <!-- #ifndef MP-ALIPAY -->
                        <view class="cp" @tap="handle_back">
                            <iconfont name="icon-arrow-left " size="36rpx" color="#333" class="mr-10"></iconfont>
                        </view>
                        <!-- #endif -->
                        <view class="wh-auto ht-auto" :style="header_padding_left">
                            <component-search :propSearchQuery="search_keywords" @search="handle_search" />
                        </view>
                    </view>
                </view>
                <!-- 导航栏 -->
                <view class="nav-tabs flex-row align-s jc-sb gap-10"> 
                    <view class="tabs-scroll-content">
                        <view v-for="(tab, index) in category_list" :key="index" class="tab-item" :class="(currentTab == index) ? 'active' : ''" :data-index="index" @click="switch_tab">{{ tab.name }}</view>
                    </view>
                    <view class="nav-tabs-filter" @click="toggle_filter_popup">
                        <iconfont name="icon-filter" size="32rpx"></iconfont>
                    </view>
                </view>
            </view>
            <!-- 推荐视频卡片区域 -->
            <scroll-view class="recommend-videos" scroll-y :show-scrollbar="false" @scrolltolower="on_scroll_lower_event" lower-threshold="150" scroll-with-animation="true" enhanced="true" :style="scroll_view_style">
                <template v-if="recommend_videos.length > 0">
                    <view class="video-grid padding-main">
                        <view v-for="(item, index) in recommend_videos" :key="index" class="video-card-item">
							<view class="video-card" :data-value="item.url" @tap="url_event">
								<image class="video-thumbnail" :src="item.cover" mode="widthFix"></image>
								<view class="video-info flex-col jc-c"> 
									<view class="video-title text-line-2">{{ item.title }}</view>
									<view class="flex-row align-c jc-sb">
										<view class="video-date">{{ item.add_time_date }}</view>
										<view class="video-likes flex-row align-c gap-4">
											<iconfont name="icon-eye" size="24rpx"></iconfont>
											<text>{{ item.access_count }}</text>
										</view>
									</view>
								</view>
							</view>
                        </view>
                    </view>
                    <template v-if="page < page_total">
                        <!-- 加载更多 -->
                        <component-loading v-if="is_more_loading"></component-loading>
                    </template>
                    <template v-else>
                        <!-- 结尾 -->
                        <component-bottom-line :propStatus="goods_bottom_line_status"></component-bottom-line>
                    </template>
                </template>
                <template v-else>
                    <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
                </template>
            </scroll-view>
        </template>
        <template v-else>
            <component-no-data :propStatus="data_tabs_loding_status" :propMsg="data_tabs_loding_msg"></component-no-data>
        </template>
		<!-- 选项卡更多弹窗 -->
        <componentPopup :propShow="filter_popup_status" propPosition="top" :propMask="true" @onclose="close_filter_popup">
            <view class="padding-bottom-lg" :style="filter_popup_top_style">
                <scroll-view class="nav-list-more bs-bb" scroll-y>
                    <view class="flex-row flex-wrap align-c">
                        <!-- 筛选列表 -->
                        <view v-for="(item, index) in popup_list" :key="index" class="filter-group">
                            <view class="filter-title">{{ item.title }}</view>
                            <view class="filter-options">
                                <view v-for="(option, index) in item.list" :key="index" :class="'filter-option ' + (option.type == filter_params[item.id] ? 'active' : '')" :data-type="option.type" :data-id="item.id" @tap="select_filter">{{ option.name }}</view>
                            </view>
                        </view>
                    </view>
                </scroll-view>
                <view class="tc padding-top-lg flex-row jc-c align-c" @tap="close_filter_popup">
                    <text class="padding-right-sm">{{ $t('nav-more.nav-more.h9g4b1') }}</text>
                    <iconfont name="icon-arrow-top" color="#ccc" propContainerDisplay="flex"></iconfont>
                </view>
            </view>
        </componentPopup>
		
		<!-- 公共 -->
        <component-common ref="common"></component-common>
	</view>
</template>

<script>
import componentSearch from '@/pages/plugins/video/components/search.vue';
import componentPopup from '@/components/popup/popup';
import componentLoading from '@/pages/plugins/video/components/loading.vue';
import componentNoData from '@/components/no-data/no-data';
import componentBottomLine from '@/components/bottom-line/bottom-line';
import { video_get_top_left_padding, isEmpty } from '@/common/js/common/common.js';
import componentCommon from '@/components/common/common';
const app = getApp();
// 状态栏高度
var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
// #ifdef MP-TOUTIAO || H5
bar_height = 0;
// #endif
export default {
	components: {
		componentSearch,
		componentPopup,
		componentLoading,
		componentNoData,
		componentBottomLine,
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
			search_keywords: '',
			currentTab: 0,
			recommend_videos: [],
			isLoadingMore: false,
			params: null,
			filter_popup_status: false,
			filter_popup_top_style: '',
            scroll_view_style: '',
			popup_list: [
				{ title: this.$t('video-search.video-search.sdfgg4'), id: 'sort', list: []},
				{ title: this.$t('video-search.video-search.gf3212'), id: 'time', list: [] },
				{ title: this.$t('video-search.video-search.iuyt42'), id: 'duration', list: [] },
			],
			filter_params: {
				sort: 'default',
				time: 'default',
				duration: 'default',
			},
			is_more_loading: false,
			header_padding_left: '',
			category_list: [],
			page: 0,
			page_total: 1,
			search_cid: '',
			goods_bottom_line_status: false,
			data_tabs_loding_status: 1,
			data_tabs_loding_msg: '',
			data_list_loding_status: 1,
			data_list_loding_msg: '',
			search_history: [],
            cache_key: 'cache_plugins_video_search_history_key',
		};
	},
    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);

        // 设置参数
        params = app.globalData.launch_params_handle(params);
        this.setData({
        	search_keywords: params.keywords || '',
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

	methods: {
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
				padding_left = video_get_top_left_padding();
			// #endif
			this.setData({
				header_padding_left: padding_left,
				menu_button_info: menu_button_info,
                search_history: uni.getStorageSync(this.cache_key) || [],
			});

			// 初始化搜索页数据
			this.init_data();
		},

		// 获取初始化数据
		init_data () {
			uni.request({
				url: app.globalData.get_request_url("searchinit", "index", "video"),
				method: 'POST',
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const new_data = data.data;
						// 数组数据更新
						this.popup_list.forEach(item => {
							if (item.id == 'sort') {
								item.list = new_data.search_order_by_list;
							} else if (item.id == 'time') {
								item.list = new_data.search_release_time_list;
							} else if (item.id == 'duration') {
								item.list = new_data.search_duration_list;
							}
						});
						this.setData({
							category_list: new_data.category_list,
							search_cid: new_data?.category_list[0]?.id || '',
							data_tabs_loding_status: 0,
							popup_list: this.popup_list
						});

						// 加载数据
						this.load_recommend_videos();

                        // 获取头部的高度
                        this.view_style_handle();
					} else {
						this.setData({
							data_tabs_loding_status: 2,
							data_tabs_loding_msg: data.msg,
						});
					}
				},
				fail: (err) => {
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
                query.select('.header-top').boundingClientRect((res) => {
                    if((res || null) == null) {
                        if(num <= 10) {
                            self.view_style_handle(num+1);
                        }
                    } else {
                        self.setData({
                            header_top_value: res.height,
                            filter_popup_top_style: 'padding-top:' + res.height + 'px;',
                            scroll_view_style: 'height: calc(100vh - '+ res.height + 'px);',
                        });
                    }
                }).exec();
            }, 100);
        },

		// 返回上一页
		handle_back() {
			app.globalData.page_back_prev_event();
		},

		// 搜索按钮点击事件
		handle_search(e) {
			this.setData({
				search_keywords: e,
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			})
			if (!isEmpty(e) && !this.search_history.includes(e)) {
				this.search_history.unshift(e);
				uni.setStorageSync(this.cache_key, this.search_history);
			}
			// 更新数据信息
			this.load_recommend_videos();
		},

        // 选项卡切换事件
		switch_tab(e) {
			const index = e?.currentTarget?.dataset?.index || 0;
			this.setData({
				currentTab: index,
				search_cid: this.category_list[index]?.id || '',
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			})
			// 根据当前标签加载对应的数据
			this.load_recommend_videos();
		},

        // 记载视频
		load_recommend_videos() {
			// 加载推荐视频数据的逻辑
			const { time = '', duration = '', sort = ''} = this.filter_params;
			const new_page = this.page + 1;
			uni.request({
				url: app.globalData.get_request_url("searchdatalist", "index", "video"),
				method: 'POST',
				data: {
					cid: this.search_cid,
					bwd: this.search_keywords, // 搜索关键字
					rt: time, // 发布时间
					dn: duration, // 视频时长
					by: sort, // 排序
					page: new_page,
				},
				dataType: 'json',
				success: res => {
					const data = res.data;
					if (data.code == 0) {
						const responseData = data.data;
						// 验证数据有效性并安全地合并数组
						if (responseData && Array.isArray(responseData.data)) {
							// 使用扩展运算符合并数组
							this.recommend_videos.push(...responseData.data);
						}
						this.setData({
							recommend_videos: this.recommend_videos,
							page: new_page,
							page_total: responseData.page_total,
							goods_bottom_line_status: new_page >= responseData.page_total,
							data_list_loding_status: 0
						})
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
			});
		},

        // url事件
		url_event(e) {
            app.globalData.url_event(e);
		},

        // 滚动事件
		on_scroll_lower_event() {
			// 添加额外的检查条件
			if (this.page >= this.page_total) {
				return;
			}
			// 加载更多数据
			this.load_recommend_videos();
		},

        // 筛选弹窗切换
		toggle_filter_popup() {
			this.filter_popup_status = !this.filter_popup_status;
		},
        
        // 关闭筛选弹窗
		close_filter_popup() {
			this.filter_popup_status = false;
		},

		// 更新筛选条件的值
		select_filter(e) {
			const type = e?.currentTarget?.dataset?.type || '';
			const id = e?.currentTarget?.dataset?.id || '';
			if (!isEmpty(id)) {
				this.filter_params[id] = type;
			}
			this.setData({
				filter_params: this.filter_params,
				page: 0,
				page_total: 1,
				data_list_loding_status: 1,
				recommend_videos: []
			});
			this.close_filter_popup();
			// 重新初始化数据
			this.load_recommend_videos();
		}
	}
};
</script>
<style lang="scss" scoped>
    @import './search.css';
</style>