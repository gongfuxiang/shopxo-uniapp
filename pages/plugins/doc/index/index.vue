<template>
    <view :class="theme_view">
        <view class="bg-white left-0 top-0 ps z-i">
            <component-nav-back :propFixed="false" propClass="bg-white cr-black" propColor="#333" :style="'padding-top:' + status_bar_height + 'px;'">
                <template slot="right" :class="is_mp_env ? 'top-search-width' : ''">
                    <view class="margin-left-main" :class="is_mp_env ? '' : 'flex-1 flex-width'">
                        <component-search
                            propUrl="/pages/plugins/doc/search/search"
                            :propPlaceholder="$t('doc.search_placeholder')"
                            propIconColor="#ccc"
                            propPlaceholderClass="cr-grey-c"
                            propBgColor="#f6f6f6"
                            propBrColor="#eee"
                            :propIsRequired="false"
                        ></component-search>
                    </view>
                </template>
            </component-nav-back>
        </view>
        <scroll-view v-if="data_base != null && navigation_list.length > 0" class="doc-nav-list nav-base scroll-view-horizontal bg-white oh" scroll-x="true" :show-scrollbar="false">
            <view
                v-for="(item, index) in navigation_list"
                :key="index"
                class="item cr-base dis-inline-block padding-horizontal-main"
                :data-value="item.event_value || item.url"
                :data-type="item.event_type == undefined ? 1 : item.event_type"
                @tap="navigation_event"
            >{{ item.name }}</view>
        </scroll-view>
        <view v-if="data_base != null" class="padding-horizontal-main padding-top-main">
            <view v-if="doc_list.length > 0">
                <view v-for="(item, index) in doc_list" :key="index" class="doc-card padding-main bg-white border-radius-main spacing-mb" :data-value="item.url || ('/pages/plugins/doc/detail/detail?id=' + item.id)" @tap="url_event">
                    <view class="doc-cover-wrap pr radius oh">
                        <image :src="item.cover || default_cover" mode="aspectFill" class="doc-cover" />
                        <view v-if="item.is_default_cover == 1 || !item.cover" class="doc-cover-name pa cr-white text-size-xs">{{ item.name }}</view>
                    </view>
                    <view class="doc-card-body">
                        <view class="single-text fw-b">{{ item.name }}</view>
                        <view v-if="item.describe" class="multi-text cr-grey text-size-sm margin-top-xs">{{ item.describe }}</view>
                        <view v-if="is_access_enable == 1 && item.access_show" class="doc-access-meta margin-top-xs">
                            <text v-if="item.access_show.access_tag_text" class="doc-access-tag">{{ item.access_show.access_tag_text }}</text>
                            <text v-if="item.access_show.access_price_text" class="cr-price text-size-xs margin-left-sm">{{ item.access_show.access_price_text }}</text>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </view>
        <view v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
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
    import pluginLocale from '../locale/index.js';
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: bar_height,
                is_mp_env: false,
                // #ifdef MP-WEIXIN || MP-BAIDU || MP-ALIPAY || MP-QQ || MP-KUAISHOU
                is_mp_env: true,
                // #endif
                data_base: null,
                default_cover: '',
                doc_list: [],
                navigation_list: [],
                is_access_enable: 0,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                share_info: {},
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

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            this.get_data();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            if ((this.share_info || null) != null && (this.share_info.path || null) != null) {
                app.globalData.page_share_handle(this.share_info);
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'doc'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var header = data.header_data || {};
                            var title = (data.base || {}).application_name || this.$t('pages.plugins-doc-index');
                            var share_info = {
                                title: (data.base || {}).seo_title || title,
                                desc: (data.base || {}).seo_desc || '',
                                path: '/pages/plugins/doc/index/index',
                                img: header.doc_cover || ((data.doc_list || [])[0] || {}).cover || '',
                            };
                            this.setData({
                                data_base: data.base || {},
                                default_cover: header.doc_cover || '',
                                doc_list: data.doc_list || [],
                                navigation_list: data.navigation_list || [],
                                is_access_enable: data.is_access_enable || 0,
                                data_list_loding_status: 0,
                                data_bottom_line_status: (data.doc_list || []).length > 0,
                                share_info: share_info,
                            });
                            uni.setNavigationBarTitle({ title: title });
                            app.globalData.page_share_handle(share_info);
                        } else {
                            this.setData({
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            // 导航事件
            navigation_event(e) {
                app.globalData.operation_event(e);
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
@import './index.css';
</style>
