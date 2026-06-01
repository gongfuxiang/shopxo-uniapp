<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="padding-horizontal-main padding-top-main">
                <view class="border-radius-main bg-white padding-main spacing-mb">
                    <view class="flex-row gap-20" :data-value="'/pages/plugins/bargain/detail/detail?id=' + bargain.id" @tap="url_event">
                        <image :src="goods.images" mode="aspectFill" class="team-goods-image radius"></image>
                        <view class="flex-1 flex-width">
                            <view class="single-text fw-b">{{ bargain.title || goods.title }}</view>
                            <view class="margin-top-xs flex-row align-c flex-wrap gap-10">
                                <text class="bargain-tag br-main cr-main bg-white text-size-xss radius padding-horizontal-xs">{{ bargain.bargain_success_tag_text }}</text>
                                <text class="cr-grey text-size-xs">{{ bargain.bargain_success_text }}</text>
                            </view>
                            <view v-if="(team.spec_text || null) != null" class="margin-top-xs cr-grey text-size-xs single-text">{{ team.spec_text }}</view>
                            <view class="margin-top-sm team-goods-price cr-main fw-b">
                                <text class="price-symbol">{{ currency_symbol }}</text>
                                <text class="team-goods-price-num">{{ goods.goods_price_text || goods.price }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="border-radius-main padding-main spacing-mb team-status-panel pr" :class="team.status == 1 || team.status == 2 ? 'team-status-panel-success' : 'bg-white'">
                    <block v-if="team.status == 0">
                        <view class="tc fw-b text-size-md">砍价中，还差 <text class="cr-red">{{ team.remain_number }}</text> 人砍价成功</view>
                        <view v-if="countdown_show" class="tc margin-top-sm flex-row align-c jc-c flex-wrap gap-10">
                            <text class="cr-grey text-size-xs">剩余</text>
                            <component-countdown
                                :key="countdown_key"
                                :propHour="countdown_hour"
                                :propMinute="countdown_minute"
                                :propSecond="countdown_second"
                                propTimeBackgroundColor="#e54d42"
                                propTimeColor="#ffffff"
                                propDsColor="#666666"
                                :propTimeSize="24"
                                :propDsSize="24"
                                :propTimePadding="6"
                                propHourDs=" : "
                                propMinuteDs=" : "
                                propSecondDs=""
                            ></component-countdown>
                            <text class="cr-grey text-size-xs">结束</text>
                        </view>
                        <view class="team-bargain-price-block margin-top-main">
                            <view class="team-bargain-current-row">
                                <text class="team-bargain-label">当前价</text>
                                <text class="team-bargain-current-price">
                                    <text class="price-symbol">{{ currency_symbol }}</text>
                                    <text class="team-bargain-price-num">{{ team.current_price_text || team.display_current_price || team.current_price }}</text>
                                </text>
                            </view>
                            <view class="team-bargain-floor-row">底价 {{ currency_symbol }}{{ team.floor_price_text || team.floor_price }}</view>
                            <view class="team-bargain-progress-wrap">
                                <view class="team-bargain-progress-row flex-row align-c">
                                    <view class="team-bargain-progress flex-1 flex-width" :style="'--progress:' + (team.progress_percent || 0) + '%;'">
                                        <view class="team-bargain-progress-inner"></view>
                                    </view>
                                    <text class="team-bargain-progress-percent cr-main fw-b">{{ progress_percent_show(team.progress_percent) }}%</text>
                                </view>
                                <view class="team-bargain-progress-meta text-size-xs cr-grey">
                                    <text>已砍 {{ currency_symbol }}{{ team.cut_total_price_text || team.cut_total_price }}</text>
                                    <text>还剩 {{ currency_symbol }}{{ team.remain_price_text || team.remain_price }}</text>
                                </view>
                            </view>
                        </view>
                    </block>
                    <block v-else-if="team.status == 1 || team.status == 2">
                        <view class="team-bargain-confetti pa" aria-hidden="true">
                            <view v-for="(item, index) in confetti_list" :key="index" :class="'team-bargain-ribbon team-bargain-ribbon-' + (index + 1)"></view>
                        </view>
                        <view class="team-status-success tc">
                            <view class="team-success-visual">
                                <view class="team-bargain-success-icon">
                                    <iconfont name="icon-check" size="50rpx" color="#ffffff"></iconfont>
                                </view>
                            </view>
                            <view class="team-success-title">砍价成功</view>
                            <view class="team-success-desc">
                                恭喜您砍价成功，快去支付吧！
                                <text class="team-success-help-tag">{{ bargain.help_number || team.help_number || 0 }}人帮砍</text>
                            </view>
                            <view class="team-bargain-price-block team-success-price-block">
                                <view class="team-bargain-current-row team-success-current-row">
                                    <text class="team-bargain-label">当前</text>
                                    <text class="team-bargain-current-price">
                                        <text class="price-symbol">{{ currency_symbol }}</text>
                                        <text class="team-bargain-price-num">{{ team.pay_total_price_text || team.current_price_text || team.current_price }}</text>
                                    </text>
                                    <text class="team-bargain-cut-done-badge">已砍 {{ currency_symbol }}{{ team.cut_total_price_text || team.cut_total_price }}</text>
                                </view>
                                <view v-if="parseInt(team.buy_number || 1) > 1" class="team-bargain-qty-row">
                                    当前 {{ currency_symbol }}{{ team.current_price_text || team.current_price }} × {{ team.buy_number }}
                                </view>
                                <view v-if="(team.floor_price_text || team.floor_price || null) != null" class="team-bargain-floor-row team-success-floor-row">底价 {{ currency_symbol }}{{ team.floor_price_text || team.floor_price }}</view>
                            </view>
                        </view>
                    </block>
                    <block v-else-if="team.status == 3 || team.status == 4">
                        <view class="team-status-fail tc">
                            <iconfont name="icon-sigh" size="48rpx" color="#999999"></iconfont>
                            <view class="fw-b text-size-lg cr-red margin-top-main">砍价失败</view>
                            <view class="cr-grey text-size-xs margin-top-sm">很遗憾，本次砍价未成功</view>
                        </view>
                    </block>

                    <view v-if="team.status == 0" class="team-action-row margin-top-main flex-row align-c jc-c flex-wrap gap-10">
                        <block v-if="user == null">
                            <button class="btn round bg-main cr-white text-size-md" type="default" @tap="login_event" hover-class="none">登录后帮砍</button>
                        </block>
                        <block v-else>
                            <button v-if="help_action.can_help == 1" class="btn round bg-main cr-white text-size-md" type="default" @tap="help_cut_event" hover-class="none">立即帮砍</button>
                            <button v-else-if="help_action.has_helped == 1" class="btn round bg-main cr-white text-size-md" type="default" disabled hover-class="none">已帮砍</button>
                            <text v-else-if="help_action.is_owner == 1" class="cr-grey text-size-sm">请邀请帮砍</text>
                            <text v-else class="cr-grey text-size-sm">{{ help_action.tips || '暂无法帮砍' }}</text>
                            <button v-if="help_action.is_owner == 1 && (team_pay.can_pay == 1 || team_pay.has_system_order == 1)" class="btn round bg-main cr-white text-size-md" type="default" @tap="pay_event" hover-class="none">{{ team_pay.has_system_order == 1 ? '查看订单' : '立即支付' }}</button>
                        </block>
                        <button class="btn round bg-white br-main cr-main text-size-md" type="default" @tap="popup_share_event" hover-class="none">邀请帮砍</button>
                    </view>
                    <view v-else-if="team.status == 1 || team.status == 2" class="team-action-row team-success-pay-row margin-top-main tc">
                        <button v-if="user == null" class="btn round bg-main cr-white text-size-md wh-auto" type="default" @tap="login_event" hover-class="none">立即支付</button>
                        <button v-else-if="team_pay.has_system_order == 1 || team.has_system_order == 1" class="btn round bg-main cr-white text-size-md wh-auto" type="default" @tap="pay_event" hover-class="none">查看订单</button>
                        <button v-else-if="team_pay.can_pay == 1" class="btn round bg-main cr-white text-size-md wh-auto" type="default" @tap="pay_event" hover-class="none">立即支付</button>
                    </view>
                    <view v-if="help_action.is_owner == 1 && (team.status == 0 || team.status == 1) && team_pay.has_system_order != 1 && team.has_system_order != 1" class="tc margin-top-main">
                        <text class="cr-grey text-size-xs" @tap="team_cancel_event">取消发起砍价</text>
                    </view>
                </view>

                <view v-if="help_list.length > 0" class="border-radius-main bg-white padding-main spacing-mb">
                    <component-bargain-dot-title propTitle="砍价记录" propTextClass="text-size-sm"></component-bargain-dot-title>
                    <view v-for="(item, index) in help_list" :key="index" class="flex-row align-c gap-10 margin-bottom-main">
                        <image :src="item.avatar" mode="aspectFill" class="help-avatar radius"></image>
                        <view class="flex-1 flex-width">
                            <view class="text-size-sm">{{ item.user_name_view }}</view>
                            <view class="cr-grey text-size-xs">{{ item.add_time }}</view>
                        </view>
                        <view class="cr-main fw-b text-size-sm">-{{ currency_symbol }}{{ item.cut_price }}</view>
                    </view>
                </view>

                <component-bargain-play-rules :propConfig="bargain_config" :propPlayCurrentStep="play_current_step" :propPlaySideNav="play_side_nav"></component-bargain-play-rules>
                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentBargainPlayRules from '../components/bargain-play-rules/bargain-play-rules';
    import componentBargainDotTitle from '../components/bargain-dot-title/bargain-dot-title';
    import componentSharePopup from '@/components/share-popup/share-popup';
    import componentCountdown from '@/components/countdown/countdown';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                data_bottom_line_status: false,
                currency_symbol: app.globalData.currency_symbol(),
                team: {},
                bargain: {},
                goods: {},
                help_list: [],
                help_action: {},
                team_pay: {},
                bargain_config: {},
                play_side_nav: [],
                user: null,
                play_current_step: 2,
                countdown_show: false,
                countdown_hour: '00',
                countdown_minute: '00',
                countdown_second: '00',
                countdown_key: '',
                share_info: {},
                confetti_list: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentBargainPlayRules,
            componentBargainDotTitle,
            componentSharePopup,
            componentCountdown,
        },
        onLoad(params) {
            app.globalData.page_event_onload_handle(params);
            params = app.globalData.launch_params_handle(params || {});
            this.setData({ params: params || {} });
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            this.setData({
                user: app.globalData.get_user_info(this, 'init'),
            });
            this.get_data();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },
        onPullDownRefresh() {
            this.get_data();
        },
        onShareAppMessage() {
            var share = app.globalData.share_content_handle(this.share_info || {});
            return {
                title: share.title,
                path: share.path + share.query,
                imageUrl: share.img,
            };
        },
        methods: {
            progress_percent_show(percent) {
                var n = parseFloat(percent);
                if (isNaN(n) || n <= 0) {
                    return '0';
                }
                if (n >= 100) {
                    return '100';
                }
                n = Math.round(n * 10) / 10;
                return n % 1 === 0 ? String(Math.round(n)) : String(n);
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('team', 'index', 'bargain'),
                    method: 'POST',
                    data: { id: this.params.id || 0, record_id: this.params.record_id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var team = result.team || {};
                            var bargain = result.bargain || {};
                            var goods = result.goods || {};
                            var countdown_time = this.parse_countdown_time(team);
                            this.setData({
                                team: team,
                                bargain: bargain,
                                goods: goods,
                                help_list: result.help_list || [],
                                help_action: result.help_action || {},
                                team_pay: result.team_pay || {},
                                bargain_config: result.bargain_config || {},
                                play_side_nav: result.play_side_nav || [],
                                play_current_step: result.play_current_step || 2,
                                countdown_show: countdown_time.show,
                                countdown_hour: countdown_time.hour,
                                countdown_minute: countdown_time.minute,
                                countdown_second: countdown_time.second,
                                countdown_key: 'team-countdown-' + (team.id || 0) + '-' + countdown_time.hour + countdown_time.minute + countdown_time.second,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                share_info: {
                                    title: bargain.title || goods.title || '邀请你帮砍',
                                    desc: '还差' + (team.remain_number || 0) + '人帮砍，快来帮砍一刀吧',
                                    path: '/pages/plugins/bargain/team/team',
                                    query: 'id=' + team.id,
                                    img: goods.images || '',
                                },
                            });
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },
            parse_countdown_time(team) {
                team = team || {};
                var expire_time = parseInt(team.expire_time || 0);
                if (expire_time <= 0) {
                    return { show: false, hour: '00', minute: '00', second: '00' };
                }
                var left = expire_time - parseInt(Date.now() / 1000);
                if (left <= 0) {
                    return { show: false, hour: '00', minute: '00', second: '00' };
                }
                if ((team.countdown_h || null) != null && expire_time > parseInt(Date.now() / 1000)) {
                    return {
                        show: true,
                        hour: team.countdown_h || '00',
                        minute: team.countdown_m || '00',
                        second: team.countdown_s || '00',
                    };
                }
                return {
                    show: true,
                    hour: String(Math.floor(left / 3600)).padStart(2, '0'),
                    minute: String(Math.floor((left % 3600) / 60)).padStart(2, '0'),
                    second: String(left % 60).padStart(2, '0'),
                };
            },
            help_cut_event() {
                uni.request({
                    url: app.globalData.get_request_url('help', 'index', 'bargain'),
                    method: 'POST',
                    data: { record_id: this.team.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            app.globalData.showToast(res.data.msg || '帮砍成功', 'success');
                            this.get_data();
                        } else {
                            if (app.globalData.is_login_check(res.data, this, 'help_cut_event')) {
                                app.globalData.showToast(res.data.msg || this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                });
            },
            pay_event() {
                var tp = this.team_pay || {};
                if (tp.has_system_order == 1 && (tp.system_order_url || null) != null) {
                    app.globalData.url_open(tp.system_order_url);
                    return;
                }
                if (tp.can_pay != 1 || (tp.goods_data || '') == '') {
                    return;
                }
                var data = {
                    buy_type: 'goods',
                    goods_data: tp.goods_data,
                    bargain_id: this.bargain.id,
                    record_id: this.team.id,
                    is_bargain_success_pay: 1,
                };
                app.globalData.url_open('/pages/buy/buy?data=' + encodeURIComponent(base64.encode(JSON.stringify(data))));
            },
            team_cancel_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('common.cancel_confirm_tips'),
                    success: (res) => {
                        if (!res.confirm) {
                            return;
                        }
                        uni.request({
                            url: app.globalData.get_request_url('teamcancel', 'index', 'bargain'),
                            method: 'POST',
                            data: { record_id: this.team.id },
                            dataType: 'json',
                            success: (r) => {
                                if (r.data.code == 0) {
                                    app.globalData.showToast('取消成功', 'success');
                                    this.get_data();
                                } else {
                                    app.globalData.showToast(r.data.msg);
                                }
                            },
                        });
                    },
                });
            },
            login_event() {
                app.globalData.url_open('/pages/login/login?event_callback=init');
            },
            url_event(e) {
                app.globalData.url_event(e);
            },
            popup_share_event() {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({ status: true, share_info: this.share_info });
                }
            },
        },
    };
</script>
<style scoped>
    @import './team.css';
</style>
