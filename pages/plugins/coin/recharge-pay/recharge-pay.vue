<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60" @scroll="scroll_event">
            <view class="padding-main pr page-bottom-fixed">
                <view class="padding-lg bg-white radius-md margin-bottom-main">
                    <view class="convert-group-row">
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('recharge-list.recharge-list.6b9399')}}</text>
                            <text class="fw-b">{{ accounts.recharge_no }}</text>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('cash-list.cash-list.714g2h')}}</text>
                            <text class="fw-b">{{ accounts.address }}</text>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('cash-list.cash-list.23ii8s')}}</text>
                            <text class="fw-b">{{ accounts.network_name }}</text>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('recharge-list.recharge-list.epd531')}}</text>
                            <text class="fw-b">{{ accounts.coin }}</text>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('cash-list.cash-list.2w20g2')}}</text>
                            <text class="fw-b">{{ accounts.platform_name }}</text>
                        </view>
                        <view class="flex-row">
                            <text class="cr-grey-9 title">{{$t('cash-list.cash-list.2w20g2')}}</text>
                            <text class="fw-b">{{ accounts.add_time }}</text>
                        </view>
                    </view>
                </view>
                <view class="padding-main bg-white radius-md margin-bottom-main">
                    <view class="flex-row align-e margin-bottom-main">
                        <text class="fw-b">{{$t('recharge-pay.recharge-pay.lutmsv')}}</text>
                        <text class="cr-grey-c text-size-xs">{{$t('recharge-pay.recharge-pay.1a5vqk')}}</text>
                    </view>
                    <component-upload :propData="image_list" :propMaxNum="10" :propPathType="editor_path_type" @call-back="return_image_event"></component-upload>
                </view>
                <view class="padding-main bg-white radius-md margin-bottom-xxxxl">
                    <view class="flex-row align-e margin-bottom-main">
                        <text class="fw-b">{{$t('recharge-pay.recharge-pay.wu49vk')}}</text>
                    </view>
                    <textarea :placeholder="$t('recharge-pay.recharge-pay.95pfkd')" name="pay_note" placeholder-class="cr-base" class="wh-auto bg-white" :value="pay_note" :maxlength="pay_note_length_max" @input="pay_note_event"></textarea>
                </view>
                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="flex-row align-c">
                            <button type="default" class="item cancel-btn round margin-right-sm" @tap="cancel_event">{{$t('common.cancel')}}</button>
                            <button type="default" class="item submit-btn round margin-left-sm" @tap="submit_event">{{$t('common.submit')}}</button>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';
    import componentUpload from '@/components/upload/upload';
    var wallet_static_url = app.globalData.get_static_url('coin', true) + 'app/';
    // 状态栏高度
    var bar_height = parseInt(app.globalData.get_system_info('statusBarHeight', 0, true));
    // #ifdef MP-TOUTIAO
    bar_height = 0;
    // #endif
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                wallet_static_url: wallet_static_url,
                bottom_fixed_style: '',
                params: null,
                accounts: {},
                image_list: [],
                editor_path_type: '',
                // 备注
                pay_note: '',
                pay_note_length_max: '500',
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPopup,
            componentUpload,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });

            this.init();
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

        // 下拉刷新
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            init(e) {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('detail', 'recharge', 'coin'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                editor_path_type: data.editor_path_type || '',
                                accounts: data.data || {},
                                data_list_loding_msg: '',
                                data_list_loding_status: 3,
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'get_data')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        uni.stopPullDownRefresh();
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 上传图片回调
            return_image_event(data) {
                this.setData({
                    image_list: data,
                });
            },

            // 备注
            pay_note_event(e) {
                this.setData({
                    pay_note: e.detail.value.trim(),
                });
            },

            // 取消
            cancel_event() {
                app.globalData.page_back_prev_event();
            },

            // 提交
            submit_event() {
                var new_data = {
                    id: this.params.id,
                    pay_voucher: this.image_list,
                    pay_note: this.pay_note,
                };
                // 数据校验
                var validation = [
                    { fields: 'pay_voucher', msg: this.$t('recharge-pay.recharge-pay.v5fok8') },
                    { fields: 'pay_note', msg: this.$t('recharge-pay.recharge-pay.95pfkd') },
                ];
                if (app.globalData.fields_check(new_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('pay', 'recharge', 'coin'),
                        method: 'POST',
                        data: new_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open('/pages/plugins/coin/recharge-list/recharge-list', true);
                                }, 1000);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.stopPullDownRefresh();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 页面滚动监听
            scroll_event(e) {
                uni.$emit('onPageScroll', e.detail);
            },
        },
    };
</script>
<style>
    @import './recharge-pay.css';
</style>
