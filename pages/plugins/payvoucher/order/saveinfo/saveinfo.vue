<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60">
            <view v-if="data_list_loding_status == 3" class="padding-main pr page-bottom-fixed">
                <!-- 订单信息 -->
                <view class="padding-main bg-white border-radius-main margin-bottom-main">
                    <view class="margin-bottom-sm flex-row">
                        <text class="cr-grey-9 title">来源类型</text>
                        <text class="fw-b">{{ page_data.source_type_name || '' }}</text>
                    </view>
                    <block v-if="(page_data.is_batch || 0) == 1">
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">合并订单</text>
                            <text class="fw-b">共 {{ page_data.order_count || 0 }} 笔</text>
                        </view>
                        <view v-for="(ov, oi) in page_data.order_list || []" :key="oi" class="flex-row jc-sb align-c padding-vertical-sm br-b">
                            <text class="cr-base text-size-sm">{{ ov.order_no || ('#' + ov.id) }}</text>
                            <text class="cr-red fw-b">{{ ov.price }}</text>
                        </view>
                        <view class="margin-top-sm flex-row jc-sb">
                            <text class="cr-grey-9">应付合计</text>
                            <text class="cr-red fw-b">{{ page_data.total_price }}</text>
                        </view>
                    </block>
                    <block v-else>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">订单编号</text>
                            <text class="fw-b">{{ (page_data.order && page_data.order.order_no) || '' }}</text>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">应付金额</text>
                            <text class="cr-red fw-b">{{ page_data.total_price }}</text>
                        </view>
                    </block>
                    <view v-if="page_data.status_name" class="margin-top-sm flex-row">
                        <text class="cr-grey-9 title">凭证状态</text>
                        <text class="fw-b">{{ page_data.status_name }}</text>
                    </view>
                    <view v-if="page_data.order_close_tips" class="margin-top-main cr-yellow text-size-sm">{{ page_data.order_close_tips }}</view>
                </view>

                <!-- 收款账户 -->
                <view v-if="page_data.account" class="padding-main bg-white border-radius-main margin-bottom-main">
                    <view class="fw-b margin-bottom-main">收款信息</view>
                    <view v-if="page_data.account.content" class="account-content cr-base text-size-sm margin-bottom-sm">{{ page_data.account.content }}</view>
                    <view v-if="page_data.account.tips" class="cr-yellow text-size-sm margin-bottom-sm">{{ page_data.account.tips }}</view>
                    <image v-if="page_data.account.images_url" :src="page_data.account.images_url" mode="widthFix" class="account-images radius-md wh-auto" @tap="preview_account_image"></image>
                </view>

                <!-- 凭证 -->
                <view class="padding-main bg-white border-radius-main margin-bottom-main form-container">
                    <view class="form-gorup-title flex-row align-e margin-bottom-main">
                        <text class="fw-b">支付凭证</text>
                        <text v-if="(page_data.is_readonly || 0) != 1" class="form-group-tips-must">*</text>
                        <text class="cr-grey-c text-size-xs margin-left-sm">{{ page_data.voucher_tips || '请上传转账截图，最多10张' }}</text>
                    </view>
                    <block v-if="(page_data.is_readonly || 0) == 1">
                        <view v-if="(image_list || []).length > 0" class="flex-row flex-wrap">
                            <image v-for="(img, ii) in image_list" :key="ii" :src="img" mode="aspectFill" class="voucher-view-img radius-md margin-right-sm margin-bottom-sm" :data-index="ii" @tap="preview_voucher_image"></image>
                        </view>
                        <view v-else class="cr-grey">暂无凭证</view>
                    </block>
                    <block v-else>
                        <component-upload :propData="image_list" :propMaxNum="10" :propPathType="editor_path_type" @call-back="return_image_event"></component-upload>
                    </block>
                </view>

                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="flex-row align-c">
                            <button type="default" class="item cancel-btn round bg-white cr-base br-grey margin-right-sm" hover-class="none" @tap="cancel_event">{{$t('common.cancel')}}</button>
                            <button v-if="(page_data.is_readonly || 0) != 1" type="default" class="item submit-btn round bg-main br-main cr-white margin-left-sm" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading" @tap="submit_event">提交凭证</button>
                            <button v-else type="default" class="item submit-btn round bg-main br-main cr-white margin-left-sm" hover-class="none" @tap="cancel_event">返回</button>
                        </view>
                    </view>
                </view>
            </view>
            <view v-else>
                <component-no-data :propStatus="data_list_loding_status" :propMsg="data_list_loding_msg"></component-no-data>
            </view>
        </scroll-view>

        <component-common ref="common"></component-common>
    </view>
