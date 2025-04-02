<template>
    <view :class="theme_view">
        <block v-if="data_list_loding_status == 3">
            <view class="page-bottom-fixed padding-main">
                <form @submit="form_submit" class="form-container">
                    <!-- 购买商品 -->
                    <view v-if="(goods_data || null) != null && goods_data.length > 0" class="bg-white padding-main border-radius-main">
                        <block v-for="(item, index) in goods_data" :key="index">
                            <view class="buy-goods-list oh">
                                <image :src="item.images" mode="aspectFit" class="goods-images radius dis-inline-block va-m"></image>
                                <view class="single-text dis-inline-block va-m margin-left-xs goods-title">{{item.title}}</view>
                                <view class="fr">
                                    <text class="cr-price">{{item.show_price_symbol}}{{item.price}}</text>
                                    <text class="cr-grey margin-left-xs">x{{item.stock}}</text>
                                </view>
                            </view>
                        </block>
                    </view>
                    <!-- 用药人 -->
                    <view class="bg-white border-radius-main oh spacing-mt">
                        <view class="padding-main">
                            <view>
                                <text class="fw-b va-m">用药人</text>
                                <view v-if="(patient_tips || null) != null" class="dis-inline-block va-m margin-left-sm" @tap="popup_patient_tips_event">
                                    <iconfont name="icon-sigh-o" size="28rpx" color="#999"></iconfont>
                                </view>
                            </view>
                            <view v-if="(patient_data || null) != null" class="oh pr margin-top">
                                <view>
                                    <text>{{patient_data.name}}</text>
                                    <block v-if="(patient_data.gender_name || null) != null">
                                        <text class="cr-grey-white padding-horizontal-sm">|</text>
                                        <text>{{patient_data.gender_name}}</text>
                                    </block>
                                    <block v-if="(patient_data.age_name || null) != null">
                                        <text class="cr-grey-white padding-horizontal-sm">|</text>
                                        <text>{{patient_data.age_name}}</text>
                                    </block>
                                </view>
                                <view>{{patient_data.idcard}}</view>
                                <view class="pa top-0 right-0">
                                    <button type="default" size="mini" class="cr-main br-main bg-white round text-size-sm" hover-class="none" data-value="/pages/plugins/hospital/patient-list/patient-list?is_choice=1" @tap="url_event">
                                        <iconfont name="icon-transfer" size="28rpx" :color="theme_color"></iconfont>
                                        <text class="margin-left-xs">切换用药人</text>
                                    </button>
                                </view>
                            </view>
                            <view v-else class="tc padding-vertical-xxl">
                                <button type="default" size="mini" class="cr-main br-main bg-white round text-size-sm" hover-class="none" data-value="/pages/plugins/hospital/patient-list/patient-list?is_choice=1" @tap="url_event">
                                    <iconfont name="icon-user-group" size="28rpx" :color="theme_color"></iconfont>
                                    <text class="margin-left-xs">选择用药人</text>
                                </button>
                            </view>
                        </view>
                        <view class="form-gorup br-t-f5">
                            <view class="form-gorup-title">主诉<text class="form-group-tips">例如: 感冒, 胃炎, 头疼, 肚子疼</text></view>
                            <input type="text" name="ill_desc" maxlength="230" placeholder-class="cr-grey-9" class="cr-base" placeholder="主诉格式1～230个字符" />
                        </view>
                    </view>
                    <view class="bottom-fixed" :style="bottom_fixed_style">
                        <view class="bottom-line-exclude">
                            <button class="item bg-main br-main cr-white round text-size wh-auto" type="default" form-type="submit" hover-class="none" :disabled="form_submit_disabled_status">免费问诊开方</button>
                        </view>
                    </view>
                </form>
            </view>

            <!-- 提示弹窗 -->
            <component-popup :propShow="popup_patient_tips_status" propPosition="bottom" @onclose="popup_patient_tips_close_event">
                <view class="padding-horizontal-main padding-top-main bg-white">
                    <view class="close oh">
                        <view class="fr" @tap.stop="popup_patient_tips_close_event">
                            <iconfont name="icon-close-o" size="28rpx" color="#999"></iconfont>
                        </view>
                    </view>
                    <view class="padding-vertical-main">
                        <block v-if="patient_tips != null">{{patient_tips}}</block>
                        <block v-else>
                            <component-no-data propStatus="0"></component-no-data>
                        </block>
                    </view>
                </view>
            </component-popup>
        </block>

        <!-- 提示信息 -->
        <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>

        <!-- 公共 -->
        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import base64 from '@/common/js/lib/base64.js';
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentPopup from '@/components/popup/popup';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                theme_color: app.globalData.get_theme_color(),
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_disabled_status: false,
                bottom_fixed_style: '',
                params: null,
                goods_data: [],
                patient_data: null,
                patient_list: [],
                popup_patient_tips_status: false,
                patient_tips: null
                
            };
        },

        components: {
            componentCommon,
            componentNoData,
            componentPopup
        },

        onLoad(params) {
            // 调用公共事件方法
            app.globalData.page_event_onload_handle(params);

            // 设置参数
            // params.data 参数 urlencode(base64_encode(json字符串))
            // buy_type 下单类型（goods 立即购买、cart 购物车）
            // goods_data 下单商品urlencode(base64_encode(json字符串[{goods_id,stock,spec}]))
            // params['data'] = '{"buy_type":"goods","goods_data":"W3siZ29vZHNfaWQiOiI5Iiwic3RvY2siOjEsInNwZWMiOlt7InR5cGUiOiLpopzoibIiLCJ2YWx1ZSI6IueyieiJsiJ9LHsidHlwZSI6IuWwuueggSIsInZhbHVlIjoiTCJ9XX1"}';
            // ids 购物车主键ids
            if ((params.data || null) != null) {
                params = JSON.parse(base64.decode(decodeURIComponent(params.data)));
                this.setData({
                    params: params,
                });
            }
        },

        onShow() {
            // 调用公共事件方法
            app.globalData.page_event_onshow_handle();

            // 数据加载
            this.init();

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
            this.init();
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
            init() {
                uni.request({
                    url: app.globalData.get_request_url('saveinit', 'prescription', 'hospital'),
                    method: 'POST',
                    data: this.params,
                    dataType: 'json',
                    success: (res) => {
                        if (res.data.code == 0) {
                            this.get_data();
                        } else {
                            this.setData({
                                data_list_loding_status: 0,
                                data_list_loding_msg: res.data.msg,
                            });
                            if (app.globalData.is_login_check(res.data, this, 'init')) {
                                app.globalData.showToast(res.data.msg);
                            }
                        }
                    },
                    fail: () => {
                        this.setData({
                            data_list_loding_status: 2,
                            data_list_loding_msg: this.$t('common.internet_error_tips'),
                        });
                    }
                });
            },

            // 获取数据
            get_data() {
                var patient_id = uni.getStorageSync(app.globalData.data.cache_hospital_patient_choice_value_key) || 0;
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'prescription', 'hospital'),
                    method: 'POST',
                    data: {...this.params, ...{id: patient_id}},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data;
                            this.setData({
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                                goods_data: data.goods_data || [],
                                patient_data: data.patient_data || null,
                                patient_tips: data.patient_tips || null
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

            // url事件
            url_event(e) {
                app.globalData.url_event(e);
            },

            // 就诊人提示开启弹层
            popup_patient_tips_event(e) {
                this.setData({
                    popup_patient_tips_status: true
                });
            },
            
            // 就诊人提示关闭弹层
            popup_patient_tips_close_event(e) {
                this.setData({
                    popup_patient_tips_status: false
                });
            },

            // 数据提交
            form_submit(e) {
                // 表单数据
                var form_data = e.detail.value;
                // 就诊人
                form_data['id'] = ((this.patient_data || null) == null) ? 0 : (this.patient_data.id || 0);
                // 数据校验
                var validation = [
                    { fields: 'id', msg: '请选择就诊人' },
                ];
                // 验证提交表单
                if (app.globalData.fields_check(form_data, validation)) {
                    // 数据保存
                    this.setData({
                        form_submit_disabled_status: true,
                    });
                    uni.showLoading({
                        title: this.$t('common.processing_in_text'),
                    });
                    uni.request({
                        url: app.globalData.get_request_url('created', 'prescription', 'hospital'),
                        method: 'POST',
                        data: form_data,
                        dataType: 'json',
                        success: (res) => {
                            uni.hideLoading();
                            if (res.data.code == 0) {
                                app.globalData.open_web_view(res.data.data, true);
                            } else {
                                this.setData({
                                    form_submit_disabled_status: false,
                                });
                                if (app.globalData.is_login_check(res.data)) {
                                    app.globalData.showToast(res.data.msg);
                                } else {
                                    app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                                }
                            }
                        },
                        fail: () => {
                            this.setData({
                                form_submit_disabled_status: false,
                            });
                            uni.hideLoading();
                            app.globalData.showToast(this.$t('common.internet_error_tips'));
                        },
                    });
                }
            }
        }
    };
</script>
<style>
    @import './prescription.css';
</style>