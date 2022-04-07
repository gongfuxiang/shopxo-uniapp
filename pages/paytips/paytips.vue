<template>
    <view>
        <view class="content tc">
            <image class="pay-icon dis-block" v-if="params.code == '9000'" mode="widthFix" :src="default_round_success_icon"></image>
            <image class="pay-icon dis-block" v-else mode="widthFix" :src="default_round_error_icon"></image>
            <view class="text-size-lg cr-base">{{params.msg}}</view>
        </view>
        <view class="btn-box tc">
            <view>
                <button class="bg-main br-main cr-white round" type="default" hover-class="none" size="mini" @tap="back_event">返回</button>
            </view>
            <view v-if="(params.page || null) != null && (params.title || null) != null" class="margin-top-lg">
                <navigator class="dis-inline-block" :url="'/pages/' + params.page + '/' + params.page" open-type="redirect">
                    <button class="bg-main-pair br-main-pair cr-white round" type="default" hover-class="none" size="mini">{{params.title}}</button>
                </navigator>
            </view>
        </view>
    </view>
</template>
<script>
    const app = getApp();

    export default {
        data() {
            return {
                params: {},
                default_round_success_icon: app.globalData.data.default_round_success_icon,
                default_round_error_icon: app.globalData.data.default_round_error_icon
            };
        },

        components: {},
        props: {},

        /**
         * 页面加载初始化
         */
        onLoad(options) {
            var msg = null;
            switch (options.code) {
                // 支付成功
                case '9000':
                    msg = '支付成功';
                    break;
                // 正在处理中
                case '8000':
                    msg = '正在处理中';
                    break;
                // 支付失败
                case '4000':
                    msg = '支付失败';
                    break;
                // 用户中途取消
                case '6001':
                    msg = '已取消支付';
                    break;
                // 网络连接出错
                case '6002':
                    msg = '网络连接出错';
                    break;
                // 支付结果未知（有可能已经支付成功），请查询商户订单列表中订单的支付状态
                case '6004':
                    msg = '支付结果未知';
                    break;
                // 用户点击忘记密码导致快捷界面退出(only iOS)
                case '99':
                    msg = '用户取消支付';
                    break;
                // 默认错误
                default:
                    msg = '其它异常错误';
            }
            options['msg'] = msg;
            this.setData({
                params: options
            });
        },
        
        onShow() {            
            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        methods: {
            // 返回
            back_event(e) {
                uni.navigateBack();
            }
        }
    };
</script>
<style>
    @import './paytips.css';
</style>