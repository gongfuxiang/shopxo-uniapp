<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <component-nav-back :propFixed="false" :propStyle="'background: url(' + presale_config.header_bg +') top/100% no-repeat;background-size:100% 100%;'">
                <template slot="right">
                    <view class="flex-1 tc">
                        <image :src="presale_config.header_logo" mode="widthFix" class="header-logo pr top-md"></image>
                    </view>
                </template>
            </component-nav-back>
            <view class="padding-horizontal-main padding-top-main">
                <!-- 通知信息 -->
                <view v-if="(data_base.content_notice || null) != null && data_base.content_notice.length > 0" class="padding-bottom" @tap="notice_open_event">
                    <text class="text-size-xs cr-blak">{{$t('index.index.516559')}}</text>
                    <iconfont name="icon-help" size="26rpx" propClass="margin-left-xs" color="#999"></iconfont>
                </view>

                <!-- 商品 -->
                <block v-if="data.length > 0">
                    <component-goods-list :propData="{ style_type: 1, goods_list: data }" :propCurrencySymbol="currency_symbol" :propOpenCart="false" propPriceField="deposit_price"></component-goods-list>

                    <!-- 结尾 -->
                    <component-bottom-line :propStatus="data_bottom_line_status"></component-bottom-line>
                </block>
                <block v-else>
                    <!-- 提示信息 -->
                    <component-no-data propStatus="0" :propMsg="$t('detail.detail.5knxg6')"></component-no-data>
                </block>
            </view>

            <!-- 弹窗 -->
            <component-popup v-if="(data_base.content_notice || null) != null && data_base.content_notice.length > 0" :propShow="popup_notice_status" propPosition="bottom" @onclose="notice_close_event">
                <view class="padding-main">
                    <view class="cr-black text-size-md fw-b margin-bottom-main">{{$t('index.index.516559')}}</view>
                    <scroll-view :scroll-y="true" class="content-notice">
                        <view v-for="(item, index) in data_base.content_notice" :key="index" class="cr-grey text-size-md">{{ item }}</view>
                    </scroll-view>
                    <button type="default" class="bg-main cr-white round text-size-md wh-auto margin-top-lg" @tap="notice_close_event">{{$t('index.index.qbi72m')}}</button>
                </view>
            </component-popup>
        </block>
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
    import componentCountdown from '@/components/countdown/countdown';
    import componentNoData from '@/components/no-data/no-data';
    import componentBottomLine from '@/components/bottom-line/bottom-line';
    import componentGoodsList from '@/components/goods-list/goods-list';
    import componentPopup from '@/components/popup/popup';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                status_bar_height: parseInt(app.globalData.get_system_info('statusBarHeight', 0)),
                data_bottom_line_status: false,
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                currency_symbol: app.globalData.currency_symbol(),
                data: [],
                presale_config: null,
                data_base: null,
                popup_notice_status: false,
                // 自定义分享信息
                share_info: {}
            };
        },
        components: {
            componentCommon,
            componentNavBack,
            componentCountdown,
            componentNoData,
            componentBottomLine,
            componentGoodsList,
            componentPopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 初始化配置
            this.init_config();

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
                    url: app.globalData.get_request_url('index', 'index', 'presale'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            var data_list = data.data || [];
                            this.setData({
                                data: data_list,
                                presale_config: data.presale_config || null,
                                data_base: data.data_base || null,
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                                data_bottom_line_status: data_list.length > 0,
                            });
                            if (this.presale_config != null && this.data_base != null) {
                                // 基础自定义分享
                                this.setData({
                                    share_info: {
                                        title: this.data_base.seo_title || this.data_base.application_name,
                                        desc: this.data_base.seo_desc,
                                        path: '/pages/plugins/presale/index/index',
                                        img: this.presale_config.header_logo || this.presale_config.header_bg || '',
                                    },
                                });
                                // #ifndef MP-ALIPAY
                                // 导航名称
                                if ((this.data_base.application_name || null) != null) {
                                    uni.setNavigationBarTitle({
                                        title: this.data_base.application_name,
                                    });
                                }
                                // #endif
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

            // 弹层开启
            notice_open_event(e) {
                this.setData({
                    popup_notice_status: true,
                });
            },

            // 弹层关闭
            notice_close_event(e) {
                this.setData({
                    popup_notice_status: false,
                });
            }
        }
    };
</script>
<style scoped>
    @import './index.css';
</style>
