<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box bg-white">
            <view class="page-bottom-fixed">
                <block v-if="data_list_loding_status == 3">
                    <view class="padding-main">
                        <view class="">
                            <mp-html :content="agreement_data.value" />
                        </view>
                        <view class="bottom-fixed" :style="bottom_fixed_style">
                            <view class="bottom-line-exclude">
                                <button class="item bg-grey br-grey cr-base round text-size fl" type="default" size="mini" hover-class="none" @tap="logout_submit_event">{{$t('logout.logout.u10002')}}</button>
                                <button class="item bg-main br-main cr-white round text-size fr" type="default" size="mini" hover-class="none" @tap="logout_cancel_event">{{$t('common.cancel')}}</button>
                            </view>
                        </view>
                    </view>
                </block>

                <!-- 错误提示 -->
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
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
    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                bottom_fixed_style: '',
                agreement_data: {},
            };
        },

        components: {
            componentCommon,
            componentNoData,
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
        },

        methods: {
            // 获取数据
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                } else {
                    this.setData({
                        data_list_loding_status: 0,
                        data_list_loding_msg: this.$t('setup.setup.nwt4o1'),
                    });
                }
            },

            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('index', 'agreement'),
                    method: 'POST',
                    data: { document: 'userlogout' },
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.setData({
                                data_list_loding_status: 3,
                                agreement_data: res.data.data || {},
                            });
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },

            // 注销提交
            logout_submit_event(e) {
                // 是否再次确认
                if (e.alert_status != 0 && e.alert_status != 1) {
                    app.globalData.alert({
                        msg: this.$t('logout.logout.9vfzz4'),
                        is_show_cancel: 1,
                        object: this,
                        method: 'logout_submit_event',
                    });
                    return false;
                }

                // 注销提交
                if (e.alert_status == 1) {
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('logout', 'safety'),
                        method: 'POST',
                        data: {},
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.remove_user_cache_event();
                                app.globalData.showToast(res.data.msg, 'success');
                                setTimeout(function () {
                                    app.globalData.url_open(app.globalData.app_tabbar_pages()[0]);
                                }, 1500);
                            } else {
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            },

            // 取消返回
            logout_cancel_event() {
                app.globalData.page_back_prev_event();
            },
        },
    };
</script>
<style>
    @import './logout.css';
</style>
