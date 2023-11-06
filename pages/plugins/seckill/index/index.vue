<template>
    <view :class="theme_view">
        <component-nav-back :prop-fixed="false" :prop-style="seckill_bg">
            <template slot="right" class="flex-1 flex-width seckill-right-title">
                <view class="flex-1 seckill-right-title tc">
                    <image :src="seckill_title_url" mode="widthFix" class="title pr top-md"></image>
                </view>
            </template>
            <template v-if="periods_list.length > 0" slot="content">
                <!-- 秒杀时段 -->
                <scroll-view :scroll-x="true" :scroll-with-animation="true" :scroll-into-view="'one-nav-item-' + nav_active_index" class="top-nav-scroll wh-auto">
                    <view class="nav_seckill flex-row flex-nowrap cr-white tc">
                        <view v-for="(item, index) in periods_list" :key="index" class="item text-size-xss" :class="nav_active_index === index ? 'active' : ''" :id="'one-nav-item-' + index" :data-index="index" :data-text="item.time.time_first_text" :data-status="item.time.status" @tap="nav_event">
                            <view class="time text-size-lg">{{ item.name }}</view>
                            <view class="state text-size-xs round" :class="nav_active_index === index ? 'cr-red' : ''">{{ item.time.msg }}</view>
                        </view>
                    </view>
                </scroll-view>
            </template>
        </component-nav-back>
        <scroll-view v-if="periods_list.length > 0" :scroll-top="scroll_top" scroll-y="true" class="scroll-y" @scroll="scroll_event">
            <view class="padding-horizontal-main padding-top-main">
                <!-- 基础信息、倒计时 -->
                <view class="oh spacing-mb flex-row jc-sb align-c">
                    <view>
                        <text :class="'va-m text-size-xs fw-b cr-blak ' + (is_valid == 1 ? 'cr-base' : 'cr-red')">{{ time_first_text }}</text>
                        <view v-if="is_valid == 1" class="dis-inline-block va-m margin-left-sm">
                            <view v-for="(item,index) in periods_list" :key="index">
                                <component-countdown v-show="nav_active_index === index" :propHour="item.time.hours" :propMinute="item.time.minutes" :propSecond="item.time.seconds" :prop-time-background-color="seckill_status === 1 ? '#E22C08' : '#333333'"></component-countdown>
                            </view>
                        </view>
                    </view>
                    <view v-if="(data_base.content_notice || null) != null && data_base.content_notice.length > 0" class="text-size-xs cr-blak" @tap="quick_open_event">
                        活动规则
                        <iconfont name="icon-miaosha-hdgz" size="26rpx" class="margin-left-xs pr top-xs" color="#999"></iconfont>
                    </view>
                </view>

                <!-- 商品 -->
                <view v-if="goods.length > 0">
                    <component-goods-list :propData="{ style_type: 1, goods_list: goods }" :propCurrencySymbol="currency_symbol" :prop-grid-btn-config="grid_btn_config" :prop-is-open-grid-btn-set="isOpenGridBtnSet" propPriceField="seckill_min_price"></component-goods-list>
                </view>
                <view v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" propMsg="没有相关商品"></component-no-data>
                </view>
            </view>
            <!-- 结尾 -->
            <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
            <!-- 弹窗 -->
            <component-popup v-if="(data_base.content_notice || null) != null && data_base.content_notice.length > 0" :propShow="popup_status" :propIsBar="propIsBar" propPosition="bottom" @onclose="quick_close_event">
                <view class="rule">
                    <view class="title cr-black text-size-md fw-b margin-bottom-main tc">活动规则</view>
                    <scroll-view :scroll-y="true" class="item">
                        <view v-for="(item, index) in data_base.content_notice" :key="index" class="cr-grey text-size-md">{{ item }}</view>
                    </scroll-view>
                    <button type="default" class="bg-main cr-white round text-size-md pa bottom-0 left-0 right-0" @tap="quick_close_event">知道了</button>
                </view>
            </component-popup>
        </scroll-view>
        <view v-else>
            <!-- 提示信息 -->
            <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
        </view>
    </view>