</template>
<script>
    const app = getApp();
    import componentCommon from '@/components/common/common';
    import componentNoData from '@/components/no-data/no-data';
    import componentUpload from '@/components/upload/upload';

    export default {
        data() {
            return {
                theme_view: app.globalData.get_theme_value_view(),
                bottom_fixed_style: '',
                params: null,
                page_data: {},
                image_list: [],
                editor_path_type: '',
                data_list_loding_status: 1,
                data_list_loding_msg: '',
                form_submit_loading: false,
            };
        },
        components: {
            componentCommon,
            componentNoData,
            componentUpload,
        },
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params,
            });
            this.init();
        },
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            app.globalData.page_share_handle();
        },
        onPullDownRefresh() {
            this.get_data();
        },
        methods: {
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },
            get_data() {
                uni.request({
                    url: app.globalData.get_request_url('saveinfo', 'order', 'payvoucher'),
                    method: 'POST',
                    data: this.params || {},
                    dataType: 'json',
                    success: (res) => {
                        uni.stopPullDownRefresh();
                        if (res.data.code == 0) {
                            var data = res.data.data || {};
                            this.setData({
                                page_data: data,
                                editor_path_type: data.editor_path_type || '',
                                image_list: data.voucher || [],
                                data_list_loding_status: 3,
                                data_list_loding_msg: '',
                            });
                            if ((data.back_url || null) != null) {
                                // back_url 为 PC 地址，uniapp 用页面返回即可
                            }
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
            return_image_event(data) {
                this.setData({
                    image_list: data,
                });
            },
            preview_account_image() {
                if ((this.page_data.account || null) != null && this.page_data.account.images_url) {
                    uni.previewImage({
                        urls: [this.page_data.account.images_url],
                    });
                }
            },
            preview_voucher_image(e) {
                var index = e.currentTarget.dataset.index || 0;
                uni.previewImage({
                    current: this.image_list[index],
                    urls: this.image_list,
                });
            },
            cancel_event() {
                app.globalData.page_back_prev_event();
            },
            submit_event() {
                if (this.form_submit_loading) {
                    return;
                }
                if ((this.image_list || []).length <= 0) {
                    app.globalData.showToast('请上传支付凭证图片');
                    return;
                }
                var post = {
                    order_id: this.page_data.order_id || this.params.oid || 0,
                    order_ids: this.page_data.order_ids || this.params.oids || '',
                    source_type: this.page_data.source_type || this.params.stype || 'system_order',
                    batch_no: this.page_data.batch_no || '',
                    voucher: this.image_list,
                };
                this.setData({
                    form_submit_loading: true,
                });
                uni.showLoading({
                    title: this.$t('common.processing_in_text'),
                    mask: true,
                });
                uni.request({
                    url: app.globalData.get_request_url('save', 'order', 'payvoucher'),
                    method: 'POST',
                    data: post,
                    dataType: 'json',
                    success: (res) => {
                        uni.hideLoading();
                        if (res.data.code == 0) {
                            // 成功保持禁用，避免返回前重复点击
                            app.globalData.showToast(res.data.msg, 'success');
                            setTimeout(() => {
                                app.globalData.page_back_prev_event();
                            }, 1000);
                        } else {
                            this.setData({
                                form_submit_loading: false,
                            });
                            if (app.globalData.is_login_check(res.data)) {
                                app.globalData.showToast(res.data.msg);
                            } else {
                                app.globalData.showToast(this.$t('common.sub_error_retry_tips'));
                            }
                        }
                    },
                    fail: () => {
                        uni.hideLoading();
                        this.setData({
                            form_submit_loading: false,
                        });
                        app.globalData.showToast(this.$t('common.internet_error_tips'));
                    },
                });
            },
        },
    };
</script>
<style>
    @import './saveinfo.css';
</style>
