<template>
    <view :class="theme_view">
        <view class="padding-main">
            <view class="bg-white border-radius-main padding-xl tc">
                <iconfont name="icon-selected-solid" size="80rpx" color="#52c41a"></iconfont>
                <view class="fw-b text-size-lg margin-top-main">{{ $t('friendpay.friendpay.pay_success_title') }}</view>
                <view class="cr-grey text-size-sm margin-top-sm">{{ successTips }}</view>
                <view class="margin-top-xl">
                    <button class="bg-main cr-white round text-size wh-auto margin-bottom-main" @tap="url_open_event" :data-value="record_list_url">{{ $t('friendpay.friendpay.view_records') }}</button>
                    <button class="bg-white cr-base br-grey round text-size wh-auto" @tap="back_event">{{ $t('common.back') }}</button>
                </view>
            </view>
        </view>
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    export default {
        components: { componentCommon },
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                id: '',
                page_text: {},
                record_list_url: '/pages/plugins/friendpay/share/list?type=payer',
            };
        },
        computed: {
            // 成功提示文案
            successTips() {
                return (this.page_text.pay_success_tips || this.$t('friendpay.friendpay.pay_success_tips'));
            },
        },
        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 参数处理
            params = app.globalData.launch_params_handle(params);
            this.setData({
                id: params.id || '',
            });
        },
        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 获取数据
            this.get_data();
        },
        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('success', 'pay', 'friendpay'),
                    method: 'POST',
                    data: { id: this.id },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                page_text: data.page_text || {},
                                record_list_url: data.record_list_url || '/pages/plugins/friendpay/share/list?type=payer',
                            });
                        }
                    },
                });
            },

            // url事件
            url_open_event(e) {
                app.globalData.url_event(e);
            },

            // 返回
            back_event() {
                app.globalData.page_back_prev_event();
            },
        },
    };
</script>
