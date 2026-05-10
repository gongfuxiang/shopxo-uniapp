<template>
    <view class="lottery-grid-page">
        <block v-if="lotteryPageOk">
        <view v-if="lotteryGrid" class="lottery-top-bar">
            <view class="lottery-top-left lottery-top-asset-panel">
                <text class="lottery-asset-text">{{ lotteryGridBarText }}</text>
            </view>
            <view v-if="Array.isArray(lotteryGrid.grid_rules_text) && lotteryGrid.grid_rules_text.length > 0" class="lottery-rules-btn" @tap="rulesPopupVisible = true">?</view>
        </view>

        <component-lottery-grid
            :nImg="nImg"
            :heroTitleImg="heroTitleImageUrl"
            :AwardList="AwardList"
            :sjNum="sjNum"
            :drawTrigger="drawTrigger"
            @beforeDraw="beforeDraw"
            @updateMoney="updateMoney"
        ></component-lottery-grid>

        <!-- H5 宽屏：与九宫格组件一致限制最大宽度并居中，避免底部条铺满 PC 浏览器 -->
        <view class="page-width-max lottery-bottom-fixed-cluster">
            <!-- 与 PC 一致：底部横向跑马灯（最近中奖） -->
            <view v-if="marqueeList.length > 0" class="lottery-marquee-wrap">
                <view class="lottery-marquee-inner">
                    <view class="lottery-marquee-row">
                        <block v-for="rep in marqueeDuplicateRuns" :key="rep">
                            <text v-for="(mv, mi) in marqueeList" :key="mi" class="lottery-marquee-item">
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
                <button type="default" class="lottery-rules-confirm round bg-blue cr-white text-size" @tap="rulesPopupVisible = false">{{ confirmBtnText }}</button>
            </view>
        </view>

        <!-- 与 PC 端 lottery-grid-result-modal 一致；与砸金蛋弹窗同构：image 背景 + 可滚内容 + 底栏确认 -->
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

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>

