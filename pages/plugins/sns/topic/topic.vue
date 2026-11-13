<template>
    <view :class="theme_view">
        <block v-if="!page_ready">
            <component-no-data :propStatus="page_loding_status" :propMsg="page_loding_msg"></component-no-data>
        </block>

        <block v-else-if="(topic || null) != null">
            <view class="topic-head bg-white padding-main">
                <view class="flex-row align-c">
                    <view class="flex-1 flex-width">
                        <view class="text-size-lg fw-b">#{{ topic.name }}</view>
                        <view class="text-size-sm cr-grey margin-top-xs">{{ topic.moment_count || 0 }}{{ $t('home.topic_moment_count') }}</view>
                    </view>
                    <view class="flex-row align-c topic-head-actions">
                        <button
                            v-if="is_share_enable == 1"
                            class="round cr-main br-main bg-white text-size-sm margin-right-sm"
                            type="default"
                            size="mini"
                            hover-class="none"
                            @tap="share_event"
                        >{{ $t('home.share') }}</button>
                        <button
                            v-if="config.is_enable_moment == 1"
                            class="round cr-white bg-main text-size-sm"
                            type="default"
                            size="mini"
                            hover-class="none"
                            @tap="join_event"
                        >{{ $t('home.topic_join') }}</button>
                    </view>
                </view>
            </view>

            <view class="nav-tabs bg-white" :style="'--tab-line-color:' + theme_color">
                <view class="tabs-scroll-content">
                    <view v-for="(tab, ti) in sort_list" :key="ti" class="tab-item" :class="{ active: sort == tab.value }" :data-sort="tab.value" @tap="sort_event">{{ tab.name }}</view>
                </view>
            </view>

            <view class="padding-main">
                <block v-if="data_list.length > 0">
                    <component-moment-item
                        v-for="(item, index) in data_list"
                        :key="item.id || index"
                        :propItem="item"
                        :propEnableDetail="config.is_enable_moment_detail == 1"
                        :propShowLike="config.is_enable_like == 1"
                        :propShowComment="config.is_enable_comment == 1"
                        :propShowOwner="true"
                        @like="like_event"
                        @comment-count="comment_count_event"
                        @edit="edit_event"
                        @delete="delete_event"
                    ></component-moment-item>
                    <component-bottom-line :propStatus="data_bottom_line_status" :propMsg="data_bottom_line_msg"></component-bottom-line>
                </block>
                <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </block>

        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentMomentItem from '@/pages/plugins/sns/components/moment-item/moment-item';
    import componentSharePopup from '@/pages/common/components/share-popup/share-popup';
    import pluginLocale from '@/pages/plugins/sns/locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                params: {},
                topic_id: 0,
                topic: null,
                config: {},
                is_share_enable: 0,
                sort_list: [],
                sort: 'new',
                page_ready: false,
                page_loding_status: 1,
                page_loding_msg: '',
                data_list: [],
                data_page: 1,
                data_bottom_line_status: false,
                data_bottom_line_msg: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
                list_req_seq: 0,
                share_info: {},
                page_scroll_top: 0,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentMomentItem,
            componentSharePopup,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            var topic_id = parseInt((params && (params.id || params.topic)) || 0) || 0;
            this.setData({
                params: params || {},
                topic_id: topic_id,
                sort: params.sort == 'hot' || params.sort == 'like' ? params.sort : 'new',
            });
            uni.setNavigationBarTitle({ title: this.$t('pages.plugins-sns-topic') });
            app.globalData.page_event_onload_handle(params);
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            app.globalData.page_common_on_show(this);
            app.globalData.page_share_handle(this.share_info);
            if (this.page_ready && uni.getStorageSync('cache_plugins_sns_topic_refresh')) {
                uni.removeStorageSync('cache_plugins_sns_topic_refresh');
                this.reload();
            }
        },
        onReachBottom() {
            this.get_list();
        },
        onPullDownRefresh() {
            this.reload();
        },
        onPageScroll(e) {
            this.page_scroll_top = (e && e.scrollTop) || 0;
        },
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-KUAISHOU
        onShareAppMessage() {
            return app.globalData.share_content_handle(this.share_info || {});
        },
        // #endif
        methods: {
            init() {
                if (this.topic_id <= 0) {
                    this.setData({
                        page_ready: false,
                        page_loding_status: 0,
                        page_loding_msg: this.$t('common.no_relevant_data_tips'),
                    });
                    return;
                }
                this.get_init();
            },
            reload() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_bottom_line_msg: '',
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                    data_is_loading: 0,
                });
                if (!this.page_ready) {
                    this.get_init();
                    return;
                }
                this.get_list(1);
            },
            get_init() {
                this.setData({
                    page_ready: false,
                    page_loding_status: 1,
                    page_loding_msg: '',
                });
                uni.request({
                    url: app.globalData.get_request_url('topicinit', 'index', 'sns'),
                    method: 'POST',
                    data: { id: this.topic_id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code != 0) {
                            uni.stopPullDownRefresh();
                            this.setData({
                                page_ready: false,
                                page_loding_status: 0,
                                page_loding_msg: res.data.msg || '',
                            });
                            return;
                        }
                        var data = res.data.data || {};
                        var topic = data.topic || null;
                        var config = data.config || {};
                        var sort_list = data.sort_list || [];
                        var sort = this.normalize_sort(this.sort, sort_list);
                        this.setData({
                            page_ready: true,
                            page_loding_status: 3,
                            topic: topic,
                            config: config,
                            is_share_enable: data.is_share_enable == 1 ? 1 : 0,
                            sort_list: sort_list,
                            sort: sort,
                            data_page: 1,
                            data_list: [],
                            data_bottom_line_status: false,
                            data_bottom_line_msg: '',
                            data_list_loding_status: 1,
                            data_list_loding_msg: '',
                            data_is_loading: 0,
                        });
                        uni.setNavigationBarTitle({ title: this.$t('pages.plugins-sns-topic') });
                        this.update_share_info(topic);
                        this.get_list(1);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            page_ready: false,
                            page_loding_status: 2,
                            page_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            update_share_info(topic) {
                if (!topic || !topic.id) {
                    return;
                }
                var name = topic.name || '';
                var info = {
                    title: name ? '#' + name : this.$t('pages.plugins-sns-topic'),
                    desc: (topic.moment_count || 0) + this.$t('home.topic_moment_count'),
                    path: '/pages/plugins/sns/topic/topic',
                    query: 'id=' + topic.id,
                    img: '',
                };
                this.setData({ share_info: info });
                app.globalData.page_share_handle(info);
            },
            share_event() {
                if (this.$refs.share && this.$refs.share.init) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },
            normalize_sort(sort, sort_list) {
                var list = sort_list || [];
                if (!list.length) {
                    return sort == 'hot' || sort == 'like' ? sort : 'new';
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i] && list[i].value == sort) {
                        return sort;
                    }
                }
                return (list[0] && list[0].value) || 'new';
            },
            get_list(is_mandatory) {
                if (!this.page_ready || this.topic_id <= 0) {
                    return;
                }
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.list_req_seq = (this.list_req_seq || 0) + 1;
                var req_seq = this.list_req_seq;
                var req_sort = this.sort;
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: this.data_list.length > 0 ? 3 : 1,
                });
                uni.request({
                    url: app.globalData.get_request_url('feed', 'index', 'sns'),
                    method: 'POST',
                    data: {
                        page: this.data_page,
                        sort: req_sort,
                        topic: this.topic_id,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (req_seq !== this.list_req_seq || req_sort !== this.sort) {
                            return;
                        }
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            var page_total = data.page_total || 0;
                            var next_page = this.data_page + 1;
                            var no_more = next_page > page_total || data.has_more == 0;
                            this.setData({
                                data_list: temp,
                                data_page: next_page,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_list_loding_msg: temp.length > 0 ? '' : this.$t('common.no_relevant_data_tips'),
                                data_bottom_line_status: temp.length > 0 && no_more,
                                data_bottom_line_msg: data.reach_max == 1 ? this.$t('feed.reach_max') : '',
                                data_is_loading: 0,
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
                        uni.stopPullDownRefresh();
                        if (req_seq !== this.list_req_seq) {
                            return;
                        }
                        this.setData({
                            data_is_loading: 0,
                            data_list_loding_status: this.data_list.length > 0 ? 3 : 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            sort_event(e) {
                var sort = e.currentTarget.dataset.sort || 'new';
                if (sort == this.sort) {
                    this.reload();
                    return;
                }
                this.setData({
                    sort: sort,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_bottom_line_msg: '',
                    data_list_loding_status: 1,
                    data_is_loading: 0,
                });
                this.get_list(1);
            },
            // 参与话题：进发布页（传 id，避免中文经 URL 乱码）
            join_event() {
                var user = app.globalData.get_user_info(this, 'join_event');
                if (user == false) {
                    return;
                }
                var url = '/pages/plugins/sns/moment-form/moment-form';
                if (this.topic_id > 0) {
                    url += '?topic_id=' + this.topic_id;
                }
                app.globalData.url_event({
                    currentTarget: { dataset: { value: url } },
                });
            },
            // 编辑动态
            edit_event(item) {
                if (!item || !item.id) {
                    return;
                }
                app.globalData.url_open('/pages/plugins/sns/moment-form/moment-form?id=' + item.id);
            },
            // 删除动态
            delete_event(item) {
                var self = this;
                if (!item || !item.id) {
                    return;
                }
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('moment.delete_confirm'),
                    success(ret) {
                        if (!ret.confirm) {
                            return;
                        }
                        uni.request({
                            url: app.globalData.get_request_url('delete', 'moment', 'sns'),
                            method: 'POST',
                            data: { ids: item.id },
                            dataType: 'json',
                            success: (res) => {
                                app.globalData.showToast(res.data.msg);
                                if (res.data.code == 0) {
                                    self.reload();
                                }
                            },
                        });
                    },
                });
            },
            like_event(item) {
                var user = app.globalData.get_user_info(this, 'like_event');
                if (user == false || !item || !item.id) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('like', 'index', 'sns'),
                    method: 'POST',
                    data: { moment_id: item.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var list = (this.data_list || []).slice();
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].id == item.id) {
                                    list[i].is_like = res.data.data && res.data.data.is_like == 1 ? 1 : 0;
                                    list[i].like_count = (res.data.data && res.data.data.like_count) || list[i].like_count;
                                    break;
                                }
                            }
                            this.setData({ data_list: list });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                });
            },
            comment_count_event(e) {
                if (!e || !e.item || !e.item.id) {
                    return;
                }
                var list = (this.data_list || []).map((row) => {
                    if (row.id == e.item.id) {
                        return {
                            ...row,
                            comment_count: e.count,
                        };
                    }
                    return row;
                });
                this.setData({ data_list: list });
            },
        },
    };
</script>
<style>
    @import './topic.css';
</style>
