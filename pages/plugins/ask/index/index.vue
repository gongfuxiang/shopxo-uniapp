<template>
    <view :class="theme_view">
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :style="'padding-top:' + (status_bar_height + 5) + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                    <component-search @onsearch="search_button_event" propIsOnEvent :propIsRequired="false" propIconColor="#ccc" propPlaceholderClass="cr-grey-c" propBgColor="#f6f6f6"></component-search>
                </view>
            </template>
        </component-nav-back>
        <scroll-view :scroll-y="true" class="scroll-box" @scrolltolower="scroll_lower" lower-threshold="60" :style="'height: calc(100vh - '+(40+status_bar_height)+'px)'">
            <view class="wh-auto">
                <!-- 轮播 -->
                <view v-if="slider_list.length > 0" class="padding-horizontal-main spacing-mb padding-top-main">
                    <component-banner :propData="slider_list"></component-banner>
                </view>
                <!-- tab -->
                <view v-if="nav_list.length > 0" class="ask-tab flex-row jc-sa align-c bg-white wh-auto left-0 top-0 ps z-i padding-bottom-sm">
                    <view v-for="(item, index) in nav_list" :key="index" class="flex-1 padding-vertical-sm tc" :class="nav_index === index ? 'cr-main fw-b nav-active-line' : 'cr-base'" :data-index="index" :data-type="item.type" @tap="nav_change_event">{{ item.name }}</view>
                </view>
                <!-- 内容列表 -->
                <view :class="(data_base.is_user_add_ask || 0) == 1 ? 'page-bottom-fixed' : ''">
                    <view v-if="data_list.length > 0" class="padding-horizontal-main padding-top-main">
                        <block v-for="(item, index) in data_list" :key="index">
                            <view :data-value="'/pages/plugins/ask/detail/detail?id=' + item.id" @tap="url_event" class="padding-main border-radius-main bg-white oh cp spacing-mb flex-row">
                                <view v-if="nav_index === 1">
                                    <view class="ask-hot border-radius-sm tc margin-right-sm va-m pr top-md" :class="index < 3 ? 'cr-white text-size-xs hot-bg-' + index : 'text-size-md'">{{ index + 1 }}</view>
                                </view>
                                <view class="flex-1 flex-width">
                                    <view class="title text-size fw-b">{{ item.title }}</view>
                                    <view v-if="item.title != item.content" class="content cr-base margin-top-sm padding-top-xs multi-text">
                                        <mp-html :content="item.content" />
                                    </view>
                                    <view class="status flex-row align-c spacing-mt text-size-xs">
                                        <view v-if="nav_index !== 1" class="ask-status cr-white border-radius-sm text-size-xss" :class="item.is_reply === '1' ? 'ask-bg-green' : 'ask-bg-yellow'">{{ item.is_reply === '1' ? $t('index.index.1c17n3') : $t('index.index.75l3l2') }}</view>
                                        <view class="num cr-grey-9 flex-row self-c">
                                            {{ item.add_time_date }}
                                            <view class="fw-b padding-horizontal-xs">·</view>
                                            {{ item.access_count || '0' }}{{ $t('detail.detail.e6ga1y') }}</view>
                                    </view>
                                </view>
                            </view>
                        </block>
                        <!-- 结尾 -->
                        <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                    </view>
                    <view v-else>
                        <!-- 提示信息 -->
                        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propLoadingLogoTop="slider_list.length > 0 ? '80%' : '50%'"></component-no-data>
                    </view>
                </view>
            </view>
        </scroll-view>
        <view v-if="(data_base.is_user_add_ask || 0) == 1" class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <view class="item flex-row jc-sa align-c text-size fw-b br bg-white round padding-vertical">
                    <view data-value="/pages/plugins/ask/form/form" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                        <view class="divider-r-d wh-auto"> <iconfont name="icon-edit-below-line" size="30rpx" color="#333" propClass="margin-right-sm"></iconfont>{{ $t('goods-detail.goods-detail.7ulh8b') }}</view>
                    </view>
                    <view data-value="/pages/plugins/ask/user-list/user-list" @tap="url_event" class="flex-1 tc flex-col jc-c align-c cp">
                        <view class="wh-auto"> <iconfont name="icon-list-dot" size="32rpx" color="#333" propClass="margin-right-sm pr top-xs"></iconfont>{{ $t('detail.detail.p7o522') }}</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSearch from '@/components/search/search';
    import componentBanner from '@/components/slider/slider';

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                bottom_fixed_style: '',
                data_base: {},
                data_list: [],
                data_total: 0,
                data_page_total: 0,
                data_page: 1,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                // 轮播
                slider_list: [],
                // 导航分类
                nav_list: [],
                nav_index: 0,
                nav_type: '',
                // 搜索框关键字
                search_bwg: '',
                // 自定义分享信息
                share_info: {},
            };
        },

        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentBottomLine,
            componentSearch,
            componentBanner
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 加载数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.setData({
                data_page: 1,
            });
            this.get_data_list(1);
        },

        methods: {
            get_data() {
                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'ask'),
                    method: 'POST',
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (res.data.data.search_tab_list.length > 0) {
                                var data_base = res.data.data.base || {};
                                this.setData({
                                    data_base: data_base,
                                    slider_list: res.data.data.slider_list || [],
                                    nav_list: res.data.data.search_tab_list || [],
                                    // 基础自定义分享
                                    share_info: {
                                        title: data_base.seo_title || data_base.application_name || this.$t('goods-detail.goods-detail.k5u755'),
                                        desc: data_base.seo_desc || '',
                                        path: '/pages/plugins/ask/index/index',
                                    },
                                });

                                // 拉取列表数据
                                this.get_data_list();
                            } else {
                                this.setData({
                                    data_list_loding_status: 2,
                                    data_list_loding_msg: this.$t('index.index.17vy72'),
                                });
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            get_data_list(is_mandatory) {
                // 分页是否还有数据
                if ((is_mandatory || 0) == 0) {
                    if (this.data_bottom_line_status == true) {
                        uni.stopPullDownRefresh();
                        return false;
                    }
                }

                // 是否加载中
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: 1,
                });

                // 获取数据
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'index', 'ask'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        type: this.nav_type,
                        bwd: this.search_bwg,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            if (this.data_page <= 1) {
                                var temp_data_list = res.data.data.data;
                            } else {
                                var temp_data_list = this.data_list || [];
                                var temp_data = res.data.data.data;
                                for (var i in temp_data) {
                                    temp_data_list.push(temp_data[i]);
                                }
                            }

                            this.setData({
                                data_list: temp_data_list,
                                data_total: res.data.data.total,
                                data_page_total: res.data.data.page_total,
                                data_list_loding_status: temp_data_list.length > 0 ? 3 : 0,
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            // 是否还有数据
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                            data_is_loading: 0,
                        });
                    },
                });
            },

            // 滚动加载
            scroll_lower(e) {
                this.get_data_list();
            },

            // 查询
            search_button_event(e) {
                this.setData({
                    search_bwg: e || '',
                    data_page: 1,
                    data_list: []
                });
                this.reset_scroll();
                this.get_data_list(1);
            },

            // 重置滑动位置
            reset_scroll() {
                this.setData({
                    scroll_top: this.scroll_top_old,
                });
                this.$nextTick(() => {
                    this.setData({
                        scroll_top: 0,
                    });
                });
            },

            nav_change_event(e) {
                this.setData({
                    nav_index: e.currentTarget.dataset.index,
                    nav_type: e.currentTarget.dataset.type,
                    data_list: [],
                    data_page: 1,
                });
                this.reset_scroll();
                this.get_data_list(1);
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        },
    };
</script>
<style scoped>
    @import './index.css';
</style>