<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentLotteryGrid from '@/pages/plugins/lottery/components/lottery-grid/lottery-grid';
    export default {
        components: {
            componentCommon,
            componentNoData,
            componentLotteryGrid,
        },
        data() {
            return {
                nImg: '',
                // 中奖的索引，也就是AwardList数组的索引，sjNum不能等于4，4是立即抽奖
                sjNum: 0,
                drawTrigger: 0,
                isDrawing: false,
                lotteryGrid: null,
                AwardList: [],
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
                /** 结果弹窗背景图 URL（小程序用 image，不用 CSS background） */
                resultModalBgUrl: '',
                rulesPopupVisible: false,
                // 自定义分享信息
                share_info: {},
                /** 最近中奖跑马灯（接口 marquee_list） */
                marqueeList: [],
                /** 1 加载中；2 网络/请求 fail；0 业务类提示；3 正常不展示 no-data */
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                /** 有每日次数上限时，draw 返回后暂存次数相关字段，九宫格跑马灯停格后再写入（与 PC 一致） */
                pendingGridChancePatch: null,
            };
        },
        computed: {
            /** 活动可用且已拉到配置时才展示九宫格 */
            lotteryPageOk() {
                const g = this.lotteryGrid;
                return !!(g && g.enable !== false);
            },
            /** 后端拼接：余额、积分、（可选）今日可抽次数 */
            lotteryGridBarText() {
                const g = this.lotteryGrid;
                if (!g) {
                    return '';
                }
                const s = String(g.grid_user_assets_bar_text || '').trim();
                if (s) {
                    return s;
                }
                return '余额：' + (g.user_wallet_money || '0.00') + '，积分：' + (g.user_integral || '0');
            },
            /**
             * 弹窗确认按钮文案（多语言）
             * @returns {string}
             */
            confirmBtnText() {
                return this.$t ? this.$t('common.confirm') : '确认';
            },
            /**
             * 规则说明多行合并为展示用文本
             * @returns {string}
             */
            rulesDisplayText() {
                const lines = (this.lotteryGrid && this.lotteryGrid.grid_rules_text) || [];
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
            /** 跑马灯双份内容，与 PC 动画 translateX(-50%) 配合 */
            marqueeDuplicateRuns() {
                return [0, 1];
            },
            /** 九宫格标题图 URL（手机端图优先，与后台 Web/App 配置一致） */
            heroTitleImageUrl() {
                const g = this.lotteryGrid;
                if (!g) {
                    return '';
                }
                const app = String(g.banner_title_image_app || '').trim();
                const web = String(g.banner_title_image || '').trim();
                return app || web || '';
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
            // 链接跳转（节点需配置 data-value）
            urlEvent(e) {
                app.globalData.url_event(e);
            },
            /**
             * 转盘结束回调：打开结果弹窗（与 PC grid.js openResultModal 一致）
             */
            updateMoney() {
                if (this.pendingGridChancePatch && this.lotteryGrid) {
                    this.lotteryGrid = Object.assign({}, this.lotteryGrid, this.pendingGridChancePatch);
                }
                this.pendingGridChancePatch = null;
                this.openResultModal();
            },
            /**
             * 根据最近一次抽奖结果展示成功/未中奖弹窗
             */
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
            /**
             * 关闭结果弹窗并刷新页面数据
             */
            closeResultModal() {
                this.resultModalVisible = false;
                this.resultModalBgUrl = '';
                this.lastDrawResult = null;
                this.pendingGridChancePatch = null;
                // 获取数据
                this.getPageData();
            },
            /**
             * 点击「立即抽奖」前校验：防重复、登录态
             */
            beforeDraw() {
                if (this.isDrawing) {
                    return;
                }
                // 校验是否登录
                if (app.globalData.get_user_info(this, 'beforeDraw') == false) {
                    return;
                }
                this.drawAction();
            },
            /**
             * 请求服务端抽奖接口，成功后驱动子组件转盘
             */
            drawAction() {
                this.isDrawing = true;
                uni.request({
                    // 获取请求地址、参数处理
                    url: app.globalData.get_request_url('draw', 'grid', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        this.isDrawing = false;
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            this.lastDrawResult = data;
                            this.sjNum = parseInt(data.grid_index || 0);
                            this.drawTrigger = this.drawTrigger + 1;
                            if (this.lotteryGrid) {
                                const patch = {
                                    user_wallet_money:
                                        data.user_wallet_money !== undefined ? data.user_wallet_money : this.lotteryGrid.user_wallet_money,
                                    user_integral:
                                        data.user_integral !== undefined ? data.user_integral : this.lotteryGrid.user_integral,
                                };
                                if (data.grid_user_assets_bar_text !== undefined && data.grid_user_assets_bar_text !== null) {
                                    patch.grid_user_assets_bar_text = data.grid_user_assets_bar_text;
                                }
                                ['grid_user_daily_draw_limit', 'grid_user_daily_draw_used_today', 'grid_user_daily_draw_remaining_today'].forEach((k) => {
                                    if (data[k] !== undefined && data[k] !== null) {
                                        patch[k] = data[k];
                                    }
                                });

                                let lim = parseInt(data.grid_user_daily_draw_limit, 10);
                                if (isNaN(lim)) {
                                    lim = parseInt(this.lotteryGrid.grid_user_daily_draw_limit, 10);
                                }
                                const deferChances = !isNaN(lim) && lim > 0;
                                let pendingChancePatch = null;
                                if (deferChances) {
                                    pendingChancePatch = {};
                                    ['grid_user_assets_bar_text', 'grid_user_daily_draw_remaining_today', 'grid_user_daily_draw_used_today'].forEach((k) => {
                                        if (patch[k] !== undefined) {
                                            pendingChancePatch[k] = patch[k];
                                            delete patch[k];
                                        }
                                    });
                                    if (Object.keys(pendingChancePatch).length === 0) {
                                        pendingChancePatch = null;
                                    }
                                }
                                this.pendingGridChancePatch = pendingChancePatch;
                                this.lotteryGrid = Object.assign({}, this.lotteryGrid, patch);
                            }
                        } else {
                            // 错误提示
                            app.globalData.showToast(res.data.msg || '抽奖失败');
                        }
                    },
                    fail: () => {
                        this.isDrawing = false;
                        // 错误提示
                        app.globalData.showToast(this.$t ? this.$t('common.internet_error_tips') : '网络异常');
                    },
                });
            },
            /**
             * 拉取九宫格活动配置与奖品列表
             */
            getPageData() {
                uni.request({
                    // 获取请求地址、参数处理
                    url: app.globalData.get_request_url('index', 'grid', 'lottery'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            const data = res.data.data || {};
                            const grid = data.lottery_grid || {};
                            this.marqueeList = Array.isArray(data.marquee_list) ? data.marquee_list : [];
                            this.lotteryGrid = grid;
                            if (grid.enable === false) {
                                const tip = String(grid.error_tips || '').trim() || '活动暂不可用';
                                this.data_list_loding_status = 0;
                                this.data_list_loding_msg = tip;
                            } else {
                                this.data_list_loding_status = 3;
                                this.data_list_loding_msg = '';
                            }
                            this.resultSuccessImage = grid.result_success_image || '';
                            this.resultFailImage = grid.result_fail_image || '';
                            this.resultFailTitle = grid.result_fail_title || '谢谢参与';
                            this.resultFailDesc = grid.result_fail_desc || '再努力努力肯定就会中哦！';
                            this.resultSuccessTitle = grid.result_success_title || '恭喜您获得';
                            this.nImg = grid.index_bg_app || '';
                            this.AwardList = this.gridCellsToAwardList(grid);
                            // 分享：与后台「抽奖页主标题 / 抽奖页描述」一致；配图优先标题手机端图
                            const defaultTitle = this.$t ? this.$t('pages.plugins-lottery-grid') : '幸运抽奖';
                            const shareTitle = String(grid.banner_title || '').trim() || defaultTitle;
                            let shareDesc = String(grid.banner_subtitle || '').trim();
                            if (!shareDesc) {
                                shareDesc = shareTitle;
                            }
                            const shareImg =
                                String(grid.banner_title_image_app || '').trim() ||
                                String(grid.banner_title_image || '').trim() ||
                                String(grid.index_bg_app || '').trim() ||
                                '';
                            this.setData({
                                share_info: {
                                    title: shareTitle,
                                    desc: shareDesc,
                                    path: '/pages/plugins/lottery/grid/grid',
                                    query: '',
                                    img: shareImg,
                                },
                            });
                        } else {
                            this.marqueeList = [];
                            this.lotteryGrid = null;
                            this.AwardList = [];
                            const errMsg = String(res.data.msg || '').trim() || '加载失败';
                            this.data_list_loding_status = 0;
                            this.data_list_loding_msg = errMsg;
                            app.globalData.showToast(errMsg);
                        }
                        // 分享菜单处理
                        app.globalData.page_share_handle(this.share_info);
                    },
                    fail: () => {
                        this.lotteryGrid = null;
                        this.AwardList = [];
                        const errMsg = this.$t ? this.$t('common.internet_error_tips') : '网络异常';
                        this.data_list_loding_status = 2;
                        this.data_list_loding_msg = errMsg;
                        app.globalData.showToast(errMsg);
                    },
                });
            },
            /**
             * 将接口 cells 转为九宫格组件所需 AwardList（含中间抽奖按钮格）
             * @param {object} grid lottery_grid 数据
             * @returns {Array<{image: string, name: string, index_num: number}>}
             */
            gridCellsToAwardList(grid) {
                const list = new Array(9).fill(null).map((_, i) => ({ image: '', name: '', index_num: i }));
                const cells = Array.isArray(grid.cells) ? grid.cells : [];
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i] || {};
                    const gi = parseInt(cell.grid_index || 0);
                    if (gi < 0 || gi > 8) {
                        continue;
                    }
                    if (cell.type === 'btn') {
                        list[gi] = {
                            image: grid.draw_start_image || '',
                            name: grid.draw_price_tips || '立即抽奖',
                            index_num: gi,
                        };
                    } else {
                        const slot = cell.slot || {};
                        list[gi] = {
                            image: slot.icon || '',
                            name: slot.name || '',
                            index_num: gi,
                        };
                    }
                }
                return list;
            },
        },
    };
</script>

<style>
    .lottery-grid-page {
        position: relative;
        min-height: 100vh;
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

    /* 与 PC .lottery-result-modal 视觉对齐（rpx 适配） */
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
    /* 底部跑马灯 + 中奖记录入口：与九宫格子组件同属 page-width-max 列宽（H5 PC） */
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

    /* 与 PC .lottery-marquee 一致：底部深色条 + 横向循环 */
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
        animation: lottery-marquee-app 42s linear infinite;
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
    @keyframes lottery-marquee-app {
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
