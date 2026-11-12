<template>
    <view :class="theme_view">
        <block v-if="(moment || null) != null">
            <!-- 动态/评论同层左右间距；块间距用 main -->
            <view class="padding-main">
                <component-moment-item :propItem="moment" :propSpacingMb="false" :propShowOwner="true" :propEnableDetail="false" :propShowLike="config.is_enable_like == 1" :propShowComment="false" :propShowCommentPreview="false" :propShowAccess="config.is_show_access_count == 1" @like="like_event" @edit="edit_event" @delete="delete_event" @share="share_event"></component-moment-item>
                <view v-if="moment.show_comment == 1" class="bg-white border-radius-main padding-main margin-top-main">
                    <component-moment-comment
                        ref="comment"
                        :propMomentId="moment.id"
                        :propList="moment.comment_preview || []"
                        :propHasMore="moment.comment_more || 0"
                        :propCommentCount="moment.comment_count || 0"
                        :propEnableLike="config.is_enable_like == 1"
                        :propShowTitle="true"
                        :propShowEmpty="false"
                        :propComposeOpen="true"
                        :propAutoLoad="false"
                        @count-change="count_change_event"
                        @more-change="more_change_event"
                    ></component-moment-comment>
                </view>
            </view>
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
        </block>
        <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentMomentItem from '@/pages/plugins/userhome/components/moment-item/moment-item';
    import componentMomentComment from '@/pages/plugins/userhome/components/moment-comment/moment-comment';
    import componentSharePopup from '@/pages/common/components/share-popup/share-popup';
    import { getUserhomeConfig } from '@/pages/plugins/userhome/utils/compose-cache.js';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';
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
                data_bottom_line_status: false,
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentMomentItem,
            componentMomentComment,
            componentSharePopup,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 设置参数
            this.setData({ params: params || {} });
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 初始化
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 编辑保存返回：与「我的动态」同一标记，仅匹配当前条时重拉详情（不消费标记，留给列表页）
            var refresh = uni.getStorageSync('cache_plugins_userhome_list_refresh') || null;
            if (refresh && refresh.type == 'edit') {
                var rid = parseInt(refresh.id || 0);
                var mid = parseInt((this.moment && this.moment.id) || (this.params && this.params.id) || 0);
                if (rid > 0 && mid > 0 && rid == mid) {
                    this.get_detail();
                }
            }
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.reload();
        },
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-KUAISHOU
        // 分享
        onShareAppMessage() {
            return app.globalData.share_content_handle(this.share_info || {});
        },
        // #endif
        methods: {
            // 初始化
            init() {
                this.get_config();
                this.get_detail();
            },
            // 重新加载
            reload() {
                this.get_config(true);
                this.get_detail();
            },
            // 获取配置（与评论组件共用缓存，避免详情页再打一遍 config）
            get_config(force) {
                getUserhomeConfig(!!force).then((data) => {
                    this.setData({ config: data || {} });
                });
            },
            // 获取详情
            get_detail() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'userhome'),
                    method: 'POST',
                    data: { id: this.params.id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var moment = res.data.data || null;
                            // 还有更多评论时只显示「查看更多」按钮；没有更多才出底线
                            var has_more = moment && moment.show_comment == 1 && moment.comment_more;
                            this.setData({
                                moment: moment,
                                data_list_loding_status: 3,
                                data_bottom_line_status: !has_more,
                            });
                            this.update_share_info(moment);
                        } else {
                            this.setData({
                                moment: null,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                                data_bottom_line_status: false,
                                share_info: {},
                            });
                            app.globalData.page_share_handle({});
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({ data_list_loding_status: 2, data_bottom_line_status: false });
                    },
                });
            },
            // 更新分享信息
            update_share_info(moment) {
                if (!moment) {
                    return;
                }
                var img = '';
                if ((moment.images || []).length > 0) {
                    img = moment.images[0];
                }
                var title = (moment.content || '').replace(/\s+/g, ' ').trim();
                if (title.length > 40) {
                    title = title.substr(0, 40);
                }
                if (!title && moment.user && moment.user.user_name_view) {
                    title = moment.user.user_name_view;
                }
                var info = {
                    title: title || '',
                    desc: moment.content || '',
                    path: '/pages/plugins/userhome/detail/detail',
                    query: 'id=' + moment.id,
                    img: img,
                };
                this.setData({ share_info: info });
                // 分享菜单处理
                app.globalData.page_share_handle(info);
            },
            // 分享
            share_event() {
                if (this.$refs.share && this.$refs.share.init) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },
            // 编辑
            edit_event(item) {
                var row = item || this.moment;
                if (!row || !row.id) {
                    return;
                }
                app.globalData.url_open('/pages/plugins/userhome/moment-form/moment-form?id=' + row.id);
            },
            // 删除
            delete_event(item) {
                var self = this;
                var row = item || this.moment;
                if (!row || !row.id) {
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
                            data: { ids: row.id },
                            dataType: 'json',
                            success: (res) => {
                                app.globalData.showToast(res.data.msg);
                                if (res.data.code == 0) {
                                    uni.setStorageSync('cache_plugins_userhome_home_refresh', 1);
                                    setTimeout(function () {
                                        app.globalData.page_back_prev_event();
                                    }, 1500);
                                }
                            },
                        });
                    },
                });
            },
            // 点赞
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
            // 评论数变更
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
            // 是否还有更多评论
            more_change_event(has_more) {
                this.setData({
                    data_bottom_line_status: !has_more,
                });
            },
        },
    };
</script>
<style scoped>
    @import './detail.css';
</style>