</template>
<script>
    const app = getApp();
    import componentNavBack from '@/components/nav-back/nav-back';
    import componentCountdown from '../../../../components/countdown/countdown';
    import componentNoData from '../../../../components/no-data/no-data';
    import componentBottomLine from '../../../../components/bottom-line/bottom-line';
    import componentGoodsList from '../../../../components/goods-list/goods-list';
    import componentPopup from '../../../../components/popup/popup';
    var seckill_static_url = app.globalData.get_static_url('seckill', true);
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                // 顶部导航返回按钮
                is_realstore_top_nav_back: app.globalData.data.is_realstore_top_nav_back || 0,
                seckill_bg: 'background: url(' + seckill_static_url + 'app/header-bg.png) top/100% no-repeat;background-size:100% 100%;',
                seckill_title_url: seckill_static_url + 'seckill-title.png',
                scroll_top: 0,
                scroll_top_old: 0,
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.data.currency_symbol,
                data_base: null,
                // 秒杀时段
                periods_list: [],
                current: null,
                time: null,
                goods: [],
                is_valid: 0,
                // 自定义分享信息
                share_info: {},
                // nav滚动下标
                nav_active_index: 0,
                // 规则弹窗
                popup_status: false,
                propIsBar: false,
                // 倒计时标题
                time_first_text: '',
                // 抢购状态
                // status 0未开始, 1进行中(距离结束还有), 2已结束, 3异常错误
                seckill_status: 0,
                // 配置商品列表按钮
                isOpenGridBtnSet: false,
                grid_btn_config: {
                    name: '即将开抢',
                    disabled: true,
                },
            };
        },
        components: {
            componentNavBack,
            componentCountdown,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentPopup,
        },
        props: {},
        onLoad() {},
        onShow() {
            // 初始化配置
            this.init_config();
            // 获取数据
            this.get_data();
        },
        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        watch: {
            seckill_status(val) {
                if (val === 0) {
                    let newData = {
                        name: '即将开抢',
                    };
                    this.setData({
                        grid_btn_config: Object.assign({}, this.grid_btn_config, newData),
                    });
                } else if (val === 2) {
                    let newData = {
                        name: '已结束',
                    };
                    this.setData({
                        grid_btn_config: Object.assign({}, this.grid_btn_config, newData),
                    });
                }
            },
        },
        methods: {
            // 初始化配置
            init_config(status) {
                if ((status || false) == true) {
                    this.setData({
                        currency_symbol: app.globalData.get_config('currency_symbol'),
                    });
                } else {
                    app.globalData.is_config(this, 'init_config');
                }
            },
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'index', 'seckill'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_base = data.config || null;
                            var current = data.current || null;
                            var time = current == null ? null : current.time || null;
                            var goods = current == null ? [] : current.goods || [];
                            var is_valid = time == null ? 0 : time.status == 1 ? 1 : 0;
                            if (goods.length > 0) {
                                for (var i in goods) {
                                    goods[i]['price_icon'] = is_valid == 1 ? current.goods_detail_icon || '秒杀价' : '';
                                }
                            }
                            this.setData({
                                periods_list: data.periods_list,
                                data_base: data_base,
                                current: current,
                                time: time,
                                time_first_text: time.time_first_text,
                                seckill_status: data.periods_list[this.nav_active_index].time.status,
                                isOpenGridBtnSet: data.periods_list[this.nav_active_index].time.status === 1 ? false : true,
                                goods: goods,
                                is_valid: is_valid,
                                data_list_loding_msg: '',
                                data_list_loding_status: 0,
                                data_bottom_line_status: goods.length > 0,
                            });
                            if ((this.data_base || null) != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/seckill/index/index',
                                        img: (this.slider || null) != null && this.slider.length > 0 ? this.slider[0]['images_url'] : '',
                                    },
                                });
                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }
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
                            data_list_loding_msg: '网络开小差了哦~',
                        });
                        app.globalData.showToast('网络开小差了哦~');
                    },
                });
            },
            nav_event(e) {
                let index = e.currentTarget.dataset.index;
                let time_first_text = e.currentTarget.dataset.text;
                let seckill_status = e.currentTarget.dataset.status;
                this.setData({
                    nav_active_index: index,
                    time_first_text: time_first_text,
                    seckill_status: seckill_status,
                    goods: this.periods_list[index].goods,
                    isOpenGridBtnSet: seckill_status === 1 ? false : true,
                });
                this.reset_scroll();
            },
            // 弹层开启
            quick_open_event(e) {
                this.setData({
                    popup_status: true,
                });
            },
            // 弹层关闭
            quick_close_event(e) {
                this.setData({
                    popup_status: false,
                });
            },

            // 重置滑动位置
            reset_scroll() {
                this.setData({
                    scroll_top: this.scroll_top_old,
                });
                this.$nextTick(() => {
                    this.setData({
                        scroll_top: 0,
                    });
                });
            },

            // 滑动事件位置记录
            scroll_event(e) {
                this.setData({
                    scroll_top_old: e.detail.scrollTop,
                });
            },
        },
    };
</script>
<style scoped>
    @import './index.css';
</style>
