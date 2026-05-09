<template>
    <view class="lottery-egg-page" :class="{ 'lottery-egg-page-loaded': lotteryPageOk }">
        <block v-if="lotteryPageOk">
            <view class="lottery-egg-page-inner">
                <view v-if="lotteryEgg" class="lottery-top-bar">
                    <view class="lottery-top-left lottery-top-asset-panel">
                        <text class="lottery-asset-text">{{ lotteryEggBarText }}</text>
                    </view>
                    <view
                        v-if="Array.isArray(lotteryEgg.egg_rules_text) && lotteryEgg.egg_rules_text.length > 0"
                        class="lottery-rules-btn"
                        @tap="rulesPopupVisible = true"
                    >
                        ?
                    </view>
                </view>

                <component-lottery-egg
                    :nImg="nImg"
                    :heroTitleImg="heroTitleImageUrl"
                    :eggCells="eggCellsList"
                    :shellClose="eggShellClose"
                    :shellOpen="eggShellOpen"
                    :hammerImage="eggHammerImg"
                    :frameImage="eggFrameImg"
                    :chancesDisplay="eggChancesDisplayStr"
                    :chancesCapLabel="eggChancesCapLabel"
                    :strikeGen="strikeGen"
                    :strikeTargetIndex="strikeTargetIndex"
                    :brokenEggIndexes="brokenEggIndexes"
                    :busyDrawing="isDrawing"
                    @eggSelect="onEggSelect"
                    @strikeDone="onStrikeDone"
                >
                    <template slot="footer-extra">
                        <view v-if="lotteryEgg && lotteryEgg.draw_price_tips" class="lottery-egg-footer-draw">
                            <text class="lottery-egg-price-tips">{{ lotteryEgg.draw_price_tips }}</text>
                        </view>
                    </template>
                </component-lottery-egg>
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
                    <!-- 小程序里 background-image 易不显示；aspectFill 铺满裁切，避免 aspectFit 缩在中间像在盒子里没铺开 -->
                    <view class="lottery-result-bd">
                        <image
                            v-if="resultModalBgUrl"
                            class="lottery-result-bd-bg-img"
                            :src="resultModalBgUrl"
                            mode="aspectFill"
                        />
                        <!-- 中间区域可滚动 + 底部按钮固定在弹窗底（不依赖 inner 下边距，避免内容多时按钮被顶出） -->
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
    /**
     * 砸金蛋（插件 lottery · egg）
     * 接口：index = lottery/egg/index，draw = lottery/egg/draw
     */
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentLotteryEgg from '@/pages/plugins/lottery/components/lottery-egg/lottery-egg';

    export default {
        components: {
            componentCommon,
            componentNoData,
            componentLotteryEgg,
        },
        data() {
            return {
                /** 页面背景图 URL（接口 index_bg_app） */
                nImg: '',
                /** 子组件锤子敲击序列：递增触发 playStrike */
                strikeGen: 0,
                /** 本次敲击对应的蛋格索引（传给 lottery-egg） */
                strikeTargetIndex: -1,
                /** 用户点击的蛋格索引，抽奖成功后写入 brokenEggIndexes */
                pendingEggIndex: -1,
                /** 已砸开过的蛋格索引列表（本页会话内保持裂开图） */
                brokenEggIndexes: [],
                /** 请求开奖或锤子动画进行中，防重复点击 */
                isDrawing: false,
                /** 接口 lottery_egg 活动配置 */
                lotteryEgg: null,
                /** 最近一次 lottery/egg/draw 返回数据 */
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
                /** 结果弹窗背景图 URL（不用 CSS background，小程序用 image 显示） */
                resultModalBgUrl: '',
                rulesPopupVisible: false,
                /** 分享给好友/朋友圈用的标题、路径、配图 */
                share_info: {},
                /** 底部跑马灯最近中奖列表 */
                marqueeList: [],
                /** 1 加载中；2 网络失败；0 业务提示；3 正常（对应 no-data 组件） */
                data_list_loding_status: 1,
                data_list_loding_msg: '',
            };
        },
        computed: {
            /** 接口返回 enable 时可渲染砸蛋区域 */
            lotteryPageOk() {
                const e = this.lotteryEgg;
                return !!(e && e.enable !== false);
            },
            /** 顶部左侧资产条：优先后台 egg_user_assets_bar_text，否则余额+积分 */
            lotteryEggBarText() {
                const e = this.lotteryEgg;
                if (!e) {
                    return '';
                }
                const s = String(e.egg_user_assets_bar_text || '').trim();
                if (s) {
                    return s;
                }
                return '余额：' + (e.user_wallet_money || '0.00') + '，积分：' + (e.user_integral || '0');
            },
            /** 弹窗「确认」等多语言文案 */
            confirmBtnText() {
                return this.$t ? this.$t('common.confirm') : '确认';
            },
            /** 规则弹窗：egg_rules_text 数组合并展示 */
            rulesDisplayText() {
                const lines = (this.lotteryEgg && this.lotteryEgg.egg_rules_text) || [];
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
            /** 跑马灯无缝滚动：两份内容拼接 */
            marqueeDuplicateRuns() {
                return [0, 1];
            },
            /** 标题图：优先 App 端图，否则 Web 端图 */
            heroTitleImageUrl() {
                const e = this.lotteryEgg;
                if (!e) {
                    return '';
                }
                const appImg = String(e.banner_title_image_app || '').trim();
                const web = String(e.banner_title_image || '').trim();
                return appImg || web || '';
            },
            /** 传给子组件的 egg_cells（最多 6 格） */
            eggCellsList() {
                const e = this.lotteryEgg;
                if (!e || !Array.isArray(e.egg_cells)) {
                    return [];
                }
                return e.egg_cells;
            },
            /** 金蛋未砸：闭合壳图 */
            eggShellClose() {
                const e = this.lotteryEgg;
                return e ? String(e.egg_shell_close_image || '').trim() : '';
            },
            /** 金蛋砸开：裂开壳图 */
            eggShellOpen() {
                const e = this.lotteryEgg;
                return e ? String(e.egg_shell_open_image || '').trim() : '';
            },
            /** 锤子图片 */
            eggHammerImg() {
                const e = this.lotteryEgg;
                return e ? String(e.egg_hammer_image || '').trim() : '';
            },
            /** 机台框背景图 */
            eggFrameImg() {
                const e = this.lotteryEgg;
                return e ? String(e.egg_machine_frame_image || '').trim() : '';
            },
            /** 底部「今日可抽」旁数字或 ∞ */
            eggChancesDisplayStr() {
                const e = this.lotteryEgg;
                if (!e) {
                    return '';
                }
                const v = e.egg_chances_display;
                return v != null && v !== undefined ? String(v) : '';
            },
            /** 「今日可抽」文案（多语言） */
            eggChancesCapLabel() {
                return this.$t ? this.$t('pages.plugins-lottery-egg-chances-label') : '今日可抽';
            },
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 获取砸金蛋配置（lottery 插件 egg/index）
            this.getPageData();
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共 onShow（用户中心等）
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle(this.share_info);
        },
        methods: {
            /** 底部「中奖记录」等带 data-value 的链接跳转 */
            urlEvent(e) {
                app.globalData.url_event(e);
            },
            /** 子组件点击蛋格：校验登录后请求开奖 */
            onEggSelect(payload) {
                const idx = payload && typeof payload.eggIndex === 'number' ? payload.eggIndex : -1;
                if (idx < 0 || this.isDrawing) {
                    return;
                }
                if (app.globalData.get_user_info(this, 'onEggSelect') == false) {
                    return;
                }
                this.pendingEggIndex = idx;
                this.drawAction();
            },
            /** 子组件锤子动画结束：标记砸开、弹出结果 */
            onStrikeDone() {
                this.isDrawing = false;
                if (this.pendingEggIndex >= 0) {
                    if (this.brokenEggIndexes.indexOf(this.pendingEggIndex) === -1) {
                        this.brokenEggIndexes = this.brokenEggIndexes.concat([this.pendingEggIndex]);
                    }
                }
                this.openResultModal();
            },
            /** 根据 lastDrawResult 填充中奖/未中奖弹窗 */
            openResultModal() {
                const d = this.lastDrawResult || {};
                const isNone = d.reward_type === 'none';
                const bgUrl = isNone ? this.resultFailImage : this.resultSuccessImage;
                this.resultModalBgUrl = bgUrl ? String(bgUrl).trim() : '';
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
                    this.resultModalPrizeIcon = icon;
                    this.resultModalPrizeName = d.name || '';
                    this.resultModalDesc = d.name || '';
                }
                this.resultModalVisible = true;
            },
            /** 关闭结果弹窗并刷新首页数据（次数、资产） */
            closeResultModal() {
                this.resultModalVisible = false;
                this.resultModalBgUrl = '';
                this.lastDrawResult = null;
                this.pendingEggIndex = -1;
                this.strikeTargetIndex = -1;
                this.getPageData();
            },
            /** 抽奖返回后同步 egg_chances_display（有限次用剩余次数，否则 ∞） */
            patchEggChancesDisplay(patch, data) {
                let lim = this.lotteryEgg ? parseInt(this.lotteryEgg.egg_user_daily_draw_limit, 10) : NaN;
                if (
                    data &&
                    data.egg_user_daily_draw_limit !== undefined &&
                    data.egg_user_daily_draw_limit !== null &&
                    String(data.egg_user_daily_draw_limit).trim() !== ''
                ) {
                    lim = parseInt(data.egg_user_daily_draw_limit, 10);
                }
                if (!isNaN(lim) && lim > 0 && data && data.egg_user_daily_draw_remaining_today !== undefined && data.egg_user_daily_draw_remaining_today !== null) {
                    patch.egg_chances_display = String(Math.max(0, parseInt(data.egg_user_daily_draw_remaining_today, 10)));
                } else {
                    patch.egg_chances_display = '\u221e';
                }
            },
            /** 请求 lottery/egg/draw，成功后递增 strikeGen 驱动子组件砸蛋动画 */
            drawAction() {
                this.isDrawing = true;
                uni.request({
                    url: app.globalData.get_request_url('draw', 'egg', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            this.lastDrawResult = data;
                            if (this.lotteryEgg) {
                                const patch = {
                                    user_wallet_money:
                                        data.user_wallet_money !== undefined ? data.user_wallet_money : this.lotteryEgg.user_wallet_money,
                                    user_integral: data.user_integral !== undefined ? data.user_integral : this.lotteryEgg.user_integral,
                                };
                                if (data.egg_user_assets_bar_text !== undefined && data.egg_user_assets_bar_text !== null) {
                                    patch.egg_user_assets_bar_text = data.egg_user_assets_bar_text;
                                }
                                ['egg_user_daily_draw_limit', 'egg_user_daily_draw_used_today', 'egg_user_daily_draw_remaining_today'].forEach((k) => {
                                    if (data[k] !== undefined && data[k] !== null) {
                                        patch[k] = data[k];
                                    }
                                });
                                this.patchEggChancesDisplay(patch, data);
                                this.lotteryEgg = Object.assign({}, this.lotteryEgg, patch);
                            }
                            this.strikeTargetIndex = this.pendingEggIndex;
                            this.strikeGen = this.strikeGen + 1;
                        } else {
                            this.isDrawing = false;
                            this.pendingEggIndex = -1;
                            app.globalData.showToast(res.data.msg || '抽奖失败');
                        }
                    },
                    fail: () => {
                        this.isDrawing = false;
                        this.pendingEggIndex = -1;
                        app.globalData.showToast(this.$t ? this.$t('common.internet_error_tips') : '网络异常');
                    },
                });
            },
            /** 请求 lottery/egg/index：活动配置、跑马灯、背景与分享信息 */
            getPageData() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'egg', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            const egg = data.lottery_egg || {};
                            this.marqueeList = Array.isArray(data.marquee_list) ? data.marquee_list : [];
                            this.lotteryEgg = egg;
                            if (egg.enable === false) {
                                const tip = String(egg.error_tips || '').trim() || '活动暂不可用';
                                this.data_list_loding_status = 0;
                                this.data_list_loding_msg = tip;
                            } else {
                                this.data_list_loding_status = 3;
                                this.data_list_loding_msg = '';
                            }
                            this.resultSuccessImage = egg.result_success_image || '';
                            this.resultFailImage = egg.result_fail_image || '';
                            this.resultFailTitle = egg.result_fail_title || '谢谢参与';
                            this.resultFailDesc = egg.result_fail_desc || '再努力努力肯定就会中哦！';
                            this.resultSuccessTitle = egg.result_success_title || '恭喜您获得';
                            this.nImg = egg.index_bg_app || '';
                            const defaultTitle = this.$t ? this.$t('pages.plugins-lottery-egg') : '砸金蛋';
                            const shareTitle = String(egg.banner_title || '').trim() || defaultTitle;
                            let shareDesc = String(egg.banner_subtitle || '').trim();
                            if (!shareDesc) {
                                shareDesc = shareTitle;
                            }
                            const shareImg =
                                String(egg.banner_title_image_app || '').trim() ||
                                String(egg.banner_title_image || '').trim() ||
                                String(egg.index_bg_app || '').trim() ||
                                '';
                            this.setData({
                                share_info: {
                                    title: shareTitle,
                                    desc: shareDesc,
                                    path: '/pages/plugins/lottery/egg/egg',
                                    query: '',
                                    img: shareImg,
                                },
                            });
                        } else {
                            this.marqueeList = [];
                            this.lotteryEgg = null;
                            const errMsg = String(res.data.msg || '').trim() || '加载失败';
                            this.data_list_loding_status = 0;
                            this.data_list_loding_msg = errMsg;
                            app.globalData.showToast(errMsg);
                        }
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        this.lotteryEgg = null;
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
    .lottery-egg-page {
        position: relative;
        box-sizing: border-box;
        min-height: calc(100vh + constant(safe-area-inset-bottom));
        min-height: calc(100vh + env(safe-area-inset-bottom));
    }

    .lottery-egg-page-loaded {
        background: linear-gradient(180deg, #1f080c 0%, #3a1018 34%, #6a1826 68%, #9c2838 100%);
        background-color: #9c2838;
    }

    .lottery-egg-page-inner {
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

    .lottery-egg-footer-draw {
        position: relative;
        z-index: 12;
        padding: 28rpx 32rpx 120rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
    }

    .lottery-egg-price-tips {
        font-size: 24rpx;
        color: rgba(255, 245, 220, 0.92);
        line-height: 1.45;
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

    /* 与背景图文案区对齐：从约 420rpx 起到底部为操作区；底部按钮固定，中间 scroll */
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
        animation: lottery-marquee-egg-app 42s linear infinite;
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

    @keyframes lottery-marquee-egg-app {
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
