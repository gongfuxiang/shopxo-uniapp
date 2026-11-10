<template>
    <view :class="theme_view">
        <view class="padding-main">
            <block v-if="data_list.length > 0">
                <component-moment-item v-for="(item, index) in data_list" :key="item.id || index" :propItem="item" :propShowUser="false" :propShowOwner="true" :propEnableDetail="config.is_enable_moment_detail == 1" :propShowLike="config.is_enable_like == 1" :propShowComment="config.is_enable_comment == 1" @like="like_event" @delete="delete_event" @comment-count="comment_count_event"></component-moment-item>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </block>
            <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
        <view class="bottom-fixed" v-if="config.is_enable_moment == 1">
            <view class="bottom-line-exclude padding-main">
                <button class="item cr-white bg-main round text-size wh-auto" type="default" hover-class="none" @tap="publish_event">{{$t('home.publish_moment')}}</button>
            </view>
        </view>
        <component-moment-publish ref="publish" @success="reload"></component-moment-publish>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentMomentItem from '../components/moment-item/moment-item';
    import componentMomentPublish from '../components/moment-publish/moment-publish';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                config: {},
                data_list: [],
                data_page: 1,
                data_page_total: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
            };
        },
        components: { componentCommon, componentNoData, componentBottomLine, componentMomentItem, componentMomentPublish },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.init();
            app.globalData.page_common_on_show(this);
        },
        onReachBottom() {
            this.get_list();
        },
        onPullDownRefresh() {
            this.reload();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    return;
                }
                this.get_config();
                this.reload();
            },
            reload() {
                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_list(1);
            },
            get_config() {
                uni.request({
                    url: app.globalData.get_request_url('config', 'index', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({ config: res.data.data || {} });
                        }
                    },
                });
            },
            get_list(is_mandatory) {
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({ data_is_loading: 1, data_list_loding_status: 1 });
                uni.request({
                    url: app.globalData.get_request_url('index', 'moment', 'userhome'),
                    method: 'POST',
                    data: { page: this.data_page },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            var page_total = data.page_total || 0;
                            var next_page = this.data_page + 1;
                            this.setData({
                                data_list: temp,
                                data_page_total: page_total,
                                data_page: next_page,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_bottom_line_status: next_page > page_total,
                                data_is_loading: 0,
                            });
                        } else {
                            this.setData({
                                data_is_loading: 0,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({ data_is_loading: 0, data_list_loding_status: 2 });
                    },
                });
            },
            like_event(item) {
                var user = app.globalData.get_user_info(this, 'like_event');
                if (user == false || !item || !item.id) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('like', 'index', 'userhome'),
                    method: 'POST',
                    data: { moment_id: item.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var list = (this.data_list || []).map((row) => {
                                if (row.id == item.id) {
                                    return {
                                        ...row,
                                        is_like: res.data.data.is_like,
                                        like_count: res.data.data.like_count,
                                    };
                                }
                                return row;
                            });
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
                            url: app.globalData.get_request_url('delete', 'moment', 'userhome'),
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
            publish_event() {
                if (this.$refs.publish && this.$refs.publish.open) {
                    this.$refs.publish.open();
                }
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
