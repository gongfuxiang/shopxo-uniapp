<template>
    <view :class="theme_view">
        <component-nav-back></component-nav-back>
        <view v-if="(data || null) != null" class="signin-container">
            <view class="pr oh">
                <image :src="data.bg_images || signin_static_url + 'signin-bg.png'" mode="widthFix" class="wh-auto"></image>
                <view class="signin-opration-group pa flex-col cr-white">
                    <view v-if="(data_base.is_share || 0) == 1" class="share oh flex-row"  @tap="share_event">
                        <view class="content">
                            <iconfont name="icon-share-square" propClass="pr top-xs" size="32rpx"></iconfont>
                            <text>{{$t('common.share')}}</text>
                        </view>
                    </view>
                    <view v-if="(data_base.is_team || 0) == 1 && (user || null) != null && data.user_id != user.id" class="team oh flex-row" @tap="team_event">
                        <view class="content">
                            <iconfont name="icon-qiandao-zudui" propClass="pr top-xs" size="34rpx"></iconfont>
                            <text>{{$t('detail.detail.8ua11k')}}</text>
                        </view>
                    </view>
                </view>
                <view class="signin-btn pa left-0 right-0 tc">
                    <view class="content cr-white" @tap="coming_event">
                        <block v-if="is_already_coming == 1">{{$t('detail.detail.25x8ij')}}</block>
                        <block v-else>{{$t('detail.detail.mvj266')}}<iconfont name="icon-arrow-right-round" color="#fff" size="32rpx" propClass="margin-left-sm"></iconfont>
                        </block>
                    </view>
                </view>

                <view class="padding-horizontal-main padding-bottom-main">
                    <view class="signin-calendar spacing-mb">
                        <view class="calendar-title flex-row align-c jc-sb">
                            <view class="title-left fw-b text-size">
                                {{ calendar }}
                            </view>
                            <view class="title-right text-size-md">
                                <text v-if="(data_base.is_user_menu || 0) == 1" data-value="/pages/plugins/signin/user/user" @tap="url_event" class="cp">
                                    <iconfont name="icon-qiandao-wdqd" size="32rpx" propClass="margin-right-sm pr top-sm"></iconfont>{{$t('detail.detail.31lky7')}}</text>
                            </view>
                        </view>
                        <view class="calendar-week flex-row align-c jc-sa padding-horizontal-main">
                            <view v-for="(item, index) in week" :key="index">
                                {{ item }}
                            </view>
                        </view>
                        <view class="calendar-days padding-horizontal-main bg-white spacing-mb">
                            <view class="item flex-row jc-sa align-c" v-for="(row, rowIndex) in day_count" :key="rowIndex">
                                <view v-for="(col, colIndex) in row" class="list tc" :class="col.class" :key="colIndex">
                                    <block v-if="col.today">
                                        <block v-if="user_signin_data && user_signin_data.current_day === 1">
                                            <iconfont name="icon-qiandao-yixuan" color="#E22C08" size="48rpx"></iconfont>
                                        </block>
                                        <block v-else>
                                            <text class="fw-b">{{$t('detail.detail.p07k62')}}</text>
                                        </block>
                                    </block>
                                    <block v-else>
                                        <!-- 判断bool是否存在数组signinHistory中    【 true则表示存在于数组中】 -->
                                        <block v-if="user_signin_data && user_signin_data.history_day.some((item) => Number(item) === col.num) && col.current_month">
                                            <iconfont name="icon-qiandao-yixuan" size="48rpx" color="#ccc"></iconfont>
                                        </block>
                                        <block v-else>
                                            {{ col.num }}
                                        </block>
                                    </block>
                                </view>
                            </view>
                        </view>
                        <view v-if="(user || null) !== null" class="calendar-foot pr">
                            <image :src="signin_static_url + 'calendar-link.png'" mode="widthFix" class="calendar-link-left"></image>
                            <image :src="signin_static_url + 'calendar-link.png'" mode="widthFix" class="calendar-link-right"></image>
                            <!-- 判断是组队签到还是个人签到 -->
                            <view v-if="(team_signin_data || null) != null && user.id == data.user_id" class="content bg-white flex-row jc-sb align-c">
                                <text class="fw-b">{{$t('detail.detail.96bwp0')}}{{ team_signin_data.day }}{{$t('detail.detail.rdxjvh')}}{{ team_signin_data.total }}{{$t('user.user.rjye50')}}</text>
                                <text v-if="(data_base.is_team_show_coming_user || 0) == 1" :data-value="'/pages/plugins/signin/user-coming-list/user-coming-list?id=' + data.id" @tap="url_event" class="cp">
                                    <iconfont name="icon-arrow-right"></iconfont>
                                </text>
                            </view>
                            <view v-else class="content bg-white flex-row jc-sb align-c">
                                <text class="fw-b">{{$t('detail.detail.96bwp0')}}<block v-if="user_signin_data.integral">{{$t('goods-detail.goods-detail.by7052')}}</block>
                                    <block v-else>{{$t('detail.detail.we522y')}}</block>{{$t('detail.detail.mqmxbt')}}{{ user_signin_data.integral || 0 }}{{$t('detail.detail.15i191')}}{{ user_signin_data.total || 0 }}{{$t('buy.buy.0pgsrm')}}</text>
                                <text v-if="(data_base.is_user_menu || 0) == 1" data-value="/pages/plugins/signin/user/user" @tap="url_event" class="cp">
                                    <iconfont name="icon-arrow-right"></iconfont>
                                </text>
                            </view>
                        </view>
                    </view>

                    <!-- 公告信息 -规则说明 -->
                    <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="notice-content border-radius-main text-size-md">
                        <view class="title fw-b">{{$t('detail.detail.sx6u43')}}</view>
                        <view class="content">
                            <block v-for="(item, index) in data_base.signin_desc" :key="index">{{ item }}</block>
                        </view>
                    </view>

                    <!-- 推荐商品 -->
                    <view v-if="(data.goods_list || null) != null && data.goods_list.length > 0" class="spacing-mt">
                        <view class="spacing-nav-title flex-row align-c jc-sb text-size-xs">
                            <text class="text-wrapper title-left-border single-text flex-1 flex-width padding-right-main">{{$t('index.index.8t4j95')}}</text>
                            <text data-value="/pages/goods-search/goods-search" @tap="url_event" class="arrow-right padding-right cr-base cp">{{$t('common.more')}}</text>
                        </view>
                        <component-goods-list :propData="{ style_type: 1, goods_list: data.goods_list }" :propCurrencySymbol="currency_symbol"></component-goods-list>
                    </view>
                </view>

                <!-- 签到成功提示信息 -->
                <view v-if="is_success_tips == 1" class="coming-tips-container">
                    <view class="coming-content">
                        <view class="coming-item tc pr">
                            <image :src="data.success_icon || signin_static_url + 'signin-popup-title.png'" class="pa" mode="widthFix"></image>
                            <view class="title">{{$t('detail.detail.6qk085')}}</view>
                            <view class="desc">{{$t('detail.detail.ndp2k3')}}<text>{{ coming_integral }}</text>{{$t('index.index.t26j9z')}}</view>
                            <view class="use-btn text-size fw-b cr-white" :data-value="home_page_url" @tap="url_event">{{$t('detail.detail.7itw5w')}}</view>
                            <view class="close-sub pa cr-white" @tap="coming_success_close_event">
                                <iconfont name="icon-qiandao-tancguanbi" size="60rpx"></iconfont>
                            </view>
                        </view>
                    </view>
                </view>
                <component-share-popup ref="share"></component-share-popup>
            </view>
        </view>
        <block v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentNoData from '@/components/no-data/no-data';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentGoodsList from '@/components/goods-list/goods-list';
    var signin_static_url = app.globalData.get_static_url('signin', true) + 'app/';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                signin_static_url: signin_static_url,
                // 首页地址
                home_page_url: app.globalData.app_tabbar_pages()[0],
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                params: null,
                user: null,
                data_base: null,
                data: null,
                team_signin_data: null,
                user_signin_data: null,
                is_already_coming: 0,
                is_success_tips: 0,
                coming_integral: 0,
                // 自定义分享信息
                share_info: {},
                // 周数
                week: [this.$t('detail.detail.6w8t3g'), this.$t('detail.detail.xtcy73'), this.$t('detail.detail.w2p2d9'), this.$t('detail.detail.xt8596'), this.$t('detail.detail.13s18l'), this.$t('detail.detail.n5rm3q'), this.$t('detail.detail.3d23mc')],
                // 年
                year: new Date().getFullYear(),
                // 月
                month: new Date().getMonth() + 1,
                // 日
                date: new Date().getDate(),
                // 日期
                calendar: new Date().getFullYear() + this.$t('detail.detail.73rb8q') + (new Date().getMonth() + 1) + this.$t('detail.detail.zill36') + new Date().getDate() + this.$t('detail.detail.6w8t3g'),
                // 本月日历总天数
                day_count: [],
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentNoData,
            componentSharePopup,
            componentGoodsList
        },
        computed: {
            days_in_month() {
                const date = new Date(this.year, this.month, 0);
                return date.getDate();
            },
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: app.globalData.launch_params_handle(params),
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 用户信息
            this.setData({
                user: app.globalData.get_user_cache_info(),
            });

            // 获取数据
            this.get_data();

            // 日历渲染
            this.get_calendar();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            // 获取日历数据
            get_calendar() {
                const first_day = new Date(this.year, this.month - 1, 1).getDay();
                const last_day = this.days_in_month;
                const days = [];
                let day = [];
                // 上月计数
                let firstday = new Date();
                firstday.setDate(1); //本月第一天的日期
                const first_day_week = firstday.getDay();
                var defore_days = new Date(this.year, this.month, 0).getDate(); //上月天数
                for (var i = first_day_week - 1; i >= 0; i--) {
                    // 上个月计数
                    day.push({
                        num: defore_days - i,
                        class: 'cr-grey-c',
                        today: false,
                        current_month: false,
                    });
                }
                // 本月计数
                for (let i = 1; i <= last_day; i++) {
                    // 获取当天日期
                    var today = new Date().getDate();
                    day.push({
                        num: i,
                        class: 'cr-black',
                        today: i === today ? true : false,
                        current_month: true,
                    });
                    if (day.length === 7) {
                        days.push(day);
                        day = [];
                    }
                }
                // 本月计数
                if (day.length > 0) {
                    var num = 1;
                    for (let i = day.length; i < 7; i++) {
                        day.push({
                            num: num++,
                            class: 'cr-grey-c',
                            today: false,
                            current_month: false,
                        });
                    }
                    days.push(day);
                }
                this.setData({
                    day_count: days,
                });
            },
            // 点击日期
            handle_day() {},
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'index', 'signin'),
                    method: 'POST',
                    data: {
                        id: this.params.id || 0,
                    },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_base: data.base || null,
                                data: data.data || null,
                                team_signin_data: data.team_signin_data || null,
                                user_signin_data: data.user_signin_data || null,
                                is_already_coming: (data.user_signin_data || null) != null && (data.user_signin_data.current_day || 0) == 1 ? 1 : 0,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: true,
                            });
                            if ((this.data || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data.seo_title || this.$t('detail.detail.y2217b'),
                                        desc: this.data.seo_desc,
                                        path: '/pages/plugins/signin/detail/detail',
                                        query: 'id=' + this.data.id,
                                        img: this.data.bg_images || this.data.logo || '',
                                    },
                                });
                            }
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    return true;
                }
                return false;
            },
            // 签到
            coming_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if (this.is_already_coming != 1 && app.globalData.get_user_info(this, 'coming_event', e)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('coming', 'index', 'signin'),
                        method: 'POST',
                        data: {
                            id: this.data.id,
                        },
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                this.setData({
                                    is_already_coming: 1,
                                    is_success_tips: 1,
                                    coming_integral: res.data.data,
                                });
                                this.get_data();
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'team_request')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
            // 签到成功提示关闭
            coming_success_close_event(e) {
                this.setData({
                    is_success_tips: 0,
                });
            },
            // 组队事件
            team_event(e) {
                if (this.init()) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('team', 'userqrcode', 'signin'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                switch (res.data.data.status) {
                                    // 组队成功
                                    case 0:
                                        var self = this;
                                        var data = res.data;
                                        // 现金支付
                                        uni.showModal({
                                            content: res.data.msg,
                                            showCancel: false,
                                            success(res) {
                                                if (res.confirm) {
                                                    // 设置签到码id
                                                    var temp_params = self.params;
                                                    temp_params['id'] = data.data.qrcode_id;
                                                    self.setData({
                                                        params: temp_params,
                                                    });
                                                    // 重新拉取数据
                                                    self.get_data();
                                                }
                                            },
                                        });
                                        break;
                                    // 需要填写联系人信息
                                    case 1:
                                        app.globalData.url_open('/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id=' + res.data.data.qrcode_id + '&is_team=1');
                                        break;
                                }
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'team_request')) {
                                    app.globalData.showToast(res.data.msg);
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },
            // 打开url
            url_event(e) {
                app.globalData.url_event(e);
            },
            // 分享开启弹层
            share_event(e) {
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        share_info: this.share_info
                    });
                }
            },

            // 页面滚动监听
            onPageScroll(res) {
                uni.$emit('onPageScroll', res);
            },
        },
    };
</script>
<style>
    @import './detail.css';
</style>
