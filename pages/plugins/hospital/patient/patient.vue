<template>
    <view :class="theme_view">
        <view v-if="data_list_loding_status == 3" class="padding-main">
            <form @submit="form_submit" class="form-container">
                <view class="form-gorup">
                    <view class="form-gorup-title">真实姓名<text class="form-group-tips-must">*</text></view>
                    <input type="text" name="name" :value="data.name || ''" maxlength="30" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入真实姓名" />
                </view>
                <view class="form-gorup">
                    <view class="form-gorup-title">身份证号码<text class="form-group-tips-must">*</text></view>
                    <input type="text" name="idcard" :value="data.idcard || ''" maxlength="60" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入身份证号码" />
                </view>
                <view class="form-gorup">
                    <view class="form-gorup-title">手机号码<text class="form-group-tips-must">*</text></view>
                    <input type="text" name="mobile" :value="data.mobile || ''" maxlength="30" placeholder-class="cr-grey-9" class="cr-base" placeholder="请输入手机号码" />
                </view>
                <view class="bottom-fixed">
                    <view class="bottom-line-exclude">
                        <button class="item bg-main br-main cr-white round text-size wh-auto" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">{{$t('common.save')}}</button>
                    </view>
                </view>
            </form>
        </view>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 公共 -->
        <component-common ref="common"></component-common>

        <!-- 健康信息弹窗 -->
        <component-popup :propShow="popup_health_status" propPosition="bottom" @onclose="popup_health_close_event">
            <view class="padding-horizontal-main padding-top-main bg-white">
                <view class="close oh">
                    <view class="fr" @tap.stop="popup_health_close_event">
                        <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                    </view>
                </view>
                <view class="page-bottom-fixed">
                    <view>
                        健康信息填写处理
                    </view>
                    <view class="bottom-fixed">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size-sm wh-auto" type="default" hover-class="none" @tap="popup_patient_save_event">{{$t('common.confirm')}}</button>
                        </view>
                    </view>
                </view>
            </view>
        </component-popup>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentPopup from '@/components/popup/popup';
    import componentNoData from '@/components/no-data/no-data';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                buy_submit_disabled_status: false,
                params: {},
                data: {},
                popup_health_status: false,
                form_submit_disabled_status: false,
            };
        },

        components: {
            componentCommon,
            componentPopup,
            componentNoData
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            this.setData({
                params: params,
            });
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.get_data();

            // 公共onshow事件
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }

            // 分享菜单处理
            app.globalData.page_share_handle();
        },

        // 下拉刷新
        onPullDownRefresh() {
            this.init();
        },

        methods: {
            // 获取数据
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'patient', 'hospital'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                data: data.data || {},
                            });
                            console.log(data)
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
                    }
                });
            },

            // 健康信息开启弹层
            popup_health_event(e) {
                this.setData({
                    popup_health_status: true
                });
            },

            // 健康信息关闭弹层
            popup_health_close_event(e) {
                this.setData({
                    popup_health_status: false
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                console.log(form_data)
            }
        }
    };
</script>
<style>
    @import './patient.css';
</style>