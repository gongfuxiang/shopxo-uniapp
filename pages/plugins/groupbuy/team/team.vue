<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="padding-horizontal-main padding-top-main">
                <view class="border-radius-main bg-white padding-main spacing-mb">
                    <view class="flex-row gap-20" :data-value="'/pages/plugins/groupbuy/detail/detail?id=' + groupbuy.id" @tap="url_event">
                        <image :src="goods.images" mode="aspectFill" class="team-goods-image radius"></image>
                        <view class="flex-1 flex-width">
                            <view class="single-text fw-b">{{ groupbuy.title || goods.title }}</view>
                            <view class="margin-top-xs">
                                <text class="groupbuy-tag cr-white bg-main text-size-xs radius padding-horizontal-sm">{{ groupbuy.group_number }}{{ $t('groupbuy.groupbuy.people_team') }}</text>
                            </view>
                            <view class="margin-top-sm">
                                <text class="cr-main fw-b">{{ currency_symbol }}{{ groupbuy.groupbuy_price_text || groupbuy.min_groupbuy_price }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="border-radius-main padding-main spacing-mb team-status-panel" :class="team.status == 1 ? 'team-status-panel-success' : 'bg-white'">
                    <block v-if="team.status == 0">
                        <view class="tc fw-b text-size-md">{{ $t('groupbuy.groupbuy.grouping_need') }}<text class="cr-red">{{ team.remain_number }}</text>{{ $t('common.person_unit') }}</view>
                        <view v-if="countdown_show" class="tc margin-top-sm flex-row align-c jc-c flex-wrap gap-10">
                            <text class="cr-grey text-size-xs">{{ $t('common.remain') }}</text>
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
                            <text class="cr-grey text-size-xs">{{ $t('common.end') }}</text>
                        </view>
                    </block>
                    <block v-else-if="team.status == 1">
                        <view class="team-status-success tc">
                            <view class="team-success-visual">
                                <view class="team-success-icon-wrap">
                                    <view class="team-success-spark team-success-spark-1"></view>
                                    <view class="team-success-spark team-success-spark-2"></view>
                                    <view class="team-success-spark team-success-spark-3"></view>
                                    <iconfont name="icon-checked-smooth" size="56rpx" color="#ffffff"></iconfont>
                                </view>
                            </view>
                            <view class="team-success-title">{{ $t('groupbuy.groupbuy.group_success') }}</view>
                            <view class="team-success-desc cr-grey text-size-sm">{{ $t('groupbuy.groupbuy.group_full_success') }}</view>
                            <view class="team-success-tags flex-row jc-c flex-wrap">
                                <text class="team-success-tag">{{ $t('groupbuy.groupbuy.full_group') }}</text>
                                <text class="team-success-tag">{{ groupbuy.group_number }}{{ $t('groupbuy.groupbuy.people_team') }}</text>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="team-status-fail tc">
                            <view class="team-fail-icon-wrap">
                                <iconfont name="icon-sigh" size="48rpx" color="#999999"></iconfont>
                            </view>
                            <view class="fw-b text-size-lg cr-red">{{ $t('groupbuy.groupbuy.group_fail') }}</view>
                            <view class="cr-grey text-size-xs margin-top-sm">{{ $t('groupbuy.groupbuy.group_fail_tips') }}</view>
                        </view>
                    </block>

                    <view class="team-members flex-row flex-wrap jc-c margin-top-main">
                        <view v-for="(item, index) in members" :key="item.user_id" class="member-item tc">
                            <image :src="item.avatar" mode="aspectFill" class="member-avatar radius"></image>
                            <view v-if="item.is_team_leader == 1" class="leader-badge bg-main cr-white text-size-xss radius padding-horizontal-xs">{{ $t('groupbuy.groupbuy.team_leader') }}</view>
                            <view class="text-size-xs cr-grey margin-top-xs single-text">{{ item.user_name_view }}</view>
                        </view>
                        <view v-for="(item, index) in empty_slots" :key="item.slot_key" class="member-item tc">
                            <view class="member-avatar member-empty bg-grey-f5 cr-grey-c radius">?</view>
                        </view>
                    </view>

                    <view v-if="team.status == 0" class="margin-top-main">
                        <button v-if="user == null" class="btn round bg-main cr-white text-size-md wh-auto" type="default" @tap="login_event" hover-class="none">{{ $t('groupbuy.groupbuy.login_to_join') }}</button>
                        <block v-else>
                            <button class="btn round bg-main cr-white text-size-md wh-auto margin-bottom-main" type="default" @tap="join_team_event" hover-class="none">{{ $t('groupbuy.groupbuy.join_now') }}</button>
                            <button class="btn round bg-white br-main cr-main text-size-md wh-auto" type="default" hover-class="none" @tap="popup_share_event">{{ $t('groupbuy.groupbuy.invite_friends') }}</button>
                            <view v-if="is_leader" class="tc margin-top-main">
                                <text class="cr-grey text-size-xs" @tap="team_cancel_event">{{ $t('groupbuy.groupbuy.cancel_open') }}</text>
                            </view>
                        </block>
                    </view>
                </view>

                <component-groupbuy-play-rules :propConfig="groupbuy_config" :propPlayCurrentStep="play_current_step" :propPlaySideNav="play_side_nav"></component-groupbuy-play-rules>

                <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            </view>
        </block>
        <block v-else>
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </block>
        <!-- 分享弹窗 -->
        <component-share-popup ref="share"></component-share-popup>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGroupbuyPlayRules from '../components/groupbuy-play-rules/groupbuy-play-rules';
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
                groupbuy: {},
                goods: {},
                members: [],
                empty_slots: [],
                groupbuy_config: {},
                play_side_nav: [],
                user: null,
                is_leader: false,
                play_current_step: 2,
                countdown_show: false,
                countdown_hour: '00',
                countdown_minute: '00',
                countdown_second: '00',
                countdown_key: '',
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGroupbuyPlayRules,
            componentSharePopup,
            componentCountdown,
        },
        onLoad(params) {
            // 参数处理
            params = app.globalData.launch_params_handle(params || {});
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            this.setData({
                params: params || {},
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 获取数据
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },

        // 分享
        onShareAppMessage() {
            var share = app.globalData.share_content_handle(this.share_info || {});
            return {
                title: share.title,
                path: share.path + share.query,
                imageUrl: share.img,
            };
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('team', 'index', 'groupbuy'),
                    method: 'POST',
                    data: { id: this.params.id || 0 },
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var team = result.team || {};
                            var user = result.user || null;
                            var is_leader = user != null && team.leader_user_id == user.id;
                            var groupbuy = result.groupbuy || {};
                            var goods = result.goods || {};
                            var share_title = groupbuy.title || goods.title || this.$t('groupbuy.groupbuy.invite_you');
                            var share_desc = this.$t('common.still_need') + (team.remain_number || 0) + this.$t('groupbuy.groupbuy.people_group_invite');
                            var countdown_time = this.parse_countdown_time(team);
                            var empty_slots_raw = result.empty_slots || [];
                            var empty_slots = [];
                            for (var ei = 0; ei < empty_slots_raw.length; ei++) {
                                empty_slots.push({ slot_key: 'empty-' + ei });
                            }
                            this.setData({
                                team: team,
                                groupbuy: groupbuy,
                                goods: goods,
                                members: result.members || [],
                                empty_slots: empty_slots,
                                groupbuy_config: result.groupbuy_config || {},
                                play_side_nav: result.play_side_nav || [],
                                user: user,
                                is_leader: is_leader,
                                play_current_step: result.play_current_step || 2,
                                countdown_show: countdown_time.show,
                                countdown_hour: countdown_time.hour,
                                countdown_minute: countdown_time.minute,
                                countdown_second: countdown_time.second,
                                countdown_key: 'team-countdown-' + (team.id || 0) + '-' + countdown_time.hour + countdown_time.minute + countdown_time.second,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                share_info: {
                                    title: share_title,
                                    desc: share_desc,
                                    path: '/pages/plugins/groupbuy/team/team',
                                    query: 'id=' + team.id,
                                    img: goods.images || '',
                                },
                            });
                            // 分享菜单处理
                            app.globalData.page_share_handle(this.share_info);
                        } else {
                            this.setData({
                                data_bottom_line_status: false,
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_bottom_line_status: false,
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

            // 登录
            login_event() {
                app.globalData.url_open('/pages/login/login?event_callback=groupbuy_team');
            },

            // 立即参团
            join_team_event() {
                app.globalData.url_open('/pages/plugins/groupbuy/detail/detail?id=' + this.groupbuy.id + '&team_id=' + this.team.id);
            },

            // 取消开团
            team_cancel_event() {
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('groupbuy.groupbuy.confirm_cancel'),
                    success: (result) => {
                        if (result.confirm) {
                            uni.showLoading({ title: this.$t('common.processing_in_text') });
                            uni.request({
                                url: app.globalData.get_request_url('teamcancel', 'index', 'groupbuy'),
                                method: 'POST',
                                data: { team_id: this.team.id },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, 'success');
                                        this.get_data();
                                    } else {
                                        app.globalData.showToast(res.data.msg);
                                    }
                                },
                                fail: () => {
                                    uni.hideLoading();
                                    app.globalData.showToast(this.$t('common.internet_error_tips'));
                                },
                            });
                        }
                    },
                });
            },

            // 链接事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 分享开启弹层
            popup_share_event(e) {
                if (!app.globalData.is_single_page_check()) {
                    return false;
                }
                if ((this.$refs.share || null) != null) {
                    this.$refs.share.init({
                        status: true,
                        share_info: this.share_info,
                    });
                }
            },
        },
    };
</script>
<style scoped>
    @import './team.css';
</style>
