<template>
    <view :class="theme_view">
        <block v-if="(moment || null) != null">
            <view class="padding-main">
                <component-moment-item :propItem="moment" :propEnableDetail="false" :propShowLike="config.is_enable_like == 1" :propShowComment="false" :propShowCommentPreview="false" :propShowAccess="config.is_show_access_count == 1" @like="like_event"></component-moment-item>
            </view>

            <!-- 与 PC 一致：仅审核通过才展示评价区 -->
            <view v-if="config.is_enable_comment == 1 && moment.show_comment == 1" class="bg-white padding-main">
                <component-moment-comment
                    ref="comment"
                    :propMomentId="moment.id"
                    :propCommentCount="moment.comment_count || 0"
                    :propEnableLike="config.is_enable_like == 1"
                    :propShowTitle="true"
                    :propShowEmpty="true"
                    :propComposeOpen="true"
                    :propAutoLoad="true"
                    @count-change="count_change_event"
                ></component-moment-comment>
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
    import componentMomentItem from '../components/moment-item/moment-item';
    import componentMomentComment from '../components/moment-comment/moment-comment';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                moment: null,
                config: {},
                data_list_loding_status: 1,
                data_list_loding_msg: '',
            };
        },
        components: { componentCommon, componentNoData, componentMomentItem, componentMomentComment },
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
        methods: {
            init() {
                this.get_config();
                this.get_detail();
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
            get_detail() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'userhome'),
                    method: 'POST',
                    data: { id: this.params.id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var moment = res.data.data || null;
                            this.setData({
                                moment: moment,
                                data_list_loding_status: 3,
                            });
                            this.$nextTick(() => {
                                if (moment && moment.show_comment == 1 && this.$refs.comment && this.$refs.comment.reload_comments) {
                                    this.$refs.comment.reload_comments();
                                }
                            });
                        } else {
                            this.setData({
                                moment: null,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        this.setData({ data_list_loding_status: 2 });
                    },
                });
            },
            like_event() {
                var user = app.globalData.get_user_info(this, 'like_event');
                if (user == false || !this.moment) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('like', 'index', 'userhome'),
                    method: 'POST',
                    data: { moment_id: this.moment.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                moment: {
                                    ...this.moment,
                                    is_like: res.data.data.is_like,
                                    like_count: res.data.data.like_count,
                                },
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                });
            },
            count_change_event(count) {
                if (!this.moment) {
                    return;
                }
                this.setData({
                    moment: {
                        ...this.moment,
                        comment_count: count,
                    },
                });
            },
        },
    };
</script>
<style scoped>
</style>
