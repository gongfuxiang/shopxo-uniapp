<template>
    <view class="lottery-turn-page" :class="{ 'lottery-turn-page-loaded': lotteryPageOk }">
        <block v-if="lotteryPageOk">
            <view class="lottery-turn-page-inner">
                <view v-if="lotteryTurn" class="lottery-top-bar">
                    <view class="lottery-top-left lottery-top-asset-panel">
                        <text class="lottery-asset-text">{{ lotteryTurnBarText }}</text>
                    </view>
                    <view
                        v-if="Array.isArray(lotteryTurn.turn_rules_text) && lotteryTurn.turn_rules_text.length > 0"
                        class="lottery-rules-btn"
                        @tap="rulesPopupVisible = true"
                    >
                        ?
                    </view>
                </view>

                <component-lottery-turn
                    ref="lotteryTurnComp"
                    :nImg="nImg"
                    :heroTitleImg="heroTitleImageUrl"
                    :sectors="sectorsList"
                    :sectorDeg="sectorDegNum"
                    :ringCount="ringCountNum"
                    :chancesText="hubCenterMainText"
                    :hubCapLabel="hubCenterCapLabel"
                    :hubDrawCta="hubCenterDrawCta"
                    :hubBusy="isDrawing"
                    @spinDone="onSpinDone"
                    @hubDraw="beforeDraw"
                >
                    <template slot="footer-draw">
                        <view class="lottery-turn-footer-draw">
                            <button type="default" class="lottery-turn-draw-btn" :disabled="isDrawing" @tap="beforeDraw">
                                <image
                                    v-if="lotteryTurn && lotteryTurn.draw_start_image"
                                    class="lottery-turn-draw-btn-img"
                                    :src="lotteryTurn.draw_start_image"
                                    mode="aspectFit"
                                />
                                <text v-else class="lottery-turn-draw-btn-txt">{{ drawNowText }}</text>
                                <text v-if="lotteryTurn && lotteryTurn.draw_price_tips" class="lottery-turn-draw-sub">{{ lotteryTurn.draw_price_tips }}</text>
                            </button>
                        </view>
                    </template>
                </component-lottery-turn>
            </view>

            <view class="page-width-max lottery-bottom-fixed-cluster">
                <view v-if="marqueeList.length > 0" class="lottery-marquee-wrap">
                    <view class="lottery-marquee-inner">
                        <view class="lottery-marquee-row">
                            <block v-for="rep in marqueeDuplicateRuns" :key="rep">
                                <text
                                    v-for="(mv, mi) in marqueeList"
                                    :key="mi"
                                    class="lottery-marquee-item"
                                >
                                    <text v-if="(mv.user_mask || '').toString().trim()">{{ mv.user_mask }}，</text>
                                    <text>抽中{{ mv.reward_name || '-' }} </text>
                                    <text class="lottery-marquee-em">刚刚</text>
                                </text>
                            </block>
                        </view>
                    </view>
                </view>

                <view class="lottery-record-entry" data-value="/pages/plugins/lottery/record/record" @tap="urlEvent">中奖记录</view>
            </view>

            <view v-if="rulesPopupVisible" class="lottery-rules-mask" @tap="rulesPopupVisible = false">
                <view class="lottery-rules-dialog" @tap.stop>
                    <view class="lottery-rules-title">抽奖规则</view>
                    <scroll-view :scroll-y="true" class="lottery-rules-scroll">
                        <text class="lottery-rules-text">{{ rulesDisplayText }}</text>
                    </scroll-view>
                    <button type="default" class="lottery-rules-confirm round bg-red cr-white text-size" @tap="rulesPopupVisible = false">{{ confirmBtnText }}</button>
                </view>
            </view>

            <view v-if="resultModalVisible" class="lottery-result-mask">
                <view class="lottery-result-dialog" @tap.stop>
                    <view class="lottery-result-bd">
                        <image
                            v-if="resultModalBgUrl"
                            class="lottery-result-bd-bg-img"
                            :src="resultModalBgUrl"
                            mode="aspectFill"
                        />
                        <view class="lottery-result-layer">
                            <scroll-view scroll-y enable-flex class="lottery-result-scroll" :show-scrollbar="false">
                                <view class="lottery-result-scroll-inner">
                                    <text class="lottery-result-title">{{ resultModalTitle }}</text>
                                    <view v-if="resultModalShowPrizeIcon" class="lottery-result-prize-wrap radius">
                                        <image
                                            class="lottery-result-prize-icon"
                                            :src="resultModalPrizeIcon"
                                            :alt="resultModalPrizeName"
                                            mode="aspectFit"
                                        />
                                    </view>
                                    <text class="lottery-result-desc">{{ resultModalDesc }}</text>
                                </view>
                            </scroll-view>
                            <button type="default" class="lottery-result-confirm round" @tap="closeResultModal">{{ confirmBtnText }}</button>
                        </view>
                    </view>
                </view>
            </view>
        </block>

        <component-no-data
            v-else
            :propStatus="data_list_loding_status"
            :propMsg="data_list_loding_msg"
            propLoadingLogoTop="35vh"
        ></component-no-data>

        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentLotteryTurn from '@/pages/plugins/lottery/components/lottery-turn/lottery-turn';

    export default {
        components: {
            componentCommon,
            componentNoData,
            componentLotteryTurn,
        },
        data() {
            return {
                nImg: '',
                isDrawing: false,
                lotteryTurn: null,
                lastDrawResult: null,
                resultSuccessImage: '',
                resultFailImage: '',
                resultFailTitle: '谢谢参与',
                resultFailDesc: '再努力努力肯定就会中哦！',
                resultSuccessTitle: '恭喜您获得',
                resultModalVisible: false,
                resultModalTitle: '',
                resultModalDesc: '',
                resultModalShowPrizeIcon: false,
                resultModalPrizeIcon: '',
                resultModalPrizeName: '',
                resultModalBgUrl: '',
                rulesPopupVisible: false,
                share_info: {},
                marqueeList: [],
                data_list_loding_status: 1,
                data_list_loding_msg: '',
            };
        },
        computed: {
            /** 接口返回活动启用时可渲染转盘主区域 */
            lotteryPageOk() {
                const t = this.lotteryTurn;
                return !!(t && t.enable !== false);
            },
            /** 顶部左侧资产条：优先后台文案，否则余额+积分 */
            lotteryTurnBarText() {
                const t = this.lotteryTurn;
                if (!t) {
                    return '';
                }
                const s = String(t.turn_user_assets_bar_text || '').trim();
                if (s) {
                    return s;
                }
                return '余额：' + (t.user_wallet_money || '0.00') + '，积分：' + (t.user_integral || '0');
            },
            /** 弹窗类按钮「确认」文案（多语言） */
            confirmBtnText() {
                return this.$t ? this.$t('common.confirm') : '确认';
            },
            /** 底部主按钮默认「立即抽奖」 */
            drawNowText() {
                return this.$t ? this.$t('pages.plugins-lottery-turn-draw') : '立即抽奖';
            },
            /** 转盘中心次数旁说明，如「可用次数」 */
            hubCapLabelText() {
                return this.$t ? this.$t('pages.plugins-lottery-turn-chances-label') : '可用次数';
            },
            /** 规则弹窗：turn_rules_text 数组合并为一段文本 */
            rulesDisplayText() {
                const lines = (this.lotteryTurn && this.lotteryTurn.turn_rules_text) || [];
                if (!Array.isArray(lines)) {
                    return '';
                }
                const out = [];
                for (let i = 0; i < lines.length; i++) {
                    const s = String(lines[i] || '').trim();
                    if (s) {
                        out.push(s);
                    }
                }
                return out.join('\n');
            },
            /** 跑马灯无缝滚动：两份相同的 DOM 拼接 */
            marqueeDuplicateRuns() {
                return [0, 1];
            },
            /** 标题图：优先 App 端图，否则 PC 端图 */
            heroTitleImageUrl() {
                const t = this.lotteryTurn;
                if (!t) {
                    return '';
                }
                const appImg = String(t.banner_title_image_app || '').trim();
                const web = String(t.banner_title_image || '').trim();
                return appImg || web || '';
            },
            /** 扇区列表，传给 lottery-turn 绘制盘面 */
            sectorsList() {
                const t = this.lotteryTurn;
                if (!t || !Array.isArray(t.sectors)) {
                    return [];
                }
                return t.sectors;
            },
            /** 每扇区角度，来自后台 sector_deg */
            sectorDegNum() {
                const t = this.lotteryTurn;
                const v = t ? parseFloat(t.sector_deg) : 0;
                return isNaN(v) ? 0 : v;
            },
            /** 扇区总数 ring_count，用于盘面分段 */
            ringCountNum() {
                const t = this.lotteryTurn;
                const v = t ? parseInt(t.ring_count, 10) : 0;
                return isNaN(v) ? 0 : v;
            },
            /** 是否配置了每日抽奖次数上限（>0 显示数字 + 「可用次数」） */
            turnDailyLimitGt0() {
                const t = this.lotteryTurn;
                if (!t || t.turn_user_daily_draw_limit === undefined || t.turn_user_daily_draw_limit === null || t.turn_user_daily_draw_limit === '') {
                    return false;
                }
                const lim = parseInt(t.turn_user_daily_draw_limit, 10);
                return !isNaN(lim) && lim > 0;
            },
            /** 中心圆主文案：有限次为剩余次数，未限制时为「立即抽奖」 */
            hubCenterMainText() {
                const t = this.lotteryTurn;
                if (!t) {
                    return '';
                }
                if (!this.turnDailyLimitGt0) {
                    return this.drawNowText;
                }
                return String(t.turn_chances_display != null ? t.turn_chances_display : '');
            },
            /** 中心圆副文案：仅有限次时显示「可用次数」 */
            hubCenterCapLabel() {
                if (!this.turnDailyLimitGt0) {
                    return '';
                }
                return this.hubCapLabelText;
            },
            /** 中心圆是否为「立即抽奖」模式（样式略缩小字号） */
            hubCenterDrawCta() {
                return !this.turnDailyLimitGt0 && !!this.lotteryTurn;
            },
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 获取数据
            this.getPageData();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);
        },
        methods: {
            /** 底部「中奖记录」等 data-value 链接跳转 */
            urlEvent(e) {
                app.globalData.url_event(e);
            },
            /** 子组件转盘动画结束：结束抽奖态并打开结果弹窗 */
            onSpinDone() {
                this.isDrawing = false;
                this.openResultModal();
            },
            /** 根据 lastDrawResult 填充中奖/未中奖弹窗 */
            openResultModal() {
                const d = this.lastDrawResult || {};
                const isNone = d.reward_type === 'none';
                const bgRemoteRaw = isNone ? this.resultFailImage : this.resultSuccessImage;
                const bgRemote = bgRemoteRaw ? String(bgRemoteRaw).trim() : '';

                if (isNone) {
                    this.resultModalTitle = this.resultFailTitle || '谢谢参与';
                    this.resultModalShowPrizeIcon = false;
                    this.resultModalPrizeIcon = '';
                    this.resultModalPrizeName = '';
                    this.resultModalDesc = this.resultFailDesc || '再努力努力肯定就会中哦！';
                } else {
                    this.resultModalTitle = this.resultSuccessTitle || '恭喜您获得';
                    const icon = d.icon || '';
                    this.resultModalShowPrizeIcon = !!icon;
                    this.resultModalPrizeIcon = icon ? String(icon).trim() : '';
                    this.resultModalPrizeName = d.name || '';
                    this.resultModalDesc = d.name || '';
                }

                this.resultModalBgUrl = bgRemote;
                this.resultModalVisible = true;
            },
            /** 关闭结果弹窗并刷新页面数据（次数等） */
            closeResultModal() {
                this.resultModalVisible = false;
                this.resultModalBgUrl = '';
                this.lastDrawResult = null;
                this.getPageData();
            },
            /** 点击立即抽奖前：防重复、登录校验 */
            beforeDraw() {
                if (this.isDrawing) {
                    return;
                }
                if (app.globalData.get_user_info(this, 'beforeDraw') == false) {
                    return;
                }
                this.drawAction();
            },
            /** 请求 lottery/draw 接口，成功后 nextTick 调子组件 runSpin（小程序里比 props+watch 可靠） */
            drawAction() {
                this.isDrawing = true;
                uni.request({
                    url: app.globalData.get_request_url('draw', 'turn', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            this.lastDrawResult = data;
                            let ringIndex = parseInt(data.ring_index || 0, 10);
                            if (isNaN(ringIndex)) {
                                ringIndex = 0;
                            }
                            if (this.lotteryTurn) {
                                const patch = {
                                    user_wallet_money:
                                        data.user_wallet_money !== undefined ? data.user_wallet_money : this.lotteryTurn.user_wallet_money,
                                    user_integral: data.user_integral !== undefined ? data.user_integral : this.lotteryTurn.user_integral,
                                };
                                if (data.turn_user_assets_bar_text !== undefined && data.turn_user_assets_bar_text !== null) {
                                    patch.turn_user_assets_bar_text = data.turn_user_assets_bar_text;
                                }
                                ['turn_user_daily_draw_limit', 'turn_user_daily_draw_used_today', 'turn_user_daily_draw_remaining_today'].forEach((k) => {
                                    if (data[k] !== undefined && data[k] !== null) {
                                        patch[k] = data[k];
                                    }
                                });
                                /* 仅在有每日上限时同步次数文案；未限制则中心圆始终用 hubCenterMainText 显示「立即抽奖」 */
                                let limAfter = this.lotteryTurn ? parseInt(this.lotteryTurn.turn_user_daily_draw_limit, 10) : NaN;
                                if (
                                    data.turn_user_daily_draw_limit !== undefined &&
                                    data.turn_user_daily_draw_limit !== null &&
                                    String(data.turn_user_daily_draw_limit).trim() !== ''
                                ) {
                                    limAfter = parseInt(data.turn_user_daily_draw_limit, 10);
                                }
                                if (
                                    !isNaN(limAfter) &&
                                    limAfter > 0 &&
                                    data.turn_chances_display !== undefined &&
                                    data.turn_chances_display !== null
                                ) {
                                    patch.turn_chances_display = data.turn_chances_display;
                                }
                                this.lotteryTurn = Object.assign({}, this.lotteryTurn, patch);
                            }
                            const ri = ringIndex;
                            this.$nextTick(() => {
                                const comp = this.$refs.lotteryTurnComp;
                                if (comp && typeof comp.runSpin === 'function') {
                                    comp.runSpin(ri);
                                }
                            });
                        } else {
                            this.isDrawing = false;
                            app.globalData.showToast(res.data.msg || '抽奖失败');
                        }
                    },
                    fail: () => {
                        this.isDrawing = false;
                        app.globalData.showToast(this.$t ? this.$t('common.internet_error_tips') : '网络异常');
                    },
                });
            },
            /** 请求 lottery/index 拉取活动配置、跑马灯、背景图与分享信息 */
            getPageData() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'turn', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            const turn = data.lottery_turn || {};
                            this.marqueeList = Array.isArray(data.marquee_list) ? data.marquee_list : [];
                            this.lotteryTurn = turn;
                            if (turn.enable === false) {
                                const tip = String(turn.error_tips || '').trim() || '活动暂不可用';
                                this.data_list_loding_status = 0;
                                this.data_list_loding_msg = tip;
                            } else {
                                this.data_list_loding_status = 3;
                                this.data_list_loding_msg = '';
                            }
                            this.resultSuccessImage = turn.result_success_image || '';
                            this.resultFailImage = turn.result_fail_image || '';
                            this.resultFailTitle = turn.result_fail_title || '谢谢参与';
                            this.resultFailDesc = turn.result_fail_desc || '再努力努力肯定就会中哦！';
                            this.resultSuccessTitle = turn.result_success_title || '恭喜您获得';
                            this.nImg = turn.index_bg_app || '';
                            const defaultTitle = this.$t ? this.$t('pages.plugins-lottery-turn') : '转盘抽奖';
                            const shareTitle = String(turn.banner_title || '').trim() || defaultTitle;
                            let shareDesc = String(turn.banner_subtitle || '').trim();
                            if (!shareDesc) {
                                shareDesc = shareTitle;
                            }
                            const shareImg =
                                String(turn.banner_title_image_app || '').trim() ||
                                String(turn.banner_title_image || '').trim() ||
                                String(turn.index_bg_app || '').trim() ||
                                '';
                            this.setData({
                                share_info: {
                                    title: shareTitle,
                                    desc: shareDesc,
                                    path: '/pages/plugins/lottery/turn/turn',
                                    query: '',
                                    img: shareImg,
                                },
                            });
                        } else {
                            this.marqueeList = [];
                            this.lotteryTurn = null;
                            const errMsg = String(res.data.msg || '').trim() || '加载失败';
                            this.data_list_loding_status = 0;
                            this.data_list_loding_msg = errMsg;
                            app.globalData.showToast(errMsg);
                        }
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        this.lotteryTurn = null;
                        const errMsg = this.$t ? this.$t('common.internet_error_tips') : '网络异常';
                        this.data_list_loding_status = 2;
                        this.data_list_loding_msg = errMsg;
                        app.globalData.showToast(errMsg);
                    },
                });
            },
        },
    };
