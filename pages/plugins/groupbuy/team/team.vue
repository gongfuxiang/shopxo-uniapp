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
                                <text class="groupbuy-tag cr-white bg-main text-size-xs radius padding-horizontal-sm">{{ groupbuy.group_number }}人团</text>
                            </view>
                            <view class="margin-top-sm">
                                <text class="cr-main fw-b">{{ currency_symbol }}{{ groupbuy.groupbuy_price_text || groupbuy.min_groupbuy_price }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="border-radius-main padding-main spacing-mb team-status-panel" :class="team.status == 1 ? 'team-status-panel-success' : 'bg-white'">
                    <block v-if="team.status == 0">
                        <view class="tc fw-b text-size-md">拼团中，还差 <text class="cr-red">{{ team.remain_number }}</text> 人</view>
                        <view v-if="countdown_text != ''" class="tc cr-grey text-size-xs margin-top-sm">剩余 {{ countdown_text }} 结束</view>
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
                            <view class="team-success-title">拼团成功</view>
                            <view class="team-success-desc cr-grey text-size-sm">恭喜！本团已满员，拼团圆满成团啦~</view>
                            <view class="team-success-tags flex-row jc-c flex-wrap">
                                <text class="team-success-tag">满员成团</text>
                                <text class="team-success-tag">{{ groupbuy.group_number }}人团</text>
                            </view>
                        </view>
                    </block>
                    <block v-else>
                        <view class="team-status-fail tc">
                            <view class="team-fail-icon-wrap">
                                <iconfont name="icon-sigh" size="48rpx" color="#999999"></iconfont>
                            </view>
                            <view class="fw-b text-size-lg cr-red">拼团失败</view>
                            <view class="cr-grey text-size-xs margin-top-sm">很遗憾，本次拼团未成团</view>
                        </view>
                    </block>

                    <view class="team-members flex-row flex-wrap jc-c margin-top-main">
                        <view v-for="(item, index) in members" :key="'m-' + index" class="member-item tc">
                            <image :src="item.avatar" mode="aspectFill" class="member-avatar radius"></image>
                            <view v-if="item.is_team_leader == 1" class="leader-badge bg-main cr-white text-size-xss radius padding-horizontal-xs">团长</view>
                            <view class="text-size-xs cr-grey margin-top-xs single-text">{{ item.user_name_view }}</view>
                        </view>
                        <view v-for="(item, index) in empty_slots" :key="'e-' + index" class="member-item tc">
                            <view class="member-avatar member-empty bg-grey-f5 cr-grey-c radius">?</view>
                        </view>
                    </view>

                    <view v-if="team.status == 0" class="margin-top-main">
                        <button v-if="user == null" class="btn round bg-main cr-white text-size-md wh-auto" type="default" @tap="login_event" hover-class="none">登录后参团</button>
                        <block v-else>
                            <button class="btn round bg-main cr-white text-size-md wh-auto margin-bottom-main" type="default" @tap="join_team_event" hover-class="none">立即参团</button>
                            <button class="btn round bg-white br-main cr-main text-size-md wh-auto" type="default" open-type="share" hover-class="none">邀请好友参团</button>
                            <view v-if="is_leader" class="tc margin-top-main">
                                <text class="cr-grey text-size-xs" @tap="team_cancel_event">取消开团</text>
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
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGroupbuyPlayRules from '../components/groupbuy-play-rules/groupbuy-play-rules';
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
                countdown_text: '',
                countdown_timer: null,
                share_info: {},
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentBottomLine,
            componentGroupbuyPlayRules,
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params || {});
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

        // 页面卸载
        onUnload() {
            clearInterval(this.countdown_timer);
        },

        // 分享
        onShareAppMessage() {
            return this.share_info || {};
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
                        if (res.data.code == 0) {
                            var result = res.data.data;
                            var team = result.team || {};
                            var user = result.user || null;
                            var is_leader = user != null && team.leader_user_id == user.id;
                            this.setData({
                                team: team,
                                groupbuy: result.groupbuy || {},
                                goods: result.goods || {},
                                members: result.members || [],
                                empty_slots: result.empty_slots || [],
                                groupbuy_config: result.groupbuy_config || {},
                                play_side_nav: result.play_side_nav || [],
                                user: user,
                                is_leader: is_leader,
                                play_current_step: result.play_current_step || 2,
                                data_list_loding_status: 3,
                                data_bottom_line_status: true,
                                share_info: {
                                    title: (result.groupbuy || {}).title || '邀请你参团',
                                    path: team.share_url || ('/pages/plugins/groupbuy/team/team?id=' + team.id),
                                    imageUrl: (result.goods || {}).images || '',
                                },
                            });
                            this.countdown_init(team.expire_time || 0);
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
                        this.setData({
                            data_bottom_line_status: false,
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    },
                });
            },

            // 倒计时初始化
            countdown_init(expire_time) {
                clearInterval(this.countdown_timer);
                if (expire_time <= 0) {
                    return false;
                }
                var update = () => {
                    var left = parseInt(expire_time) - parseInt(Date.now() / 1000);
                    if (left <= 0) {
                        this.setData({ countdown_text: '00:00:00' });
                        clearInterval(this.countdown_timer);
                        return false;
                    }
                    var h = String(Math.floor(left / 3600)).padStart(2, '0');
                    var m = String(Math.floor((left % 3600) / 60)).padStart(2, '0');
                    var s = String(left % 60).padStart(2, '0');
                    this.setData({ countdown_text: h + ':' + m + ':' + s });
                };
                update();
                this.countdown_timer = setInterval(update, 1000);
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
                    content: '确定要取消当前拼团吗？',
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
        },
    };
</script>
<style scoped>
    @import './team.css';
</style>
