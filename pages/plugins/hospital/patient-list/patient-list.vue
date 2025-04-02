<template>
    <view :class="theme_view">
        <view class="page-bottom-fixed padding-main">
            <view v-if="patient_tips != null" class="margin-bottom">
                <uni-notice-bar background-color="" :text="patient_tips" />
            </view>
            <view v-if="(data_list || null) != null && data_list.length > 0" class="bg-white padding-horizontal-main border-radius-main">
                <block v-for="(item, index) in data_list" :key="index">
                    <view class="item padding-vertical-main oh pr" :class="index > 0 ? 'br-t-f5' : ''" :data-index="index" @tap="item_event">
                        <view>
                            <text>{{item.name}}</text>
                            <block v-if="(item.gender_name || null) != null">
                                <text class="cr-grey-white padding-horizontal-sm">|</text>
                                <text>{{item.gender_name}}</text>
                            </block>
                            <block v-if="(item.age_name || null) != null">
                                <text class="cr-grey-white padding-horizontal-sm">|</text>
                                <text>{{item.age_name}}</text>
                            </block>
                        </view>
                        <view>{{item.idcard}}</view>
                        <view class="pa top-0 right-0 margin-top-xl">
                            <view class="dis-inline-block va-m" :data-value="'/pages/plugins/hospital/patient/patient?id='+item.id" @tap.stop="url_event">
                                <iconfont name="icon-edit-o" size="48rpx" color="#999"></iconfont>
                            </view>
                            <view class="dis-inline-block va-m margin-left" :data-index="index" @tap.stop="del_event">
                                <iconfont name="icon-delete-o" size="48rpx" color="#999"></iconfont>
                            </view>
                        </view>
                    </view>
                </block>
            </view>
            <block v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </block>
        </view>
        <view class="bottom-fixed" :style="bottom_fixed_style">
            <view class="bottom-line-exclude">
                <button class="item bg-main br-main cr-white round text-size wh-auto" type="default" hover-class="none" data-value="/pages/plugins/hospital/patient/patient" @tap="url_event">添加就诊人</button>
            </view>
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
                bottom_fixed_style: '',
                params: {},
                data_list: [],
                patient_tips: null,
            };
        },

        components: {
            componentCommon,
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

            // 初始化配置
            this.init_config();

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
                    url: app.globalData.get_request_url('index', 'patient', 'hospital'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: '',
                                patient_tips: data.patient_tips || null,
                                data_list: data.data_list || [],
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
                    }
                });
            },

            // 删除
            del_event(e) {
                var data = this.data_list[e.currentTarget.dataset.index];
                uni.showModal({
                    title: this.$t('common.warm_tips'),
                    content: this.$t('recommend-list.recommend-list.54d418'),
                    confirmText: this.$t('common.confirm'),
                    cancelText: this.$t('recommend-list.recommend-list.w9460o'),
                    success: (result) => {
                        if (result.confirm) {
                            // 加载loding
                            uni.showLoading({
                                title: this.$t('common.processing_in_text'),
                            });
                            // 获取数据
                            uni.request({
                                url: app.globalData.get_request_url('delete', 'patient', 'hospital'),
                                method: 'POST',
                                data: {
                                    ids: data.id,
                                },
                                dataType: 'json',
                                success: (res) => {
                                    uni.hideLoading();
                                    if (res.data.code == 0) {
                                        app.globalData.showToast(res.data.msg, 'success');
                                        // 数据加载
                                        this.get_data();
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
                    }
                });
            },

            // 数据项事件
            item_event(e) {
                if(parseInt(this.params.is_choice || 0) == 1) {
                    var data = this.data_list[e.currentTarget.dataset.index];
                    uni.setStorageSync(app.globalData.data.cache_hospital_patient_choice_value_key, data.id);
                    app.globalData.page_back_prev_event();
                }
            },

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            }
        }
    };
</script>
<style>
</style>