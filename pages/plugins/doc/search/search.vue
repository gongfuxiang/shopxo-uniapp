<template>
    <view :class="theme_view">
        <view v-if="(data_base || null) != null">
            <view class="padding-horizontal-main padding-top-main padding-bottom-sm bg-white left-0 top-0 ps z-i flex-row align-c">
                <view class="doc-home-entry margin-right" @tap="doc_home_event">
                    <iconfont name="icon-home" size="32rpx" color="#333"></iconfont>
                </view>
                <view class="flex-1">
                    <component-search
                        @onsearch="search_keywords_event"
                        :propIsOnEvent="true"
                        :propIsRequired="false"
                        :propDefaultValue="search_keywords_value"
                        :propPlaceholder="$t('doc.search_placeholder_all')"
                        propIconColor="#ccc"
                        propPlaceholderClass="cr-grey-c"
                        propBgColor="#f6f6f6"
                        propBrColor="#eee"
                    ></component-search>
                </view>
            </view>
            <view v-if="search_doc_list.length > 0 || search_content_list.length > 0" class="padding-horizontal-main padding-top-main">
                <view v-if="search_doc_list.length > 0" class="spacing-mb">
                    <view class="margin-bottom-sm">{{ $t('doc.search_group_doc') }}</view>
                    <view v-for="(item, index) in search_doc_list" :key="item.id" class="doc-card padding-main bg-white border-radius-main spacing-mb" :data-value="item.url || ('/pages/plugins/doc/detail/detail?id=' + item.id)" @tap="url_event">
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
                <view v-if="search_content_list.length > 0">
                    <view class="margin-bottom-sm">{{ $t('doc.search_group_content') }}</view>
                    <view v-for="(item, index) in search_content_list" :key="'c' + index" class="padding-main bg-white border-radius-main spacing-mb" :data-value="item.url" @tap="url_event">
                        <view class="fw-b">{{ item.title }}</view>
                        <view v-if="item.doc_name" class="cr-grey text-size-sm margin-top-xs">{{ item.doc_name }}</view>
                    </view>
                </view>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </view>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentSearch from '@/components/search/search';
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                data_is_loading: 0,
                data_base: null,
                default_cover: '',
                is_access_enable: 0,
                search_keywords_value: '',
                search_doc_list: [],
                search_content_list: [],
                params: null,
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentSearch,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params,
                search_keywords_value: params.keywords || params.bwd || '',
            });
            this.get_data();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data_list();
        },
        methods: {
            // 获取公共数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'search', 'doc'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var header = data.header_data || {};
                            var app_name = (data.base || {}).application_name || this.$t('pages.plugins-doc-index');
                            this.setData({
                                data_base: data.base || {},
                                default_cover: header.doc_cover || '',
                                is_access_enable: data.is_access_enable || 0,
                            });
                            uni.setNavigationBarTitle({ title: app_name + this.$t('common.search') });
                            this.get_data_list();
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 列表数据
            get_data_list() {
                this.share_info_handle();
                if (this.data_is_loading == 1) {
                    return false;
                }
                this.setData({ data_is_loading: 1 });
                uni.request({
                    url: app.globalData.get_request_url('datalist', 'search', 'doc'),
                    method: 'POST',
                    data: {
                        keywords: this.search_keywords_value,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var docs = data.doc_list || [];
                            var contents = data.content_list || [];
                            this.setData({
                                search_doc_list: docs,
                                search_content_list: contents,
                                data_list_loding_status: docs.length > 0 || contents.length > 0 ? 3 : 0,
                                data_list_loding_msg: docs.length > 0 || contents.length > 0 ? '' : this.$t('doc.search_empty'),
                                data_bottom_line_status: docs.length > 0 || contents.length > 0,
                                data_is_loading: 0,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_is_loading: 0,
                            });
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_is_loading: 0,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 分享设置处理
            share_info_handle() {
                var info = this.data_base || {};
                this.setData({
                    share_info: {
                        title: info.seo_title || info.application_name || this.$t('pages.plugins-doc-index'),
                        desc: info.seo_desc,
                        path: '/pages/plugins/doc/search/search',
                        query: 'keywords=' + (this.search_keywords_value || ''),
                    },
                });
                app.globalData.page_share_handle(this.share_info);
            },
            // 关键字搜索
            search_keywords_event(e) {
                this.setData({
                    search_keywords_value: e || '',
                    data_list_loding_status: 1,
                    search_doc_list: [],
                    search_content_list: [],
                    data_bottom_line_status: false,
                    data_is_loading: 0,
                });
                this.share_info_handle();
                this.get_data_list();
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 返回文档首页
            doc_home_event() {
                var prev_url = app.globalData.prev_page();
                if (prev_url != null && prev_url.indexOf('pages/plugins/doc/index/index') != -1) {
                    uni.navigateBack();
                } else {
                    app.globalData.url_open('/pages/plugins/doc/index/index');
                }
            },
        },
    };
</script>
<style>
    @import './search.css';
</style>
