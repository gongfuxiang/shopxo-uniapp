<template>
    <view :class="theme_view">
        <!-- 顶部内容 -->
        <view class="top-content">
            <!-- 内容 -->
            <view class="content">
                <view class="user-top bg-white">
                    <view class="head-base pr flex-row jc-sb align-c">
                        <!-- 左侧头像 -->
                        <view class="head-left">
                            <image data-value="/pages/personal/personal" @tap="url_event" @error="user_avatar_error" class="head-avatar circle bg-white va-m" :src="avatar" mode="widthFix"></image>
                            <view class="va-m dis-inline-block margin-left-lg base-info">
                                <view class="flex-col align-b" data-value="/pages/personal/personal" @tap="url_event">
                                    <view class="va-m fw-b text-size single-text">{{ nickname }}</view>
                                    <view v-if="(user || null) != null && (user.number_code || null) != null" class="head-id border-radius-sm padding-horizontal-sm margin-top-sm dis-inline-block fw-b">
                                        <text class="text-size-xs">ID </text>
                                        <text class="text-size-xss padding-left-xs pr bottom-xs">{{ user.number_code }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                        <!-- 右上角 -->
                        <view class="head-right cr-black">
                            <view class="item pr dis-inline-block margin-left-xxl" data-value="/pages/setup/setup" data-login="0" @tap="url_event">
                                <iconfont name="icon-setup" size="46rpx"></iconfont>
                            </view>
                            <view class="item pr dis-inline-block margin-left-xxl" data-value="/pages/message/message" @tap="url_event">
                                <iconfont name="icon-smallbell" size="46rpx"></iconfont>
                                <view class="badge-icon pa">
                                    <component-badge :propNumber="message_total"></component-badge>
                                </view>
                            </view>
                        </view>
                    </view>
                    <!-- 副导航 -->
                    <view v-if="common_app_is_head_vice_nav == 1 && head_nav_list.length > 0" class="head-nav oh padding-main flex-row align-c jc-sa tc">
                        <block v-for="(item, index) in head_nav_list" :key="index">
                            <view class="flex-1 flex-width cp" :data-value="'/pages/' + item.url + '/' + item.url" @tap="url_event">
                                <view class="head-nav-item">
                                    <view class="nav-value fw-b text-size margin-bottom-sm">{{ item.count }}</view>
                                    <view class="nav-name text-size-sm">{{ item.name }}</view>
                                </view>
                            </view>
                        </block>
                    </view>
                    <!-- 超级会员-开通提示 -->
                    <view v-if="(plugins_vip_user_center_open_tips_data || null) != null" class="plugins-vip-user-center-open-tips padding-horizontal-main">
                        <view class="plugins-vip-user-center-open-tips-inner border-radius-main flex-row jc-sb align-c cp" :data-value="plugins_vip_user_center_open_tips_data.panel_url" :data-login="(plugins_vip_user_center_open_tips_data.show_type || 'open') == 'open' ? 0 : 1" @tap="url_event">
                            <!-- 未开通/未登录 -->
                            <block v-if="(plugins_vip_user_center_open_tips_data.show_type || 'open') == 'open'">
                                <view class="tips-content flex-row align-c flex-1 flex-width margin-right-sm">
                                    <iconfont name="icon-admin-store-vip" color="#f3d9b1" size="32rpx" propClass="tips-icon"></iconfont>
                                    <text class="tips-text single-text flex-1 flex-width">{{ plugins_vip_user_center_open_tips_data.tips_text }}</text>
                                </view>
                                <text class="tips-btn round cp" :data-value="(plugins_vip_user_center_open_tips_data.is_login || 0) == 1 ? plugins_vip_user_center_open_tips_data.buy_url : plugins_vip_user_center_open_tips_data.login_url" @tap.stop="url_event">{{ plugins_vip_user_center_open_tips_data.btn_text }}</text>
                            </block>
                            <!-- 已开通会员 -->
                            <block v-else>
                                <view class="tips-content flex-row align-c flex-1 flex-width margin-right-sm">
                                    <image v-if="(plugins_vip_user_center_open_tips_data.user_vip.icon || null) != null" class="vip-level-icon radius" :src="plugins_vip_user_center_open_tips_data.user_vip.icon" mode="widthFix"></image>
                                    <iconfont v-else name="icon-admin-store-vip" color="#f3d9b1" size="32rpx" propClass="tips-icon"></iconfont>
                                    <view class="flex-1 flex-width oh">
                                        <view class="tips-text single-text">{{ plugins_vip_user_center_open_tips_data.user_vip.level_name }}</view>
                                        <view v-if="(plugins_vip_user_center_open_tips_data.user_vip.user_vip_model || null) == 'pay'" class="tips-expire text-size-xss cr-grey-9 single-text">
                                            <block v-if="(plugins_vip_user_center_open_tips_data.user_vip.is_permanent || 0) == 1">
                                                <text>{{ plugins_vip_user_center_open_tips_data.user_vip.permanent_value }}{{ plugins_vip_user_center_open_tips_data.user_vip.permanent_unit }}</text>
                                            </block>
                                            <block v-else-if="(plugins_vip_user_center_open_tips_data.user_vip.surplus_time_number || 0) > 0">
                                                <text>{{ plugins_vip_user_center_open_tips_data.user_vip.surplus_time_number }}{{ plugins_vip_user_center_open_tips_data.user_vip.surplus_time_unit }}</text>
                                                <text v-if="(plugins_vip_user_center_open_tips_data.user_vip.expire_time || null) != null" class="margin-left-xs">| {{ plugins_vip_user_center_open_tips_data.user_vip.expire_time }}</text>
                                            </block>
                                            <block v-else>
                                                <text>{{$t('user.user.528t26')}}</text>
                                            </block>
                                        </view>
                                    </view>
                                </view>
                                <text v-if="(plugins_vip_user_center_open_tips_data.vip_btn || null) != null && (plugins_vip_user_center_open_tips_data.vip_btn.show || 0) == 1" class="tips-btn round cp" :data-value="plugins_vip_user_center_open_tips_data.vip_btn.url" @tap.stop="vip_tips_btn_event">{{ plugins_vip_user_center_open_tips_data.vip_btn.btn_text }}</text>
                            </block>
                        </view>
                    </view>
                    <!-- 会员码 付款码 -->
                    <view v-if="(payment_page_url || null) !== null || (vip_page_url || null) !== null" class="qrcode padding-horizontal-main pr oh">
                        <view class="qrcode-content flex-row align-c text-size-md" :style="'background-image: url(' + static_url + 'qrcode-bg.png)'" :class="(payment_page_url || null) == null || (vip_page_url || null) == null ? 'jc-sb' : 'jc-sa divider-r'">
                            <view v-if="(vip_page_url || null) != null" class="padding-horizontal-lg pr z-i ht-auto" :class="(payment_page_url || null) == null || (vip_page_url || null) == null ? 'wh-auto' : 'tc flex-width-half'" :data-value="vip_page_url" @tap="url_event">
                                <view class="item pr top-lg dis-inline-block"> <image class="icon" :src="static_url + 'vip-code.png'" mode="widthFix"></image> </view>{{ $t('member-code.member-code.26bu38') }}</view
                            >
                            <view v-if="(payment_page_url || null) != null" class="padding-horizontal-lg pr z-i ht-auto" :class="(payment_page_url || null) == null || (vip_page_url || null) == null ? 'wh-auto' : 'tc flex-width-half'" :data-value="payment_page_url" @tap="url_event">
                                <view class="item pr top-lg dis-inline-block">
                                    <image class="icon" :src="static_url + 'payment-code.png'" mode="widthFix"></image>
                                </view>
                                <text>{{ $t('user.user.91h03v') }}</text>
                            </view>
                        </view>
                        <iconfont v-if="(payment_page_url || null) == null || (vip_page_url || null) == null" name="icon-arrow-right" propClass="iconfont pa" color="#FEF6CF"></iconfont>
                    </view>
                </view>

                <!-- 中间导航 -->
                <view :class="'user-bottom padding-horizontal-main ' + ((payment_page_url || null) !== null || (vip_page_url || null) !== null ? 'box-shadow' : '')">
                    <!-- 主要的订单+副导航 -->
                    <block v-if="(main_navigation_data || null) != null && main_navigation_data.length > 0">
                        <block v-for="(item, index) in main_navigation_data" :key="index">
                            <block v-if="(item.extension_data || null) != null && item.extension_data.length > 0">
                                <view class="nav-list bg-white bg-white padding-vertical-main border-radius-main spacing-mb">
                                    <view class="nav-content flex-row jc-sb align-c">
                                        <!-- 副导航 -->
                                        <view class="nav-list-sub oh flex-row jc-sa align-c flex-1">
                                            <block v-for="(items, index2) in item.extension_data" :key="index2">
                                                <view class="flex-1 cp" :data-value="items.url" @tap="url_event">
                                                    <view class="item pr tc">
                                                        <view class="badge-icon pa">
                                                            <component-badge :propNumber="items.count"></component-badge>
                                                        </view>
                                                        <image class="item-icon margin-bottom-xs" :src="items.icon" mode="aspectFill"></image>
                                                        <view class="item-name cr-base text-size-sm">{{ items.name }}</view>
                                                    </view>
                                                </view>
                                            </block>
                                        </view>
                                        <!-- 主导航 -->
                                        <view class="nav-all-order-goods pr" :data-value="item.url || item.event_value" @tap="url_event">
                                            <view class="item pr tc">
                                                <image class="item-icon margin-bottom-xs" :src="item.icon || item.images_url" mode="aspectFill"></image>
                                                <view class="item-name cr-base text-size-sm">{{ item.name }}</view>
                                            </view>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </block>
                    </block>

                    <!-- 聚合导航 -->
                    <view class="service-nav padding-main border-radius-main bg-white spacing-mb">
                        <!-- 列表模式 -->
                        <view v-if="nav_show_model_type == 1" class="nav-list">
                            <block v-for="(item, index) in navigation" :key="index">
                                <view :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" :class="'nav-item cp padding-main ' + (index > 0 ? 'br-t-e' : '')">
                                    <view class="arrow-right">
                                        <image :src="item.images_url" class="item-icon va-m" mode="widthFix"></image>
                                        <text class="item-name va-m cr-base margin-left-sm text-size-sm">{{ item.name }}</text>
                                        <text v-if="(item.desc || null) != null" class="item-desc fr tr single-text cr-grey-9 text-size-sm">{{ item.desc }}</text>
                                    </view>
                                </view>
                            </block>
                            <!-- 清除缓存 -->
                            <view v-if="(nav_logout_data || null) != null" class="nav-item br-t cp padding-main" @tap="remove_user_cache_event">
                                <view class="arrow-right">
                                    <image :src="common_static_url + nav_logout_data.icon + '-icon.png'" class="item-icon va-m" mode="widthFix"></image>
                                    <text class="item-name va-m cr-base margin-left-sm text-size-sm">{{ nav_logout_data.name }}</text>
                                </view>
                            </view>
                            <!-- 在线客服：游客也可进入（chat 支持匿名 uuid） -->
                            <view class="nav-item br-t cp padding-main" @tap="chat_nav_event">
                                <view class="arrow-right">
                                    <image :src="common_static_url + 'online-service-icon.png'" class="item-icon va-m" mode="widthFix"></image>
                                    <text class="item-name va-m cr-base margin-left-sm text-size-sm">{{ $t('design.design.21kak7') }}</text>
                                </view>
                            </view>
                            <!-- 联系客服 -->
                            <view v-if="(common_app_customer_service_tel || null) != null" class="nav-item br-t cp padding-main" @tap="call_event">
                                <view class="arrow-right">
                                    <image :src="common_static_url + 'customer-service-icon.png'" class="item-icon va-m" mode="widthFix"></image>
                                    <text class="item-name va-m cr-base margin-left-sm text-size-sm">{{ $t('common.tel_service') }}</text>
                                </view>
                            </view>
                        </view>
                        <!-- 默认九方格模式 -->
                        <view v-else class="nav-box oh margin-top-sm">
                            <block v-for="(item, index) in navigation" :key="index">
                                <view :data-value="item.event_value" :data-type="item.event_type" @tap="navigation_event" class="nav-item padding-vertical-main padding-horizontal-xs fl tc cp">
                                    <image :src="item.images_url" class="item-icon" mode="widthFix"></image>
                                    <view class="item-name single-text cr-base text-size-sm">{{ item.name }}</view>
                                </view>
                            </block>
                            <!-- 清除缓存 -->
                            <view v-if="(nav_logout_data || null) != null" class="nav-item padding-vertical-main padding-horizontal-xs fl tc cp" @tap="remove_user_cache_event">
                                <image :src="common_static_url + nav_logout_data.icon + '-icon.png'" class="item-icon" mode="widthFix"></image>
                                <view class="item-name single-text cr-base text-size-sm">{{ nav_logout_data.name }}</view>
                            </view>
                            <!-- 在线客服：游客也可进入（chat 支持匿名 uuid） -->
                            <view class="nav-item padding-vertical-main padding-horizontal-xs fl tc cp" @tap="chat_nav_event">
                                <image :src="common_static_url + 'online-service-icon.png'" class="item-icon" mode="widthFix"></image>
                                <view class="item-name single-text cr-base text-size-sm">{{ $t('design.design.21kak7') }}</view>
                            </view>
                            <!-- 联系客服 -->
                            <view v-if="(common_app_customer_service_tel || null) != null" class="nav-item padding-vertical-main padding-horizontal-xs fl tc cp" @tap="call_event">
                                <image :src="common_static_url + 'customer-service-icon.png'" class="item-icon" mode="widthFix"></image>
                                <view class="item-name single-text cr-base text-size-sm">{{ $t('common.tel_service') }}</view>
                            </view>
                        </view>
                    </view>

                    <!-- 用户中心公告 -->
                    <view v-if="(common_user_center_notice || null) != null" class="padding-horizontal-main">
                        <uni-notice-bar class="padding-0 margin-0" show-icon scrollable :text="common_user_center_notice" background-color="transparent" color="#666" />
                    </view>

                    <!-- 版权信息 -->
                    <component-copyright></component-copyright>
                </view>
            </view>
        </view>

        <!-- 在线客服 -->
        <component-online-service :propIsNav="true" :propIsBar="true"></component-online-service>

        <!-- 快捷导航 -->
        <component-quick-nav :propIsNav="true" :propIsBar="true"></component-quick-nav>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentQuickNav from '@/components/quick-nav/quick-nav';
    import componentBadge from '@/components/badge/badge';
    import componentCopyright from '@/components/copyright/copyright';
    import componentOnlineService from '@/components/online-service/online-service';

    var common_static_url = app.globalData.get_static_url('common');
    var static_url = app.globalData.get_static_url('user');
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                common_static_url: common_static_url,
                load_status: 0,
                static_url: static_url,
                avatar: app.globalData.data.default_user_head_src,
                user: null,
                nickname: '',
                message_total: 0,
                nav_logout_data: null,
                // 头部小导航
                head_nav_list: [],
                // 主要的订单+副导航
                main_navigation_data: [],
                // 远程自定义导航
                navigation: [],
                // 基础配置
                common_app_customer_service_tel: null,
                common_user_center_notice: null,
                common_app_is_online_service: 0,
                common_app_is_head_vice_nav: 0,
                // 会员码地址
                vip_page_url: null,
                // 付款码地址
                payment_page_url: null,
                // 超级会员开通提示
                plugins_vip_user_center_open_tips_data: null,
                // 会员续费按钮状态
                vip_submit_disabled_status: false,
                // 用户中心菜单展示模式
                nav_show_model_type: 0,
            };
        },

        components: {
            componentCommon,
            componentQuickNav,
            componentBadge,
            componentCopyright,
            componentOnlineService
        },

        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params);

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 资源设置
            this.set_resources_data();

            // 初始化配置
            if(app.globalData.get_config('status') == 1) {
                app.globalData.init_config(0, this, 'init_config', true);
            } else {
                app.globalData.is_config(this, 'init_config');
            }

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show({object: this, method: 'init'});
            }
        },

        // 下拉刷新
        onPullDownRefresh(e) {
            this.init();
        },

        methods: {
            // 资源设置
            set_resources_data() {
                // 当前用户信息
                var user = app.globalData.get_user_cache_info() || null;
                // 导航名称处理
                var old_nav = this.head_nav_list;
                var head_nav_list = [
                    {
                        name: this.$t('promotion-order.promotion-order.iwa646'),
                        url: 'user-order',
                        count: old_nav.length > 0 ? old_nav[0].count : 0,
                    },
                    {
                        name: this.$t('user.user.3q4p8k'),
                        url: 'user-favor',
                        count: old_nav.length > 0 ? old_nav[1].count : 0,
                    },
                    {
                        name: this.$t('user.user.57xw84'),
                        url: 'user-goods-browse',
                        count: old_nav.length > 0 ? old_nav[2].count : 0,
                    },
                    {
                        name: this.$t('user.user.k78280'),
                        url: 'user-integral',
                        count: old_nav.length > 0 ? old_nav[3].count : 0,
                    },
                ];
                var nav_logout_data = (user == null) ? null : {
                    name: this.$t('user.user.2k0227'),
                    icon: 'logout',
                };

                this.setData({
                    user: user,
                    head_nav_list: head_nav_list,
                    nav_logout_data: nav_logout_data,
                    nickname: this.nickname || this.$t('login.login.6yfr9g'),
                });
            },

            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    // 会员码及付款码入口
                    var vip_page_url = null;
                    var payment_page_url = null;
                    if (app.globalData.get_config('plugins_base.wallet.data.is_enable_payment_code') == 1) {
                        payment_page_url = '/pages/plugins/wallet/payment-code/payment-code';
                    }
                    if (app.globalData.get_config('plugins_base.vip.data.is_enable_member_code') == 1) {
                        vip_page_url = '/pages/plugins/vip/member-code/member-code';
                    }
                    this.setData({
                        common_app_customer_service_tel: app.globalData.get_config('config.common_app_customer_service_tel'),
                        common_user_center_notice: app.globalData.get_config('config.common_user_center_notice'),
                        common_app_is_online_service: app.globalData.get_config('config.common_app_is_online_service'),
                        common_app_is_head_vice_nav: parseInt(app.globalData.get_config('config.common_app_is_head_vice_nav', 0)),
                        nav_show_model_type: parseInt(app.globalData.get_config('config.common_user_center_nav_show_model_type', 0)),
                        vip_page_url: vip_page_url,
                        payment_page_url: payment_page_url,
                    });
                }
            },

            // 获取数据
            init(status = 0) {
                // 没有用户信息则调用用户登录
                if(this.user == null) {
                    app.globalData.get_user_info(this, 'init', 1);
                }
                if(status == 1) {
                    // 资源设置
                    this.set_resources_data();
                }

                // 获取数据
                this.get_data();

                // 设置用户基础数据
                this.set_user_base();

                // 分享菜单处理
                app.globalData.page_share_handle();
            },

            // 设置用户基础信息
            set_user_base() {
                if(this.user != null) {
                    if ((this.user.avatar || null) != null) {
                        this.setData({
                            avatar: this.user.avatar,
                        });
                    }
                    if ((this.user.user_name_view || null) != null) {
                        this.setData({
                            nickname: this.user.user_name_view,
                        });
                    }
                } else {
                    // 有用户信息，是否需要绑定手机
                    if(app.globalData.user_is_bind_mobile(this.user)) {
                        this.setData({
                            nickname: this.$t('login.login.np9177')
                        });
                    }
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('center', 'user'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var navigation = data.navigation || [];

                            // 头部小导航总数
                            var temp_head_nav_list = this.head_nav_list;
                            temp_head_nav_list[0]['count'] = (data.user_order_count || 0) == 0 ? 0 : data.user_order_count;
                            temp_head_nav_list[1]['count'] = (data.user_goods_favor_count || 0) == 0 ? 0 : data.user_goods_favor_count;
                            temp_head_nav_list[2]['count'] = (data.user_goods_browse_count || 0) == 0 ? 0 : data.user_goods_browse_count;
                            temp_head_nav_list[3]['count'] = (data.integral || 0) == 0 ? 0 : data.integral;

                            // 订单状态总数
                            var user_order_status_list = [
                                {
                                    name: this.$t('user.user.9u8e61'),
                                    status: 1,
                                    count: 0,
                                    url: '/pages/user-order/user-order?status=1',
                                },
                                {
                                    name: this.$t('user.user.66714e'),
                                    status: 2,
                                    count: 0,
                                    url: '/pages/user-order/user-order?status=2',
                                },
                                {
                                    name: this.$t('order.order.q820hx'),
                                    status: 3,
                                    count: 0,
                                    url: '/pages/user-order/user-order?status=3',
                                },
                                {
                                    name: this.$t('user.user.aa1ri3'),
                                    status: 101,
                                    count: 0,
                                    url: '/pages/user-orderaftersale/user-orderaftersale',
                                },
                            ];
                            if ((data.user_order_status || null) != null && data.user_order_status.length > 0) {
                                for (var i in user_order_status_list) {
                                    for (var t in data.user_order_status) {
                                        if (user_order_status_list[i]['status'] == data.user_order_status[t]['status']) {
                                            user_order_status_list[i]['count'] = data.user_order_status[t]['count'];
                                            user_order_status_list[i]['icon'] = this.static_url + 'order-icon-' + user_order_status_list[i]['status'] + '.png';
                                            break;
                                        }
                                    }
                                }
                            }

                            // 导航处理，是否存在主要的订单+副导航
                            var main_navigation_data = [];
                            var temp_navigation = [];
                            if (navigation.length > 0) {
                                for (var i in navigation) {
                                    // 去除参数
                                    var url = app.globalData.get_url_main_part(navigation[i]['event_value']);
                                    // 系统订单
                                    var status = true;
                                    if (url == '/pages/user-order/user-order') {
                                        var temp = navigation[i];
                                        temp['extension_data'] = user_order_status_list;
                                        main_navigation_data.push(temp);
                                        status = false;
                                    // 是否存在扩展副导航数据
                                    } else if((navigation[i]['extension_data'] || null) != null && navigation[i]['extension_data'].length > 0) {
                                        main_navigation_data.push(navigation[i]);
                                        status = false;
                                    }
                                    if(status) {
                                        temp_navigation.push(navigation[i]);
                                    }
                                }
                            }

                            // 数据设置
                            var upd_data = {
                                load_status: 1,
                                message_total: parseInt(data.message_total || 0),
                                head_nav_list: temp_head_nav_list,
                                navigation: temp_navigation,
                                main_navigation_data: main_navigation_data,
                                plugins_vip_user_center_open_tips_data: data.plugins_vip_user_center_open_tips_data || null,
                            };

                            // 用户基础信息处理
                            if ((data.avatar || null) != null) {
                                upd_data['avatar'] = data.avatar;
                            }
                            if ((data.user_name_view || null) != null) {
                                upd_data['nickname'] = data.user_name_view;
                            }
                            this.setData(upd_data);

                            // 购物车导航角标
                            app.globalData.set_tab_bar_badge('cart', data.cart_total.buy_number);
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }

                        // 分享菜单处理、延时执行，确保基础数据已加载完成
                        setTimeout(function () {
                            app.globalData.page_share_handle();
                        }, 3000);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 清除缓存
            remove_user_cache_event(e) {
                // 当前页面处理
                this.setData({
                    user: null,
                    nickname: '',
                    avatar: app.globalData.data.default_user_head_src,
                    nav_logout_data: null,
                });

                // 调用公共方法处理
                app.globalData.remove_user_cache_event();
                
                // 资源设置
                this.set_resources_data();

                // 初始数据
                this.get_data();
            },

            // 在线客服（原生）
            chat_nav_event() {
                if (typeof app.globalData.chat_native_entry_handle == 'function') {
                    app.globalData.chat_native_entry_handle({ to_list: 1 });
                    return;
                }
                uni.navigateTo({ url: '/pages/plugins/chat/list/list' });
            },

            // 客服电话
            call_event() {
                if (this.common_app_customer_service_tel == null) {
                    app.globalData.showToast(this.$t('setup.setup.utnr7g'));
                } else {
                    app.globalData.call_tel(this.common_app_customer_service_tel);
                }
            },

            // 头像加载错误
            user_avatar_error(e) {
                this.setData({
                    avatar: app.globalData.data.default_user_head_src,
                });
            },

            // 远程自定义导航事件
            navigation_event(e) {
                if(this.is_login()) {
                    app.globalData.operation_event(e);
                }
            },

            // url事件
            url_event(e) {
                var login = e.currentTarget.dataset.login;
                if(login === undefined || login == 1) {
                    if(this.is_login()) {
                        app.globalData.url_event(e);
                    }
                } else {
                    app.globalData.url_event(e);
                }
            },

            // 已开通会员提示按钮（开通/续费/连续开通，逻辑与会员中心页一致）
            vip_tips_btn_event(e) {
                var btn = (this.plugins_vip_user_center_open_tips_data || null) != null ? this.plugins_vip_user_center_open_tips_data.vip_btn : null;
                if ((btn || null) == null || (btn.show || 0) != 1) {
                    return;
                }
                if ((btn.action || '') == 'renew') {
                    this.uservip_renew_event(e);
                    return;
                }
                app.globalData.url_event(e);
            },

            // 连续开通会员（超级会员提示）
            uservip_renew_event(e) {
                var self = this;
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('user.user.95s1ez'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('common.not_yet'),
                    success: (result) => {
                        if (result.confirm) {
                            self.setData({
                                vip_submit_disabled_status: true,
                            });
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            uni.request({
                                url: app.globalData.get_request_url('renew', 'buy', 'vip'),
                                method: 'POST',
                                data: {},
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    self.setData({
                                        vip_submit_disabled_status: false,
                                    });
                                    if (res.data.code == 0) {
                                        uni.setStorageSync(app.globalData.data.cache_page_pay_key, res.data.data.id);
                                        app.globalData.url_open('/pages/plugins/vip/order/order', true);
                                    } else {
                                        if (app.globalData.is_login_check(res.data, self, 'uservip_renew_event')) {
                                            app.globalData.showToast(res.data.msg);
                                        }
                                    }
                                },
                                fail: () => {
                                    self.setData({
                                        vip_submit_disabled_status: false,
                                    });
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 是否登录
            is_login() {
                if((this.user || null) == null) {
                    app.globalData.url_open('/pages/login/login?event_callback=init');
                    return false;
                }
                return true;
            }
        },
    };
</script>
<style>
    @import './user.css';
</style>
