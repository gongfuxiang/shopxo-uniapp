<template>
    <view :class="theme_view">
        <view class="padding-main page-content">
            <form @submit="form_submit" class="form-container">
                <view class="border-radius-main bg-white padding-main padding-bottom-xxxxl spacing-mb">
                    <view class="title fw-b text-size margin-vertical-xxxl">{{$t('common.verification_text')}}</view>
                    <view class="flex-row align-c padding-bottom-xl">
                        <!-- #ifndef H5 -->
                        <view class="margin-right" @tap="scan_event">
                            <uni-icons type="scan" size="56rpx" color="#666"></uni-icons>
                        </view>
                        <!-- #endif -->
                        <input type="text" class="wh-auto check-value" :placeholder="$t('common.verification_mobile_message')" placeholder-class="cr-grey-c" :value="check_value" @input="check_event" />
                    </view>
                </view>
                <view class="padding-main">
                    <button type="default" form-type="submit" hover-class="none" class="br-main bg-main cr-white round text-size-lg" :disabled="form_submit_loading">{{$t('common.confirm')}}</button>
                </view>
                <view class="padding-lg margin-top-xl text-size-lg tc">
                    <text v-if="(error_msg || null) != null" class="cr-red">{{error_msg}}</text>
                    <text v-if="(success_msg || null) != null" class="cr-green">{{success_msg}}</text>
                </view>
                <view class="bottom-fixed padding-xl tc">
                    <button type="default" size="mini" class="bg-main-light br-main cr-main text-size-lg circle padding-0 refresh-submit" @tap="refresh_data_event">{{$t('common.refresh_text')}}</button>
                    <view class="bottom-line-exclude flex-row jc-sb margin-top-xl">
                        <block v-if="stats_data.length > 0">
                            <block v-for="(item, index) in stats_data">
                                <view>
                                    <view class="cr-grey">{{item.name}}</view>
                                    <view class="fw-b text-size-lg" :class="item.type == 1 ? 'cr-green' : (item.type == 0 ? 'cr-yellow' : '')">{{item.value}}</view>
                                </view>
                            </block>
                        </block>
                    </view>
                </view>
            </form>
        </view>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                form_submit_loading: false,
                check_value: '',
                error_msg: '',
                success_msg: '',
                stats_data: []
            };
        },
        components: {
            componentCommon
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 刷新数据
            this.refresh_data_event('init');
        },

        methods: {
            // 获取数据
            init() {
                app.globalData.get_user_info(this, "init");
            },

            // 输入事件
            check_event(e) {
                this.setData({
                    check_value: e.detail.value
                });
            },

            // 扫码事件
            scan_event(e) {
                var self = this;
                uni.scanCode({
                	success: function (res) {
                        if((res.result || null) != null) {
                            self.setData({
                                check_value: res.result
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
                    value: this.check_value
                }
                var validation = [
                    { fields: 'value', msg: this.$t('common.verification_mobile_message') }
                ];
                if (app.globalData.fields_check(form_data, validation)) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    this.setData({
                        form_submit_loading: true
                    });
                    var temp_code = this.check_value;
                    uni.request({
                        url: app.globalData.get_request_url('check', 'index', 'form'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            var data = res.data;
                            if (data.code == 0) {
                                this.setData({
                                    form_submit_loading: false,
                                    check_value: '',
                                    error_msg: '',
                                    stats_data: data.data.stats_data || [],
                                    success_msg: data.msg+'（'+data.data.username+'）',
                                });
                            } else {
                                if (app.globalData.is_login_check(data, this, 'form_submit')) {
                                    this.setData({
                                        form_submit_loading: false,
                                        error_msg: data.msg+'（'+temp_code+'）',
                                        success_msg: '',
                                    });
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            this.setData({
                                form_submit_loading: false,
                                error_msg: this.$t('common.internet_error_tips')+'（'+temp_code+'）',
                                success_msg: '',
                            });
                        },
                    });
                }
            },
            
            // 刷新数据
            refresh_data_event(e) {
                uni.request({
                    url: app.globalData.get_request_url('stats', 'index', 'form'),
                    method: 'POST',
                    data: {},
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                stats_data: res.data.data || []
                            });
                            if(e != 'init') {
                                app.globalData.showToast(res.data.msg, 'success');
                            }
                        } else {
                            app.globalData.showToast(res.data.msg);
                        }
                    }
                });
            }
        }
    };
</script>
<style scoped>
    input.check-value {
        height: 100rpx;
        line-height: 100rpx;
        font-size: 44rpx;
    }
    .page-content {
        padding-top: 12vh;
    }
    .refresh-submit {
        width: 140rpx;
        height: 140rpx;
        line-height: 140rpx;
    }
</style>