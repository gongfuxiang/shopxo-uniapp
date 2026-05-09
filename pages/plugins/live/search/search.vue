<template>
    <view :class="theme_view">
        <template v-if="live_status_tab_list.length > 0 || sort_popup_ready">
            <!-- 搜索框 -->
            <view class="header-top">
                <view class="header-search" :style="top_content_style + menu_button_info">
                    <view id="search-height" class="flex-row align-c">
                        <!-- 支付宝小程序自带返回按钮，这里就不给返回按钮了，这里给留出一点空间就行 -->
                        <!-- #ifndef MP-ALIPAY -->
                        <view class="cp" @tap="handle_back">
                            <iconfont name="icon-arrow-left " size="36rpx" color="#333"></iconfont>
                        </view>
                        <!-- #endif -->
                        <view class="wh-auto ht-auto" :style="header_padding_left">
                            <component-search :propSearchQuery="search_keywords" @search="handle_search" />
                        </view>
                    </view>
                </view>
                <!-- 仅保留直播状态 Tab；排序改为与 video 一致的弹窗（仅排序依据） -->
                <view class="status-filter-row flex-row align-c jc-sb">
                    <scroll-view v-if="live_status_tab_list.length > 0" scroll-x :show-scrollbar="false" class="status-tabs-scroll flex-1 nowrap">
                        <view class="status-tabs-scroll-content">
                            <view
                                v-for="(item, index) in live_status_tab_list"
                                :key="index"
                                class="status-tab-item"
                                :class="{ active: current_status_index === index }"
                                :data-index="index"
                                @tap="switch_status_tab"
                            >
                                <text>{{ item.name }}</text>
                            </view>
                        </view>
                    </scroll-view>
                    <view v-else class="status-tabs-placeholder flex-1"></view>
                    <view class="nav-tabs-filter" @tap="toggle_filter_popup">
                        <iconfont name="icon-filter" size="32rpx"></iconfont>
                    </view>
                </view>
            </view>
            <!-- 推荐直播间卡片区域 -->
            <scroll-view class="recommend-lives" scroll-y :show-scrollbar="false" @scrolltolower="on_scroll_lower_event" lower-threshold="150" scroll-with-animation="true" enhanced="true" :style="scroll_view_style">
                <template v-if="recommend_lives.length > 0">
                    <view class="live-grid padding-main">
                        <view v-for="(item, index) in recommend_lives" :key="index" class="live-card-item">
                            <view class="live-card" :data-value="item.url" @tap="url_event">
                                <view class="live-cover pr">
                                    <image class="live-thumbnail" :src="item.cover" mode="aspectFill"></image>
                                    <!-- 直播状态标签 -->
                                    <view class="live-status-tag" :class="'status-' + item.status">
                                        <text v-if="item.status == 1" class="live-status-dot"></text>
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
										    <text>{{ item.online_count || 0 }}</text>
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
            </scroll-view>
        </template>
        <template v-else>
            <component-no-data :propStatus="data_tabs_loding_status" :propMsg="data_tabs_loding_msg"></component-no-data>
        </template>

        <!-- 排序依据弹窗（与 video 搜索一致，仅保留排序） -->
        <componentPopup :propShow="filter_popup_status" propPosition="top" :propMask="true" @onclose="close_filter_popup">
            <view class="padding-bottom-lg" :style="filter_popup_top_style">
                <scroll-view class="nav-list-more bs-bb" scroll-y>
                    <view class="flex-row flex-wrap align-c">
                        <view v-for="(item, index) in popup_list" :key="index" class="filter-group">
                            <view class="filter-title">{{ item.title }}</view>
                            <view class="filter-options">
                                <view
                                    v-for="(option, oi) in item.list"
                                    :key="oi"
                                    :class="'filter-option ' + (option.type == filter_params[item.id] ? 'active' : '')"
                                    :data-type="option.type"
                                    :data-id="item.id"
                                    @tap="select_filter"
                                >{{ option.name }}</view>
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
import componentSearch from '@/pages/plugins/live/components/search.vue';
import componentPopup from '@/components/popup/popup';
import componentNoData from '@/components/no-data/no-data';
import componentBottomLine from '@/components/bottom-line/bottom-line';
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
        componentPopup,
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
            is_first: true,
            /** 文档 searchinit.live_status_tab_list */
            live_status_tab_list: [],
            current_status_index: 0,
            current_status: '',
            /** 与 video 搜索一致：弹窗内仅「排序依据」，数据来自 search_order_by_list */
            popup_list: [
                { title: this.$t('video-search.video-search.sdfgg4'), id: 'sort', list: [] },
            ],
            filter_params: {
                sort: '',
            },
            filter_popup_status: false,
            filter_popup_top_style: '',
            sort_popup_ready: false,
            recommend_lives: [],
            /** 文档 searchdatalist：page / page_total / total / data */
            list_page: 1,
            page_total: 1,
            list_total: 0,
            is_loading_more: false,
            data_list_loding_status: 1,
            data_tabs_loding_status: 1,
            data_tabs_loding_msg: '',
            data_list_loding_msg: '',
            menu_button_info: '',
            header_padding_left: '',
            search_keywords: '',
            scroll_view_style: '',
        };
    },
    
    onLoad(params) {
        // 调用公共事件方法
        app.globalData.page_event_onload_handle(params);
    
        // 设置参数
        this.setData({
            params: params,
            search_keywords: params.keywords || '',
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
                padding_left = live_get_top_left_padding();
            // #endif
            this.setData({
                header_padding_left: padding_left,
                menu_button_info: menu_button_info,
            });
            // 初始化数据
            this.init_data();

            // 获取节点位置
            this.view_style_handle();
        },
        
        // 初始化数据
        init_data(is_list_loading = false) {
            // 获取数据
            uni.request({
                url: app.globalData.get_request_url("searchinit", "index", "live"),
                method: 'POST',
                dataType: 'json',
                success: res => {
                    uni.stopPullDownRefresh();
                    const data = res.data;
                    if (data.code == 0) {
                        const new_data = data.data;
                        const status_tabs = new_data.live_status_tab_list || [];
                        const order_list = new_data.search_order_by_list || [];
                        const sort_options = order_list.map((o) => ({
                            name: o.name,
                            type: o.value,
                        }));
                        let default_sort = '';
                        const checked_order = order_list.find((o) => o.checked);
                        if (checked_order) {
                            default_sort = checked_order.value;
                        } else if (order_list.length > 0) {
                            default_sort = order_list[0].value;
                        }
                        this.setData({
                            is_first: false,
                            live_status_tab_list: status_tabs,
                            current_status_index: 0,
                            current_status: status_tabs.length > 0 ? status_tabs[0].index : '',
                            popup_list: [
                                {
                                    title: this.$t('video-search.video-search.sdfgg4'),
                                    id: 'sort',
                                    list: sort_options,
                                },
                            ],
                            filter_params: {
                                sort: default_sort,
                            },
                            sort_popup_ready: sort_options.length > 0,
                            data_tabs_loding_status: 0,
                        });
                        // 获取直播间列表
                        this.get_live_list(is_list_loading);
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
                        data_tabs_loding_msg: this.$t('common.internet_error_tips'),
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
                            scroll_view_style: 'height: calc(100vh - ' + res.height + 'px);',
                            filter_popup_top_style: 'padding-top:' + res.height + 'px;',
                        });
                    }
                }).exec();
            }, 100);
        },
        
        // 获取数据列表（文档：page 必填；bwd 关键字；by 排序；status 可选）
        get_live_list(is_list_loading = false, load_more = false) {
            let req_page = 1;
            if (load_more) {
                if (this.is_loading_more || this.list_page >= this.page_total) {
                    return;
                }
                req_page = this.list_page + 1;
                this.setData({ is_loading_more: true });
            } else {
                this.setData({
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    recommend_lives: is_list_loading ? this.recommend_lives : [],
                });
                req_page = 1;
            }
            const by = this.filter_params.sort || '';
            const status_param = this.normalize_live_status_for_request(this.current_status);
            uni.request({
                url: app.globalData.get_request_url("searchdatalist", "index", "live"),
                method: 'POST',
                data: {
                    page: req_page,
                    status: status_param,
                    bwd: this.search_keywords || '',
                    by: by,
                },
                dataType: 'json',
                success: res => {
                    const data = res.data;
                    if (data.code == 0) {
                        const new_data = data.data || {};
                        const list = new_data.data || [];
                        const next = load_more ? (this.recommend_lives || []).concat(list) : list;
                        this.setData({
                            recommend_lives: next,
                            data_list_loding_status: 0,
                            list_page: req_page,
                            page_total: new_data.page_total != null ? new_data.page_total : 1,
                            list_total: new_data.total != null ? new_data.total : next.length,
                            is_loading_more: false,
                        });
                    } else {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: data.msg,
                            is_loading_more: false,
                        });
                    }
                },
                fail: (err) => {
                    this.setData({
                        data_list_loding_status: 2,
                        data_list_loding_msg: this.$t('common.internet_error_tips'),
                        is_loading_more: false,
                    });
                }
            });
        },

        // 搜索事件
        handle_search(value) {
            this.search_keywords = value;
            this.get_live_list();
        },

        // 状态 Tab（文档 live_status_tab_list.index → searchdatalist.status）
        switch_status_tab(e) {
            const index = Number(e?.currentTarget?.dataset?.index) || 0;
            const status = this.live_status_tab_list[index]?.index;
            this.setData({
                current_status_index: index,
                current_status: status,
            });
            this.get_live_list();
        },

        /**
         * 状态筛选项的 index 可能为 ''、0、1、2，需把 0 与空字符串区分后交给接口
         */
        normalize_live_status_for_request(st) {
            if (st === 0) {
                return 0;
            }
            if (st === '' || st === null || st === undefined) {
                return '';
            }
            return st;
        },

        toggle_filter_popup() {
            this.setData({
                filter_popup_status: !this.filter_popup_status,
            });
        },

        close_filter_popup() {
            this.setData({
                filter_popup_status: false,
            });
        },

        select_filter(e) {
            const type = e?.currentTarget?.dataset?.type ?? '';
            const id = e?.currentTarget?.dataset?.id || '';
            if (!isEmpty(id)) {
                this.filter_params[id] = type;
            }
            this.setData({
                filter_params: this.filter_params,
                filter_popup_status: false,
            });
            this.get_live_list();
        },

        // 滚动到底部：文档分页 page_total
        on_scroll_lower_event() {
            this.get_live_list(false, true);
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
    @import './search.css';
</style>
