<template>
    <view :class="theme_view">
        <view class="content tc">
            <image class="pay-icon dis-block" v-if="params.code == '9000'" mode="widthFix" :src="default_round_success_icon"></image>
            <image class="pay-icon dis-block" v-else mode="widthFix" :src="default_round_error_icon"></image>
            <view class="text-size-lg cr-base">{{ params.msg || $t('paytips.paytips.679rxu') }}</view>
        </view>
        <view class="btn-box tc">
            <view>
                <button class="bg-main br-main cr-white round" type="default" hover-class="none" size="mini" @tap="back_event">{{$t('common.return')}}</button>
            </view>
            <view class="margin-top-lg">
                <button class="bg-main-pair br-main-pair cr-white round" type="default" hover-class="none" size="mini" data-redirect="1" :data-value="default_to_url" @tap="url_event">{{ params.title || $t('paytips.paytips.jifuu8') }}</button>
            </view>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                params: {},
                default_round_success_icon: app.globalData.data.default_round_success_icon,
                default_round_error_icon: app.globalData.data.default_round_error_icon,
                default_to_url: '',
            };
        },
        components: {
            componentCommon
        },

        /**
         * 页面加载初始化
         */
        onLoad(params) {
            // 参数处理
            if((params || null) != null) {
                params = JSON.parse(base64.decode(decodeURIComponent(params.params)));
            }

            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 根据状态处理
            var msg = null;
            switch (params.code) {
                // 支付成功
                case '9000':
                    msg = this.$t('paytips.paytips.679rxu');
                    break;
                // 正在处理中
                case '8000':
                    msg = this.$t('paytips.paytips.d8m853');
                    break;
                // 支付失败
                case '4000':
                    msg = this.$t('paytips.paytips.6y488i');
                    break;
                // 用户中途取消
                case '6001':
                    msg = this.$t('paytips.paytips.e732we');
                    break;
                // 网络连接出错
                case '6002':
                    msg = this.$t('paytips.paytips.13v11t');
                    break;
                // 支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
                case '6004':
                    msg = this.$t('paytips.paytips.u1153p');
                    break;
                // 用户点击忘记密码导致快捷界面退出(only iOS)
                case '99':
                    msg = this.$t('paytips.paytips.6mpsl7');
                    break;
                // 默认错误
                default:
                    msg = this.$t('paytips.paytips.59u769');
            }
            params['msg'] = msg;
            this.setData({
                params: params,
                default_to_url: params.page || app.globalData.app_tabbar_pages()[0],
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 返回
            back_event(e) {
                app.globalData.page_back_prev_event();
            },
            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },
        },
    };
</script>
<style>
    @import './paytips.css';
</style>
