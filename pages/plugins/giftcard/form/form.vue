<template>
    <view :class="theme_view">
        <view class="padding-main">
            <block v-if="data_list_loding_status == 3">
                <form @submit="form_submit" class="form-container">
                    <view class="border-radius-main bg-white padding-main padding-bottom-xxxxl spacing-mb">
                        <view class="title fw-b text-size margin-vertical-xxxl">{{$t('giftcard-index.giftcard-index.hfg2fg')}}</view>
                        <view class="flex-row align-c padding-bottom-xl">
                            <!-- #ifndef H5 -->
                            <view class="margin-right" @tap="scan_event">
                                <uni-icons type="scan" size="56rpx" color="#666"></uni-icons>
                            </view>
                            <!-- #endif -->
                            <input type="text" class="wh-auto secret-key-value" :placeholder="$t('giftcard-index.giftcard-index.fu3rf1')" placeholder-class="cr-grey-c" :value="secret_key_value" @input="secret_key_event" />
                        </view>
                    </view>
                    <view class="padding-main">
                        <button type="default" form-type="submit" hover-class="none" class="br-main bg-main cr-white round text-size-lg" :disabled="form_submit_loading">{{$t('common.confirm')}}</button>
                    </view>
                    <view class="padding-lg margin-top-xl text-size-lg tc">
                        <text v-if="(error_msg || null) != null" class="cr-red">{{error_msg}}</text>
                        <text v-if="(success_msg || null) != null" class="cr-green">{{success_msg}}</text>
                    </view>
                </form>
            </block>
            <block v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_loading: false,
                secret_key_value: '',
                error_msg: '',
                success_msg: ''
            };
        },
        components: {
            componentCommon,
            componentNoData,
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 加载数据
            this.init();
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
        },

        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user == false) {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                } else {
                    this.setData({
                        data_list_loding_status: 3,
                        data_list_loding_msg: '',
                    });
                }
            },
            
            // 输入事件
            secret_key_event(e) {
                this.setData({
                    secret_key_value: e.detail.value
                });
            },

            // 扫码事件
            scan_event(e) {
                var self = this;
                uni.scanCode({
                	success: function (res) {
                        if((res.result || null) != null) {
                            self.setData({
                                secret_key_value: res.result
                            });
                            self.form_submit();
                        }
                	}
                });
            },

            // 表单提交
            form_submit() {
                this.setData({
                    error_msg: '',
                    success_msg: ''
                });
                var form_data = {
                    secret_key: this.secret_key_value
                }
                var validation = [
                    { fields: 'secret_key', msg: this.$t('giftcard-index.giftcard-index.fu3rf1') }
                ];
                if (app.globalData.fields_check(form_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    uni.request({
                        url: app.globalData.get_request_url('exchange', 'index', 'giftcard'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                var self = this;
                                self.setData({
                                    error_msg: '',
                                    success_msg: res.data.msg,
                                });
                                setTimeout(function() {
                                    self.setData({
                                        form_submit_loading: false,
                                    });
                                    if(app.globalData.prev_page() == null) {
                                        app.globalData.url_open('/pages/plugins/giftcard/index/index', true);
                                    } else {
                                        uni.navigateBack();
                                    }
                                }, 1500);
                            } else {
                                if (app.globalData.is_login_check(res.data, this, 'form_submit')) {
                                    this.setData({
                                        form_submit_loading: false,
                                        error_msg: res.data.msg,
                                        success_msg: '',
                                    });
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                                error_msg: this.$t('common.internet_error_tips'),
                                success_msg: '',
                            });
                        },
                    });
                }
            }
        }
    };
</script>
<style scoped>
    input.secret-key-value {
        height: 100rpx;
        line-height: 100rpx;
        font-size: 44rpx;
    }
</style>