</script>

<style>
    .lottery-turn-page {
        position: relative;
        box-sizing: border-box;
        /* 含底部安全区，否则渐变常见在 Home Indicator 上方「断开」露全局灰底 */
        min-height: calc(100vh + constant(safe-area-inset-bottom));
        min-height: calc(100vh + env(safe-area-inset-bottom));
    }

    /* 与九宫格页一致：加载中不铺主题渐变，避免闪一整屏红底 */
    .lottery-turn-page-loaded {
        background: linear-gradient(180deg, #1f080c 0%, #3a1018 34%, #6a1826 68%, #9c2838 100%);
        background-color: #9c2838;
    }
    .lottery-turn-page-inner {
        box-sizing: border-box;
    }
    .lottery-top-bar {
        position: absolute;
        top: 20rpx;
        left: 24rpx;
        right: 24rpx;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }
    .lottery-top-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        min-width: 0;
    }
    .lottery-top-asset-panel {
        max-width: 80%;
        padding: 14rpx 20rpx;
        border-radius: 16rpx;
        background: rgba(0, 0, 0, 0.52);
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.25);
    }
    .lottery-asset-text {
        display: block;
        color: #fff;
        font-size: 24rpx;
        line-height: 1.55;
        text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.45);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .lottery-rules-btn {
        min-width: 56rpx;
        height: 56rpx;
        line-height: 52rpx;
        text-align: center;
        border-radius: 50%;
        background: #ffd54f;
        color: #7a4b00;
        font-size: 34rpx;
        font-weight: 700;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
    }

    .lottery-turn-footer-draw {
        position: relative;
        z-index: 12;
        /* 与转盘拉开距离；底部为固定跑马灯/安全区留白（替代原先 page-inner 260rpx 造成的空白滚动） */
        padding: 80rpx 32rpx 120rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    @media screen and (max-height: 700px) {
        .lottery-turn-footer-draw {
            padding-top: 48rpx;
            padding-bottom: 96rpx;
        }
    }
    .lottery-turn-draw-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6rpx;
        min-width: 260rpx;
        max-width: min(560rpx, 92vw);
        padding: 14rpx 40rpx 16rpx;
        line-height: 1.25;
        height: auto;
        min-height: 0;
        border-radius: 96rpx;
        background: linear-gradient(180deg, #fff8e1 0%, #ffd54f 45%, #ffb300 100%);
        border: 4rpx solid rgba(255, 255, 255, 0.65);
        box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.35);
    }
    .lottery-turn-draw-btn::after {
        border: none;
    }
    .lottery-turn-draw-btn-img {
        max-width: min(320rpx, 72vw);
        max-height: 56rpx;
        vertical-align: middle;
    }
    .lottery-turn-draw-btn-txt {
        font-size: 32rpx;
        font-weight: 700;
        color: #b71c1c;
        line-height: 1.25;
    }
    .lottery-turn-draw-sub {
        margin-top: 0;
        font-size: 22rpx;
        line-height: 1.3;
        color: rgba(183, 28, 28, 0.85);
    }

    .lottery-rules-mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 10070;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40rpx;
        box-sizing: border-box;
    }
    .lottery-rules-dialog {
        width: 100%;
        max-width: 640rpx;
        background: #fff;
        border-radius: 20rpx;
        padding: 28rpx;
        box-sizing: border-box;
    }
    .lottery-rules-title {
        text-align: center;
        font-size: 32rpx;
        font-weight: 600;
        color: #222;
    }
    .lottery-rules-scroll {
        max-height: 520rpx;
        margin-top: 20rpx;
    }
    .lottery-rules-text {
        display: block;
        font-size: 28rpx;
        color: #333;
        line-height: 1.65;
        white-space: pre-line;
        word-break: break-word;
    }
    .lottery-rules-confirm {
        margin-top: 20rpx;
        width: 100%;
    }

    .lottery-result-mask {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 10080;
        background: rgba(0, 0, 0, 0.55);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40rpx;
        box-sizing: border-box;
    }
    .lottery-result-dialog {
        width: 100%;
        max-width: 640rpx;
    }
    .lottery-result-bd {
        width: 100%;
        height: 800rpx;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    }
    .lottery-result-bd-bg-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
    }
    .lottery-result-layer {
        position: absolute;
        left: 0;
        right: 0;
        top: 420rpx;
        bottom: 0;
        z-index: 1;
        display: flex;
        flex-direction: column;
        padding: 0 32rpx;
        box-sizing: border-box;
    }
    .lottery-result-scroll {
        flex: 1;
        min-height: 0;
        width: 100%;
        height: 0;
    }
    .lottery-result-scroll-inner {
        text-align: center;
        padding-bottom: 16rpx;
        box-sizing: border-box;
    }
    .lottery-result-title {
        display: block;
        font-size: 40rpx;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.45);
        line-height: 1.35;
        margin-bottom: 20rpx;
    }
    .lottery-result-prize-wrap {
        width: 320rpx;
        height: 110rpx;
        margin: 0 auto;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .lottery-result-prize-icon {
        display: block;
        width: 100%;
        height: 100%;
    }
    .lottery-result-desc {
        display: block;
        font-size: 28rpx;
        color: rgba(255, 255, 255, 0.92);
        text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.45);
        margin-top: 10rpx;
        line-height: 1.4;
        word-break: break-word;
    }
    .lottery-result-confirm {
        flex-shrink: 0;
        align-self: center;
        display: inline-block;
        width: auto !important;
        min-width: 200rpx;
        margin: 20rpx 0 40rpx;
        padding: 12rpx 36rpx;
        font-size: 28rpx;
        line-height: 1.3;
        color: #fff;
        background: transparent;
        border: 2rpx solid #fff;
    }
    .lottery-result-confirm::after {
        border: none;
    }

    .lottery-bottom-fixed-cluster {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 45;
        width: 100%;
        box-sizing: border-box;
        pointer-events: none;
    }
    .lottery-bottom-fixed-cluster .lottery-marquee-wrap,
    .lottery-bottom-fixed-cluster .lottery-record-entry {
        pointer-events: auto;
    }

    .lottery-marquee-wrap {
        position: relative;
        width: 100%;
        z-index: 45;
        height: 72rpx;
        line-height: 72rpx;
        overflow: hidden;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        box-sizing: content-box;
        background: rgba(0, 0, 0, 0.45);
    }
    .lottery-marquee-inner {
        display: inline-block;
        white-space: nowrap;
        animation: lottery-marquee-turn-app 42s linear infinite;
    }
    .lottery-marquee-row {
        display: inline-flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        height: 72rpx;
    }
    .lottery-marquee-item {
        display: inline-block;
        margin-right: 48rpx;
        font-size: 24rpx;
        color: #eeeeee;
        white-space: nowrap;
    }
    .lottery-marquee-em {
        color: #ff5252;
        font-style: normal;
    }
    @keyframes lottery-marquee-turn-app {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    .lottery-record-entry {
        position: absolute;
        right: 22rpx;
        bottom: 120rpx;
        z-index: 50;
        background: rgba(0, 0, 0, 0.56);
        color: #fff;
        font-size: 24rpx;
        border-radius: 28rpx;
        padding: 14rpx 22rpx;
        line-height: 1;
        box-shadow: 0 4rpx 10rpx rgba(0, 0, 0, 0.25);
    }
</style>
