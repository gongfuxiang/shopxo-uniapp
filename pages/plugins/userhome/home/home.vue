<template>
    <view :class="theme_view">
        <!-- 公共返回：固定顶栏，不随内容滚动（同秒杀/优惠券） -->
        <!-- z-i-deep-middle：高于头区内层，避免返回键被封面/头区挡住 -->
        <component-nav-back propClass="z-i-deep-middle" :propColor="nav_back_color" :propIsRightSlot="false" :propName="nav_back_title" :propNameOpacity="true"></component-nav-back>

        <!-- 首屏：home 完成前整页加载 -->
        <block v-if="!page_ready">
            <component-no-data :propStatus="page_loding_status" :propMsg="page_loding_msg"></component-no-data>
        </block>

        <block v-else-if="(home || null) != null">
            <view class="home-header spacing-mb" :class="header_class">
                <!-- 自定义背景图层：有图始终渲染；开「风格主题色」时半透明叠在主题色上 -->
                <view v-if="home.cover" class="home-header-bg" :style="'background-image:url(' + home.cover + ');'"></view>
                <view class="home-header-mask"></view>
                <view class="home-header-inner padding-horizontal-main padding-bottom-main" :style="header_inner_style">
                    <view class="flex-row align-c">
                        <image class="avatar circle" :src="home.avatar" mode="aspectFill"></image>
                        <view class="flex-1 flex-width padding-left-main">
                            <view class="text-size fw-b header-name">{{ home.user_name_view }}</view>
                            <view class="text-size-sm header-sign margin-top-xs">{{ home.signature || $t('home.no_signature') }}</view>
                        </view>
                    </view>

                    <!-- 统计独立一行：关注/粉丝可点进列表，内容类型切 tab -->
                    <view class="flex-row text-size-sm margin-top-main flex-wrap header-stats">
                        <view
                            v-if="home.config.is_show_follow_count == 1"
                            class="stat-item margin-right-main"
                            :class="home.can_view_follow_list == 1 ? '' : 'stat-item-disabled'"
                            data-type="follow"
                            @tap="stat_follow_event"
                        >
                            <text>{{ $t('home.follow') }}</text>
                            <text class="fw-b margin-left-xs">{{ home.follow_count }}</text>
                        </view>
                        <view
                            v-if="home.config.is_show_fans_count == 1"
                            class="stat-item margin-right-main"
                            :class="home.can_view_fans_list == 1 ? '' : 'stat-item-disabled'"
                            data-type="fans"
                            @tap="stat_follow_event"
                        >
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

                    <view class="margin-top-main flex-row align-c header-actions">
                        <view class="flex-row align-c flex-1 flex-width">
                            <view v-if="home.is_share_enable == 1" class="action-icon margin-right-sm" @tap="share_event">
                                <iconfont name="icon-share" size="36rpx" :color="header_icon_color"></iconfont>
                            </view>
                            <block v-if="home.is_self == 1">
                                <view class="action-icon margin-right-sm" @tap="profile_event">
                                    <iconfont name="icon-user-setup" size="36rpx" :color="header_icon_color"></iconfont>
                                </view>
                                <view class="action-icon" @tap="theme_open_event">
                                    <iconfont name="icon-theme" size="36rpx" :color="header_icon_color"></iconfont>
                                </view>
                            </block>
                        </view>
                        <button v-if="home.is_self == 1" class="round text-size-sm header-action-btn" type="default" size="mini" hover-class="none" data-value="/pages/plugins/userhome/list/list" @tap="url_event">{{ $t('feed.my_moment') }}</button>
                        <button v-else-if="home.config.is_enable_follow == 1" class="round text-size-sm header-action-btn" type="default" size="mini" hover-class="none" :loading="follow_loading == 1" :disabled="follow_loading == 1" @tap="follow_event">{{ home.is_follow == 1 ? $t('home.unfollow') : $t('home.follow') }}</button>
                    </view>
                </view>
            </view>

            <view v-if="home.is_self == 1 && home.config.is_enable_moment == 1" class="padding-horizontal-main spacing-mb">
                <component-moment-publish :propInline="true" @success="publish_success_event"></component-moment-publish>
            </view>

            <view v-if="home.tabs && home.tabs.length > 0" class="nav-tabs bg-white" :style="'--tab-line-color:' + theme_color">
                <view class="tabs-scroll-content">
                    <view v-for="(tab, ti) in home.tabs" :key="ti" class="tab-item" :class="{ active: content_type == tab.type }" :data-type="tab.type" @tap="tab_event">{{ tab.name }}</view>
                </view>
            </view>

            <view class="padding-main">
                <block v-if="data_list.length > 0">
                    <block v-if="content_type == 'moment'">
                        <component-moment-item
                            v-for="(item, index) in data_list"
                            :key="index"
                            :propItem="item"
                            :propShowUser="false"
                            :propShowOwner="home.is_self == 1"
                            :propEnableDetail="home.config.is_enable_moment_detail == 1"
                            :propShowLike="home.config.is_enable_like == 1"
                            :propShowComment="home.config.is_enable_comment == 1"
                            :propShowAccess="home.config.is_show_access_count == 1"
                            @like="like_event"
                            @edit="edit_event"
                            @delete="delete_event"
                            @comment-count="comment_count_event"
                        ></component-moment-item>
                    </block>
                    <block v-else>
                        <view v-for="(item, index) in data_list" :key="index" class="bg-white border-radius-main padding-main spacing-mb">
                            <block v-if="content_type == 'blog'">
                                <view class="flex-row cp" :data-value="item.url" @tap="url_event">
                                    <image v-if="item.cover" class="blog-cover radius margin-right-sm" :src="item.cover" mode="aspectFill"></image>
                                    <view class="flex-1 flex-width">
                                        <view class="text-line-2">{{ item.title }}</view>
                                        <view class="flex-row align-c text-size-xs cr-grey-9 margin-top-xs">
                                            <text>{{ item.add_time }}</text>
                                            <view v-if="home.config.is_show_access_count == 1" class="flex-row align-c margin-left-main">
                                                <iconfont name="icon-eye" size="24rpx" color="#999" propClass="va-m"></iconfont>
                                                <text class="margin-left-xs">{{ item.access_count || 0 }}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                            <block v-else-if="content_type == 'ask'">
                                <view class="cp" :data-value="item.url" @tap="url_event">
                                    <view>{{ item.title }}</view>
                                    <view class="flex-row align-c text-size-xs cr-grey-9 margin-top-xs">
                                        <text>{{ item.add_time_time || item.add_time }}</text>
                                        <view v-if="home.config.is_show_access_count == 1" class="flex-row align-c margin-left-main">
                                            <iconfont name="icon-eye" size="24rpx" color="#999" propClass="va-m"></iconfont>
                                            <text class="margin-left-xs">{{ item.access_count || 0 }}</text>
                                        </view>
                                    </view>
                                </view>
                            </block>
                            <block v-else-if="content_type == 'video'">
                                <view class="flex-row cp" :data-value="item.url" @tap="url_event">
                                    <view class="video-cover-wrap radius margin-right-sm">
                                        <image v-if="item.cover" class="video-cover" :src="item.cover" mode="aspectFill"></image>
                                        <view v-else class="video-cover video-cover-empty"></view>
                                        <view class="video-play-icon flex-row align-c jc-c">
                                            <iconfont name="icon-bofang" size="40rpx" color="#fff"></iconfont>
                                        </view>
                                    </view>
                                    <view class="flex-1 flex-width">
                                        <view class="text-line-2">{{ item.title }}</view>
                                        <view class="flex-row align-c text-size-xs cr-grey-9 margin-top-xs">
                                            <text>{{ item.add_time_date || item.add_time }}</text>
                                            <view v-if="home.config.is_show_access_count == 1" class="flex-row align-c margin-left-main">
                                                <iconfont name="icon-eye" size="24rpx" color="#999" propClass="va-m"></iconfont>
                                                <text class="margin-left-xs">{{ item.access_count || 0 }}</text>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </block>
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </block>
                <component-no-data v-else :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg" :propLoadingLogoTop="list_loading_logo_top"></component-no-data>
            </view>
        </block>

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
                    <view class="theme-list">
                        <view
                            v-for="(th, ti) in theme_list"
                            :key="ti"
                            class="theme-item"
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
                                <view v-else class="cover-empty radius bg-grey-e">
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
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentPopup from '@/components/popup/popup';
    import componentSharePopup from '@/pages/common/components/share-popup/share-popup';
    import componentMomentPublish from '@/pages/plugins/userhome/components/moment-publish/moment-publish';
    import componentMomentItem from '@/pages/plugins/userhome/components/moment-item/moment-item';
    import { getUserhomeConfig } from '@/pages/plugins/userhome/utils/compose-cache.js';
    import pluginLocale from '@/pages/plugins/userhome/locale/index.js';

    // 状态栏高度（固定顶栏下内容偏移）
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO || H5
    bar_height = 0;
    // #endif
    export default {
        mixins: [pluginLocale],
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                status_bar_height: bar_height,
                nav_opacity: 0,
                params: {},
                page_ready: false,
                page_loding_status: 1,
                page_loding_msg: '',
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
                follow_loading: 0,
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentBottomLine,
            componentPopup,
            componentSharePopup,
            componentMomentPublish,
            componentMomentItem,
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
                // 纯背景图（关风格主题色）：浅色图标
                if (home.cover && home.is_cover_theme_color != 1) {
                    return '#fff';
                }
                // 深色/封面沉浸底色深：浅色图标；清新渐变等浅色主题用深色
                if (style == 'dark' || style == 'cover') {
                    return '#fff';
                }
                return '#333';
            },
            // 滚动后顶栏变白，箭头改深色
            nav_back_color() {
                if (this.nav_opacity > 0.3) {
                    return '#333';
                }
                return this.header_icon_color;
            },
            // 默认不显示；滚动顶栏变白后再出标题，避免与头区昵称重复
            nav_back_title() {
                if (!this.page_ready || !this.home || this.nav_opacity <= 0.3) {
                    return '';
                }
                return this.home.user_name_view || '';
            },
            // 固定顶栏下给头区内容留空
            header_inner_style() {
                var top = (this.status_bar_height || 0) + 44;
                return 'padding-top:' + top + 'px;';
            },
            // 相对视口高度下移；有发布框时略大
            list_loading_logo_top() {
                var home = this.home || {};
                var cfg = home.config || {};
                if (home.is_self == 1 && cfg.is_enable_moment == 1) {
                    return '65vh';
                }
                return '40vh';
            },
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);
            // 设置参数
            this.setData({
                params: params || {},
            });
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
            // 初始化
            this.init();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();
            // 公共onshow事件（$refs 未就绪时自动延后重试）
            app.globalData.page_common_on_show(this);
            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);
            // 资料编辑返回时按需刷新（避免 onShow 每次重拉）
            this.check_home_refresh();
        },
        // 滚动加载
        onReachBottom() {
            this.get_content_list();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.reload();
        },
        // 同步公共返回组件透明度
        onPageScroll(e) {
            var top = e.scrollTop > 47 ? 1 : e.scrollTop / 47;
            this.setData({ nav_opacity: top });
            uni.$emit('onPageScroll', e);
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
                this.get_home();
            },
            // 资料修改后返回刷新主页
            check_home_refresh() {
                var key = 'cache_plugins_userhome_home_refresh';
                var refresh = uni.getStorageSync(key) || null;
                if (!refresh) {
                    return;
                }
                uni.removeStorageSync(key);
                // 已展示头区时 keep_page，避免整页闪白
                this.get_home(!!this.page_ready);
            },
            // 重新加载
            reload() {
                this.setData({
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                });
                if (!this.page_ready) {
                    this.get_home();
                    return;
                }
                this.get_home(true);
            },
            // 获取主页
            // keep_page：已展示头区时只刷新数据，避免整页闪白
            get_home(keep_page) {
                if (!keep_page) {
                    this.setData({
                        page_ready: false,
                        page_loding_status: 1,
                        page_loding_msg: '',
                    });
                }
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
                                page_ready: true,
                                page_loding_status: 3,
                                home: home,
                                content_type: content_type,
                                current_theme: (home && home.theme_style) || 'classic',
                                theme_list: (home && home.theme_style_list) || [],
                                cover_url: (home && home.cover) || '',
                                is_cover_theme_color: home && home.is_cover_theme_color == 0 ? 0 : 1,
                                cover_audit_tip: this.build_cover_audit_tip(home),
                                data_page: 1,
                                data_list: [],
                                data_bottom_line_status: false,
                                data_list_loding_status: content_type ? 1 : 0,
                                data_list_loding_msg: '',
                            });
                            this.update_share_info(home);
                            if (content_type) {
                                this.get_content_list(1);
                            }
                            if (home && home.is_self == 1) {
                                this.load_cover_path();
                            }
                        } else {
                            this.setData({
                                page_ready: false,
                                page_loding_status: 0,
                                page_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            page_ready: false,
                            page_loding_status: 2,
                        });
                    },
                });
            },
            // 封面审核提示
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
            // 封面上传 path（config 统一下发，与 PC BaseService 一致）
            load_cover_path() {
                getUserhomeConfig().then((data) => {
                    data = data || {};
                    if (data.cover_path_type) {
                        this.cover_path_type = data.cover_path_type;
                        return;
                    }
                    // 兜底：资料初始化接口
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
                });
            },
            // 更新分享信息
            update_share_info(home) {
                if (!home) {
                    return;
                }
                var name = home.user_name_view || '';
                var info = {
                    title: name ? name + this.$t('home.home_suffix') : this.$t('pages.plugins-userhome-home'),
                    desc: home.signature || this.$t('home.no_signature'),
                    path: '/pages/plugins/userhome/home/home',
                    query: 'id=' + home.user_id,
                    img: home.avatar || '',
                };
                this.setData({ share_info: info });
                // 分享菜单处理
                app.globalData.page_share_handle(info);
            },
            // 获取内容列表
            get_content_list(is_mandatory) {
                if (!this.page_ready || !this.content_type || !this.home) {
                    return;
                }
                if ((is_mandatory || 0) == 0 && this.data_bottom_line_status) {
                    return;
                }
                if (this.data_is_loading == 1) {
                    return;
                }
                this.setData({
                    data_is_loading: 1,
                    data_list_loding_status: this.data_list.length > 0 ? 3 : 1,
                });
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
                            var page_total = data.page_total || 0;
                            var next_page = this.data_page + 1;
                            var temp = this.data_page <= 1 ? list : (this.data_list || []).concat(list);
                            var empty = temp.length <= 0;
                            this.setData({
                                data_list: temp,
                                data_total: data.total || 0,
                                data_page_total: page_total,
                                data_page: next_page,
                                // 无数据：与 PC not_data 一致给出空态提示
                                data_list_loding_status: empty ? 0 : 3,
                                data_list_loding_msg: empty ? this.$t('common.no_relevant_data_tips') : '',
                                data_bottom_line_status: empty || next_page > page_total,
                                data_is_loading: 0,
                            });
                        } else {
                            this.setData({
                                data_is_loading: 0,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg || '',
                            });
                        }
                    },
                    fail: () => {
                        this.setData({ data_is_loading: 0, data_list_loding_status: 2 });
                    },
                });
            },
            // 切换标签
            tab_event(e) {
                var type = e.currentTarget.dataset.type || '';
                if (!type) {
                    return;
                }
                // 当前选中也可再次点击刷新列表
                this.setData({
                    content_type: type,
                    data_page: 1,
                    data_list: [],
                    data_bottom_line_status: false,
                    data_list_loding_status: 1,
                    data_list_loding_msg: '',
                });
                this.get_content_list(1);
            },
            // 统计切换标签
            stat_tab_event(e) {
                this.tab_event(e);
            },
            // 关注粉丝列表（不可看时不响应，样式已灰显）
            stat_follow_event(e) {
                if (!this.home) {
                    return;
                }
                var type = (e.currentTarget.dataset.type || 'follow') == 'fans' ? 'fans' : 'follow';
                var can = type == 'fans' ? this.home.can_view_fans_list == 1 : this.home.can_view_follow_list == 1;
                if (!can) {
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
            // 关注（只改按钮与粉丝数，不整页重拉；按钮 :loading 反馈）
            follow_event() {
                var user = app.globalData.get_user_info(this, 'follow_event');
                if (user == false) {
                    return false;
                }
                if (!this.home || this.follow_loading == 1) {
                    return false;
                }
                this.follow_loading = 1;
                var action = this.home.is_follow == 1 ? 'unfollow' : 'follow';
                uni.request({
                    url: app.globalData.get_request_url(action, 'index', 'userhome'),
                    method: 'POST',
                    data: { uid: this.home.user_id },
                    dataType: 'json',
                    success: (res) => {
                        this.follow_loading = 0;
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            var is_follow = parseInt(data.is_follow || 0) || 0;
                            var fans_count = data.fans_count !== undefined && data.fans_count !== null
                                ? (parseInt(data.fans_count, 10) || 0)
                                : Math.max(0, (parseInt(this.home.fans_count, 10) || 0) + (is_follow == 1 ? 1 : -1));
                            this.home = Object.assign({}, this.home, {
                                is_follow: is_follow,
                                fans_count: fans_count,
                            });
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    },
                    fail: () => {
                        this.follow_loading = 0;
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 分享
            share_event() {
                if (this.$refs.share && this.$refs.share.init) {
                    this.$refs.share.init({
                        share_info: this.share_info,
                    });
                }
            },
            // 编辑资料
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
            // 打开主题
            theme_open_event() {
                var user = app.globalData.get_user_info(this, 'theme_open_event');
                if (user == false) {
                    return;
                }
                this.theme_popup = true;
            },
            // 关闭主题
            theme_close_event() {
                this.theme_popup = false;
            },
            // 保存主题
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
            // 选择封面
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
                                    // 保存成功后由服务端删旧封面，前端不提前 deletefile
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
            // 预览封面
            cover_preview_event() {
                if (!this.cover_url) {
                    return;
                }
                uni.previewImage({
                    current: this.cover_url,
                    urls: [this.cover_url],
                });
            },
            // 清除封面（走 coversave，服务端删旧文件）
            cover_clear_event() {
                this.cover_save('');
            },
            // 封面主题色
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
            // 保存封面
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
            // 发布成功
            publish_success_event() {
                this.reload();
            },
            // 编辑动态
            edit_event(item) {
                if (!item || !item.id) {
                    return;
                }
                app.globalData.url_open('/pages/plugins/userhome/moment-form/moment-form?id=' + item.id);
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
            // 点赞
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
            // 评论数变更
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
            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './home.css';
</style>
