<template>
    <view>
        <view v-if="(data_base || null) != null" :style="'padding-top:' + (status_bar_height > 0 ? status_bar_height + 5 : 10) + 'px;'">
            <!-- 头部背景 -->
            <image :src="distribution_static_url + 'distribution-bg.png'" mode="widthFix" class="wh-auto pa top-0 left-0 right-0" />
            <view class="pr z-i">
                <!-- 返回 -->
                <!-- #ifdef MP-WEIXIN || MP-QQ || MP-KUAISHOU || H5 || APP -->
                <view v-if="is_realstore_top_nav_back == 1" class="nav-back padding-horizontal-main padding-top-sm round va-m pr top-sm cr-white" @tap="top_nav_left_back_event">
                    <iconfont name="icon-tongyong-fanhui" size="32rpx"></iconfont>
                </view>
                <!-- #endif -->
                <view class="padding-top-xxxl oh">
                    <!-- 头部 -->
                    <view class="padding-main border-radius-main oh pr">
                        <view class="flex-row align-c">
                            <view class="head-img avatar bg-white circle">
                                <image class="wh-auto circle" @tap="preview_event" @error="user_avatar_error" :src="avatar" mode="widthFix"></image>
                            </view>
                            <view class="head-item padding-left-main flex-1 flex-width">
                                <view class="cr-white text-size fw-b">{{ nickname }}</view>
                                <view v-if="(user_level || null) != null" class="single-text level-item round dis-inline-block margin-top-sm">
                                    <image v-if="(user_level.images_url || null) != null" class="level-icon margin-right-sm pr top-sm" :src="user_level.images_url" mode="widthFix"></image>
                                    <text v-if="(user_level.name || null) != null" class="cr-white text-size-xs">{{ user_level.name }}</text>
                                </view>
                            </view>
                        </view>
                        <view class="head-base pa">
                            <block v-if="(data_base || null) != null && (data_base.is_enable_self_extraction || 0) == 1">
                                <navigator url="/pages/plugins/distribution/extraction/extraction" hover-class="none">
                                    <button class="text-size-xs cr-white" size="mini" type="default" hover-class="none">
                                        {{ (extraction || null) == null ? '申请' : '' }}取货点
                                        <iconfont name="icon-qiandao-jiantou2" size="18rpx" color="#fff" class="pa"></iconfont>
                                    </button>
                                </navigator>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 会员中心通知 -->
                <view v-if="(user_level || null) != null && (data_base.user_center_notice || null) != null && data_base.user_center_notice.length > 0" class="padding-horizontal-main padding-bottom-main">
                    <view :class="(superior || null) != null ? 'padding-horizontal-main margin-horizontal-xs' : ''">
                        <uni-notice-bar show-icon scrollable :text="data_base.user_center_notice.join('')" background-color="transparent" color="#fff" />
                    </view>
                </view>

                <!-- 上级用户 -->
                <view v-if="(superior || null) != null" class="superior">
                    <view class="superior-item flex-row jc-sb align-c oh border-radius-top-main">
                        <view class="superior-title cr-white fw-b va-m text-size">上级用户</view>
                        <view class="superior-content">
                            <image :src="superior.avatar" mode="widthFix" class="circle va-m"></image>
                            <text class="cr-white va-m margin-left-sm text-size-xs">{{ superior.user_name_view }}</text>
                        </view>
                    </view>
                </view>

                <!-- 数据统计 -->
                <view v-if="stats_user_promotion_data_list.length > 0 || stats_base_data_list.length > 0 || stats_profit_data_list.length > 0" class="padding-horizontal-main oh">
                    <view class="stats-container padding-main border-radius-main bg-white pr spacing-mb">
                        <view class="flex-row jc-sb align-c">
                            <view class="title-left-border text-size fw-b">基础统计</view>
                            <button type="default" size="mini" class="br-grey-f5 bg-grey-f5 round stats-switch-submit text-size-xs pr margin-0" @tap="popup_time_event">
                                {{ popup_time_value.name }}
                                <iconfont name="icon-mendian-jiantou2" size="24rpx" class="pa"></iconfont>
                            </button>
                        </view>
                        <!-- 推广统计 -->
                        <view v-if="stats_user_promotion_data_list.length > 0" class="margin-top-main oh tc flex-row jc-sa align-c">
                            <block v-for="(item, index) in stats_user_promotion_data_list" :key="index">
                                <view class="padding-main flex-1" :class="stats_user_promotion_data_list.length - 1 > index ? 'divider-r-f5' : ''">
                                    <view class="cr-base">{{ item.name }}</view>
                                    <view class="single-text margin-top-sm">
                                        <text :class="'fw-b text-size ' + item.ent">{{ item.value }}</text>
                                        <text v-if="(item.unit || null) != null" class="cr-grey text-size-xs margin-left-sm">人</text>
                                    </view>
                                </view>
                            </block>
                        </view>
                        <!-- 基础统计 -->
                        <view v-if="stats_base_data_list.length > 0" class="margin-top oh tc">
                            <block v-for="(item, index) in stats_base_data_list_children" :key="index">
                                <view class="flex-row jc-sa align-c bg-grey-f5 border-radius-main" :class="stats_base_data_list_children.length - 1 > index ? 'spacing-mb' : ''">
                                    <block v-for="(child, i) in item" :key="i">
                                        <view class="flex-width-half">
                                            <view class="padding-vertical-main padding-horizontal-xxxl flex-row jc-c align-c">
                                                <image :src="child.icon" mode="widthFix" class="count-img" />
                                                <view class="tl flex-1 flex-width padding-left-main">
                                                    <view class="text-size-xs single-text">{{ child.name }}</view>
                                                    <view class="single-text margin-top-sm">
                                                        <text v-if="(child.first || null) != null" class="text-size-xs">{{ child.first }}</text>
                                                        <text class="text-size-lg fw-b">{{ child.value }}</text>
                                                        <text v-if="(child.unit || null) != null" class="cr-grey-9 text-size-xs">{{ child.unit }}</text>
                                                    </view>
                                                </view>
                                            </view>
                                        </view>
                                    </block>
                                </view>
                            </block>
                        </view>
                    </view>

                    <!-- 返佣统计 -->
                    <view v-if="stats_profit_data_list.length > 0" class="stats-container padding-sm border-radius-main bg-white pr">
                        <view class="title-left-border text-size fw-b padding-vertical-sm padding-horizontal-main margin-left-sm">返佣统计</view>
                        <view class="flex-row flex-warp">
                            <block v-for="(item, index) in stats_profit_data_list" :key="index">
                                <view class="flex-width-half">
                                    <view class="anti-mercenary-count bg-grey-f5 border-radius-main margin-sm">
                                        <view class="text-size-xs single-text">{{ item.name }}</view>
                                        <view class="single-text margin-top-sm">
                                            <text class="text-size-xs">{{ currency_symbol }}</text>
                                            <text class="text-size-lg fw-b">{{ item.value }}</text>
                                        </view>
                                    </view>
                                </view>
                            </block>
                        </view>
                    </view>
                </view>

                <!-- 导航 -->
                <view v-if="nav_list.length > 0" class="nav oh flex-row flex-warp padding-sm" :class="(profit_ladder || null) != null ? 'padding-bottom-main' : 'nav-bottom'">
                    <block v-for="(item, index) in nav_list" :key="index">
                        <view class="flex-width-half">
                            <view class="item bg-white border-radius-main margin-sm">
                                <navigator :url="item.url" hover-class="none" class="flex-row align-c">
                                    <image :src="item.icon" mode="scaleToFill" class="dis-block"></image>
                                    <view class="padding-left-main text-size fw-b flex-1 flex-width single-text">{{ item.title }}</view>
                                </navigator>
                            </view>
                        </view>
                    </block>
                </view>

                <!-- 不符合分销条件描述 -->
                <view v-if="(user_level || null) == null && (data_base.non_conformity_desc || null) != null && data_base.non_conformity_desc.length > 0" class="padding-horizontal-main">
                    <uni-notice-bar class="padding-0" show-icon scrollable :text="data_base.non_conformity_desc.join" background-color="transparent" color="#fff" />
                </view>

                <!-- 阶梯返佣提示 -->
                <view v-if="(profit_ladder || null) != null" class="padding-main bottom-fixed bg-white">
                    <view class="flex-row jc-sb align-c">
                        <text class="cr-base">{{ profit_ladder.msg }}</text>
                        <navigator url="/pages/plugins/distribution/poster/poster" hover-class="none" class="text-size bg-main cr-white dis-inline-block round padding-horizontal-xxxl promotion-btn">去推广</navigator>
                    </view>
                </view>
                <view class="padding-main bottom-fixed bg-white">
                    <view class="flex-row jc-sb align-c">
                        <text class="cr-base">123123213</text>
                        <navigator url="/pages/plugins/distribution/poster/poster" hover-class="none" class="text-size bg-main cr-white dis-inline-block round padding-horizontal-xxxl promotion-btn">去推广</navigator>
                    </view>
                </view>

                <!-- 时间选择弹窗 -->
                <component-popup :propShow="popup_time_status" propPosition="bottom" @onclose="popup_time_close_event">
                    <view class="padding-horizontal-main padding-top-main bg-white">
                        <view class="close oh">
                            <view class="tr" @tap.stop="popup_time_close_event">
                                <uni-icons type="clear" size="46rpx" color="#999"></uni-icons>
                            </view>
                        </view>
                        <view class="popup-time-container page-bottom-fixed">
                            <form @submit="form_submit" class="form-container">
                                <view v-if="(time_data || null) != null" class="quit-time oh">
                                    <block v-for="(item, index) in time_data" :key="index">
                                        <view class="item fl padding-main bs-bb">
                                            <view class="br-grey cr-grey text-size-xs round padding-top-xs padding-bottom-xs tc" :data-index="index" @tap="quit_time_event">{{ item.name }}</view>
                                        </view>
                                    </block>
                                </view>

                                <view class="form-gorup bg-white">
                                    <view class="form-gorup-title">开始时间</view>
                                    <view class="br-b">
                                        <uni-datetime-picker @change="time_start_change_event" v-model="popup_time_value.start" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" placeholder="开始时间" placeholder-class="cr-grey" />
                                    </view>
                                </view>
                                <view class="form-gorup bg-white">
                                    <view class="form-gorup-title">结束时间</view>
                                    <view class="br-b">
                                        <uni-datetime-picker @change="time_end_change_event" v-model="popup_time_value.end" :border="false" :showFirstIcon="false" :hide-second="true" type="datetime" placeholder="结束时间" placeholder-class="cr-grey" />
                                    </view>
                                </view>
                                <view class="bottom-fixed padding-main">
                                    <button class="bg-main br-main cr-white round text-size" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">查询</button>
                                </view>
                            </form>
                        </view>
                    </view>
                </component-popup>
            </view>
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
    import componentPopup from '../../../../components/popup/popup';
    var currency_symbol = app.globalData.currency_symbol();
    var distribution_static_url = app.globalData.get_static_url('distribution', true) + 'app/';
    export default {
        data() {
            return {
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                distribution_static_url: distribution_static_url,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: currency_symbol,
                avatar: app.globalData.data.default_user_head_src,
                nickname: '用户名',
                data_base: null,
                user_level: null,
                extraction: null,
                superior: null,
                profit_ladder: null,
                nav_list: [],
                time_data: null,
                base_data: null,
                user_promotion_data: null,
                profit_data: null,
                stats_user_promotion_data_list: [],
                stats_base_data_list: [],
                stats_base_data_list_children: [],
                stats_profit_data_list: [],
                popup_time_status: false,
                form_submit_disabled_status: false,
                popup_time_value: { name: '自定义', start: '', end: '', index: '' },
            };
        },

        components: {
            componentNoData,
            componentPopup,
        },
        props: {},

        onLoad(params) {},

        onShow() {
            this.init();

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            init(e) {
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
                                this.set_user_base(user);
                            },
                        });
                    } else {
                        this.set_user_base(user);
                        this.get_data();
                    }
                }
            },

            // 设置用户基础信息
            set_user_base(user) {
                if ((user.avatar || null) != null) {
                    this.setData({ avatar: user.avatar });
                }
                if ((user.user_name_view || null) != null) {
                    this.setData({ nickname: user.user_name_view });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'user', 'distribution'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            // 选择时间处理
                            var time_data = data.time_data || null;
                            var temp_value = this.popup_time_value;
                            if (time_data != null) {
                                var temp = time_data[data.default_day];
                                temp_value.start = temp.start;
                                temp_value.end = temp.end;
                                temp_value.name = temp.name;
                            }
                            this.setData({
                                data_base: data.base || null,
                                user_level: data.user_level || null,
                                extraction: data.extraction || null,
                                superior: data.superior || null,
                                profit_ladder: data.profit_ladder || null,
                                nav_list: data.nav_list || [],
                                time_data: time_data,
                                stats_user_promotion_data_list: data.stats_user_promotion_data_list || [],
                                stats_base_data_list: data.stats_base_data_list || [],
                                stats_base_data_list_children: app.globalData.group_arry(data.stats_base_data_list, 2) || [],
                                stats_profit_data_list: data.stats_profit_data_list || [],
                                popup_time_value: temp_value,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: false,
                            });
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 2,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
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

            // 头像查看
            preview_event() {
                if (app.globalData.data.default_user_head_src != this.avatar) {
                    uni.previewImage({
                        current: this.avatar,
                        urls: [this.avatar],
                    });
                }
            },

            // 头像加载错误
            user_avatar_error(e) {
                this.setData({
                    avatar: app.globalData.data.default_user_head_src,
                });
            },

            // 时间选择开启弹层
            popup_time_event(e) {
                this.setData({
                    popup_time_status: true,
                });
            },

            // 时间选择关闭弹层
            popup_time_close_event(e) {
                this.setData({
                    popup_time_status: false,
                });
            },

            // 时间快捷选择
            quit_time_event(e) {
                var index = e.currentTarget.dataset.index;
                var item = this.time_data[index];
                var temp_value = this.popup_time_value;
                temp_value.start = item.start;
                temp_value.end = item.end;
                temp_value.index = index;
                this.setData({
                    popup_time_value: temp_value,
                });
            },

            // 自定义开始时间事件
            time_start_change_event(e) {
                var temp_value = this.popup_time_value;
                temp_value.start = e;
                temp_value.index = '';
                this.setData({
                    popup_time_value: temp_value,
                });
            },

            // 自定义结束时间事件
            time_end_change_event(e) {
                var temp_value = this.popup_time_value;
                temp_value.end = e;
                temp_value.index = '';
                this.setData({
                    popup_time_value: temp_value,
                });
            },

            // 数据提交
            form_submit(e) {
                this.setData({
                    form_submit_disabled_status: true,
                });
                uni.showLoading({
                    title: '查询中...',
                });
                uni.request({
                    url: app.globalData.get_request_url('stats', 'user', 'distribution'),
                    method: 'POST',
                    data: this.popup_time_value,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var temp_value = this.popup_time_value;
                            temp_value.name = (temp_value.index || null) == null ? ((temp_value.start || null) == null && (temp_value.end || null) == null ? '全部' : '自定义') : this.time_data[temp_value.index]['name'];
                            this.setData({
                                popup_time_status: false,
                                form_submit_disabled_status: false,
                                stats_user_promotion_data_list: data.stats_user_promotion_data_list || [],
                                stats_base_data_list: data.stats_base_data_list || [],
                                stats_base_data_list_children: app.globalData.group_arry(data.stats_base_data_list, 2) || [],
                                popup_time_value: temp_value,
                            });
                        } else {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast('提交失败，请重试！');
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            form_submit_disabled_status: false,
                        });
                        uni.hideLoading();
                        app.globalData.showToast('服务器请求出错');
                    },
                });
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
        },
    };
</script>
<style>
    @import './user.css';
</style>
