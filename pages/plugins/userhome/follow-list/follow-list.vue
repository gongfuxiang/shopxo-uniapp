<template>
    <view :class="theme_view">
        <!-- 搜索：对齐「我的订单」顶部搜索栏 -->
        <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :style="'padding-top:' + status_bar_height + 'px;'">
            <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                    <component-search
                        @oninput="search_input_event"
                        :propIsOnInputEvent="true"
                        @onsearch="search_button_event"
                        :propIsOnEvent="true"
                        :propDefaultValue="search_keywords"
                        :propIsRequired="false"
                        :propPlaceholder="$t('home.relation_search')"
                        propIconColor="#ccc"
                        propPlaceholderClass="cr-grey-c"
                        propBgColor="#f6f6f6"
                    ></component-search>
                </view>
            </template>
        </component-nav-back>

        <!-- 顶部 tabs：对齐「我的动态」下划线样式，两项铺满 -->
        <view class="nav-base bg-white">
            <view :class="'item fl tc ' + (list_type == 'follow' ? 'cr-main nav-active-line' : '')" data-type="follow" @tap="type_event">{{ $t('home.follow') }}</view>
            <view :class="'item fl tc ' + (list_type == 'fans' ? 'cr-main nav-active-line' : '')" data-type="fans" @tap="type_event">{{ $t('home.fans') }}</view>
        </view>

        <scroll-view :scroll-y="true" class="scroll-box" :style="content_style" @scrolltolower="scroll_lower" lower-threshold="60">
            <view v-if="data_list.length > 0" class="padding-main">
                <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main spacing-mb flex-row align-c">
                    <view class="flex-row align-c flex-1 flex-width cp" :data-value="item.user_home_url" @tap="url_event">
                        <image class="avatar circle" :src="item.avatar" mode="aspectFill"></image>
                        <text class="margin-left-main text-line-1">{{ item.user_name_view }}</text>
                    </view>
                    <!-- 与 PC 一致：非本人显示关注状态，可关注/取消 -->
                    <button
                        v-if="item.is_self != 1"
                        class="follow-btn round text-size-sm"
                        :class="item.is_follow == 1 ? 'cr-grey br-grey bg-white' : 'cr-white bg-main'"
                        type="default"
                        size="mini"
                        hover-class="none"
                        :loading="item._follow_loading == 1"
                        :disabled="item._follow_loading == 1"
                        :data-index="index"
                        @tap.stop="follow_event"
                    >{{ follow_btn_text(item) }}</button>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </scroll-view>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentSearch from '@/components/search/search';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';

    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                client_type: app.globalData.application_client_type(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                params: {},
                list_type: 'follow',
                search_keywords: '',
                content_style: '',
                data_list: [],
                data_page: 1,
                data_page_total: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentSearch,
            componentNoData,
            componentBottomLine,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 设置参数
            this.setData({
                params: params || {},
                list_type: params.type == 'fans' ? 'fans' : 'follow',
                search_keywords: params.keywords || '',
                content_style: 'height: calc(100vh - 80rpx - ' + (this.status_bar_height + (this.client_type == 'h5' ? 55 : 50)) + 'px);',
            });
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 首屏：导航/搜索已展示，下方加载列表
            this.reload_list();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.reload_list();
        },
        methods: {
            // 重新加载列表
            reload_list() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_page_total: 0,
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    data_is_loading: 0,
                });
                this.get_list(1);
            },
            // 切换类型（当前选中也可点，重新加载）
            type_event(e) {
                var type = e.currentTarget.dataset.type || 'follow';
                this.setData({ list_type: type });
                this.reload_list();
            },
            // 搜索输入
            search_input_event(e) {
                this.setData({
                    search_keywords: e,
                });
            },
            // 关键字搜索
            search_button_event(e) {
                this.setData({
                    search_keywords: e,
                });
                this.reload_list();
            },
            // 获取列表
            get_list(is_mandatory) {
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
                if (this.data_page > 1) {
                    uni.showLoading({
                        title: this.$t('common.loading_in_text'),
                    });
                }
                var action = this.list_type == 'fans' ? 'fanslist' : 'followlist';
                uni.request({
                    url: app.globalData.get_request_url(action, 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        uid: this.params.uid || 0,
                        page: this.data_page,
                        keywords: this.search_keywords || '',
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            var page_total = parseInt(data.page_total || 0) || 0;
                            this.setData({
                                data_list: temp,
                                data_page_total: page_total,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_list_loding_msg: temp.length > 0 ? '' : this.$t('common.no_relevant_data_tips'),
                                data_page: this.data_page + 1,
                                data_is_loading: 0,
                            });
                            this.setData({
                                data_bottom_line_status: this.data_list.length > 0 && this.data_page > 1 && this.data_page > this.data_page_total,
                            });
                        } else {
                            this.setData({
                                data_is_loading: 0,
                                data_list_loding_status: this.data_list.length > 0 ? 3 : 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        if (this.data_page > 1) {
                            uni.hideLoading();
                        }
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_is_loading: 0,
                            data_list_loding_status: this.data_list.length > 0 ? 3 : 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 滚动加载
            scroll_lower() {
                this.get_list();
            },
            // 按钮文案：互相关注 / 已关注 / 关注
            follow_btn_text(item) {
                if (!item) {
                    return this.$t('home.follow');
                }
                if (item.is_mutual == 1) {
                    return this.$t('home.mutual_follow');
                }
                if (item.is_follow == 1) {
                    return this.$t('home.followed');
                }
                return this.$t('home.follow');
            },
            // 关注/取消关注（与 PC、主页同一套接口）
            follow_event(e) {
                var user = app.globalData.get_user_info(this, 'follow_event');
                if (user == false) {
                    return;
                }
                var index = parseInt((e.currentTarget.dataset || {}).index);
                if (isNaN(index) || index < 0) {
                    return;
                }
                var list = (this.data_list || []).slice();
                var item = list[index];
                if (!item || item.is_self == 1 || item._follow_loading == 1) {
                    return;
                }
                item._follow_loading = 1;
                this.setData({ data_list: list });
                var action = item.is_follow == 1 ? 'unfollow' : 'follow';
                uni.request({
                    url: app.globalData.get_request_url(action, 'index', 'userhome'),
                    method: 'POST',
                    data: { uid: item.user_id },
                    dataType: 'json',
                    success: (res) => {
                        var next = (this.data_list || []).slice();
                        var row = next[index];
                        if (!row) {
                            return;
                        }
                        row._follow_loading = 0;
                        if (res.data.code == 0) {
                            // 成功靠按钮状态变化反馈，不再 toast
                            var data = res.data.data || {};
                            row.is_follow = parseInt(data.is_follow || 0) || 0;
                            row.is_mutual = parseInt(data.is_mutual || 0) || 0;
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                        this.setData({ data_list: next });
                    },
                    fail: () => {
                        var next = (this.data_list || []).slice();
                        if (next[index]) {
                            next[index]._follow_loading = 0;
                            this.setData({ data_list: next });
                        }
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './follow-list.css';
</style>
