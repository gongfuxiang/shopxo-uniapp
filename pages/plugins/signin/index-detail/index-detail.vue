<template>
    <view class="signin-container">
        <view class="pf z-i left-0 top-0 right-0 pa-w" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;background-color:rgba(255,255,255,' + opacity + ')'">
            <!-- 返回 -->
            <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
            <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-vertical-sm round va-m" :class="opacity > 0.3 ? 'cr-black' : 'cr-white'">
                <iconfont name="icon-tongyong-fanhui" size="40rpx" @tap="top_nav_left_back_event"></iconfont>
            </view>
            <!-- #endif -->
        </view>
        <view v-if="(data || null) != null" class="pr">
            <image :src="signin_static_url + 'signin-bg.png'" mode="widthFix" class="signin-bg"></image>
            <view class="signin-opration-group pa right-0 flex-col cr-white">
                <view v-if="(data_base.is_share || 0) == 1" class="share oh flex-row">
                    <button class="content" open-type="share" @tap="share_event">
                        <iconfont name="icon-qiandao-fenxiang" class="pr top-sm" size="32rpx"></iconfont>
                        分享
                    </button>
                </view>
                <view v-if="(data_base.is_team || 0) == 1 && (user || null) != null && data.user_id != user.id" class="team oh flex-row" @tap="team_event">
                    <view class="content">
                        <iconfont name="icon-qiandao-zudui" class="pr top-xs" size="34rpx"></iconfont>
                        组队
                    </view>
                </view>
            </view>
            <view class="signin-btn pa left-0 right-0 tc">
                <view class="content cr-white" @tap="coming_event">
                    <block v-if="is_already_coming == 1"> 已签到 </block>
                    <block v-else>
                        立即签到
                        <iconfont name="icon-qiandao-jiantou" color="#fff" size="32rpx" class="margin-left-sm"></iconfont>
                    </block>
                </view>
            </view>

            <view class="padding-horizontal-main padding-bottom-xxxl">
                <view class="signin-calendar spacing-mb">
                    <view class="calendar-title flex-row align-c jc-sb">
                        <view class="title-left fw-b text-size">
                            {{ calendar }}
                        </view>
                        <view class="title-right text-size-md">
                            <navigator v-if="(data_base.is_user_menu || 0) == 1" url="/pages/plugins/signin/user/user" hover-class="none">
                                <iconfont name="icon-qiandao-wdqd margin-right-sm pr top-sm" size="32rpx"></iconfont>
                                我的签到
                            </navigator>
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
                                        <text class="fw-b">今天</text>
                                    </block>
                                </block>
                                <block v-else>
                                    <!-- 判断bool是否存在数组signinHistory中    【 true则表示存在于数组中】 -->
                                    <block v-if="user_signin_data && user_signin_data.history_day.some((item) => Number(item) === col.num)">
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
                            <text class="fw-b">今日{{ team_signin_data.day }}人签到，共{{ team_signin_data.total }}人</text>
                            <navigator v-if="(data_base.is_team_show_coming_user || 0) == 1" :url="'/pages/plugins/signin/user-coming-list/user-coming-list?id=' + data.id" hover-class="none">
                                <iconfont name="icon-qiandao-jiantou2"></iconfont>
                            </navigator>
                        </view>
                        <view v-else class="content bg-white flex-row jc-sb align-c">
                            <text class="fw-b">
                                今日
                                <block v-if="user_signin_data.integral">已</block>
                                <block v-else>未</block>
                                签到，获得{{ user_signin_data.integral || 0 }}积分，共{{ user_signin_data.total || 0 }}次
                            </text>
                            <navigator v-if="(data_base.is_user_menu || 0) == 1" url="/pages/plugins/signin/user/user" hover-class="none">
                                <iconfont name="icon-qiandao-jiantou2"></iconfont>
                            </navigator>
                        </view>
                    </view>
                </view>

                <!-- 公告信息 -规则说明 -->
                <view v-if="(data_base.signin_desc || null) != null && data_base.signin_desc.length > 0" class="notice-content border-radius-main text-size-md">
                    <view class="title fw-b">规则说明</view>
                    <view class="content">
                        <block v-for="(item, index) in data_base.signin_desc" :key="index">{{ item }}</block>
                    </view>
                </view>
            </view>

            <!-- 签到成功提示信息 -->
            <view v-if="is_success_tips == 1" class="coming-tips-container">
                <view class="coming-content tc pr">
                    <image :src="signin_static_url + 'signin-popup-title.png'" class="pa" mode="widthFix"></image>
                    <view class="title">签到成功</view>
                    <view class="desc">
                        恭喜您获得
                        <text>{{ coming_integral }}</text>
                        积分
                    </view>
                    <view class="use-btn text-size fw-b cr-white" :data-value="home_page_url" @tap="url_event">立即使用</view>
                    <view class="close-sub pa cr-white" @tap="coming_success_close_event">
                        <iconfont name="icon-qiandao-tancguanbi" size="60rpx"></iconfont>
                    </view>
                </view>
            </view>
            <component-share-popup ref="share"></component-share-popup>
        </view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNoData from '../../../../components/no-data/no-data';
    import componentSharePopup from '../../../../components/share-popup/share-popup';
    var signin_static_url = app.globalData.get_static_url('signin', true) + 'app/';
    export default {
        data() {
            return {
                signin_static_url: signin_static_url,
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                // 顶部返回导航背景透明度
                opacity: 0,
                // 首页地址
                home_page_url: app.globalData.data.tabbar_pages[0],
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
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
                week: ['日', '一', '二', '三', '四', '五', '六'],
                // 年
                year: new Date().getFullYear(),
                // 月
                month: new Date().getMonth() + 1,
                // 日
                date: new Date().getDate(),
                // 日期
                calendar: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日',
                // 本月日历总天数
                day_count: [],
            };
        },
        components: {
            componentNoData,
            componentSharePopup,
        },
        props: {},
        computed: {
            days_in_month() {
                const date = new Date(this.year, this.month, 0);
                return date.getDate();
            },
        },
        onLoad(params) {
            //params['id'] = 1;
            this.setData({
                params: params,
            });
        },
        onShow() {
            // 用户信息
            this.setData({
                user: app.globalData.get_user_cache_info(),
            });
            // 获取数据
            this.get_data();
            // 日历渲染
            this.get_calendar();
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
                    });
                    if (day.length === 7) {
                        days.push(day);
                        day = [];
                    }
                }
                // 本月计数
                if (day.length > 0) {
                    for (let i = day.length; i < 7; i++) {
                        day.push({
                            num: i,
                            class: 'cr-grey-c',
                            today: false,
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
                                        title: this.data.seo_title || '签到',
                                        desc: this.data.seo_desc,
                                        path: '/pages/plugins/signin/index-detail/index-detail',
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
                            data_list_loding_msg: '服务器请求出错',
                        });
                        app.globalData.showToast('服务器请求出错');
                    },
                });
            },
            // 初始化
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    // 用户未绑定用户则转到登录页面
                    if (app.globalData.user_is_need_login(user)) {
                        uni.showModal({
                            title: '温馨提示',
                            content: '绑定手机号码',
                            confirmText: '确认',
                            cancelText: '暂不',
                            success: (result) => {
                                uni.stopPullDownRefresh();
                                if (result.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login?event_callback=init',
                                    });
                                }
                            },
                        });
                    } else {
                        return true;
                    }
                }
                return false;
            },
            // 签到
            coming_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if (this.is_already_coming != 1 && this.init()) {
                    uni.showLoading({
                        title: '处理中...',
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
                            app.globalData.showToast('服务器请求出错');
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
                        title: '处理中...',
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
                                        // 设置签到码id
                                        var temp_params = this.params;
                                        temp_params['id'] = res.data.data.qrcode_id;
                                        this.setData({
                                            params: temp_params,
                                        });
                                        // 重新拉取数据
                                        this.get_data();
                                        break;
                                    // 需要填写联系人信息
                                    case 1:
                                        uni.navigateTo({
                                            url: '/pages/plugins/signin/user-qrcode-saveinfo/user-qrcode-saveinfo?id=' + res.data.data.qrcode_id + '&is_team=1',
                                        });
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
                            app.globalData.showToast('服务器请求出错');
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
                    this.$refs.share.init();
                }
            },

            // 顶部返回操作
            top_nav_left_back_event(e) {
                var pages = getCurrentPages();
                if (pages.length <= 1) {
                    uni.switchTab({
                        url: app.globalData.data.tabbar_pages[0],
                    });
                } else {
                    uni.navigateBack();
                }
            },

            // 页面滚动监听
            onPageScroll(e) {
                var top = e.scrollTop > 47 ? 1 : e.scrollTop / 47;
                this.setData({
                    opacity: top,
                });
            },
        },
    };
</script>
<style>
    @import './index-detail.css';
</style>
