<template>
    <view :class="theme_view">
        <block v-if="(home || null) != null">
            <view class="home-header spacing-mb" :class="header_class">
                <!-- 自定义背景图层：有图始终渲染；开「风格主题色」时半透明叠在主题色上 -->
                <view v-if="home.cover" class="home-header-bg" :style="'background-image:url(' + home.cover + ');'"></view>
                <view class="home-header-mask"></view>
                <view class="home-header-inner padding-main">
                    <view class="flex-row align-c">
                        <image class="avatar circle" :src="home.avatar" mode="aspectFill"></image>
                        <view class="flex-1 flex-width padding-left-main">
                            <view class="text-size fw-b header-name">{{ home.user_name_view }}</view>
                            <view class="text-size-sm header-sign margin-top-xs">{{ home.signature || $t('home.no_signature') }}</view>
                        </view>
                    </view>

                    <!-- 统计独立一行：关注/粉丝可点进列表，内容类型切 tab -->
                    <view class="flex-row text-size-sm margin-top-main flex-wrap header-stats">
                        <view v-if="home.config.is_show_follow_count == 1" class="stat-item margin-right-main" data-type="follow" @tap="stat_follow_event">
                            <text>{{ $t('home.follow') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.follow_count }}</text>
                        </view>
                        <view v-if="home.config.is_show_fans_count == 1" class="stat-item margin-right-main" data-type="fans" @tap="stat_follow_event">
                            <text>{{ $t('home.fans') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.fans_count }}</text>
                        </view>
                        <view v-if="home.config.is_support_moment == 1" class="stat-item margin-right-main" data-type="moment" @tap="stat_tab_event">
                            <text>{{ $t('home.moment') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.moment_count }}</text>
                        </view>
                        <view v-if="home.config.is_support_blog == 1" class="stat-item margin-right-main" data-type="blog" @tap="stat_tab_event">
                            <text>{{ $t('home.blog') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.blog_count }}</text>
                        </view>
                        <view v-if="home.config.is_support_ask == 1" class="stat-item margin-right-main" data-type="ask" @tap="stat_tab_event">
                            <text>{{ $t('home.ask') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.ask_count }}</text>
                        </view>
                        <view v-if="home.config.is_support_video == 1" class="stat-item" data-type="video" @tap="stat_tab_event">
                            <text>{{ $t('home.video') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.video_count }}</text>
                        </view>
                    </view>

                    <view class="margin-top-main flex-row align-c flex-wrap">
                        <view v-if="home.is_share_enable == 1" class="action-icon margin-right-sm" @tap="share_event">
                            <iconfont name="icon-share" size="36rpx" :color="header_icon_color"></iconfont>
                        </view>
                        <block v-if="home.is_self == 1">
                            <view class="action-icon margin-right-sm" @tap="profile_event">
                                <iconfont name="icon-user-setup" size="36rpx" :color="header_icon_color"></iconfont>
                            </view>
                            <view class="action-icon margin-right-sm" @tap="theme_open_event">
                                <iconfont name="icon-theme" size="36rpx" :color="header_icon_color"></iconfont>
                            </view>
                            <button class="round text-size-sm margin-right-sm" type="default" size="mini" hover-class="none" data-value="/pages/plugins/userhome/list/list" @tap="url_event">{{ $t('feed.my_moment') }}</button>
                        </block>
                        <button v-else-if="home.config.is_enable_follow == 1" class="round text-size-sm" type="default" size="mini" hover-class="none" @tap="follow_event">{{ home.is_follow == 1 ? $t('home.unfollow') : $t('home.follow') }}</button>
                    </view>
                </view>
            </view>

            <view v-if="home.is_self == 1 && home.config.is_enable_moment == 1" class="padding-horizontal-main spacing-mb">
                <component-moment-publish :propInline="true" @success="publish_success_event"></component-moment-publish>
            </view>

            <view v-if="(home.tabs || []).length > 0" class="bg-white flex-row tc text-size-sm br-b-f5">
                <view v-for="(tab, ti) in home.tabs" :key="ti" class="flex-1 padding-vertical-main" :class="content_type == tab.type ? 'cr-main fw-b' : ''" :data-type="tab.type" @tap="tab_event">{{ tab.name }}</view>
            </view>

            <view class="padding-main">
                <block v-if="data_list.length > 0">
                    <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main spacing-mb">
                        <block v-if="content_type == 'moment'">
                            <view class="cp" :data-value="'/pages/plugins/userhome/detail/detail?id=' + item.id" @tap="url_event">
                                <view>{{ item.content }}</view>
                                <view v-if="(item.images || []).length > 0" class="flex-row flex-wrap margin-top-sm">
                                    <image v-for="(img, ii) in item.images" :key="ii" class="moment-img radius margin-right-xs margin-bottom-xs" :src="img" mode="aspectFill"></image>
                                </view>
                                <view v-if="item.video_url" class="margin-top-sm">
                                    <video class="wh-auto radius" style="height: 320rpx;" :src="item.video_url" controls></video>
                                </view>
                                <view class="text-size-xs cr-grey-9 margin-top-sm">{{ item.add_time_text || item.add_time }} <text v-if="item.audit_status != 2">· {{ item.audit_status_name }}</text></view>
                            </view>
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

        <!-- 主题风格弹窗 -->
        <component-popup :propShow="theme_popup" propPosition="bottom" @onclose="theme_close_event">
            <view class="theme-popup bg-white" @tap.stop="">
                <view class="flex-row jc-sb align-c padding-main br-b-e">
                    <view class="text-size fw-b">{{ $t('home.theme_switch') }}</view>
                    <view @tap.stop="theme_close_event">
                        <iconfont name="icon-close-line" color="#333" size="28rpx"></iconfont>
                    </view>
                </view>
                <view class="padding-main">
                    <view class="flex-row flex-wrap">
                        <view
                            v-for="(th, ti) in theme_list"
                            :key="th.value || ti"
                            class="theme-item margin-right-sm margin-bottom-sm"
                            :class="current_theme == th.value ? 'active' : ''"
                            :data-theme="th.value"
                            @tap="theme_save_event"
                        >
                            <view class="theme-preview" :class="'preview-' + th.value"></view>
                            <view class="text-size-xs tc margin-top-xs">{{ th.name }}</view>
                        </view>
                    </view>
                    <view class="margin-top-main br-t-e padding-top-main">
                        <view class="text-size-sm fw-b margin-bottom-sm">{{ $t('home.cover_upload') }}</view>
                        <view class="flex-row align-c">
                            <!-- 点击图区域直接重选上传；预览/删除用角标，避免点图只能预览、还要先叉掉才能传 -->
                            <view class="cover-box pr margin-right-main" @tap="cover_choose_event">
                                <image v-if="cover_url" class="cover-img radius" :src="cover_url" mode="aspectFill" :show-menu-by-longpress="false"></image>
                                <view v-else class="cover-img radius flex-row align-c jc-c bg-grey-e">
                                    <iconfont name="icon-add" size="40rpx" color="#999"></iconfont>
                                </view>
                                <view v-if="cover_url" class="cover-preview-mask pa flex-row align-c jc-c" @tap.stop="cover_preview_event">
                                    <iconfont name="icon-eye" size="36rpx" color="#fff"></iconfont>
                                </view>
                                <view v-if="cover_url" class="cover-del pa flex-row align-c jc-c" @tap.stop="cover_clear_event">
                                    <iconfont name="icon-close-line" size="24rpx" color="#666"></iconfont>
                                </view>
                            </view>
                            <view class="flex-1 flex-width">
                                <view class="flex-row align-c" @tap="cover_theme_color_event">
                                    <iconfont :name="is_cover_theme_color == 1 ? 'icon-selected-solid' : 'icon-not-selected'" size="40rpx" :color="is_cover_theme_color == 1 ? theme_color : '#999'"></iconfont>
                                    <text class="text-size-sm margin-left-sm">{{ $t('home.cover_overlay') }}</text>
                                </view>
                                <view v-if="cover_audit_tip" class="text-size-xs cr-yellow margin-top-xs">{{ cover_audit_tip }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>

        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPopup from '@/components/popup/popup';
    import componentSharePopup from '@/pages/common/components/share-popup/share-popup';
    import componentMomentPublish from '../components/moment-publish/moment-publish';
    import pluginLocale from '../locale/index.js';
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
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
                theme_popup: false,
                current_theme: 'classic',
                theme_list: [],
                cover_url: '',
                cover_path_type: '',
                is_cover_theme_color: 1,
                cover_audit_tip: '',
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentPopup,
            componentSharePopup,
            componentMomentPublish,
        },
        computed: {
            header_class() {
                var home = this.home || {};
                var list = ['theme-' + (home.theme_style || 'classic')];
                if (home.cover) {
                    list.push('has-cover');
                }
                // 默认开主题色叠图；关闭后纯背景图
                if (!home.cover || home.is_cover_theme_color == 1) {
                    list.push('cover-theme-color');
                }
                return list.join(' ');
            },
            header_icon_color() {
                var home = this.home || {};
                var style = home.theme_style || 'classic';
                // 纯背景图、深色/封面主题：用浅色图标
                if (home.cover && home.is_cover_theme_color != 1) {
                    return '#fff';
                }
                if (style == 'dark' || style == 'cover' || style == 'gradient') {
                    return '#fff';
                }
                return '#333';
            },
        },
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
        // #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ || MP-TOUTIAO || MP-KUAISHOU
        onShareAppMessage() {
            return app.globalData.share_content_handle(this.share_info || {});
        },
        // #endif
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
                                current_theme: (home && home.theme_style) || 'classic',
                                theme_list: (home && home.theme_style_list) || [],
                                cover_url: (home && home.cover) || '',
                                is_cover_theme_color: home && home.is_cover_theme_color == 0 ? 0 : 1,
                                cover_audit_tip: this.build_cover_audit_tip(home),
                            });
                            this.update_share_info(home);
                            if (content_type) {
                                this.setData({ data_page: 1, data_list: [], data_bottom_line_status: false });
                                this.get_content_list(1);
                            }
                            if (home && home.is_self == 1) {
                                this.load_cover_path();
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
            build_cover_audit_tip(home) {
                if (!home || home.is_self != 1) {
                    return '';
                }
                if (home.cover_audit_status == 0) {
                    return this.$t('home.cover_audit_pending');
                }
                if (home.cover_audit_status == 3) {
                    var tip = this.$t('home.cover_audit_reject');
                    return home.cover_reject_reason ? tip + '：' + home.cover_reject_reason : tip;
                }
                return '';
            },
            load_cover_path() {
                uni.request({
                    url: app.globalData.get_request_url('profilesaveinfo', 'index', 'userhome'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data && res.data.code == 0 && res.data.data) {
                            this.cover_path_type = res.data.data.cover_path_type || '';
                        }
                    },
                });
            },
            update_share_info(home) {
                if (!home) {
                    return;
                }
                var info = {
                    title: home.user_name_view || '',
                    desc: home.signature || this.$t('home.no_signature'),
                    path: '/pages/plugins/userhome/home/home',
                    query: 'uid=' + home.user_id,
                    img: home.avatar || '',
                };
                this.share_info = info;
                app.globalData.page_share_handle(info);
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
            stat_tab_event(e) {
                this.tab_event(e);
            },
            stat_follow_event(e) {
                if (!this.home) {
                    return;
                }
                var type = (e.currentTarget.dataset.type || 'follow') == 'fans' ? 'fans' : 'follow';
                var can = type == 'fans' ? this.home.can_view_fans_list == 1 : this.home.can_view_follow_list == 1;
                if (!can) {
                    app.globalData.showToast(this.$t('home.follow_list_deny_tips'));
                    return;
                }
                app.globalData.url_event({
                    currentTarget: {
                        dataset: {
                            value: '/pages/plugins/userhome/follow-list/follow-list?uid=' + this.home.user_id + '&type=' + type,
                        },
                    },
                });
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
            share_event() {
                if (this.$refs.share && this.$refs.share.init) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },
            profile_event() {
                var user = app.globalData.get_user_info(this, 'profile_event');
                if (user == false) {
                    return;
                }
                app.globalData.url_event({
                    currentTarget: {
                        dataset: { value: '/pages/plugins/userhome/profile-edit/profile-edit' },
                    },
                });
            },
            theme_open_event() {
                var user = app.globalData.get_user_info(this, 'theme_open_event');
                if (user == false) {
                    return;
                }
                this.theme_popup = true;
            },
            theme_close_event() {
                this.theme_popup = false;
            },
            theme_save_event(e) {
                var theme = e.currentTarget.dataset.theme || '';
                if (!theme || theme == this.current_theme) {
                    return;
                }
                uni.request({
                    url: app.globalData.get_request_url('themesave', 'index', 'userhome'),
                    method: 'POST',
                    data: { theme_style: theme },
                    dataType: 'json',
                    success: (res) => {
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            this.current_theme = theme;
                            if (this.home) {
                                this.home = Object.assign({}, this.home, { theme_style: theme });
                            }
                        }
                    },
                });
            },
            cover_choose_event() {
                var self = this;
                uni.chooseImage({
                    count: 1,
                    success(res) {
                        var path = (res.tempFilePaths || [])[0];
                        if (!path) {
                            return;
                        }
                        uni.showLoading({ title: self.$t('common.uploading_wait_moment'), mask: true });
                        uni.uploadFile({
                            url: app.globalData.get_request_url('index', 'ueditor'),
                            filePath: path,
                            name: 'upfile',
                            formData: {
                                action: 'uploadimage',
                                path_type: self.cover_path_type || '',
                            },
                            complete: () => {
                                uni.hideLoading();
                            },
                            success: (up) => {
                                var result = typeof up.data == 'object' ? up.data : JSON.parse(up.data || '{}');
                                if (up.statusCode == 200 && result.code == 0 && result.data && result.data.url) {
                                    self.cover_save(result.data.url);
                                } else {
                                    app.globalData.showToast((result && result.msg) || self.$t('common.sub_error_retry_tips'));
                                }
                            },
                            fail: () => {
                                app.globalData.showToast(self.$t('common.internet_error_tips'));
                            },
                        });
                    },
                });
            },
            cover_preview_event() {
                if (!this.cover_url) {
                    return;
                }
                uni.previewImage({
                    current: this.cover_url,
                    urls: [this.cover_url],
                });
            },
            cover_clear_event() {
                this.cover_save('');
            },
            cover_theme_color_event() {
                var flag = this.is_cover_theme_color == 1 ? 0 : 1;
                uni.request({
                    url: app.globalData.get_request_url('coversave', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        only_theme_color: 1,
                        is_cover_theme_color: flag,
                    },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.is_cover_theme_color = flag;
                            if (this.home) {
                                this.home = Object.assign({}, this.home, { is_cover_theme_color: flag });
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                });
            },
            cover_save(url) {
                uni.request({
                    url: app.globalData.get_request_url('coversave', 'index', 'userhome'),
                    method: 'POST',
                    data: {
                        cover: url || '',
                        is_cover_theme_color: this.is_cover_theme_color,
                    },
                    dataType: 'json',
                    success: (res) => {
                        app.globalData.showToast(res.data.msg);
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.cover_url = data.cover || '';
                            this.is_cover_theme_color = data.is_cover_theme_color == 0 ? 0 : 1;
                            if (this.home) {
                                this.home = Object.assign({}, this.home, {
                                    cover: this.cover_url,
                                    is_cover_theme_color: this.is_cover_theme_color,
                                    cover_audit_status: data.cover_audit_status,
                                });
                                this.cover_audit_tip = this.build_cover_audit_tip(this.home);
                            }
                        }
                    },
                });
            },
            publish_success_event() {
                this.reload();
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    .home-header {
        position: relative;
        overflow: hidden;
        background: #f7f8fa;
        color: #333;
    }
    .home-header-bg,
    .home-header-mask {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 0;
    }
    .home-header-bg {
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        opacity: 0;
    }
    .home-header.has-cover .home-header-bg {
        opacity: 1;
    }
    /* 开「风格主题色」：压低图片，透出主题色 */
    .home-header.has-cover.cover-theme-color.theme-classic .home-header-bg {
        opacity: 0.18;
    }
    .home-header.has-cover.cover-theme-color.theme-cover .home-header-bg {
        opacity: 0.38;
    }
    .home-header.has-cover.cover-theme-color.theme-gradient .home-header-bg {
        opacity: 0.28;
    }
    .home-header.has-cover.cover-theme-color.theme-dark .home-header-bg {
        opacity: 0.32;
    }
    .home-header.has-cover.cover-theme-color.theme-warm .home-header-bg {
        opacity: 0.28;
    }
    .home-header.has-cover.cover-theme-color.theme-mint .home-header-bg {
        opacity: 0.28;
    }
    /* 关「风格主题色」：纯背景图 */
    .home-header.has-cover:not(.cover-theme-color) {
        background: #2a2a2a !important;
        color: #fff;
    }
    .home-header.has-cover:not(.cover-theme-color) .home-header-bg {
        opacity: 1 !important;
    }
    .home-header.has-cover:not(.cover-theme-color) .home-header-mask {
        display: block !important;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.42) 100%);
    }
    .home-header.theme-classic {
        background: #fff;
    }
    .home-header.theme-classic.cover-theme-color .home-header-mask,
    .home-header.theme-classic:not(.has-cover) .home-header-mask {
        display: none;
    }
    .home-header.theme-cover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
    }
    .home-header.theme-cover .home-header-mask {
        background: linear-gradient(180deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.5) 100%);
    }
    .home-header.theme-gradient {
        background: linear-gradient(120deg, #e0f7fa 0%, #e3f2fd 45%, #f3e5f5 100%);
    }
    .home-header.theme-gradient .home-header-mask {
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.15) 100%);
    }
    .home-header.theme-dark {
        background: #1f2329;
        color: #fff;
    }
    .home-header.theme-dark .home-header-mask {
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.35) 100%);
    }
    .home-header.theme-warm {
        background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
    }
    .home-header.theme-warm .home-header-mask {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(250, 177, 160, 0.25) 100%);
    }
    .home-header.theme-mint {
        background: linear-gradient(135deg, #55efc4 0%, #81ecec 100%);
    }
    .home-header.theme-mint .home-header-mask {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(129, 236, 236, 0.2) 100%);
    }
    .home-header-inner {
        position: relative;
        z-index: 1;
    }
    .header-sign {
        opacity: 0.85;
    }
    .stat-item {
        padding: 8rpx 0;
    }
    .action-icon {
        width: 64rpx;
        height: 64rpx;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .avatar {
        width: 120rpx;
        height: 120rpx;
        flex-shrink: 0;
        border: 4rpx solid rgba(255, 255, 255, 0.7);
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
    .theme-popup {
        border-radius: 24rpx 24rpx 0 0;
        overflow: hidden;
        max-height: 75vh;
    }
    .theme-item {
        width: 140rpx;
    }
    .theme-item.active .theme-preview {
        box-shadow: 0 0 0 4rpx var(--color-main, #e22c08);
    }
    .theme-preview {
        width: 140rpx;
        height: 80rpx;
        border-radius: 12rpx;
    }
    .preview-classic {
        background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
    }
    .preview-cover {
        background: #2f3542;
    }
    .preview-gradient {
        background: linear-gradient(135deg, #74b9ff 0%, #a29bfe 100%);
    }
    .preview-dark {
        background: #1e272e;
    }
    .preview-warm {
        background: linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%);
    }
    .preview-mint {
        background: linear-gradient(135deg, #55efc4 0%, #81ecec 100%);
    }
    .cover-box {
        width: 160rpx;
        height: 100rpx;
        flex-shrink: 0;
    }
    .cover-img {
        width: 160rpx;
        height: 100rpx;
        display: block;
        pointer-events: none;
    }
    .cover-preview-mask {
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 1;
        background: rgba(0, 0, 0, 0.35);
        border-radius: 12rpx;
    }
    .cover-del {
        top: -12rpx;
        right: -12rpx;
        z-index: 3;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        background: #fff;
        border: 2rpx solid #e5e5e5;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.18);
        box-sizing: border-box;
    }
</style>
