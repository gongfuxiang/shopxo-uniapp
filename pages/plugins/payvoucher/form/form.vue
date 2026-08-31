<template>
    <view :class="theme_view">
        <scroll-view :scroll-y="true" class="scroll-box" lower-threshold="60">
            <view v-if="data_list_loding_status == 3" class="padding-main pr page-bottom-fixed">
                <!-- 订单信息 -->
                <view class="padding-main bg-white border-radius-main margin-bottom-main">
                    <view class="margin-bottom-sm flex-row">
                        <text class="cr-grey-9 title">{{$t('payvoucher.source_type')}}</text>
                        <text class="fw-b">{{ page_data.source_type_name || '' }}</text>
                    </view>
                    <block v-if="(page_data.is_batch || 0) == 1">
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('payvoucher.merge_order')}}</text>
                            <text class="fw-b">{{$t('common.total')}} {{ page_data.order_count || 0 }} {{$t('payvoucher.order_unit')}}</text>
                        </view>
                        <view v-for="(ov, oi) in page_data.order_list || []" :key="oi" class="flex-row jc-sb align-c padding-vertical-sm br-b">
                            <view class="flex-row align-c flex-1" :data-value="ov.order_no || ''" @tap="text_copy_event">
                                <text class="cr-base text-size-sm">{{ ov.order_no || ('#' + ov.id) }}</text>
                                <view v-if="(ov.order_no || null) != null" class="dis-inline-block margin-left-sm">
                                    <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                                </view>
                            </view>
                            <text class="cr-red fw-b">{{ ov.price }}</text>
                        </view>
                        <view class="margin-top-sm flex-row jc-sb">
                            <text class="cr-grey-9">{{$t('payvoucher.pay_total')}}</text>
                            <text class="cr-red fw-b">{{ page_data.total_price }}</text>
                        </view>
                    </block>
                    <block v-else>
                        <view class="margin-bottom-sm flex-row align-c">
                            <text class="cr-grey-9 title">{{$t('common.user_order_detail_order_number')}}</text>
                            <view class="flex-row align-c" :data-value="(page_data.order && page_data.order.order_no) || ''" @tap="text_copy_event">
                                <text class="fw-b">{{ (page_data.order && page_data.order.order_no) || '' }}</text>
                                <view v-if="(page_data.order && page_data.order.order_no) || ''" class="dis-inline-block margin-left-sm">
                                    <iconfont name="icon-copy" size="28rpx" class="cr-grey"></iconfont>
                                </view>
                            </view>
                        </view>
                        <view class="margin-bottom-sm flex-row">
                            <text class="cr-grey-9 title">{{$t('payvoucher.payable_amount')}}</text>
                            <text class="cr-red fw-b">{{ page_data.total_price }}</text>
                        </view>
                    </block>
                    <view v-if="page_data.status_name" class="margin-top-sm flex-row">
                        <text class="cr-grey-9 title">{{$t('payvoucher.voucher_status')}}</text>
                        <text class="fw-b">{{ page_data.status_name }}</text>
                    </view>
                    <view v-if="page_data.order_close_tips" class="margin-top-main cr-yellow text-size-sm">{{ page_data.order_close_tips }}</view>
                </view>

                <!-- 收款账户 -->
                <view v-if="page_data.account" class="padding-main bg-white border-radius-main margin-bottom-main">
                    <view class="fw-b margin-bottom-main">{{$t('payvoucher.receive_info')}}</view>
                    <view v-if="page_data.account.content" class="account-content cr-base text-size-sm margin-bottom-sm">{{ page_data.account.content }}</view>
                    <view v-if="page_data.account.tips" class="cr-yellow text-size-sm margin-bottom-sm">{{ page_data.account.tips }}</view>
                    <image v-if="page_data.account.images_url" :src="page_data.account.images_url" mode="widthFix" class="account-images radius-md wh-auto" @tap="preview_account_image"></image>
                </view>

                <!-- 凭证 -->
                <view class="padding-main bg-white border-radius-main margin-bottom-main form-container">
                    <view class="form-gorup-title flex-row align-e margin-bottom-main">
                        <text class="fw-b">{{$t('payvoucher.pay_voucher')}}</text>
                        <text v-if="(page_data.is_readonly || 0) != 1" class="form-group-tips-must">*</text>
                        <text class="cr-grey-c text-size-xs margin-left-sm">{{ page_data.voucher_tips || $t('payvoucher.upload_transfer_screenshot') }}</text>
                    </view>
                    <block v-if="(page_data.is_readonly || 0) == 1">
                        <view v-if="(image_list || []).length > 0" class="flex-row flex-wrap">
                            <image v-for="(img, ii) in image_list" :key="ii" :src="img" mode="aspectFill" class="voucher-view-img radius-md margin-right-sm margin-bottom-sm" :data-index="ii" @tap="preview_voucher_image"></image>
                        </view>
                        <view v-else class="cr-grey">{{$t('payvoucher.no_voucher')}}</view>
                    </block>
                    <block v-else>
                        <component-upload :propData="image_list" :propMaxNum="10" :propPathType="editor_path_type" @call-back="return_image_event"></component-upload>
                    </block>
                </view>

                <view class="bottom-fixed" :style="bottom_fixed_style">
                    <view class="bottom-line-exclude">
                        <view class="flex-row align-c">
                            <button type="default" class="item cancel-btn round bg-white cr-base br-grey margin-right-sm" hover-class="none" @tap="cancel_event">{{$t('common.cancel')}}</button>
                            <button v-if="(page_data.is_readonly || 0) != 1" type="default" class="item submit-btn round bg-main br-main cr-white margin-left-sm" hover-class="none" :loading="form_submit_loading" :disabled="form_submit_loading" @tap="submit_event">{{$t('payvoucher.submit_voucher')}}</button>
                            <button v-else type="default" class="item submit-btn round bg-main br-main cr-white margin-left-sm" hover-class="none" @tap="cancel_event">{{$t('common.return')}}</button>
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
    import pluginLocale from '../locale/index.js';

    export default {
        mixins: [pluginLocale],
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

        /**
         * 页面加载
         */
        onLoad(params) {
            params = app.globalData.launch_params_handle(params);
            app.globalData.page_event_onload_handle(params);
            this.setData({
                params: params,
            });
            this.init();
        },

        /**
         * 页面显示
         */
        onShow() {
            app.globalData.page_event_onshow_handle();
            if ((this.$refs.common || null) != null) {
                this.$refs.common.on_show();
            }
            app.globalData.page_share_handle();
        },

        /**
         * 下拉刷新
         */
        onPullDownRefresh() {
            this.get_data();
        },

        methods: {
            /**
             * 初始化（校验登录后拉取表单数据）
             */
            init() {
                var user = app.globalData.get_user_info(this, 'init');
                if (user != false) {
                    this.get_data();
                }
            },

            /**
             * 获取上传页数据
             */
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

            /**
             * 上传组件回调（同步凭证图片列表）
             */
            return_image_event(data) {
                this.setData({
                    image_list: data,
                });
            },

            /**
             * 复制订单编号
             */
            text_copy_event(e) {
                if ((e.currentTarget.dataset.value || null) != null) {
                    app.globalData.text_copy_event(e);
                }
            },

            /**
             * 预览收款账户图片
             */
            preview_account_image() {
                if ((this.page_data.account || null) != null && this.page_data.account.images_url) {
                    uni.previewImage({
                        urls: [this.page_data.account.images_url],
                    });
                }
            },

            /**
             * 预览已上传的支付凭证图片
             */
            preview_voucher_image(e) {
                var index = e.currentTarget.dataset.index || 0;
                uni.previewImage({
                    current: this.image_list[index],
                    urls: this.image_list,
                });
            },

            /**
             * 取消/返回上一页
             */
            cancel_event() {
                app.globalData.page_back_prev_event();
            },

            /**
             * 提交支付凭证
             */
            submit_event() {
                if (this.form_submit_loading) {
                    return;
                }
                if ((this.image_list || []).length <= 0) {
                    app.globalData.showToast(this.$t('payvoucher.upload_voucher_image'));
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
    @import './form.css';
</style>
