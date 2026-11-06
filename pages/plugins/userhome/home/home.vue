<template>
    <view :class="theme_view">
        <block v-if="(home || null) != null">
            <view class="padding-main bg-white spacing-mb">
                <view class="flex-row">
                    <image class="avatar circle" :src="home.avatar" mode="aspectFill"></image>
                    <view class="flex-1 flex-width padding-left-main">
                        <view class="text-size fw-b">{{ home.user_name_view }}</view>
                        <view class="text-size-sm cr-grey-9 margin-top-xs">{{ home.signature || $t('home.no_signature') }}</view>
                        <view class="flex-row text-size-sm margin-top-sm flex-wrap">
                            <text class="margin-right-main">{{$t('home.follow')}} {{ home.follow_count }}</text>
                            <text class="margin-right-main">{{$t('home.fans')}} {{ home.fans_count }}</text>
                            <text v-if="home.config.is_support_moment == 1" class="margin-right-main">{{$t('home.moment')}} {{ home.moment_count }}</text>
                            <text v-if="home.config.is_support_blog == 1" class="margin-right-main">{{$t('home.blog')}} {{ home.blog_count }}</text>
                            <text v-if="home.config.is_support_ask == 1" class="margin-right-main">{{$t('home.ask')}} {{ home.ask_count }}</text>
                            <text v-if="home.config.is_support_video == 1">{{$t('home.video')}} {{ home.video_count }}</text>
                        </view>
                    </view>
                </view>
                <view class="margin-top-main flex-row">
                    <button v-if="home.is_self != 1" class="round text-size-sm" type="default" size="mini" hover-class="none" @tap="follow_event">{{ home.is_follow == 1 ? $t('home.unfollow') : $t('home.follow') }}</button>
                    <button v-if="home.is_self == 1 && home.config.is_enable_moment == 1" class="round text-size-sm margin-left-sm cr-main br-main bg-white" type="default" size="mini" hover-class="none" data-value="/pages/plugins/userhome/moment-form/moment-form" @tap="url_event">{{$t('home.publish_moment')}}</button>
                    <button class="round text-size-sm margin-left-sm" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/userhome/follow-list/follow-list?uid=' + home.user_id + '&type=follow'" @tap="url_event">{{$t('home.follow')}}</button>
                    <button class="round text-size-sm margin-left-sm" type="default" size="mini" hover-class="none" :data-value="'/pages/plugins/userhome/follow-list/follow-list?uid=' + home.user_id + '&type=fans'" @tap="url_event">{{$t('home.fans')}}</button>
                </view>
            </view>

            <view v-if="(home.tabs || []).length > 0" class="bg-white flex-row tc text-size-sm br-b-f5">
                <view v-for="(tab, ti) in home.tabs" :key="ti" class="flex-1 padding-vertical-main" :class="content_type == tab.type ? 'cr-main fw-b' : ''" :data-type="tab.type" @tap="tab_event">{{ tab.name }}</view>
            </view>

            <view class="padding-main">
                <block v-if="data_list.length > 0">
                    <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main spacing-mb">
                        <block v-if="content_type == 'moment'">
                            <view>{{ item.content }}</view>
                            <view v-if="(item.images || []).length > 0" class="flex-row flex-wrap margin-top-sm">
                                <image v-for="(img, ii) in item.images" :key="ii" class="moment-img radius margin-right-xs margin-bottom-xs" :src="img" mode="aspectFill"></image>
                            </view>
                            <view class="text-size-xs cr-grey-9 margin-top-sm">{{ item.add_time }} <text v-if="item.audit_status != 2">· {{ item.audit_status_name }}</text></view>
                        </block>
                        <block v-else-if="content_type == 'blog'">
                            <view class="cp" :data-value="item.url" @tap="url_event">{{ item.title }}</view>
                            <view class="text-size-xs cr-grey-9 margin-top-xs">{{ item.add_time }}</view>
                        </block>
                        <block v-else-if="content_type == 'ask'">
                            <view class="cp" :data-value="item.url" @tap="url_event">{{ item.title }}</view>
                            <view class="text-size-xs cr-grey-9 margin-top-xs">{{ item.add_time_time }}</view>
                        </block>
                        <block v-else-if="content_type == 'video'">
                            <view class="flex-row cp" :data-value="item.url" @tap="url_event">
                                <image v-if="item.cover" class="video-cover radius margin-right-sm" :src="item.cover" mode="aspectFill"></image>
                                <view class="flex-1 flex-width">{{ item.title }}</view>
                            </view>
                        </block>
                    </view>
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </block>
                <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </block>
        <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                home: null,
                content_type: '',
                data_list: [],
                data_page: 1,
                data_total: 0,
                data_page_total: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_is_loading: 0,
            };
        },
        components: { componentCommon, componentNoData, componentBottomLine },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            this.setData({ params: params || {} });
            app.globalData.page_event_onload_handle(params);
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.init();
            app.globalData.page_common_on_show(this);
        },
        onReachBottom() {
            this.get_content_list();
        },
        onPullDownRefresh() {
            this.reload();
        },
        methods: {
            init() {
                this.get_home();
            },
            reload() {
                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                this.get_home();
            },
            get_home() {
                uni.request({
                    url: app.globalData.get_request_url('home', 'index', 'userhome'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var home = res.data.data || null;
                            var content_type = this.content_type || this.params.type || '';
                            if (!content_type && home && (home.tabs || []).length > 0) {
                                content_type = home.tabs[0].type;
                            }
                            this.setData({
                                home: home,
                                content_type: content_type,
                                data_list_loding_status: 3,
                            });
                            if (content_type) {
                                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                                this.get_content_list(1);
                            }
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({ data_list_loding_status: 2 });
                    },
                });
            },
            get_content_list(is_mandatory) {
                if (!this.content_type || !this.home) {
                    return;
                }
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({ data_is_loading: 1 });
                uni.request({
                    url: app.globalData.get_request_url('content', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        uid: this.home.user_id,
                        type: this.content_type,
                        page: this.data_page,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var list = data.data || [];
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            this.setData({
                                data_list: temp,
                                data_total: data.total || 0,
                                data_page_total: data.page_total || 0,
                                data_page: this.data_page + 1,
                                data_list_loding_status: temp.length > 0 ? 3 : 0,
                                data_bottom_line_status: this.data_page > (data.page_total || 0),
                                data_is_loading: 0,
                            });
                        } else {
                            this.setData({ data_is_loading: 0, data_list_loding_status: 0, data_list_loding_msg: res.data.msg });
                        }
                    },
                    fail: () => {
                        this.setData({ data_is_loading: 0, data_list_loding_status: 2 });
                    },
                });
            },
            tab_event(e) {
                var type = e.currentTarget.dataset.type || '';
                if (!type || type == this.content_type) {
                    return;
                }
                this.setData({
                    content_type: type,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                });
                this.get_content_list(1);
            },
            follow_event() {
                var user = app.globalData.get_user_info(this, 'follow_event');
                if (user == false) {
                    return false;
                }
                var action = this.home.is_follow == 1 ? 'unfollow' : 'follow';
                uni.request({
                    url: app.globalData.get_request_url(action, 'index', 'userhome'),
                    method: 'POST',
                    data: { uid: this.home.user_id },
                    dataType: 'json',
                    success: (res) => {
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            this.get_home();
                        }
                    },
                });
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    .avatar {
        width: 120rpx;
        height: 120rpx;
        flex-shrink: 0;
    }
    .moment-img {
        width: 200rpx;
        height: 200rpx;
    }
    .video-cover {
        width: 100rpx;
        height: 130rpx;
        flex-shrink: 0;
    }
</style>
